const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, transactionController.createTransaction);

router.get('/', authMiddleware, transactionController.getHistory);
router.get('/:id', authMiddleware, transactionController.getDetail);

router.patch('/:id/void', authMiddleware, transactionController.cancelTransaction);

module.exports = router;