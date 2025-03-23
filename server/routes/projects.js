const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');
const taskRoutes = require('./tasks'); // Nested routes for tasks

// Protect all project routes with JWT verification middleware
router.use(authMiddleware.verifyToken);

// Route to create a new project
router.post('/', projectController.createProject);

// Route to get all projects for the authenticated user
router.get('/', projectController.getProjects);

// Route to get a specific project by its ID
router.get('/:id', projectController.getProject);

// Route to update a specific project
router.put('/:id', projectController.updateProject);

// Route to delete a specific project
router.delete('/:id', projectController.deleteProject);

// Mount nested task routes under a project
router.use('/:projectId/tasks', taskRoutes);

module.exports = router;
