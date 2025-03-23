import { api } from "@/lib/api";

export interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
  today: number;
}

export interface Project {
  id: string;
  title: string;
  tasksCount: number;
  completedCount: number;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  project: string;
}

export interface DashboardSummary {
  pendingTasks: any;
  taskSummary: TaskSummary;
  recentProjects: Project[];
  upcomingTasks: Task[];
}

const dashboardService = {
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get("/dashboard/summary");
    return response.data;
  }
};

export default dashboardService;
