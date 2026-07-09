const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const data = await productService.getAllProductsFiltered(category, search);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await productService.getProductById(id);
    if (!data) {
      return res.status(404).json({ status: "error", message: "Produk tidak ditemukan" });
    }
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil detail produk",
      data
    });
  } catch (error) {
    return res.status(404).json({ status: "error", message: "Produk tidak ditemukan atau tidak aktif" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { category_id, name, sell_price, cost_price, image_url, initial_stock, min_stock, unit } = req.body;

    // Validasi input wajib sesuai skema halaman 14
    if (!category_id || !name || !sell_price) {
      return res.status(400).json({ 
        status: "error", 
        message: "Kategori, nama produk, dan harga jual wajib diisi" 
      });
    }

    const product = await productService.createProduct(req.body);

    return res.status(201).json({
      status: "success",
      message: "Produk dan stok awal berhasil ditambahkan",
      data: product
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, sell_price, cost_price, image_url } = req.body;

    // Validasi minimal field wajib jika dikirim
    if (sell_price !== undefined && sell_price < 0) {
      return res.status(400).json({ status: "error", message: "Harga jual tidak boleh negatif" });
    }

    const product = await productService.updateProduct(id, req.body);
    return res.status(200).json({
      status: "success",
      message: "Produk berhasil diperbarui",
      data: product
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.deleteProduct(id);
    return res.status(200).json({
      status: "success",
      message: "Produk berhasil dihapus (soft delete)",
      data: product
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};