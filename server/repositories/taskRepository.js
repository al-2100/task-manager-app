const prisma = require('../lib/prismaClient');

/**
 * Task Repository
 * Handles direct database interactions for task-related queries.
 */
exports.createTask = async ({ title, description, status, dueDate, priority, projectId }) => {
    return prisma.task.create({
        data: {
            title,
            description,
            status,
            // Convert dueDate to a JavaScript Date object if provided; otherwise, set as null
            dueDate: dueDate ? new Date(dueDate) : null,
            priority,
            // Connect the task to its associated project using the project ID
            project: {connect: {id: projectId}},
        },
    });
};

exports.getTasksByProject = async (projectId) => {
    return prisma.task.findMany({
        where: {projectId},
    });
};

exports.getTaskById = async (id, projectId) => {
    return prisma.task.findFirst({
        where: {id, projectId},
    });
};

exports.updateTask = async (id, projectId, data) => {
    // First find the task to make sure it exists
    const task = await prisma.task.findFirst({
        where: {id, projectId},
    });
    
    if (!task) {
        return { count: 0, task: null };
    }
    
    // Update the task
    const updatedTask = await prisma.task.update({
        where: { id },
        data,
    });
    
    return { count: 1, task: updatedTask };
};

exports.deleteTask = async (id, projectId) => {
    // First find the task to be deleted
    const task = await prisma.task.findFirst({
        where: {id, projectId},
    });
    
    if (!task) {
        return { count: 0, task: null };
    }
    
    // Delete the task
    await prisma.task.delete({
        where: { id },
    });
    
    return { count: 1, task };
};
