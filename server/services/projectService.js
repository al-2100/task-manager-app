const projectRepository = require('../repositories/projectRepository');

/**
 * Project Service
 * Contains business logic for handling project-related operations.
 */

exports.createProject = async ({ title, description, userId }) => {
    // Delegate project creation to the repository
    return await projectRepository.createProject({ title, description, userId });
};

exports.getProjectsByUser = async (userId) => {
    // Retrieve all projects for the given user
    return await projectRepository.getProjectsByUser(userId);
};

exports.getProjectById = async (id, userId) => {
    // Retrieve a single project by its ID and associated user
    return await projectRepository.getProjectById(id, userId);
};

exports.updateProject = async (id, userId, data) => {
    // Update the project with the provided data and return the updated project
    return await projectRepository.updateProject(id, userId, data);
};

exports.deleteProject = async (id, userId) => {
    // Delete the project and return the deleted project data
    return await projectRepository.deleteProject(id, userId);
};
