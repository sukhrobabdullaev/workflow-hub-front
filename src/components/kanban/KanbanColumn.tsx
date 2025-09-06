import { DeleteColumnDialog } from '@/components/modals';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Task } from '@/store/appStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useDroppable } from '@dnd-kit/core';
import { MoreVertical, Trash2 } from 'lucide-react';
import React from 'react';
import { QuickTaskCreator } from './QuickTaskCreator';

interface KanbanColumnProps {
  id: Task['status'];
  title: string;
  color: string;
  taskCount: number;
  children: React.ReactNode;
  projectId?: string;
  isDefault?: boolean;
  onDelete?: () => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  taskCount,
  children,
  projectId,
  isDefault = true,
  onDelete,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const { currentPlan } = useSubscriptionStore();
  const isFreePlan = currentPlan === 'free';
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-[600px] flex-col rounded-lg p-4 transition-all duration-200',
          color,
          isOver && 'bg-opacity-80 ring-2 ring-primary ring-opacity-50'
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            <div className="min-w-[24px] rounded-full bg-primary/10 px-2 py-1 text-center text-sm text-primary">
              {taskCount}
            </div>

            {/* Delete button for custom columns (pro users only) */}
            {!isDefault && !isFreePlan && onDelete && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40" align="end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Column
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {children}

          {/* Quick Task Creator */}
          <QuickTaskCreator status={id} projectId={projectId} />
        </div>

        {/* Drop zone indicator */}
        {isOver && (
          <div className="mt-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-center text-sm text-muted-foreground">
            Drop task here
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteColumnDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        columnTitle={title}
      />
    </>
  );
};
