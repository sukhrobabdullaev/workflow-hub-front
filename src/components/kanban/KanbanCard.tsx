import { TaskDetailModal } from '@/components/modals';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Task, useAppStore } from '@/store/appStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Calendar,
  Edit,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Trash2,
  User,
} from 'lucide-react';
import React, { useState } from 'react';

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
  const { teamMembers } = useAppStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assignee = task.assignee ? teamMembers.find(member => member.id === task.assignee) : null;

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
          'group relative transition-all duration-200 hover:shadow-md',
          isDragging && 'scale-105 opacity-50 shadow-lg'
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={handleCardClick}
      >
        {/* Drag Handle */}
        <div
          {...listeners}
          className="absolute left-2 top-2 z-10 flex h-4 w-4 cursor-grab items-center justify-center rounded opacity-0 transition-opacity hover:opacity-100 active:cursor-grabbing group-hover:opacity-50"
          style={{
            background:
              'repeating-linear-gradient(90deg, #ccc 0, #ccc 2px, transparent 2px, transparent 4px)',
          }}
        />
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium leading-tight">{task.title}</h4>
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
                      'h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100',
                      showActions && 'opacity-100'
                    )}
                    onClick={e => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Task
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
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {assignee && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <Avatar className="h-6 w-6">
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

              {/* Comments and Attachments Indicators */}
              <div className="flex items-center gap-2">
                {(task.comments?.length || 0) > 0 && (
                  <div className="flex items-center gap-1 rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    <span>{task.comments?.length}</span>
                  </div>
                )}
                {(task.attachments?.length || 0) > 0 && (
                  <div className="flex items-center gap-1 rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                    <Paperclip className="h-3 w-3" />
                    <span>{task.attachments?.length}</span>
                  </div>
                )}
              </div>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskDetailModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} task={task} />
    </>
  );
};
