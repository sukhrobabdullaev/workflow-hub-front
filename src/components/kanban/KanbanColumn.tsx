import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { QuickTaskCreator } from './QuickTaskCreator';
import { Task } from '@/store/appStore';

interface KanbanColumnProps {
  id: Task['status'];
  title: string;
  color: string;
  taskCount: number;
  children: React.ReactNode;
  projectId?: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  taskCount,
  children,
  projectId,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
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
        <div className="min-w-[24px] rounded-full bg-primary/10 px-2 py-1 text-center text-sm text-primary">
          {taskCount}
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
  );
};
