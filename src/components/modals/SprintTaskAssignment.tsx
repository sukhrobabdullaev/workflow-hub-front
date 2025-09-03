import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore, type Task, type Sprint } from '@/store/appStore';
import { Zap, Calendar, Target } from 'lucide-react';

interface SprintTaskAssignmentProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onAssign?: (taskId: string, sprintId: string | null) => void;
}

export const SprintTaskAssignment = ({
    isOpen,
    onClose,
    task,
    onAssign,
}: SprintTaskAssignmentProps) => {
    const { sprints, assignTaskToSprint, removeTaskFromSprint, updateSprintProgress } = useAppStore();
    const [selectedSprintId, setSelectedSprintId] = useState<string | null>(
        task?.sprintId || null
    );

    if (!task) return null;

    // Filter sprints that are active or planning (not completed/cancelled)
    const availableSprints = sprints.filter(
        (sprint) => sprint.status === 'active' || sprint.status === 'planning'
    );

    const currentSprint = sprints.find((sprint) => sprint.id === task.sprintId);

    const handleAssign = () => {
        if (selectedSprintId) {
            assignTaskToSprint(task.id, selectedSprintId);
            updateSprintProgress(selectedSprintId);

            // If task was previously in another sprint, update that sprint too
            if (task.sprintId && task.sprintId !== selectedSprintId) {
                updateSprintProgress(task.sprintId);
            }
        } else {
            if (task.sprintId) {
                removeTaskFromSprint(task.id);
                updateSprintProgress(task.sprintId);
            }
        }

        onAssign?.(task.id, selectedSprintId);
        onClose();
    };

    const getSprintStatusColor = (status: Sprint['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'planning':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Assign Task to Sprint
                    </DialogTitle>
                    <DialogDescription>
                        Assign "{task.title}" to a sprint for better organization and tracking.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current Assignment */}
                    {currentSprint && (
                        <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Currently Assigned To:</h4>
                            <div className="flex items-center gap-2">
                                <Badge className={getSprintStatusColor(currentSprint.status)}>
                                    {currentSprint.status}
                                </Badge>
                                <span className="font-medium">{currentSprint.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {currentSprint.goal}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(currentSprint.startDate).toLocaleDateString()} - {new Date(currentSprint.endDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    {currentSprint.completedTasks}/{currentSprint.totalTasks} tasks
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Sprint Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Assign to Sprint:</label>
                        <Select value={selectedSprintId || 'none'} onValueChange={(value) =>
                            setSelectedSprintId(value === 'none' ? null : value)
                        }>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a sprint or leave unassigned" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">
                                    <span className="text-muted-foreground">No Sprint (Backlog)</span>
                                </SelectItem>
                                {availableSprints.map((sprint) => (
                                    <SelectItem key={sprint.id} value={sprint.id}>
                                        <div className="flex items-center gap-2 w-full">
                                            <Badge
                                                className={`${getSprintStatusColor(sprint.status)} w-3 h-3 p-0`}
                                            />
                                            <span className="font-medium">{sprint.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({sprint.completedTasks}/{sprint.totalTasks} tasks)
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Selected Sprint Info */}
                    {selectedSprintId && (
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                            {(() => {
                                const selectedSprint = sprints.find((s) => s.id === selectedSprintId);
                                if (!selectedSprint) return null;

                                return (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={getSprintStatusColor(selectedSprint.status)}>
                                                {selectedSprint.status}
                                            </Badge>
                                            <span className="font-medium">{selectedSprint.name}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            <strong>Goal:</strong> {selectedSprint.goal}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(selectedSprint.startDate).toLocaleDateString()} - {new Date(selectedSprint.endDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Target className="w-3 h-3" />
                                                {selectedSprint.completedTasks}/{selectedSprint.totalTasks} tasks
                                            </span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Available Sprints Info */}
                    {availableSprints.length === 0 && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                No active or planning sprints available. Create a new sprint to assign tasks.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleAssign}>
                        {selectedSprintId ? 'Assign to Sprint' : 'Remove from Sprint'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
