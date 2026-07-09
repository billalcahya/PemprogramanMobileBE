const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/daily', authMiddleware, reportController.getDailyReport);
router.get('/monthly', authMiddleware, reportController.getMonthlyReport);

module.exports = router;
