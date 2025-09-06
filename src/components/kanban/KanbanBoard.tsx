import { Task, useAppStore } from '@/store/appStore';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';
import { KanbanCard } from './KanbanCard';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  projectId?: string;
  tasks?: Task[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, tasks: propTasks }) => {
  const { tasks: storeTasks, moveTask, getColumnsForProject, deleteColumn } = useAppStore();
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Use provided tasks or filter from store
  const filteredTasks =
    propTasks || (projectId ? storeTasks.filter(task => task.projectId === projectId) : storeTasks);

  // Get columns for this project (or global columns)
  const columns = getColumnsForProject(projectId);

  const handleDragStart = (event: DragStartEvent) => {
    const task = filteredTasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // Check if the drop target is a valid column
    const isValidColumn = columns.some(col => col.id === newStatus);
    if (isValidColumn) {
      moveTask(taskId, newStatus);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    deleteColumn(columnId);
  };

  // Prepare column data for rendering
  const columnData = columns.map(column => ({
    ...column,
    tasks: filteredTasks.filter(task => task.status === column.id),
  }));

  return (
    <div className="h-full">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div
          className={`grid h-full gap-6 ${
            columns.length === 3
              ? 'grid-cols-1 md:grid-cols-3'
              : columns.length === 4
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                : columns.length === 5
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'
          }`}
        >
          {columnData.map(column => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              taskCount={column.tasks.length}
              projectId={projectId}
              isDefault={column.isDefault}
              onDelete={column.isDefault ? undefined : () => handleDeleteColumn(column.id)}
            >
              <SortableContext
                items={column.tasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {column.tasks.map(task => (
                    <KanbanCard key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-80">
              <KanbanCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
