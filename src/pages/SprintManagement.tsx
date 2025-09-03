import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/appStore';
import {
    Zap,
    Calendar,
    Target,
    TrendingUp,
    Users,
    Clock,
    PlayCircle,
    PauseCircle,
    CheckCircle,
    AlertCircle,
    Plus,
    Timer,
    BarChart3,
    Edit,
    Trash2,
    Settings,
    Archive,
    RotateCcw,
} from 'lucide-react';

// Sprint interface
interface Sprint {
    id: string;
    name: string;
    goal: string;
    startDate: string;
    endDate: string;
    status: 'planning' | 'active' | 'completed' | 'cancelled';
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    velocity: number;
    burndownData: number[];
    projectId: string;
}

// Mock sprint data
const mockSprints: Sprint[] = [
    {
        id: '1',
        name: 'Sprint 2.3',
        goal: 'Complete user authentication and implement task commenting system',
        startDate: '2025-01-20',
        endDate: '2025-02-03',
        status: 'active',
        totalTasks: 18,
        completedTasks: 12,
        inProgressTasks: 4,
        todoTasks: 2,
        velocity: 8.5,
        burndownData: [18, 16, 14, 12, 10, 8, 6, 4, 2, 0],
        projectId: '1'
    },
    {
        id: '2',
        name: 'Sprint 2.2',
        goal: 'Kanban board enhancements and team collaboration features',
        startDate: '2025-01-06',
        endDate: '2025-01-19',
        status: 'completed',
        totalTasks: 15,
        completedTasks: 15,
        inProgressTasks: 0,
        todoTasks: 0,
        velocity: 9.2,
        burndownData: [15, 13, 11, 9, 7, 5, 3, 1, 0],
        projectId: '1'
    },
    {
        id: '3',
        name: 'Sprint 2.4',
        goal: 'Analytics dashboard and reporting features',
        startDate: '2025-02-04',
        endDate: '2025-02-17',
        status: 'planning',
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        velocity: 0,
        burndownData: [],
        projectId: '1'
    }
];

// Enhanced chart component for burndown
const BurndownChart = ({ data, title }: { data: number[]; title?: string }) => {
    const max = Math.max(...data);
    const ideal = data.map((_, index) => max - (max / (data.length - 1)) * index);

    return (
        <div className="h-48 w-full">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(y => (
                    <line
                        key={y}
                        x1="10"
                        y1={10 + y * 0.8}
                        x2="90"
                        y2={10 + y * 0.8}
                        stroke="hsl(var(--border))"
                        strokeWidth="0.2"
                        opacity="0.3"
                    />
                ))}

                {/* Ideal line */}
                <polyline
                    points={ideal.map((value, index) => {
                        const x = 10 + (index / (ideal.length - 1)) * 80;
                        const y = 90 - (value / max) * 70;
                        return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    opacity="0.6"
                />

                {/* Actual line */}
                <polyline
                    points={data.map((value, index) => {
                        const x = 10 + (index / (data.length - 1)) * 80;
                        const y = 90 - (value / max) * 70;
                        return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                />

                {/* Data points */}
                {data.map((value, index) => {
                    const x = 10 + (index / (data.length - 1)) * 80;
                    const y = 90 - (value / max) * 70;
                    return (
                        <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill="hsl(var(--primary))"
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export const SprintManagement = () => {
    const { projects, tasks, teamMembers, sprints, getSprintTasks } = useAppStore();
    const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(sprints.find(s => s.status === 'active') || sprints[0]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const activeSprint = sprints.find(s => s.status === 'active');
    const completedSprints = sprints.filter(s => s.status === 'completed');
    const planningSprints = sprints.filter(s => s.status === 'planning');

    const getSprintStatusColor = (status: Sprint['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'completed':
                return 'bg-blue-500';
            case 'planning':
                return 'bg-yellow-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getSprintStatusIcon = (status: Sprint['status']) => {
        switch (status) {
            case 'active':
                return PlayCircle;
            case 'completed':
                return CheckCircle;
            case 'planning':
                return Clock;
            case 'cancelled':
                return AlertCircle;
            default:
                return PauseCircle;
        }
    };

    const calculateDaysRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Zap className="w-8 h-8" />
                        Sprint Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Plan, track, and manage Agile sprints with comprehensive insights
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Sprint Reports
                    </Button>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-primary hover:opacity-90">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Sprint
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Create New Sprint</DialogTitle>
                                <DialogDescription>
                                    Plan your next sprint with clear goals and timeline
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="sprint-name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="sprint-name"
                                        placeholder="Sprint 2.5"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="sprint-goal" className="text-right">
                                        Goal
                                    </Label>
                                    <Textarea
                                        id="sprint-goal"
                                        placeholder="What do you want to achieve in this sprint?"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="start-date" className="text-right">
                                        Start Date
                                    </Label>
                                    <Input
                                        id="start-date"
                                        type="date"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="end-date" className="text-right">
                                        End Date
                                    </Label>
                                    <Input
                                        id="end-date"
                                        type="date"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="project" className="text-right">
                                        Project
                                    </Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projects.map(project => (
                                                <SelectItem key={project.id} value={project.id}>
                                                    {project.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setIsCreateModalOpen(false)}>
                                    Create Sprint
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Sprint Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <PlayCircle className="w-4 h-4 text-green-600" />
                            Active Sprint
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeSprint ? 1 : 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeSprint ? activeSprint.name : 'No active sprint'}
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            Completed Sprints
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedSprints.length}</div>
                        <p className="text-xs text-muted-foreground">This quarter</p>
                    </CardContent>
                </Card>
                <Card className="shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            Average Velocity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {completedSprints.length > 0
                                ? (completedSprints.reduce((acc, s) => acc + s.velocity, 0) / completedSprints.length).toFixed(1)
                                : '0.0'
                            }
                        </div>
                        <p className="text-xs text-muted-foreground">Story points per sprint</p>
                    </CardContent>
                </Card>
                <Card className="shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            Planning Sprints
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{planningSprints.length}</div>
                        <p className="text-xs text-muted-foreground">Ready to start</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="current" className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4" />
                        Current Sprint
                    </TabsTrigger>
                    <TabsTrigger value="backlog" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Sprint Backlog
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <Archive className="w-4 h-4" />
                        Sprint History
                    </TabsTrigger>
                    <TabsTrigger value="planning" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Sprint Planning
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-6 mt-6">
                    {activeSprint ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2 shadow-soft">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <Zap className="w-5 h-5" />
                                                {activeSprint.name}
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                <strong>Goal:</strong> {activeSprint.goal}
                                            </CardDescription>
                                            <CardDescription>
                                                {new Date(activeSprint.startDate).toLocaleDateString()} - {new Date(activeSprint.endDate).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                <Timer className="w-3 h-3" />
                                                {calculateDaysRemaining(activeSprint.endDate)} days left
                                            </Badge>
                                            <Badge className={getSprintStatusColor(activeSprint.status)}>
                                                <PlayCircle className="w-3 h-3 mr-1" />
                                                {activeSprint.status.charAt(0).toUpperCase() + activeSprint.status.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium">Sprint Progress</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {activeSprint.completedTasks}/{activeSprint.totalTasks} tasks
                                                </span>
                                            </div>
                                            <Progress
                                                value={(activeSprint.completedTasks / activeSprint.totalTasks) * 100}
                                                className="h-3"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                <span>0%</span>
                                                <span className="font-medium">
                                                    {Math.round((activeSprint.completedTasks / activeSprint.totalTasks) * 100)}%
                                                </span>
                                                <span>100%</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-3">Burndown Chart</h4>
                                            <BurndownChart data={activeSprint.burndownData} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-soft">
                                <CardHeader>
                                    <CardTitle className="text-lg">Sprint Metrics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                            <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
                                            <div className="text-lg font-bold text-green-600">{activeSprint.completedTasks}</div>
                                            <div className="text-xs text-muted-foreground">Completed</div>
                                        </div>
                                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                            <PlayCircle className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                                            <div className="text-lg font-bold text-blue-600">{activeSprint.inProgressTasks}</div>
                                            <div className="text-xs text-muted-foreground">In Progress</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                                            <PauseCircle className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                                            <div className="text-lg font-bold text-gray-600">{activeSprint.todoTasks}</div>
                                            <div className="text-xs text-muted-foreground">To Do</div>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                            <TrendingUp className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                                            <div className="text-lg font-bold text-purple-600">{activeSprint.velocity}</div>
                                            <div className="text-xs text-muted-foreground">Velocity</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t">
                                        <Button className="w-full" variant="outline">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Sprint
                                        </Button>
                                        <Button className="w-full" variant="outline">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Complete Sprint
                                        </Button>
                                        <Button className="w-full" variant="outline">
                                            <Target className="w-4 h-4 mr-2" />
                                            Sprint Retrospective
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card className="shadow-soft">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No Active Sprint</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Start your next sprint to begin tracking progress and managing tasks.
                                </p>
                                <Button onClick={() => setIsCreateModalOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Start New Sprint
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="history" className="space-y-6 mt-6">
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Sprint History</CardTitle>
                            <CardDescription>
                                View and analyze completed sprints
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {completedSprints.map(sprint => {
                                    const StatusIcon = getSprintStatusIcon(sprint.status);
                                    return (
                                        <div
                                            key={sprint.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <StatusIcon className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <h4 className="font-medium">{sprint.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">{sprint.completedTasks}/{sprint.totalTasks} tasks</div>
                                                    <div className="text-xs text-muted-foreground">Velocity: {sprint.velocity}</div>
                                                </div>
                                                <Badge className={getSprintStatusColor(sprint.status)}>
                                                    {sprint.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="backlog" className="space-y-6 mt-6">
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Sprint Backlog</CardTitle>
                            <CardDescription>
                                Tasks assigned to sprints and unassigned backlog items
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Active Sprint Tasks */}
                                {activeSprint && (
                                    <div>
                                        <h4 className="font-medium mb-3 flex items-center gap-2">
                                            <PlayCircle className="w-4 h-4 text-green-600" />
                                            {activeSprint.name} - Active Sprint Tasks
                                        </h4>
                                        <div className="space-y-2">
                                            {tasks.filter(task => task.sprintId === activeSprint.id).map(task => (
                                                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full ${task.status === 'done' ? 'bg-green-500' :
                                                                task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                                                            }`} />
                                                        <div>
                                                            <h5 className="font-medium">{task.title}</h5>
                                                            <p className="text-sm text-muted-foreground">{task.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={
                                                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-green-100 text-green-800'
                                                        }>
                                                            {task.priority}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            {task.status.replace('-', ' ')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                            {tasks.filter(task => task.sprintId === activeSprint.id).length === 0 && (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    No tasks assigned to this sprint yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Unassigned Tasks (Product Backlog) */}
                                <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        Product Backlog - Unassigned Tasks
                                    </h4>
                                    <div className="space-y-2">
                                        {tasks.filter(task => !task.sprintId).map(task => (
                                            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                                                    <div>
                                                        <h5 className="font-medium">{task.title}</h5>
                                                        <p className="text-sm text-muted-foreground">{task.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={
                                                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'
                                                    }>
                                                        {task.priority}
                                                    </Badge>
                                                    <Button variant="outline" size="sm">
                                                        <Zap className="w-3 h-3 mr-1" />
                                                        Assign to Sprint
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {tasks.filter(task => !task.sprintId).length === 0 && (
                                            <div className="text-center py-8 text-muted-foreground">
                                                All tasks are assigned to sprints.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Future Sprint Tasks */}
                                {planningSprints.map(sprint => (
                                    <div key={sprint.id}>
                                        <h4 className="font-medium mb-3 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-yellow-600" />
                                            {sprint.name} - Planning Sprint Tasks
                                        </h4>
                                        <div className="space-y-2">
                                            {tasks.filter(task => task.sprintId === sprint.id).map(task => (
                                                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                        <div>
                                                            <h5 className="font-medium">{task.title}</h5>
                                                            <p className="text-sm text-muted-foreground">{task.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={
                                                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-green-100 text-green-800'
                                                        }>
                                                            {task.priority}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-yellow-50">
                                                            Planning
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                            {tasks.filter(task => task.sprintId === sprint.id).length === 0 && (
                                                <div className="text-center py-4 text-muted-foreground text-sm">
                                                    No tasks assigned to this sprint yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="planning" className="space-y-6 mt-6">
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Sprint Planning</CardTitle>
                            <CardDescription>
                                Plan and estimate upcoming sprints
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {planningSprints.map(sprint => {
                                    const StatusIcon = getSprintStatusIcon(sprint.status);
                                    return (
                                        <div
                                            key={sprint.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <StatusIcon className="w-5 h-5 text-yellow-600" />
                                                <div>
                                                    <h4 className="font-medium">{sprint.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Planned: {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getSprintStatusColor(sprint.status)}>
                                                    {sprint.status}
                                                </Badge>
                                                <Button variant="outline" size="sm">
                                                    <PlayCircle className="w-4 h-4 mr-2" />
                                                    Start Sprint
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
