const transactionService = require('../services/transactionService');
const supabase = require('../config/supabase');

const createTransaction = async (req, res) => {
    try {
        const userId = req.user.id; // Diambil dari token JWT via authMiddleware
        const { items, paymentMethod, paymentAmount } = req.body;

        if (!items || items.length === 0 || !paymentMethod || paymentAmount === undefined) {
            return res.status(400).json({
                status: "error",
                message: "Item belanja, metode bayar, dan nominal bayar wajib diisi"
            });
        }

        const result = await transactionService.checkout(userId, req.body);

        // Kirim respons 201 Created sesuai spesifikasi halaman 17
        return res.status(201).json({
            status: "success",
            message: "Transaksi berhasil",
            data: result
        });
    } catch (error) {
        // Menangani error unprocessable entity jika stok kurang (Halaman 17)
        return res.status(422).json({
            status: "error",
            message: error.message
        });
    }
};

// Tambahkan fungsi-fungsi ini ke file controllers/transactionController.js kamu:

const getHistory = async (req, res) => {
    try {
        const data = await transactionService.getTransactionHistory();
        return res.status(200).json({
            status: "success",
            message: "Berhasil mengambil riwayat transaksi",
            data
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

const getDetail = async (req, res) => {
    try {
        const { id } = req.params;
        
        const itemsData = await transactionService.getTransactionDetail(id);
        
        const { data: transactionInfo, error: txError } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (txError || !transactionInfo) {
            return res.status(404).json({ 
                status: "error", 
                message: "Data transaksi tidak ditemukan" 
            });
        }
        
        const formattedData = [
            {
                id: transactionInfo.id,
                transaction_code: transactionInfo.transaction_code, 
                user_id: transactionInfo.user_id, 
                total_amount: parseFloat(transactionInfo.total_amount),
                discount_amount: parseFloat(transactionInfo.discount_amount || 0),
                grand_total: parseFloat(transactionInfo.grand_total),
                payment_method: transactionInfo.payment_method,
                payment_amount: parseFloat(transactionInfo.payment_amount),
                change_amount: parseFloat(transactionInfo.change_amount || 0),
                status: transactionInfo.status,         
                void_reason: transactionInfo.void_reason, 
                created_at: transactionInfo.created_at,
                items: itemsData
            }
        ];

        return res.status(200).json({
            status: "success",
            message: "Berhasil mengambil rincian detail transaksi",
            data: formattedData 
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

const cancelTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { void_reason } = req.body;

        if (!void_reason) {
            return res.status(400).json({ status: "error", message: "Alasan pembatalan (void_reason) wajib diisi" });
        }

        const data = await transactionService.voidTransaction(id, void_reason);
        return res.status(200).json({
            status: "success",
            message: "Transaksi berhasil dibatalkan (voided)",
            data
        });
    } catch (error) {
        return res.status(400).json({ status: "error", message: error.message });
    }
};

// Update module.exports di bagian bawah controller kamu:
module.exports = {
    createTransaction, // fungsi lama kamu
    getHistory,
    getDetail,
    cancelTransaction
};
