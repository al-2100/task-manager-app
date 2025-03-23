const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all dashboard routes with JWT verification middleware
router.use(authMiddleware.verifyToken);

// Route to get dashboard summary data
router.get('/summary', dashboardController.getDashboardSummary);

module.exports = router;
