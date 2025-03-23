import { useState, useEffect } from "react"
import {
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  File,
  PenBox,
  Plus,
  type LucideIcon,
  Loader2,
  PlusCircle,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ProjectDialog } from "@/components/project-dialog"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface Project {
  id: string
  title: string
  icon?: LucideIcon
}

export function NavProjects() {
  const { isMobile } = useSidebar()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  // Fetch projects from the API
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/projects")
      setProjects(response.data)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
      toast.error("Error", {
        description: "Failed to load projects. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async (projectData: { title: string }) => {
    try {
      const response = await api.post("/projects", projectData)
      setProjects((prev) => [...prev, response.data])
      toast.success("Success", {
        description: `Project "${response.data.title}" created successfully!`
      })
    } catch (error: any) {
      console.error("Failed to create project:", error)
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to create project. Please try again."
      })
    }
  }

  const handleUpdateProject = async (id: string, projectData: { title: string }) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData)
      console.log("Update response:", response.data)
      
      if (response.data && response.data.project) {
        const updatedProject = response.data.project;
        
        await fetchProjects();
        
        toast.success("Success", {
          description: `Project updated to "${updatedProject.title}" successfully!`
        })
      } else {
        console.error("Unexpected response structure:", response.data)
        toast.error("Error", {
          description: "Received unexpected data format from server"
        })
      }
    } catch (error: any) {
      console.error("Failed to update project:", error)
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to update project. Please try again."
      })
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project? All associated tasks will also be deleted.")) {
      try {
        const projectToDelete = projects.find(p => p.id === id);
        const response = await api.delete(`/projects/${id}`)
        setProjects((prev) => prev.filter(p => p.id !== id))
        toast.success("Success", {
          description: `Project "${projectToDelete?.title}" deleted successfully!`
        })
        
        if (response.data?.stats) {
          toast.info("Info", {
            description: `${response.data.stats.tasksDeleted} associated tasks were also deleted.`
          })
        }
      } catch (error: any) {
        console.error("Failed to delete project:", error)
        toast.error("Error", {
          description: error.response?.data?.message || "Failed to delete project. Please try again."
        })
      }
    }
  }

  const openCreateDialog = () => {
    setCurrentProject(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (project: Project) => {
    setCurrentProject(project)
    setIsDialogOpen(true)
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="flex items-center justify-between">
          Projects
          <button 
            onClick={openCreateDialog}
            className="rounded-full p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Create new project"
          >
            <PlusCircle className="h-4 w-4" />
          </button>
        </SidebarGroupLabel>
        <SidebarMenu>
          {isLoading ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading projects...</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : projects.length === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled className="text-muted-foreground">
                <span>No projects found</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            projects.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton asChild>
                  <a href={`/projects/${project.id}`}>
                    <Folder />
                    <span>{project.title}</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem asChild>
                      <a href={`/projects/${project.id}`}>
                        <Folder className="text-muted-foreground mr-2" />
                        <span>View Project</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={`/projects/${project.id}/tasks`}>
                        <File className="text-muted-foreground mr-2" />
                        <span>View Tasks</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditDialog(project)}>
                      <PenBox className="text-muted-foreground mr-2" />
                      <span>Edit Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="text-muted-foreground mr-2" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeleteProject(project.id)}>
                      <Trash2 className="text-muted-foreground mr-2" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))
          )}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={openCreateDialog}>
              <Plus />
              <span>New Project</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <ProjectDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={currentProject}
        onSave={(data) => {
          if (currentProject) {
            handleUpdateProject(currentProject.id, data);
          } else {
            handleCreateProject(data);
          }
        }}
      />
    </>
  )
}
