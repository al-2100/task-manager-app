const request = require('supertest');
const express = require('express');
const projectRoutes = require('../../routes/projects');
const projectService = require('../../services/projectService');

// Mock projectService
jest.mock('../../services/projectService');

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

app.use('/api/projects', projectRoutes);

describe('Project Controller', () => {
    describe('POST /api/projects', () => {
        it('should create a new project', async () => {
            const newProject = { id: 1, title: 'Test Project', description: 'Test Description', userId: 1 };
            projectService.createProject.mockResolvedValue(newProject);

            const res = await request(app)
                .post('/api/projects')
                .send({ title: 'Test Project', description: 'Test Description' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(newProject);
            expect(projectService.createProject).toHaveBeenCalledWith({ title: 'Test Project', description: 'Test Description', userId: 1 });
        });
    });

    describe('GET /api/projects', () => {
        it('should return a list of projects', async () => {
            const projects = [{ id: 1, title: 'Test Project', description: 'Test Description', userId: 1 }];
            projectService.getProjectsByUser.mockResolvedValue(projects);

            const res = await request(app).get('/api/projects');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(projects);
            expect(projectService.getProjectsByUser).toHaveBeenCalledWith(1);
        });
    });

    describe('GET /api/projects/:id', () => {
        it('should return a project by id', async () => {
            const project = { id: 1, title: 'Test Project', description: 'Test Description', userId: 1 };
            projectService.getProjectById.mockResolvedValue(project);

            const res = await request(app).get('/api/projects/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(project);
            expect(projectService.getProjectById).toHaveBeenCalledWith(1, 1);
        });

        it('should return 404 if project not found', async () => {
            projectService.getProjectById.mockResolvedValue(null);

            const res = await request(app).get('/api/projects/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Project not found' });
        });
    });

    describe('PUT /api/projects/:id', () => {
        it('should update a project and return success message', async () => {
            const updateData = { title: 'Updated Project Title' };
            projectService.updateProject.mockResolvedValue({ count: 1 });

            const res = await request(app)
                .put('/api/projects/1')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Project updated successfully' });
            expect(projectService.updateProject).toHaveBeenCalledWith(1, 1, updateData);
        });

        it('should return 404 if project is not found or unauthorized', async () => {
            projectService.updateProject.mockResolvedValue({ count: 0 });

            const res = await request(app)
                .put('/api/projects/999')
                .send({ title: 'Updated Project Title' });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Project not found or not authorized' });
        });
    });

    describe('DELETE /api/projects/:id', () => {
        it('should delete a project and return success message', async () => {
            projectService.deleteProject.mockResolvedValue({ count: 1 });

            const res = await request(app).delete('/api/projects/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Project deleted successfully' });
            expect(projectService.deleteProject).toHaveBeenCalledWith(1, 1);
        });

        it('should return 404 if project is not found or unauthorized', async () => {
            projectService.deleteProject.mockResolvedValue({ count: 0 });

            const res = await request(app).delete('/api/projects/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Project not found or not authorized' });
        });
    });

});
