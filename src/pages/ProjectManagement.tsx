import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KanbanBoard } from '@/components/kanban';
import { useAppStore } from '@/store/appStore';
import { Plus, Filter, Search } from 'lucide-react';

export const ProjectManagement = () => {
  const { projects, currentProject, setCurrentProject, tasks } = useAppStore();
  const [selectedProject, setSelectedProject] = React.useState<string | null>(
    currentProject
  );

  const handleProjectSelect = (projectId: string) => {
    const project = projectId === 'all' ? null : projectId;
    setSelectedProject(project);
    setCurrentProject(project);
  };

  const selectedProjectData = selectedProject
    ? projects.find(p => p.id === selectedProject)
    : null;

  const filteredTasks = selectedProject
    ? tasks.filter(task => task.projectId === selectedProject)
    : tasks;

  const taskStats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter(t => t.status === 'todo').length,
    inProgress: filteredTasks.filter(t => t.status === 'in-progress').length,
    done: filteredTasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Project Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage tasks with Kanban board
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Project Selector and Stats */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Project:</span>
          <Select
            value={selectedProject || 'all'}
            onValueChange={handleProjectSelect}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProjectData && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{selectedProjectData.status}</Badge>
            <span className="text-sm text-muted-foreground">
              {selectedProjectData.progress}% complete
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total:</span>
            <Badge variant="outline">{taskStats.total}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">To Do:</span>
            <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              {taskStats.todo}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">In Progress:</span>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              {taskStats.inProgress}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Done:</span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              {taskStats.done}
            </Badge>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <KanbanBoard projectId={selectedProject || undefined} />
      </div>
    </div>
  );
};
