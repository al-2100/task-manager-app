import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  Clock, 
  CalendarClock, 
  ListTodo, 
  BarChart2,
} from "lucide-react"

import { toast } from "sonner"
import dashboardService, { DashboardSummary } from "@/services/dashboardService"

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardSummary>({
    taskSummary: { total: 0, completed: 0, pending: 0, today: 0 },
    pendingTasks: [],
    recentProjects: [],
    upcomingTasks: []
  })

  // Fetch real dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const data = await dashboardService.getDashboardSummary()
        setDashboardData(data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        toast.error("Error loading dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getCompletionPercentage = () => {
    const { total, completed } = dashboardData.taskSummary
    if (total === 0) return 0
    return Math.round((completed / total) * 100)
  }

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-6 p-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
                <p className="text-muted-foreground">Here's an overview of your tasks and projects.</p>
              </div>

              {/* Loading state */}
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Quick Stats Cards */}
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Total Tasks</span>
                            <span className="text-2xl font-bold">{dashboardData.taskSummary.total}</span>
                          </div>
                          <div className="bg-primary/10 text-primary rounded-full p-2">
                            <ListTodo className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Today's Tasks</span>
                            <span className="text-2xl font-bold">{dashboardData.taskSummary.today}</span>
                          </div>
                          <div className="bg-blue-500/10 text-blue-500 rounded-full p-2">
                            <CalendarClock className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Completed</span>
                            <span className="text-2xl font-bold">{dashboardData.taskSummary.completed}</span>
                          </div>
                          <div className="bg-green-500/10 text-green-500 rounded-full p-2">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Pending</span>
                            <span className="text-2xl font-bold">{dashboardData.taskSummary.pending}</span>
                          </div>
                          <div className="bg-orange-500/10 text-orange-500 rounded-full p-2">
                            <Clock className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Dashboard Content */}
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Pending Tasks Widget */}
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Clock className="mr-2 h-5 w-5" /> Pending Tasks
                        </CardTitle>
                        <CardDescription>Tasks in progress</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <div className="max-h-[300px] overflow-y-auto pr-1">
                          {!dashboardData.pendingTasks || dashboardData.pendingTasks.length === 0 ? (
                            <div className="text-center text-sm text-muted-foreground py-4">
                              No pending tasks
                            </div>
                          ) : (
                            dashboardData.pendingTasks.map((task: { id: string; title: string; priority: string; projectTitle: string; dueDate?: string }) => (
                              <div key={task.id} className="flex flex-col gap-1 p-3 border rounded-md mb-3 last:mb-0">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{task.title}</div>
                                  <Badge variant={
                                    task.priority === 'HIGH' ? 'destructive' :
                                    task.priority === 'MEDIUM' ? 'default' : 'outline'
                                  }>
                                    {task.priority}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {task.projectTitle}
                                </div>
                                {task.dueDate && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Task Progress */}
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart2 className="mr-2 h-5 w-5" /> Task Progress
                        </CardTitle>
                        <CardDescription>Your overall completion rate</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overall Completion</span>
                            <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
                          </div>
                          <Progress value={getCompletionPercentage()} className="h-2" />
                        </div>
                        
                        <div className="flex flex-col gap-4">
                          {dashboardData.recentProjects.length === 0 ? (
                            <div className="text-center text-sm text-muted-foreground py-4">
                              No projects available
                            </div>
                          ) : (
                            dashboardData.recentProjects.slice(0, 3).map(project => {
                              const completionPercentage = project.tasksCount > 0 
                                ? Math.round((project.completedCount / project.tasksCount) * 100) 
                                : 0;
                              
                              return (
                                <div key={project.id} className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium">{project.title}</span>
                                    <div className="text-xs text-muted-foreground">
                                      {project.completedCount} of {project.tasksCount} tasks completed
                                    </div>
                                  </div>
                                  <Progress 
                                    value={completionPercentage} 
                                    className="w-20 h-2" 
                                  />
                                </div>
                              );
                            })
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Upcoming Tasks */}
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CalendarClock className="mr-2 h-5 w-5" /> Upcoming Tasks
                        </CardTitle>
                        <CardDescription>Tasks due soon</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        {dashboardData.upcomingTasks.length === 0 ? (
                          <div className="text-center text-sm text-muted-foreground py-4">
                            No upcoming tasks
                          </div>
                        ) : (
                          dashboardData.upcomingTasks.slice(0, 4).map(task => (
                            <div key={task.id} className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{task.title}</div>
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                  <span className="mx-1">•</span>
                                  <span>{task.project}</span>
                                </div>
                              </div>
                              <Badge variant={
                                task.priority === 'high' ? 'destructive' :
                                task.priority === 'medium' ? 'default' : 'outline'
                              }>
                                {task.priority}
                              </Badge>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Projects Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart2 className="mr-2 h-5 w-5" /> Projects Overview
                      </CardTitle>
                      <CardDescription>Your current projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {dashboardData.recentProjects.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <p className="mb-2">No projects found</p>
                          <Button size="sm" variant="outline" asChild>
                            <a href="/projects/new">Create your first project</a>
                          </Button>
                        </div>
                      ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {dashboardData.recentProjects.map(project => (
                            <Card key={project.id} className="overflow-hidden">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{project.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-col gap-3">
                                  <div>
                                    <div className="flex justify-between text-sm mb-1">
                                      <span>Tasks</span>
                                      <span>{project.completedCount}/{project.tasksCount}</span>
                                    </div>
                                    <Progress 
                                      value={project.tasksCount > 0 ? (project.completedCount / project.tasksCount) * 100 : 0} 
                                      className="h-2"
                                    />
                                  </div>
                                  
                                  <Button size="sm" variant="outline" asChild className="mt-2">
                                    <a href={`/projects/${project.id}`}>
                                      View Project
                                    </a>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default Dashboard;