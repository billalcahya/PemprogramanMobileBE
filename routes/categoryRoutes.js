const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Semua endpoint kategori wajib menyertakan Bearer Token JWT
router.get('/', authMiddleware, categoryController.getCategories);
router.get('/:id', authMiddleware, categoryController.getCategoryById);
router.post('/', authMiddleware, categoryController.addCategory);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;