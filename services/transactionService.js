const supabase = require('../config/supabase');
const generateTransactionCode = require('../utils/generateCode');

const checkout = async (userId, transactionData) => {
    const { items, discountAmount, paymentMethod, paymentAmount } = transactionData;
    const transactionCode = generateTransactionCode();

    // 1. Ambil data produk untuk menghitung total harga dan mencatat snapshot nama/harga modal
    const productIds = items.map(item => item.productId);
    const { data: products, error: productError } = await supabase
        .from('products')
        .select('*, inventory(current_stock)')
        .in('id', productIds);

    if (productError || !products) throw new Error('Gagal mengambil data produk terkait');

    let totalAmount = 0;
    const detailInserts = [];
    const inventoryUpdates = [];

    // 2. Validasi stok dan kalkulasi harga
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

        // Siapkan data untuk transaction_details (Snapshot data sesuai halaman 15)
        detailInserts.push({
            product_id: product.id,
            product_name: product.name,
            sell_price: product.sell_price,
            cost_price: product.cost_price,
            quantity: item.quantity,
            subtotal: subtotal
        });

        // Siapkan data untuk update stok inventori
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

    // TRACKING UNTUK ROLLBACK MANUAL
    const successfullyUpdatedStocks = [];
    let insertedTransactionId = null;

    try {
        // Step 1: Update stok inventori satu per satu (secara kondisional)
        for (const update of inventoryUpdates) {
            const newStock = update.old_stock - update.quantity;
            const { data: updatedInv, error: stockError } = await supabase
                .from('inventory')
                .update({ current_stock: newStock })
                .eq('product_id', update.product_id)
                .gte('current_stock', update.quantity) // Validasi agar tidak negatif / race condition
                .select();

            if (stockError || !updatedInv || updatedInv.length === 0) {
                throw new Error(`Gagal mengupdate stok untuk produk ID ${update.product_id}. Stok tidak mencukupi.`);
            }

            successfullyUpdatedStocks.push(update);
        }

        // Step 2: Simpan data transaksi utama
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

        // Step 3: Hubungkan id transaksi utama ke detail item
        const finalDetails = detailInserts.map(detail => ({
            ...detail,
            transaction_id: transaction.id
        }));

        // Simpan semua detail item transaksi
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

        // ROLLBACK STEP 2: Hapus data transaksi utama jika berhasil terbuat
        if (insertedTransactionId) {
            await supabase.from('transactions').delete().eq('id', insertedTransactionId);
        }

        // ROLLBACK STEP 1: Kembalikan stok inventori yang sudah terlanjur dipotong
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
    // Mengambil daftar semua transaksi (FR-08)
    const { data, error } = await supabase
        .from('transactions')
        .select('*, users(full_name)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

const getTransactionDetail = async (id) => {
    // Mengambil rincian item dari satu transaksi spesifik (UC-07)
    const { data, error } = await supabase
        .from('transaction_details')
        .select('*')
        .eq('transaction_id', id);

    if (error) throw error;
    return data;
};

const voidTransaction = async (id, voidReason) => {
    // 1. Ambil detail item dari transaksi yang akan dibatalkan
    const { data: details, error: detailsError } = await supabase
        .from('transaction_details')
        .select('product_id, quantity')
        .eq('transaction_id', id);

    if (detailsError || !details || details.length === 0) {
        throw new Error('Data transaksi tidak ditemukan');
    }

    // Pastikan transaksi belum di-void sebelumnya
    const { data: currentTrx } = await supabase
        .from('transactions')
        .select('status')
        .eq('id', id)
        .single();

    if (currentTrx && currentTrx.status === 'voided') {
        throw new Error('Transaksi sudah dibatalkan sebelumnya');
    }

    // TRACKING ROLLBACK UNTUK VOID
    const successfullyRestoredStocks = [];
    let isStatusUpdated = false;

    try {
        // Step 1: Update status transaksi menjadi 'voided' (UC-13)
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

        // Step 2: Kembalikan stok produk ke tabel inventory karena transaksi dibatalkan
        for (const item of details) {
            // Ambil stok saat ini
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

        // ROLLBACK STEP 1: Kembalikan status transaksi menjadi completed
        if (isStatusUpdated) {
            await supabase
                .from('transactions')
                .update({
                    status: 'completed',
                    void_reason: null
                })
                .eq('id', id);
        }

        // ROLLBACK STEP 2: Kurangi stok kembali sebesar kuantiti detail
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

// Jangan lupa daftarkan fungsi baru ini ke module.exports di bagian paling bawah file:
module.exports = {
    checkout, // fungsi lama kamu
    getTransactionHistory,
    getTransactionDetail,
    voidTransaction
};
