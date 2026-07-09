const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, inventoryController.getInventory);
router.put('/:id', authMiddleware, inventoryController.updateStock);

module.exports = router;