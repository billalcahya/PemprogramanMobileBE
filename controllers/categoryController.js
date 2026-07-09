const categoryService = require('../services/categoryService');

const getCategories = async (req, res) => {
  try {
    const data = await categoryService.getAllCategories();
    return res.status(200).json(data);
  } catch (error) {
    console.error("DEBUG GET CATEGORIES ERROR:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await categoryService.getCategoryById(id);
    if (!data) {
      return res.status(404).json({ status: "error", message: "Kategori tidak ditemukan" });
    }
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil detail kategori",
      data
    });
  } catch (error) {
    return res.status(404).json({ status: "error", message: "Kategori tidak ditemukan atau tidak aktif" });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, color_hex, icon_name } = req.body;
    if (!name) {
      return res.status(400).json({ status: "error", message: "Nama kategori wajib diisi" });
    }

    const data = await categoryService.createCategory(name, color_hex, icon_name);
    return res.status(201).json({
      status: "success",
      message: "Kategori berhasil ditambahkan",
      data
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color_hex, icon_name } = req.body;

    const data = await categoryService.updateCategory(id, { name, color_hex, icon_name });
    return res.status(200).json({
      status: "success",
      message: "Kategori berhasil diperbarui",
      data
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await categoryService.deleteCategory(id);
    return res.status(200).json({
      status: "success",
      message: "Kategori berhasil dihapus (soft delete)",
      data
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory
};