const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge URL parameters from parent router
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all task routes with the JWT verification middleware
router.use(authMiddleware.verifyToken);

// Route to create a new task within a project
router.post('/', taskController.createTask);

// Route to retrieve all tasks for a specific project
router.get('/', taskController.getTasks);

// Route to retrieve a specific task by its ID within a project
router.get('/:id', taskController.getTask);

// Route to update a specific task
router.put('/:id', taskController.updateTask);

// Route to delete a specific task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
