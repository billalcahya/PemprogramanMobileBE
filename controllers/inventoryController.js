const inventoryService = require('../services/inventoryService');

const getInventory = async (req, res) => {
  try {
    const data = await inventoryService.getAllInventory();
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data inventori",
      data
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { current_stock, min_stock, unit } = req.body; 

    if (current_stock === undefined || current_stock < 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "Jumlah stok baru wajib diisi dan tidak boleh negatif" 
      });
    }

    const data = await inventoryService.updateStockManual(id, current_stock, min_stock, unit);
    return res.status(200).json({
      status: "success",
      message: "Stok berhasil diperbarui secara manual",
      data
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getInventory,
  updateStock
};