import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Task } from '@/store/appStore';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { Calendar, User, Edit, Trash2, MoreHorizontal, MessageCircle, Paperclip, Eye, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditTaskModal, TaskDetailModal, SprintTaskAssignment } from '@/components/modals';

interface KanbanCardProps {
  task: Task;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const { teamMembers, deleteTask, sprints } = useAppStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSprintAssignmentOpen, setIsSprintAssignmentOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assignee = task.assignee
    ? teamMembers.find(member => member.id === task.assignee)
    : null;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // For now, we'll open the edit modal which has the delete functionality
    // In the future, this could be a separate delete confirmation dialog
    setIsEditModalOpen(true);
  };

  const handleSprintAssignClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSprintAssignmentOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening modal when clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          'transition-all duration-200 hover:shadow-md relative group',
          isDragging && 'opacity-50 shadow-lg scale-105'
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={handleCardClick}
      >
        {/* Drag Handle */}
        <div
          {...listeners}
          className="absolute top-2 left-2 w-4 h-4 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity z-10 rounded flex items-center justify-center"
          style={{
            background: 'repeating-linear-gradient(90deg, #ccc 0, #ccc 2px, transparent 2px, transparent 4px)'
          }}
        />
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
            <div className="flex items-center gap-1">
              <Badge className={cn('text-xs', getPriorityColor(task.priority))}>
                {task.priority}
              </Badge>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity',
                      showActions && 'opacity-100'
                    )}
                    onClick={e => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSprintAssignClick}>
                    <Zap className="mr-2 h-4 w-4" />
                    Assign to Sprint
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteClick}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {assignee && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                    <AvatarFallback className="text-xs">
                      {assignee.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}

              {/* Sprint Indicator */}
              {task.sprintId && (
                <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  <Zap className="w-3 h-3" />
                  <span>
                    {sprints.find(s => s.id === task.sprintId)?.name || 'Sprint'}
                  </span>
                </div>
              )}

              {/* Comments and Attachments Indicators */}
              <div className="flex items-center gap-2">
                {(task.comments?.length || 0) > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    <MessageCircle className="w-3 h-3" />
                    <span>{task.comments?.length}</span>
                  </div>
                )}
                {(task.attachments?.length || 0) > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    <Paperclip className="w-3 h-3" />
                    <span>{task.attachments?.length}</span>
                  </div>
                )}
              </div>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskDetailModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        task={task}
      />

      <SprintTaskAssignment
        isOpen={isSprintAssignmentOpen}
        onClose={() => setIsSprintAssignmentOpen(false)}
        task={task}
      />
    </>
  );
};
