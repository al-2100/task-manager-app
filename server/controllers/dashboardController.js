const dashboardService = require('../services/dashboardService');

/**
 * Dashboard Controller
 * Processes HTTP requests for dashboard data and sends responses.
 */

exports.getDashboardSummary = async (req, res) => {
    try {
        // Get the user ID from the authenticated request
        const userId = req.user.id;
        
        // Call service to retrieve dashboard summary data
        const dashboardData = await dashboardService.getDashboardSummary(userId);
        
        res.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: error.message });
    }
};
