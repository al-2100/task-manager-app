const taskService = require('../services/taskService');

/**
 * Task Controller
 * Processes HTTP requests for task operations and sends appropriate responses.
 */

exports.createTask = async (req, res) => {
    // Extract projectId from URL parameters and task details from the request body
    const { projectId } = req.params;
    const { title, description, status, dueDate, priority } = req.body;
    try {
        // Call the service to create a new task associated with the specified project
        const task = await taskService.createTask({
            title,
            description,
            status,
            dueDate,
            priority,
            projectId: parseInt(projectId),
        });
        // Return the created task with a 201 status code
        res.status(201).json(task);
    } catch (error) {
        // Log the error and respond with a 500 Internal Server Error
        console.error('Error creating task:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    // Extract the projectId from URL parameters
    const { projectId } = req.params;
    try {
        // Retrieve all tasks for the given project
        const tasks = await taskService.getTasksByProject(parseInt(projectId));
        res.json(tasks);
    } catch (error) {
        // Log error and send a 500 response
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getTask = async (req, res) => {
    // Extract both projectId and task id from URL parameters
    const { projectId, id } = req.params;
    try {
        // Retrieve a specific task by its ID within the project
        const task = await taskService.getTaskById(parseInt(id), parseInt(projectId));
        if (!task) {
            // Return a 404 status if task is not found
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    // Extract projectId and task id from URL parameters
    const { projectId, id } = req.params;
    try {
        // Update the task and check if any record was affected
        const result = await taskService.updateTask(parseInt(id), parseInt(projectId), req.body);
        if (result.count === 0) {
            // If no records were updated, the task might not exist or the user is unauthorized
            return res.status(404).json({ error: 'Task not found or not authorized' });
        }
        res.json({ 
            message: 'Task updated successfully',
            task: result.task
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    // Extract projectId and task id from URL parameters
    const { projectId, id } = req.params;
    try {
        // Delete the task and check if the deletion was successful
        const result = await taskService.deleteTask(parseInt(id), parseInt(projectId));
        if (result.count === 0) {
            return res.status(404).json({ error: 'Task not found or not authorized' });
        }
        res.json({ 
            message: 'Task deleted successfully',
            task: result.task
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: error.message });
    }
};
