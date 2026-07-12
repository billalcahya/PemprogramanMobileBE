const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // 1. Import middleware upload                                                                                                           

router.get('/', authMiddleware, productController.getProducts);
router.get('/:id', authMiddleware, productController.getProductById);

// 2. Tambahkan upload.single('product_image') di sini                                                                                                                                             
router.post('/', authMiddleware, upload.single('product_image'), productController.addProduct);

router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;         