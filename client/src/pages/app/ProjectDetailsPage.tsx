import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject, deleteProject } from '@/services/projectService';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/taskService';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, PlusCircle, Calendar, Clock, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: string | number;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  startDate?: string | null;
  dueDate?: string | null;
  completedAt?: string | null;
}

interface Project {
  id: string | number;
  title: string;
  description?: string;
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit project states
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editedProjectTitle, setEditedProjectTitle] = useState('');
  const [editedProjectDescription, setEditedProjectDescription] = useState('');
  
  // Task dialog states
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | number | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('PENDING');
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  
  // Delete project dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Sort states
  const [sortBy, setSortBy] = useState<string>('status');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch project data
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const projectResponse = await getProjectById(projectId);
        setProject(projectResponse.data);
        setEditedProjectTitle(projectResponse.data.title);
        setEditedProjectDescription(projectResponse.data.description || '');
        
        const tasksResponse = await getTasks(projectId);
        setTasks(tasksResponse.data);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  // Handle project edit
  const handleProjectEdit = async () => {
    if (!project) return;
    
    if (isEditingProject) {
      try {
        await updateProject(project.id, {
          title: editedProjectTitle,
          description: editedProjectDescription
        });
        
        setProject({
          ...project,
          title: editedProjectTitle,
          description: editedProjectDescription
        });
        setIsEditingProject(false);
      } catch (err) {
        console.error('Error updating project:', err);
        setError('Failed to update project. Please try again.');
      }
    } else {
      setIsEditingProject(true);
    }
  };
  
  // Handle project delete
  const handleProjectDelete = async () => {
    if (!project) return;
    
    try {
      await deleteProject(project.id);
      navigate('/app/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Open task dialog for new task
  const openNewTaskDialog = () => {
    setIsEditingTask(false);
    setCurrentTaskId(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus('PENDING');
    setTaskPriority('MEDIUM');
    setTaskStartDate('');
    setTaskDueDate('');
    setIsTaskDialogOpen(true);
  };
  
  // Open task dialog for edit
  const openEditTaskDialog = (task: Task) => {
    setIsEditingTask(true);
    setCurrentTaskId(task.id);
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskStatus(task.status);
    setTaskPriority(task.priority);
    setTaskStartDate(task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '');
    setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setIsTaskDialogOpen(true);
  };
  
  // Handle task save
  const handleTaskSave = async () => {
    const taskData = {
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
      priority: taskPriority,
      startDate: taskStartDate,
      dueDate: taskDueDate
    };
    
    try {
      if (isEditingTask && currentTaskId) {
        await updateTask(projectId, currentTaskId, taskData);
        setTasks(tasks.map(task => 
          task.id === currentTaskId 
            ? { ...task, ...taskData } 
            : task
        ));
      } else {
        const response = await createTask(projectId, taskData);
        setTasks([...tasks, response.data]);
      }
      
      setIsTaskDialogOpen(false);
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task. Please try again.');
    }
  };
  
  // Handle task delete
  const handleTaskDelete = async (taskId: string | number) => {
    try {
      await deleteTask(projectId, taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };
  
  // Task status change handler
  const handleTaskStatusChange = async (taskId: string | number, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    try {
      const updatedTask = { ...task, status: newStatus };
      await updateTask(projectId, taskId, updatedTask);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };
  
  // Sort tasks function
  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      if (sortBy === 'status') {
        const statusOrder = { 'PENDING': 0, 'IN_PROGRESS': 1, 'COMPLETED': 2 };
        return sortDirection === 'asc' 
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      }
      
      if (sortBy === 'priority') {
        const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
        return sortDirection === 'asc' 
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      if (sortBy === 'dueDate') {
        // Handle null values
        if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1;
        if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1;
        
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (sortBy === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      
      return 0;
    });
  };
  
  // Toggle sort direction

  if (loading) {
    return (
      <div className="[--header-height:calc(theme(spacing.14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  if (error) {
    return (
      <div className="[--header-height:calc(theme(spacing.14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-red-500 mb-4">{error}</div>
                <Button onClick={() => navigate('/app/projects')}>Back to Projects</Button>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-6 p-6">
              {/* Project Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex-1">
                  {isEditingProject ? (
                    <div className="space-y-2">
                      <Input 
                        value={editedProjectTitle}
                        onChange={(e) => setEditedProjectTitle(e.target.value)}
                        className="text-2xl font-bold"
                      />
                      <Textarea 
                        value={editedProjectDescription}
                        onChange={(e) => setEditedProjectDescription(e.target.value)}
                        placeholder="Project description"
                        className="min-h-[100px]"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-2xl font-bold">{project?.title}</h1>
                      <p className="text-muted-foreground mt-2">{project?.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant={isEditingProject ? "default" : "outline"} 
                    size="sm"
                    onClick={handleProjectEdit}
                  >
                    {isEditingProject ? 'Save' : <><Pencil className="h-4 w-4 mr-1" /> Edit</>}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
              
              {/* Tasks Section */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Tasks</h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="status">Status</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                          <SelectItem value="dueDate">Due Date</SelectItem>
                          <SelectItem value="title">Title</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="ml-1"
                        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                      >
                        <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`} />
                      </Button>
                    </div>
                    <Button onClick={openNewTaskDialog}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>
                
                {tasks.length === 0 ? (
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <p className="text-muted-foreground">No tasks yet. Create your first task to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getSortedTasks().map((task) => (
                      <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{task.title}</h3>
                            {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                            <div className="flex gap-4 mt-2 text-sm">
                              {task.dueDate && (
                                <div className="flex items-center text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                </div>
                              )}
                              <div className={`flex items-center ${
                                task.priority === 'HIGH' ? 'text-red-500' : 
                                task.priority === 'MEDIUM' ? 'text-amber-500' : 'text-green-500'
                              }`}>
                                <Clock className="h-4 w-4 mr-1" />
                                {task.priority}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Select 
                              value={task.status} 
                              onValueChange={(value) => 
                                handleTaskStatusChange(task.id, value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED')
                              }
                            >
                              <SelectTrigger className="w-[140px] h-8">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" onClick={() => openEditTaskDialog(task)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleTaskDelete(task.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Delete Project Dialog */}
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this project? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleProjectDelete}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Task Dialog */}
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditingTask ? 'Edit Task' : 'New Task'}</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="taskTitle">Title</label>
                      <Input
                        id="taskTitle"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Task title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="taskDescription">Description</label>
                      <Textarea
                        id="taskDescription"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Task description"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="taskStatus">Status</label>
                        <Select value={taskStatus} onValueChange={(value) => setTaskStatus(value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="taskPriority">Priority</label>
                        <Select value={taskPriority} onValueChange={(value) => setTaskPriority(value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="taskStartDate">Start Date</label>
                        <Input
                          id="taskStartDate"
                          type="date"
                          value={taskStartDate}
                          onChange={(e) => setTaskStartDate(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="taskDueDate">Due Date</label>
                        <Input
                          id="taskDueDate"
                          type="date"
                          value={taskDueDate}
                          onChange={(e) => setTaskDueDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleTaskSave}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
