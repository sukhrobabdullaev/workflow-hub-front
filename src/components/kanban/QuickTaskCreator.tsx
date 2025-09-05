import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Check, User } from 'lucide-react';
import { useAppStore, type Task } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { EditTaskModal } from '@/components/modals';

interface QuickTaskCreatorProps {
  status: Task['status'];
  projectId?: string;
}

export const QuickTaskCreator: React.FC<QuickTaskCreatorProps> = ({ status, projectId }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [createdTaskId, setCreatedTaskId] = useState<string | null>(null);

  const { addTask, tasks, teamMembers } = useAppStore();
  const user = useAuthStore(state => state.user);

  const handleQuickCreate = () => {
    if (!taskTitle.trim() || !user) return;

    const taskId = Date.now().toString(); // Generate ID ourselves
    const newTask = {
      id: taskId,
      title: taskTitle.trim(),
      description: '',
      status,
      priority: 'medium' as const,
      assignee: assigneeId || user.id, // Use selected assignee or current user as fallback
      projectId: projectId || 'default',
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      attachments: [],
    };

    addTask(newTask);
    setCreatedTaskId(taskId);
    setTaskTitle('');
    setAssigneeId('');
    setIsCreating(false);

    // Open detailed modal for further editing
    setShowDetailModal(true);
  };

  const handleCancel = () => {
    setTaskTitle('');
    setAssigneeId('');
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (taskTitle.trim()) {
        handleQuickCreate();
      }
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Tab' && taskTitle.trim()) {
      // Allow tabbing to assignee field
      e.preventDefault();
    }
  };

  const createdTask = createdTaskId ? tasks.find(t => t.id === createdTaskId) : null;

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  if (isCreating) {
    return (
      <Card className="border-2 border-dashed border-primary/30 bg-primary/5 shadow-sm">
        <CardContent className="p-3">
          <div className="space-y-3">
            <div className="space-y-1">
              <Input
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="border-none bg-white/80 p-2 text-sm backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-primary"
                autoFocus
                onKeyDown={handleKeyPress}
                maxLength={100}
              />
              {taskTitle.length > 0 && (
                <div className="text-right text-xs text-muted-foreground">
                  {taskTitle.length}/100 characters
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="h-8 border-none bg-white/80 text-xs backdrop-blur-sm focus:ring-1 focus:ring-primary">
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={user?.id || 'me'}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-xs">
                          {user?.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>Assign to me</span>
                    </div>
                  </SelectItem>
                  {teamMembers
                    .filter(member => member.id !== user?.id)
                    .map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleQuickCreate}
                disabled={!taskTitle.trim()}
                className="h-7 px-3 text-xs font-medium"
              >
                <Check className="mr-1 h-3 w-3" />
                Add Task
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 px-3 text-xs">
                <X className="mr-1 h-3 w-3" />
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press <kbd className="rounded bg-muted px-1 py-0.5 text-xs">Enter</kbd> to create •{' '}
              <kbd className="rounded bg-muted px-1 py-0.5 text-xs">Esc</kbd> to cancel
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        className="group h-auto w-full justify-between border-2 border-dashed border-transparent p-3 text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
        onClick={() => setIsCreating(true)}
      >
        <div className="flex items-center">
          <Plus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          <div className="flex flex-col items-start">
            <span className="font-normal">Add a task</span>
            <span className="text-xs opacity-70">
              Click to create a new task in {getStatusLabel(status)}
            </span>
          </div>
        </div>
        {user && (
          <Avatar className="h-6 w-6 opacity-50 transition-opacity group-hover:opacity-100">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-xs">
              {user.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        )}
      </Button>

      {/* Detailed Creation Modal */}
      {showDetailModal && createdTask && (
        <EditTaskModal
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
          task={createdTask}
        />
      )}
    </>
  );
};
