const prisma = require('../lib/prismaClient');

/**
 * Project Repository
 * Handles direct interactions with the database for project-related queries.
 */

exports.createProject = async ({ title, description, userId }) => {
    // Create a new project record linked to the given user
    return prisma.project.create({
        data: {title, description, userId},
    });
};

exports.getProjectsByUser = async (userId) => {
    // Retrieve all projects belonging to a user
    return prisma.project.findMany({
        where: {userId},
    });
};

exports.getProjectById = async (id, userId) => {
    // Retrieve a project by its ID and ensure it belongs to the specified user
    return prisma.project.findFirst({
        where: {id, userId},
    });
};

exports.updateProject = async (id, userId, data) => {
    // First find the project to make sure it exists and belongs to user
    const project = await prisma.project.findFirst({
        where: {id, userId},
    });
    
    if (!project) {
        return { count: 0, project: null };
    }
    
    // Update the project
    const updatedProject = await prisma.project.update({
        where: { id },
        data,
    });
    
    return { count: 1, project: updatedProject };
};

exports.deleteProject = async (id, userId) => {
    // First find the project to be deleted
    const project = await prisma.project.findFirst({
        where: {id, userId},
    });
    
    if (!project) {
        return { count: 0, project: null };
    }
    
    // Delete the project
    await prisma.project.delete({
        where: { id },
    });
    
    return { count: 1, project };
};
