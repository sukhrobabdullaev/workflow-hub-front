import { TaskComments } from '@/components/TaskComments';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAppStore, type Task } from '@/store/appStore';
import { format } from 'date-fns';
import {
  CalendarIcon,
  CheckSquare,
  Clock,
  Edit,
  Flag,
  MessageCircle,
  Save,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export const TaskDetailModal = ({ open, onOpenChange, task }: TaskDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    assignee: '',
    dueDate: undefined as Date | undefined,
  });

  const { updateTask, teamMembers, projects } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee || '',
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      });
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;

    updateTask(task.id, {
      ...formData,
      dueDate: formData.dueDate?.toISOString(),
    });

    toast({
      title: 'Task Updated',
      description: 'Task has been updated successfully.',
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee || '',
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      });
    }
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const assignedMember = teamMembers.find(member => member.id === formData.assignee);
  const project = projects.find(p => p.id === task?.projectId);

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-[900px]">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <DialogTitle className="mb-2 text-xl">
                {isEditing ? (
                  <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="text-xl font-semibold"
                  />
                ) : (
                  task.title
                )}
              </DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2">
                <span>in {project?.name}</span>
                <Badge className={getStatusColor(formData.status)}>
                  {formData.status.replace('-', ' ')}
                </Badge>
                <Badge className={getPriorityColor(formData.priority)}>
                  {formData.priority} priority
                </Badge>
                {assignedMember && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="text-xs">assigned to {assignedMember.name}</span>
                  </div>
                )}
                {formData.dueDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">due {format(formData.dueDate, 'MMM d, yyyy')}</span>
                  </div>
                )}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="min-h-0 flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Comments ({task.comments?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter task description..."
                      className="mt-2 min-h-[120px]"
                    />
                  ) : (
                    <div className="mt-2 min-h-[120px] rounded-lg bg-muted/30 p-3">
                      {task.description || (
                        <span className="italic text-muted-foreground">
                          No description provided
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select
                      value={formData.status}
                      onValueChange={(value: Task['status']) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2">
                      <Badge className={getStatusColor(formData.status)}>
                        {formData.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  {isEditing ? (
                    <Select
                      value={formData.priority}
                      onValueChange={(value: Task['priority']) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2">
                      <Badge className={getPriorityColor(formData.priority)}>
                        <Flag className="mr-1 h-3 w-3" />
                        {formData.priority} priority
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  {isEditing ? (
                    <Select
                      value={formData.assignee}
                      onValueChange={value => setFormData({ ...formData, assignee: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {teamMembers.map(member => (
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
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2">
                      {assignedMember ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={assignedMember.avatar} />
                            <AvatarFallback className="text-xs">
                              {assignedMember.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{assignedMember.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {assignedMember.role}
                          </Badge>
                        </div>
                      ) : (
                        <span className="italic text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Due Date</Label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'mt-2 w-full justify-start text-left font-normal',
                            !formData.dueDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dueDate ? (
                            format(formData.dueDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dueDate}
                          onSelect={date => setFormData({ ...formData, dueDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div className="mt-2">
                      {formData.dueDate ? (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{format(formData.dueDate, 'PPP')}</span>
                        </div>
                      ) : (
                        <span className="italic text-muted-foreground">No due date</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Project</Label>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <span>{project?.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {project?.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Task ID</Label>
                  <div className="mt-2">
                    <code className="rounded bg-muted px-2 py-1 text-sm">{task.id}</code>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-6 min-h-0 flex-1">
            <TaskComments task={task} className="h-full" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
