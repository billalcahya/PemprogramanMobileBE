const supabase = require('../config/supabase');
const generateTransactionCode = require('../utils/generateCode');

const checkout = async (userId, transactionData) => {
    const { items, discountAmount, paymentMethod, paymentAmount } = transactionData;
    const transactionCode = generateTransactionCode();

    const productIds = items.map(item => item.productId);
    const { data: products, error: productError } = await supabase
        .from('products')
        .select('*, inventory(current_stock)')
        .in('id', productIds);

    if (productError || !products) throw new Error('Gagal mengambil data produk terkait');

    let totalAmount = 0;
    const detailInserts = [];
    const inventoryUpdates = [];

    for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`);

        let currentStock = 0;
        if (product.inventory) {
            if (Array.isArray(product.inventory)) {
                currentStock = product.inventory[0]?.current_stock || 0;
            } else {
                currentStock = product.inventory.current_stock || 0;
            }
        }

        if (currentStock < item.quantity) {
            throw new Error(`Stok ${product.name} tidak mencukupi (sisa: ${currentStock})`);
        }

        const subtotal = product.sell_price * item.quantity;
        totalAmount += subtotal;

        detailInserts.push({
            product_id: product.id,
            product_name: product.name,
            sell_price: product.sell_price,
            cost_price: product.cost_price,
            quantity: item.quantity,
            subtotal: subtotal
        });

        inventoryUpdates.push({
            product_id: product.id,
            old_stock: currentStock,
            quantity: item.quantity
        });
    }

    const grandTotal = totalAmount - (discountAmount || 0);
    const changeAmount = paymentAmount - grandTotal;

    if (changeAmount < 0) {
        throw new Error('Nominal pembayaran kurang');
    }

    const successfullyUpdatedStocks = [];
    let insertedTransactionId = null;

    try {
        for (const update of inventoryUpdates) {
            const newStock = update.old_stock - update.quantity;
            const { data: updatedInv, error: stockError } = await supabase
                .from('inventory')
                .update({ current_stock: newStock })
                .eq('product_id', update.product_id)
                .gte('current_stock', update.quantity)  
                .select();

            if (stockError || !updatedInv || updatedInv.length === 0) {
                throw new Error(`Gagal mengupdate stok untuk produk ID ${update.product_id}. Stok tidak mencukupi.`);
            }

            successfullyUpdatedStocks.push(update);
        }

        const { data: transaction, error: trxError } = await supabase
            .from('transactions')
            .insert([{
                transaction_code: transactionCode,
                user_id: userId,
                total_amount: totalAmount,
                discount_amount: discountAmount || 0,
                grand_total: grandTotal,
                payment_method: paymentMethod,
                payment_amount: paymentAmount,
                change_amount: changeAmount,
                status: 'completed'
            }])
            .select()
            .single();

        if (trxError) throw trxError;
        insertedTransactionId = transaction.id;

        const finalDetails = detailInserts.map(detail => ({
            ...detail,
            transaction_id: transaction.id
        }));

        const { error: detailsError } = await supabase.from('transaction_details').insert(finalDetails);
        if (detailsError) throw detailsError;

        return {
            transactionId: transaction.id,
            transactionCode: transaction.transaction_code,
            grandTotal: transaction.grand_total,
            changeAmount: transaction.change_amount
        };

    } catch (error) {
        console.error("TRANSAKSI GAGAL. MELAKUKAN ROLLBACK...", error.message);

        if (insertedTransactionId) {
            await supabase.from('transactions').delete().eq('id', insertedTransactionId);
        }

        for (const stock of successfullyUpdatedStocks) {
            const { data: currentInv } = await supabase
                .from('inventory')
                .select('current_stock')
                .eq('product_id', stock.product_id)
                .single();

            if (currentInv) {
                await supabase
                    .from('inventory')
                    .update({ current_stock: currentInv.current_stock + stock.quantity })
                    .eq('product_id', stock.product_id);
            }
        }

        throw error;
    }
};

const getTransactionHistory = async () => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*, users(full_name)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

const getTransactionDetail = async (id) => {
    const { data, error } = await supabase
        .from('transaction_details')
        .select('*')
        .eq('transaction_id', id);

    if (error) throw error;
    return data;
};

const voidTransaction = async (id, voidReason) => {
    const { data: details, error: detailsError } = await supabase
        .from('transaction_details')
        .select('product_id, quantity')
        .eq('transaction_id', id);

    if (detailsError || !details || details.length === 0) {
        throw new Error('Data transaksi tidak ditemukan');
    }

    const { data: currentTrx } = await supabase
        .from('transactions')
        .select('status')
        .eq('id', id)
        .single();

    if (currentTrx && currentTrx.status === 'voided') {
        throw new Error('Transaksi sudah dibatalkan sebelumnya');
    }

    const successfullyRestoredStocks = [];
    let isStatusUpdated = false;

    try {
        const { data: transaction, error: trxError } = await supabase
            .from('transactions')
            .update({
                status: 'voided',
                void_reason: voidReason
            })
            .eq('id', id)
            .select()
            .single();

        if (trxError) throw trxError;
        isStatusUpdated = true;

        for (const item of details) {
            const { data: inv, error: invError } = await supabase
                .from('inventory')
                .select('current_stock')
                .eq('product_id', item.product_id)
                .single();

            if (invError || !inv) {
                throw new Error(`Data inventori tidak ditemukan untuk produk ID ${item.product_id}`);
            }

            const restoredStock = inv.current_stock + item.quantity;
            const { error: updateStockErr } = await supabase
                .from('inventory')
                .update({ current_stock: restoredStock })
                .eq('product_id', item.product_id);

            if (updateStockErr) throw updateStockErr;
            successfullyRestoredStocks.push(item);
        }

        return transaction;

    } catch (error) {
        console.error("PEMBATALAN TRANSAKSI GAGAL. MELAKUKAN ROLLBACK...", error.message);

        if (isStatusUpdated) {
            await supabase
                .from('transactions')
                .update({
                    status: 'completed',
                    void_reason: null
                })
                .eq('id', id);
        }

        for (const rolled of successfullyRestoredStocks) {
            const { data: inv } = await supabase
                .from('inventory')
                .select('current_stock')
                .eq('product_id', rolled.product_id)
                .single();

            if (inv) {
                await supabase
                    .from('inventory')
                    .update({ current_stock: inv.current_stock - rolled.quantity })
                    .eq('product_id', rolled.product_id);
            }
        }

        throw error;
    }
};

module.exports = {
    checkout, 
    getTransactionHistory,
    getTransactionDetail,
    voidTransaction
};
