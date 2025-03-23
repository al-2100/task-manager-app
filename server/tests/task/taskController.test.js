const request = require('supertest');
const express = require('express');
const taskRoutes = require('../../routes/tasks');
const taskService = require('../../services/taskService');

// Mock the taskService to avoid executing real business logic
jest.mock('../../services/taskService');

// Create an Express app instance for testing task endpoints
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

// Use a dynamic route parameter
app.use('/api/projects/:projectId/tasks', taskRoutes);

describe('Task Controller', () => {
    describe('POST /api/projects/1/tasks', () => {
        it('should create a new task', async () => {
            const newTask = { id: 1, title: 'Test Task', description: 'Task description', status: 'PENDING', dueDate: '2025-03-30T00:00:00Z', priority: 'MEDIUM', projectId: 1 };
            taskService.createTask.mockResolvedValue(newTask);

            const res = await request(app)
                .post('/api/projects/1/tasks')
                .send({ title: 'Test Task', description: 'Task description', status: 'PENDING', dueDate: '2025-03-30T00:00:00Z', priority: 'MEDIUM' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(newTask);
            expect(taskService.createTask).toHaveBeenCalledWith({
                title: 'Test Task',
                description: 'Task description',
                status: 'PENDING',
                dueDate: '2025-03-30T00:00:00Z',
                priority: 'MEDIUM',
                projectId: 1,
            });
        });
    });

    describe('GET /api/projects/1/tasks', () => {
        it('should return a list of tasks', async () => {
            const tasks = [{ id: 1, title: 'Test Task', projectId: 1 }];
            taskService.getTasksByProject.mockResolvedValue(tasks);

            const res = await request(app).get('/api/projects/1/tasks');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(tasks);
            expect(taskService.getTasksByProject).toHaveBeenCalledWith(1);
        });
    });

    describe('GET /api/projects/1/tasks/:id', () => {
        it('should return a task by id', async () => {
            const task = { id: 1, title: 'Test Task', projectId: 1 };
            taskService.getTaskById.mockResolvedValue(task);

            const res = await request(app).get('/api/projects/1/tasks/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(task);
            expect(taskService.getTaskById).toHaveBeenCalledWith(1, 1);
        });

        it('should return 404 if task not found', async () => {
            taskService.getTaskById.mockResolvedValue(null);

            const res = await request(app).get('/api/projects/1/tasks/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Task not found' });
        });
    });

    describe('PUT /api/projects/1/tasks/:id', () => {
        it('should update a task and return success message', async () => {
            const updateData = { title: 'Updated Task Title' };
            taskService.updateTask.mockResolvedValue({ count: 1 });

            const res = await request(app)
                .put('/api/projects/1/tasks/1')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Task updated successfully' });
            expect(taskService.updateTask).toHaveBeenCalledWith(1, 1, updateData);
        });

        it('should return 404 if task is not found or unauthorized', async () => {
            taskService.updateTask.mockResolvedValue({ count: 0 });

            const res = await request(app)
                .put('/api/projects/1/tasks/999')
                .send({ title: 'Updated Task Title' });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Task not found or not authorized' });
        });
    });

    describe('DELETE /api/projects/1/tasks/:id', () => {
        it('should delete a task and return success message', async () => {
            taskService.deleteTask.mockResolvedValue({ count: 1 });

            const res = await request(app).delete('/api/projects/1/tasks/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Task deleted successfully' });
            expect(taskService.deleteTask).toHaveBeenCalledWith(1, 1);
        });

        it('should return 404 if task is not found or unauthorized', async () => {
            taskService.deleteTask.mockResolvedValue({ count: 0 });

            const res = await request(app).delete('/api/projects/1/tasks/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Task not found or not authorized' });
        });
    });

});
