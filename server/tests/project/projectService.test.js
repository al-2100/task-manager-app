const projectService = require('../../services/projectService');
const projectRepository = require('../../repositories/projectRepository');

// Mock the projectRepository
jest.mock('../../repositories/projectRepository');

describe('Project Service', () => {
    describe('createProject', () => {
        it('should create a project and return the created project', async () => {
            const projectData = { title: 'Test Project', description: 'Test Description', userId: 1 };
            const createdProject = { id: 1, ...projectData };
            projectRepository.createProject.mockResolvedValue(createdProject);

            const result = await projectService.createProject(projectData);
            expect(result).toEqual(createdProject);
            expect(projectRepository.createProject).toHaveBeenCalledWith(projectData);
        });
    });

    describe('getProjectsByUser', () => {
        it('should return an array of projects for the given user', async () => {
            const userId = 1;
            const projects = [{ id: 1, title: 'Test Project', userId }];
            projectRepository.getProjectsByUser.mockResolvedValue(projects);

            const result = await projectService.getProjectsByUser(userId);
            expect(result).toEqual(projects);
            expect(projectRepository.getProjectsByUser).toHaveBeenCalledWith(userId);
        });
    });

    describe('getProjectById', () => {
        it('should return a project if found', async () => {
            const projectId = 1, userId = 1;
            const project = { id: projectId, title: 'Test Project', userId };
            projectRepository.getProjectById.mockResolvedValue(project);

            const result = await projectService.getProjectById(projectId, userId);
            expect(result).toEqual(project);
            expect(projectRepository.getProjectById).toHaveBeenCalledWith(projectId, userId);
        });
    });

    describe('updateProject', () => {
        it('should update the project and return the update result', async () => {
            const projectId = 1, userId = 1;
            const updateData = { title: 'Updated Title' };
            const updateResult = { count: 1 };
            projectRepository.updateProject.mockResolvedValue(updateResult);

            const result = await projectService.updateProject(projectId, userId, updateData);
            expect(result).toEqual(updateResult);
            expect(projectRepository.updateProject).toHaveBeenCalledWith(projectId, userId, updateData);
        });
    });

    describe('deleteProject', () => {
        it('should delete the project and return the delete result', async () => {
            const projectId = 1, userId = 1;
            const deleteResult = { count: 1 };
            projectRepository.deleteProject.mockResolvedValue(deleteResult);

            const result = await projectService.deleteProject(projectId, userId);
            expect(result).toEqual(deleteResult);
            expect(projectRepository.deleteProject).toHaveBeenCalledWith(projectId, userId);
        });
    });
});
