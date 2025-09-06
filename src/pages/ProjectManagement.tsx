import { KanbanBoard } from '@/components/kanban';
import { AddColumnModal, CreateTaskModal } from '@/components/modals';
import { UpgradeDialog } from '@/components/modals/UpgradeDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/appStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Columns, Crown, Filter, Plus, Search, X } from 'lucide-react';
import React, { useState } from 'react';

export const ProjectManagement = () => {
  const { projects, currentProject, setCurrentProject, tasks, teamMembers, getColumnsForProject } =
    useAppStore();
  const { currentPlan } = useSubscriptionStore();
  const isFreePlan = currentPlan === 'free';

  const [selectedProject, setSelectedProject] = useState<string | null>(currentProject);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showSearchPreview, setShowSearchPreview] = useState(false);
  const [showFilterPreview, setShowFilterPreview] = useState(false);
  const [showColumnPreview, setShowColumnPreview] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    assignee: [] as string[],
  });

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowSearch(true);
      }
      // Escape to close search
      if (event.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const handleProjectSelect = (projectId: string) => {
    const project = projectId === 'all' ? null : projectId;
    setSelectedProject(project);
    setCurrentProject(project);
  };

  const handleFilterChange = (type: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      assignee: [],
    });
    setSearchQuery('');
  };

  const applyQuickFilter = (type: 'my-tasks' | 'high-priority' | 'overdue' | 'completed') => {
    clearFilters();
    switch (type) {
      case 'my-tasks':
        // Assuming current user ID is '1' - in real app, get from auth
        setFilters(prev => ({ ...prev, assignee: ['1'] }));
        break;
      case 'high-priority':
        setFilters(prev => ({ ...prev, priority: ['high'] }));
        break;
      case 'completed':
        setFilters(prev => ({ ...prev, status: ['done'] }));
        break;
    }
  };

  // Get available columns for the current project
  const availableColumns = getColumnsForProject(selectedProject || undefined);
  const selectedProjectData = selectedProject ? projects.find(p => p.id === selectedProject) : null;

  // Apply all filters
  const filteredTasks = React.useMemo(() => {
    let result = selectedProject ? tasks.filter(task => task.projectId === selectedProject) : tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter(task => filters.status.includes(task.status));
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      result = result.filter(task => filters.priority.includes(task.priority));
    }

    // Apply assignee filter
    if (filters.assignee.length > 0) {
      result = result.filter(task => task.assignee && filters.assignee.includes(task.assignee));
    }

    return result;
  }, [selectedProject, tasks, searchQuery, filters]);

  const hasActiveFilters =
    searchQuery.trim() ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0;

  const taskStats = {
    total: filteredTasks.length,
    ...availableColumns.reduce(
      (acc, column) => {
        acc[column.id] = filteredTasks.filter(t => t.status === column.id).length;
        return acc;
      },
      {} as Record<string, number>
    ),
  };

  return (
    <div className="flex h-full animate-fade-in flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="mt-2 text-muted-foreground">
            {isFreePlan
              ? 'Basic kanban board with simple task management'
              : 'Manage tasks with advanced Kanban board'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!showSearch && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isFreePlan) {
                  setShowSearchPreview(true);
                } else {
                  setShowSearch(true);
                }
              }}
              className={
                isFreePlan
                  ? 'border-dashed border-primary/50 bg-gradient-to-r from-primary/5 to-purple-500/5'
                  : 'relative'
              }
            >
              <Search className="mr-2 h-4 w-4" />
              {isFreePlan ? 'Search (Pro)' : 'Search'}
              {isFreePlan && <Crown className="ml-1 h-3 w-3 text-primary" />}
              {!isFreePlan && (
                <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              )}
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={
                  isFreePlan
                    ? 'border-dashed border-primary/50 bg-gradient-to-r from-primary/5 to-purple-500/5'
                    : hasActiveFilters
                      ? 'border-primary'
                      : ''
                }
                onClick={() => {
                  if (isFreePlan) {
                    setShowFilterPreview(true);
                  }
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                {isFreePlan ? 'Filter (Pro)' : 'Filter'}
                {isFreePlan ? (
                  <Crown className="ml-1 h-3 w-3 text-primary" />
                ) : hasActiveFilters ? (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                    {filters.status.length + filters.priority.length + filters.assignee.length}
                  </Badge>
                ) : null}
              </Button>
            </PopoverTrigger>

            {(!isFreePlan || showFilterPreview) && (
              <PopoverContent className="w-80" align="end">
                <div className={`space-y-4 ${showFilterPreview ? 'relative' : ''}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {hasActiveFilters && !showFilterPreview && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                        <X className="mr-1 h-4 w-4" />
                        Clear
                      </Button>
                    )}
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="space-y-2">
                      {availableColumns.map(column => (
                        <div key={column.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${column.id}`}
                            checked={
                              showFilterPreview
                                ? column.id === 'in-progress'
                                : filters.status.includes(column.id)
                            }
                            onCheckedChange={() =>
                              !showFilterPreview && handleFilterChange('status', column.id)
                            }
                            disabled={showFilterPreview}
                          />
                          <Label
                            htmlFor={`status-${column.id}`}
                            className={`flex items-center gap-2 text-sm ${showFilterPreview ? 'opacity-60' : ''}`}
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${
                                column.id === 'todo'
                                  ? 'bg-slate-500'
                                  : column.id === 'in-progress'
                                    ? 'bg-blue-500'
                                    : column.id === 'done'
                                      ? 'bg-green-500'
                                      : 'bg-gray-500'
                              }`}
                            />
                            {column.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Priority</Label>
                    <div className="space-y-2">
                      {[
                        {
                          value: 'high',
                          label: 'High',
                          color: 'bg-red-100 text-red-800',
                        },
                        {
                          value: 'medium',
                          label: 'Medium',
                          color: 'bg-yellow-100 text-yellow-800',
                        },
                        {
                          value: 'low',
                          label: 'Low',
                          color: 'bg-gray-100 text-gray-800',
                        },
                      ].map(priority => (
                        <div key={priority.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${priority.value}`}
                            checked={
                              showFilterPreview
                                ? priority.value === 'high'
                                : filters.priority.includes(priority.value)
                            }
                            onCheckedChange={() =>
                              !showFilterPreview && handleFilterChange('priority', priority.value)
                            }
                            disabled={showFilterPreview}
                          />
                          <Label
                            htmlFor={`priority-${priority.value}`}
                            className={`flex items-center gap-2 text-sm ${showFilterPreview ? 'opacity-60' : ''}`}
                          >
                            <Badge className={`h-4 px-1.5 text-xs ${priority.color}`}>
                              {priority.label}
                            </Badge>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assignee Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Assignee</Label>
                    <div className="space-y-2">
                      {teamMembers.slice(0, 3).map((member, index) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`assignee-${member.id}`}
                            checked={
                              showFilterPreview ? index === 0 : filters.assignee.includes(member.id)
                            }
                            onCheckedChange={() =>
                              !showFilterPreview && handleFilterChange('assignee', member.id)
                            }
                            disabled={showFilterPreview}
                          />
                          <Label
                            htmlFor={`assignee-${member.id}`}
                            className={`text-sm ${showFilterPreview ? 'opacity-60' : ''}`}
                          >
                            {member.name}
                          </Label>
                        </div>
                      ))}
                      {showFilterPreview && teamMembers.length > 3 && (
                        <div className="text-xs text-muted-foreground opacity-60">
                          +{teamMembers.length - 3} more team members
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Filter Preview Overlay */}
                  {showFilterPreview && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-t from-background/95 via-background/70 to-transparent">
                      <div className="space-y-3 p-4 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                          <Crown className="h-4 w-4" />
                          Pro Feature Preview
                        </div>
                        <div>
                          <h3 className="mb-1 text-lg font-semibold">Advanced Filtering</h3>
                          <p className="max-w-xs text-sm text-muted-foreground">
                            Filter by status, priority, assignee, and more
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setShowFilterPreview(false);
                            setShowUpgradeDialog(true);
                          }}
                          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        >
                          Upgrade to Pro
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            )}
          </Popover>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isFreePlan) {
                setShowColumnPreview(true);
              } else {
                setIsAddColumnModalOpen(true);
              }
            }}
            className={
              isFreePlan
                ? 'border-dashed border-primary/50 bg-gradient-to-r from-primary/5 to-purple-500/5'
                : ''
            }
          >
            <Columns className="mr-2 h-4 w-4" />
            {isFreePlan ? 'Add Column (Pro)' : 'Add Column'}
            {isFreePlan && <Crown className="ml-1 h-3 w-3 text-primary" />}
          </Button>
          <Button
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => setIsCreateTaskModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {(showSearch || showSearchPreview) && (
        <div
          className={`flex items-center gap-2 rounded-lg p-4 ${showSearchPreview ? 'relative border-2 border-dashed border-primary/50 bg-muted/50' : 'bg-muted/30'}`}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              showSearchPreview
                ? 'Search tasks by title, description, tags...'
                : 'Search tasks by title or description...'
            }
            value={showSearchPreview ? 'design review' : searchQuery}
            onChange={e => !showSearchPreview && setSearchQuery(e.target.value)}
            className={`flex-1 ${showSearchPreview ? 'opacity-60' : ''}`}
            autoFocus={!showSearchPreview}
            disabled={showSearchPreview}
          />
          {(searchQuery || showSearchPreview) && (
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {showSearchPreview
                ? '3 results'
                : `${filteredTasks.length} result${filteredTasks.length !== 1 ? 's' : ''}`}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (showSearchPreview) {
                setShowSearchPreview(false);
              } else {
                setShowSearch(false);
                setSearchQuery('');
              }
            }}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Search Preview Overlay */}
          {showSearchPreview && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-t from-background/95 via-background/70 to-transparent">
              <div className="space-y-3 p-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Crown className="h-4 w-4" />
                  Pro Feature Preview
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold">Advanced Search</h3>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    Search by title, description, tags, and more with instant results
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setShowSearchPreview(false);
                    setShowUpgradeDialog(true);
                  }}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Project Selector and Stats */}
      <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Project:</span>
          <Select value={selectedProject || 'all'} onValueChange={handleProjectSelect}>
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

        {hasActiveFilters && (
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
            <span className="text-sm font-medium text-primary">
              {filteredTasks.length} of{' '}
              {selectedProject
                ? tasks.filter(t => t.projectId === selectedProject).length
                : tasks.length}{' '}
              tasks
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 w-6 p-0 hover:bg-primary/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              applyQuickFilter('my-tasks');
            }}
            className={`text-xs ${isFreePlan ? 'text-muted-foreground' : ''}`}
          >
            My Tasks
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              applyQuickFilter('high-priority');
            }}
            className={`text-xs ${isFreePlan ? 'text-muted-foreground' : ''}`}
          >
            High Priority
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              applyQuickFilter('completed');
            }}
            className={`text-xs ${isFreePlan ? 'text-muted-foreground' : ''}`}
          >
            Completed
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total:</span>
            <Badge variant="outline">{taskStats.total}</Badge>
          </div>
          {availableColumns.map(column => (
            <div key={column.id} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{column.title}:</span>
              <Badge
                className={
                  column.id === 'todo'
                    ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    : column.id === 'in-progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      : column.id === 'done'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }
              >
                {taskStats[column.id] || 0}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="min-h-0 flex-1">
        {filteredTasks.length === 0 && hasActiveFilters ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No tasks found</h3>
            <p className="mb-4 max-w-md text-muted-foreground">
              No tasks match your current search and filter criteria. Try adjusting your filters or
              search terms.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        ) : (
          <KanbanBoard projectId={selectedProject || undefined} tasks={filteredTasks} />
        )}
      </div>

      {/* Add Column Preview Dialog */}
      {showColumnPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-lg border bg-background shadow-lg">
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add Custom Column</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowColumnPreview(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="column-name" className="text-sm font-medium opacity-60">
                    Column Name
                  </Label>
                  <Input
                    id="column-name"
                    placeholder="e.g., Code Review, Testing, Deploy"
                    value="Code Review"
                    disabled
                    className="opacity-60"
                  />
                </div>

                <div>
                  <Label htmlFor="column-color" className="text-sm font-medium opacity-60">
                    Color
                  </Label>
                  <div className="mt-2 flex gap-2">
                    {['bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'].map(
                      (color, index) => (
                        <div
                          key={color}
                          className={`h-8 w-8 rounded-full ${color} ${index === 0 ? 'ring-2 ring-purple-500 ring-offset-2' : ''} opacity-60`}
                        />
                      )
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium opacity-60">Position</Label>
                  <Select disabled>
                    <SelectTrigger className="opacity-60">
                      <SelectValue placeholder="After 'In Progress'" />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button disabled className="flex-1 opacity-60">
                  Add Column
                </Button>
                <Button variant="outline" disabled className="opacity-60">
                  Cancel
                </Button>
              </div>
            </div>

            {/* Column Preview Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/95 via-background/70 to-transparent">
              <div className="space-y-3 p-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Crown className="h-4 w-4" />
                  Pro Feature Preview
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold">Custom Kanban Columns</h3>
                  <p className="max-w-xs text-sm text-muted-foreground">
                    Create unlimited custom columns to match your exact workflow
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setShowColumnPreview(false);
                    setShowUpgradeDialog(true);
                  }}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal open={isCreateTaskModalOpen} onOpenChange={setIsCreateTaskModalOpen} />

      {/* Add Column Modal */}
      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        projectId={selectedProject || undefined}
      />

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        title="Unlock Custom Kanban Columns"
        description="Upgrade to Professional to create unlimited custom columns, advanced filtering, search, and team collaboration features. Customize your workflow exactly how you need it."
      />
    </div>
  );
};
