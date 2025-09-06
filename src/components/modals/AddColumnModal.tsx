import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/appStore';
import React from 'react';

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

const colorOptions = [
  { value: 'bg-slate-100 dark:bg-slate-800', label: 'Gray', preview: 'bg-slate-500' },
  { value: 'bg-blue-50 dark:bg-blue-900/20', label: 'Blue', preview: 'bg-blue-500' },
  { value: 'bg-green-50 dark:bg-green-900/20', label: 'Green', preview: 'bg-green-500' },
  { value: 'bg-yellow-50 dark:bg-yellow-900/20', label: 'Yellow', preview: 'bg-yellow-500' },
  { value: 'bg-red-50 dark:bg-red-900/20', label: 'Red', preview: 'bg-red-500' },
  { value: 'bg-purple-50 dark:bg-purple-900/20', label: 'Purple', preview: 'bg-purple-500' },
  { value: 'bg-pink-50 dark:bg-pink-900/20', label: 'Pink', preview: 'bg-pink-500' },
  { value: 'bg-indigo-50 dark:bg-indigo-900/20', label: 'Indigo', preview: 'bg-indigo-500' },
];

export const AddColumnModal: React.FC<AddColumnModalProps> = ({ isOpen, onClose, projectId }) => {
  const { addColumn, kanbanColumns } = useAppStore();
  const [title, setTitle] = React.useState('');
  const [color, setColor] = React.useState(colorOptions[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    // Get the next position
    const maxPosition = kanbanColumns.reduce((max, col) => Math.max(max, col.position), -1);

    addColumn({
      title: title.trim(),
      color,
      position: maxPosition + 1,
      isDefault: false,
      projectId,
    });

    // Reset form and close
    setTitle('');
    setColor(colorOptions[0].value);
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setColor(colorOptions[0].value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
          <DialogDescription>
            Create a new column for your Kanban board. This will help you organize tasks based on
            your workflow.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Review, Testing"
                className="col-span-3"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="col-span-3">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${colorOptions.find(opt => opt.value === color)?.preview}`}
                      />
                      {colorOptions.find(opt => opt.value === color)?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${option.preview}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Column
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
