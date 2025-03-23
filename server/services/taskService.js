const taskRepository = require('../repositories/taskRepository');

/**
 * Task Service
 * Contains business logic for handling task-related operations.
 */

exports.createTask = async ({ title, description, status, dueDate, priority, projectId }) => {
    // Delegate task creation to the repository
    return await taskRepository.createTask({ title, description, status, dueDate, priority, projectId });
};

exports.getTasksByProject = async (projectId) => {
    // Retrieve all tasks associated with the specified project
    return await taskRepository.getTasksByProject(projectId);
};

exports.getTaskById = async (id, projectId) => {
    // Retrieve a specific task by its ID within a project
    return await taskRepository.getTaskById(id, projectId);
};

exports.updateTask = async (id, projectId, data) => {
    // Update task details and return the updated task
    return await taskRepository.updateTask(id, projectId, data);
};

exports.deleteTask = async (id, projectId) => {
    // Delete the task and return the deleted task data
    return await taskRepository.deleteTask(id, projectId);
};
