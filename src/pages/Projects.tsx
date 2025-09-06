import { CreateProjectModal } from '@/components/modals';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlanLimitIndicator } from '@/components/ui/plan-indicators';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAppStore, type Project } from '@/store/appStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import {
  BarChart3,
  Calendar,
  Edit,
  FolderOpen,
  Kanban,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-success/10 text-success';
    case 'planning':
      return 'bg-warning/10 text-warning';
    case 'completed':
      return 'bg-primary/10 text-primary';
    case 'on-hold':
      return 'bg-destructive/10 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const Projects = () => {
  const { projects, teamMembers, setCurrentProject, tasks, deleteProject } = useAppStore();
  const { getCurrentPlan, checkLimit } = useSubscriptionStore();
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentPlan = getCurrentPlan();
  const isFreePlan = currentPlan.id === 'free';

  const handleCreateProject = () => {
    if (isFreePlan && !checkLimit('maxProjects')) {
      toast({
        title: 'Project Limit Reached',
        description:
          'Free plan is limited to 3 projects. Upgrade to Professional for unlimited projects.',
        variant: 'destructive',
      });
      return;
    }
    setIsCreateProjectModalOpen(true);
  };

  const handleProjectClick = (projectId: string) => {
    setCurrentProject(projectId);
    navigate('/project-management');
  };

  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(selectedProject);
    setSelectedProject(project);
    // TODO: Implement edit functionality
    toast({
      title: 'Edit Project',
      description: 'Edit functionality coming soon',
    });
  };

  const handleDeleteProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setShowDeleteDialog(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    // Check if project has tasks
    const projectTasks = tasks.filter(task => task.projectId === projectToDelete.id);
    if (projectTasks.length > 0) {
      toast({
        title: 'Cannot delete project',
        description: `This project has ${projectTasks.length} tasks. Please delete or move all tasks before deleting the project.`,
        variant: 'destructive',
      });
      setShowDeleteDialog(false);
      return;
    }

    try {
      deleteProject(projectToDelete.id);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Project Limit Indicator */}
      {isFreePlan && (
        <div className="max-w-sm">
          <PlanLimitIndicator feature="projects" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <FolderOpen className="h-8 w-8" />
            Projects & Kanban
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isFreePlan
              ? 'Simple project management with up to 3 projects and basic Kanban boards'
              : 'Visual project management with unlimited Kanban boards'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-primary hover:opacity-90" onClick={handleCreateProject}>
            <FolderOpen className="mr-2 h-4 w-4" />
            {isFreePlan ? `New Project (${projects.length}/3)` : 'New Project'}
          </Button>
          <Link to="/project-management">
            <Button variant="outline">
              <Kanban className="mr-2 h-4 w-4" />
              Full Kanban View
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Management Tabs */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Project Grid
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6 space-y-6">
          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects &&
              projects.map(project => (
                <Card
                  key={project.id}
                  className="group cursor-pointer shadow-soft transition-all duration-200 hover:shadow-elevated"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={e => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={e => handleEditProject(project, e)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={e => handleDeleteProject(project, e)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm text-muted-foreground">Team</p>
                        <div className="flex -space-x-2">
                          {project.teamMembers.slice(0, 3).map(memberId => {
                            const member = teamMembers.find(m => m.id === memberId);
                            return member ? (
                              <img
                                key={member.id}
                                src={member.avatar}
                                alt={member.name}
                                className="h-8 w-8 rounded-full border-2 border-background object-cover"
                                title={member.name}
                              />
                            ) : null;
                          })}
                          {project?.teamMembers.length > 3 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs text-muted-foreground">
                              +{project?.teamMembers.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Modals */}
          <CreateProjectModal
            open={isCreateProjectModalOpen}
            onOpenChange={setIsCreateProjectModalOpen}
          />

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the project
                  {projectToDelete?.name} and all associated data.
                  {projectToDelete &&
                    tasks.filter(task => task.projectId === projectToDelete.id).length > 0 && (
                      <span className="mt-2 block font-medium text-red-600">
                        Warning: This project has{' '}
                        {tasks.filter(task => task.projectId === projectToDelete.id).length} tasks.
                        Please delete or move all tasks before deleting the project.
                      </span>
                    )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeleteProject}
                  disabled={
                    projectToDelete &&
                    tasks.filter(task => task.projectId === projectToDelete.id).length > 0
                  }
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6 space-y-6">
          {/* Timeline/Calendar View */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Project Timeline
              </CardTitle>
              <CardDescription>Visual timeline of all your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects &&
                  projects.map(project => (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        </div>
                        <div className="mb-2 text-sm text-muted-foreground">
                          Due: {new Date(project.dueDate).toLocaleDateString()}
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{project.progress}%</div>
                        <div className="text-xs text-muted-foreground">Complete</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={isCreateProjectModalOpen}
        onOpenChange={setIsCreateProjectModalOpen}
      />

      {/* Delete Project Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{projectToDelete?.name}</strong>? This action
              cannot be undone.
              {projectToDelete &&
                tasks.filter(task => task.projectId === projectToDelete.id).length > 0 && (
                  <span className="mt-2 block font-medium text-red-600">
                    Warning: This project has{' '}
                    {tasks.filter(task => task.projectId === projectToDelete.id).length} tasks.
                    Please delete or move all tasks before deleting the project.
                  </span>
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProject}
              disabled={
                projectToDelete &&
                tasks.filter(task => task.projectId === projectToDelete.id).length > 0
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
