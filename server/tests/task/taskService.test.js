const taskService = require('../../services/taskService');
const taskRepository = require('../../repositories/taskRepository');

// Mock the taskRepository
jest.mock('../../repositories/taskRepository');

describe('Task Service', () => {
    describe('createTask', () => {
        it('should create a new task', async () => {
            const taskData = { title: 'Test Task', description: 'Task description', status: 'PENDING', dueDate: '2023-03-30T00:00:00Z', priority: 'MEDIUM', projectId: 1 };
            const createdTask = { id: 1, ...taskData };
            taskRepository.createTask.mockResolvedValue(createdTask);

            const result = await taskService.createTask(taskData);
            expect(result).toEqual(createdTask);
            expect(taskRepository.createTask).toHaveBeenCalledWith(taskData);
        });
    });

    describe('getTasksByProject', () => {
        it('should return tasks for the project', async () => {
            const projectId = 1;
            const tasks = [{ id: 1, title: 'Test Task', projectId }];
            taskRepository.getTasksByProject.mockResolvedValue(tasks);

            const result = await taskService.getTasksByProject(projectId);
            expect(result).toEqual(tasks);
            expect(taskRepository.getTasksByProject).toHaveBeenCalledWith(projectId);
        });
    });

    describe('getTaskById', () => {
        it('should return the task when found', async () => {
            const taskId = 1, projectId = 1;
            const task = { id: taskId, title: 'Test Task', projectId };
            taskRepository.getTaskById.mockResolvedValue(task);

            const result = await taskService.getTaskById(taskId, projectId);
            expect(result).toEqual(task);
            expect(taskRepository.getTaskById).toHaveBeenCalledWith(taskId, projectId);
        });
    });

    describe('updateTask', () => {
        it('should update the task and return the update result', async () => {
            const taskId = 1, projectId = 1;
            const updateData = { title: 'Updated Task Title' };
            const updateResult = { count: 1 };
            taskRepository.updateTask.mockResolvedValue(updateResult);

            const result = await taskService.updateTask(taskId, projectId, updateData);
            expect(result).toEqual(updateResult);
            expect(taskRepository.updateTask).toHaveBeenCalledWith(taskId, projectId, updateData);
        });
    });

    describe('deleteTask', () => {
        it('should delete the task and return the delete result', async () => {
            const taskId = 1, projectId = 1;
            const deleteResult = { count: 1 };
            taskRepository.deleteTask.mockResolvedValue(deleteResult);

            const result = await taskService.deleteTask(taskId, projectId);
            expect(result).toEqual(deleteResult);
            expect(taskRepository.deleteTask).toHaveBeenCalledWith(taskId, projectId);
        });
    });
});
