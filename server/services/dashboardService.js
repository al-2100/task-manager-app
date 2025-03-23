const projectRepository = require('../repositories/projectRepository');
const taskRepository = require('../repositories/taskRepository');

/**
 * Dashboard Service
 * Contains business logic for gathering dashboard data.
 */

exports.getDashboardSummary = async (userId) => {
    // Get all projects for the user
    const projects = await projectRepository.getProjectsByUser(userId);
    
    // Prepare containers for collecting data
    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let tasksToday = 0;
    const recentProjects = [];
    const upcomingTasks = [];
    const pendingTasksList = []; // New array to store pending tasks
    
    // Process each project to collect task statistics
    for (const project of projects) {
        const projectTasks = await taskRepository.getTasksByProject(project.id);
        
        // Count tasks for this project
        const projectCompletedTasks = projectTasks.filter(task => task.status === 'COMPLETED').length;
        
        // Update total counts
        totalTasks += projectTasks.length;
        completedTasks += projectCompletedTasks;
        
        // Add to recent projects data
        recentProjects.push({
            id: project.id.toString(),
            title: project.title,
            tasksCount: projectTasks.length,
            completedCount: projectCompletedTasks
        });
        
        // Process each task in the project
        for (const task of projectTasks) {
            // Check if task is pending
            if (task.status !== 'COMPLETED') {
                pendingTasks++;
                
                // Add to pending tasks list
                pendingTasksList.push({
                    id: task.id.toString(),
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
                    projectId: project.id.toString(),
                    projectTitle: project.title
                });
                
                // Check if task is due today
                if (task.dueDate) {
                    const today = new Date();
                    const dueDate = new Date(task.dueDate);
                    
                    if (dueDate.toDateString() === today.toDateString()) {
                        tasksToday++;
                    }
                    
                    // Add to upcoming tasks if due date is in the future or today
                    if (dueDate >= today) {
                        upcomingTasks.push({
                            id: task.id.toString(),
                            title: task.title,
                            dueDate: task.dueDate.toISOString(),
                            priority: task.priority,
                            project: project.title
                        });
                    }
                }
            }
        }
    }
    
    // Sort upcoming tasks by due date
    upcomingTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    // Return formatted dashboard data
    return {
        taskSummary: {
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            today: tasksToday
        },
        recentProjects: recentProjects.slice(0, 5), // Limit to 5 most recent projects
        upcomingTasks: upcomingTasks.slice(0, 5),    // Limit to 5 most urgent tasks
        pendingTasks: pendingTasksList // Include all pending tasks in the response
    };
};
