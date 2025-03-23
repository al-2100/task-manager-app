const request = require('supertest');
const express = require('express');
const dashboardRoutes = require('../../routes/dashboard');
const dashboardService = require('../../services/dashboardService');

// Mock dashboardService
jest.mock('../../services/dashboardService');

// Create an Express app instance for testing
const app = express();
app.use(express.json());

// Bypass token verification in tests
jest.mock('../../middlewares/authMiddleware', () => ({
    verifyToken: (req, res, next) => {
        // Bypass token verification in tests
        req.user = { id: 1 }; // Dummy user
        next();
    },
}));

app.use('/api/dashboard', dashboardRoutes);

describe('Dashboard Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    describe('GET /api/dashboard/summary', () => {
        it('should return dashboard summary data', async () => {
            // Mock data that would be returned by the service
            const mockDashboardData = {
                taskSummary: {
                    total: 10,
                    completed: 5,
                    pending: 5,
                    today: 2
                },
                recentProjects: [
                    { id: '1', title: 'Project 1', tasksCount: 5, completedCount: 3 }
                ],
                upcomingTasks: [
                    { id: '1', title: 'Task 1', dueDate: '2023-06-01T00:00:00.000Z', priority: 'HIGH', project: 'Project 1' }
                ],
                pendingTasks: [
                    { id: '1', title: 'Task 1', status: 'IN_PROGRESS', priority: 'HIGH', projectId: '1', projectTitle: 'Project 1' }
                ]
            };
            
            // Setup the mock to return our data
            dashboardService.getDashboardSummary.mockResolvedValue(mockDashboardData);
            
            // Make the request
            const res = await request(app).get('/api/dashboard/summary');
            
            // Assertions
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDashboardData);
            expect(dashboardService.getDashboardSummary).toHaveBeenCalledWith(1);
            expect(dashboardService.getDashboardSummary).toHaveBeenCalledTimes(1);
        });
        
        it('should return 500 if an error occurs', async () => {
            // Setup the mock to throw an error
            const errorMessage = 'Internal server error';
            dashboardService.getDashboardSummary.mockRejectedValue(new Error(errorMessage));
            
            // Make the request
            const res = await request(app).get('/api/dashboard/summary');
            
            // Assertions
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: errorMessage });
        });
    });
});
