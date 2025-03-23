const projectService = require('../services/projectService');

/**
 * Project Controller
 * Handles HTTP requests for project operations and sends responses.
 */

exports.createProject = async (req, res) => {
    // Ensure the user is authenticated (user info is attached via authMiddleware)
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    const { title, description } = req.body;
    const userId = req.user.id;
    try {
        // Call the service to create a new project
        const project = await projectService.createProject({ title, description, userId });
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProjects = async (req, res) => {
    const userId = req.user.id;
    try {
        // Retrieve all projects for the authenticated user
        const projects = await projectService.getProjectsByUser(userId);
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProject = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        // Retrieve a single project by its ID
        const project = await projectService.getProjectById(parseInt(id), userId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        // Update the project and check if the update affected any record
        const result = await projectService.updateProject(parseInt(id), userId, req.body);
        if (result.count === 0) {
            return res.status(404).json({ error: 'Project not found or not authorized' });
        }
        res.json({ 
            message: 'Project updated successfully',
            project: result.project
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        // Delete the project and check if it was successful
        const result = await projectService.deleteProject(parseInt(id), userId);
        if (result.count === 0) {
            return res.status(404).json({ error: 'Project not found or not authorized' });
        }
        res.json({ 
            message: 'Project deleted successfully',
            project: result.project
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: error.message });
    }
};
