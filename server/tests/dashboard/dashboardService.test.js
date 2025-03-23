const dashboardService = require('../../services/dashboardService');
const projectRepository = require('../../repositories/projectRepository');
const taskRepository = require('../../repositories/taskRepository');

// Mock the repositories
jest.mock('../../repositories/projectRepository');
jest.mock('../../repositories/taskRepository');

describe('Dashboard Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    describe('getDashboardSummary', () => {
        it('should return correctly formatted dashboard data', async () => {
            const userId = 1;
            
            // Create dates for testing that ensure both tasks are recognized as upcoming
            // Set hours/minutes/seconds to zero to avoid time comparison issues
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            // Mock projects data
            const mockProjects = [
                { id: 1, title: 'Project 1' },
                { id: 2, title: 'Project 2' }
            ];
            
            // Mock tasks data for each project
            const projectOneTasksMock = [
                { 
                    id: 1, 
                    title: 'Task 1', 
                    description: 'Description 1', 
                    status: 'COMPLETED', 
                    priority: 'HIGH', 
                    dueDate: null 
                },
                { 
                    id: 2, 
                    title: 'Task 2', 
                    description: 'Description 2', 
                    status: 'IN_PROGRESS', 
                    priority: 'MEDIUM',
                    dueDate: today // Using the normalized today date
                }
            ];
            
            const projectTwoTasksMock = [
                { 
                    id: 3, 
                    title: 'Task 3', 
                    description: 'Description 3', 
                    status: 'TODO', 
                    priority: 'LOW', 
                    dueDate: tomorrow // Using the normalized tomorrow date
                }
            ];
            
            // Setup repository mocks
            projectRepository.getProjectsByUser.mockResolvedValue(mockProjects);
            taskRepository.getTasksByProject
                .mockResolvedValueOnce(projectOneTasksMock)  // For Project 1
                .mockResolvedValueOnce(projectTwoTasksMock); // For Project 2
            
            // Mock the Date in the service to use a fixed date for consistent comparison
            const originalDate = global.Date;
            const mockDate = class extends Date {
                constructor(...args) {
                    if (args.length === 0) {
                        // When creating a new Date() without arguments, return a fixed date
                        // that matches our test dates
                        return new originalDate(today);
                    }
                    return new originalDate(...args);
                }
                static now() {
                    return new originalDate(today).getTime();
                }
            };
            global.Date = mockDate;
                
            try {
                // Call the service
                const result = await dashboardService.getDashboardSummary(userId);
                
                // Assertions
                expect(projectRepository.getProjectsByUser).toHaveBeenCalledWith(userId);
                expect(taskRepository.getTasksByProject).toHaveBeenCalledTimes(2);
                expect(taskRepository.getTasksByProject).toHaveBeenCalledWith(1);
                expect(taskRepository.getTasksByProject).toHaveBeenCalledWith(2);
                
                // Verify the dashboard data structure
                expect(result).toHaveProperty('taskSummary');
                expect(result).toHaveProperty('recentProjects');
                expect(result).toHaveProperty('upcomingTasks');
                expect(result).toHaveProperty('pendingTasks');
                
                // Verify task counts
                expect(result.taskSummary.total).toBe(3);
                expect(result.taskSummary.completed).toBe(1);
                expect(result.taskSummary.pending).toBe(2);
                
                // Check for today's tasks
                expect(result.taskSummary.today).toBe(1);
                
                // Check recent projects (should be all projects since we have fewer than 5)
                expect(result.recentProjects.length).toBe(2);
                expect(result.recentProjects[0].id).toBe('1');
                expect(result.recentProjects[0].tasksCount).toBe(2);
                expect(result.recentProjects[0].completedCount).toBe(1);
                
                // Check upcoming tasks (should include Task 2 and Task 3)
                expect(result.upcomingTasks.length).toBe(2);
                
                // Check pending tasks (should include Task 2 and Task 3)
                expect(result.pendingTasks.length).toBe(2);
            } finally {
                // Restore original Date implementation
                global.Date = originalDate;
            }
        });
        
        it('should handle empty projects array', async () => {
            const userId = 1;
            
            // Mock an empty projects array
            projectRepository.getProjectsByUser.mockResolvedValue([]);
            
            // Call the service
            const result = await dashboardService.getDashboardSummary(userId);
            
            // Assertions
            expect(projectRepository.getProjectsByUser).toHaveBeenCalledWith(userId);
            expect(taskRepository.getTasksByProject).not.toHaveBeenCalled();
            
            // Verify the dashboard data structure with zero counts
            expect(result.taskSummary.total).toBe(0);
            expect(result.taskSummary.completed).toBe(0);
            expect(result.taskSummary.pending).toBe(0);
            expect(result.taskSummary.today).toBe(0);
            expect(result.recentProjects.length).toBe(0);
            expect(result.upcomingTasks.length).toBe(0);
            expect(result.pendingTasks.length).toBe(0);
        });
        
        it('should handle projects with no tasks', async () => {
            const userId = 1;
            
            // Mock projects data
            const mockProjects = [
                { id: 1, title: 'Project 1' }
            ];
            
            // Setup repository mocks
            projectRepository.getProjectsByUser.mockResolvedValue(mockProjects);
            taskRepository.getTasksByProject.mockResolvedValue([]);  // Empty tasks
            
            // Call the service
            const result = await dashboardService.getDashboardSummary(userId);
            
            // Assertions
            expect(projectRepository.getProjectsByUser).toHaveBeenCalledWith(userId);
            expect(taskRepository.getTasksByProject).toHaveBeenCalledWith(1);
            
            // Verify the dashboard data structure with zero counts
            expect(result.taskSummary.total).toBe(0);
            expect(result.taskSummary.completed).toBe(0);
            expect(result.taskSummary.pending).toBe(0);
            expect(result.taskSummary.today).toBe(0);
            expect(result.recentProjects.length).toBe(1);
            expect(result.recentProjects[0].tasksCount).toBe(0);
            expect(result.recentProjects[0].completedCount).toBe(0);
            expect(result.upcomingTasks.length).toBe(0);
            expect(result.pendingTasks.length).toBe(0);
        });
    });
});
