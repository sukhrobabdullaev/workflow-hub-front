import {
  CreateProjectModal,
  CreateTaskModal,
  VideoRecordingModal,
  ViewReportsModal,
} from '@/components/modals';
import { LiveUpdates } from '@/components/realtime/LiveUpdates';
import { OnlineUsers } from '@/components/realtime/OnlineUsers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import {
  BarChart3,
  CheckSquare,
  Database,
  FolderOpen,
  Infinity,
  MessageCircle,
  Play,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple chart component for demonstration
const SimpleChart = ({ data, type = 'bar' }: { data: number[]; type?: 'bar' | 'line' }) => {
  const max = Math.max(...data);

  if (type === 'line') {
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (value / max) * 80;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="h-32 w-full">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <polyline
            points={points}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (value / max) * 80;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="hsl(var(--primary))"
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-32 items-end justify-center gap-2">
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-gradient-primary min-w-0 flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80"
          style={{ height: `${(value / max) * 100}%`, minHeight: '8px' }}
        />
      ))}
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  description,
  trend,
}: {
  title: string;
  value: string | number;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <Card className="shadow-soft transition-shadow duration-200 hover:shadow-elevated">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {trend && (
        <div
          className={`rounded-full px-2 py-1 text-xs ${
            trend === 'up'
              ? 'bg-success/10 text-success'
              : trend === 'down'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-muted text-muted-foreground'
          }`}
        >
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
        </div>
      )}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const ActivityItem = ({
  title,
  description,
  time,
  type,
}: {
  title: string;
  description: string;
  time: string;
  type: 'task' | 'project' | 'team';
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'task':
        return 'bg-primary/10 text-primary';
      case 'project':
        return 'bg-success/10 text-success';
      case 'team':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
      <div className={`mt-2 h-2 w-2 rounded-full ${getTypeColor()}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="mt-1 text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  status,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'active' | 'coming-soon';
  onClick?: () => void;
}) => (
  <Card
    className="group cursor-pointer bg-gradient-to-br from-white to-gray-50 transition-all duration-200 hover:scale-105 hover:shadow-lg dark:from-gray-900 dark:to-gray-800"
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
          {icon}
        </div>
        <Badge variant={status === 'active' ? 'default' : 'secondary'} className="text-xs">
          {status === 'active' ? 'Active' : 'Coming Soon'}
        </Badge>
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  const { projects, tasks, teamMembers } = useAppStore();
  const navigate = useNavigate();

  // Modal states
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isViewReportsModalOpen, setIsViewReportsModalOpen] = useState(false);
  const [isVideoRecordingOpen, setIsVideoRecordingOpen] = useState(false);

  // Calculate metrics
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Sample data for charts
  const progressData = [65, 78, 82, 74, 85, 91, 88];
  const statusData = [
    { label: 'To Do', value: tasks.filter(t => t.status === 'todo').length },
    {
      label: 'In Progress',
      value: tasks.filter(t => t.status === 'in-progress').length,
    },
    { label: 'Done', value: completedTasks },
  ];

  // Recent activities
  const recentActivities = [
    {
      title: 'Task completed',
      description: 'Homepage mockup design finished',
      time: '2 hours ago',
      type: 'task' as const,
    },
    {
      title: 'New team member',
      description: 'Alex Rodriguez joined the team',
      time: '4 hours ago',
      type: 'team' as const,
    },
    {
      title: 'Project milestone',
      description: 'Website redesign reached 65% completion',
      time: '1 day ago',
      type: 'project' as const,
    },
    {
      title: 'Task assigned',
      description: 'API integration task assigned to Emily',
      time: '2 days ago',
      type: 'task' as const,
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => setIsCreateProjectModalOpen(true)}
          >
            New Project
          </Button>
          <Button variant="outline" onClick={() => setIsViewReportsModalOpen(true)}>
            View Reports
          </Button>
        </div>
      </div>

      {/* Feature Highlights Banner */}
      <Card className="border-none bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-lg dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50">
        <CardHeader className="text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Infinity className="h-6 w-6 text-primary" />
            <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              Unlimited Everything - Free Forever!
            </CardTitle>
          </div>
          <CardDescription className="text-lg">
            Experience all premium features without any limitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white/50 p-3 text-center dark:bg-gray-800/50">
              <CheckSquare className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <div className="font-semibold">Unlimited Tasks</div>
              <div className="text-sm text-muted-foreground">No limits on your productivity</div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 text-center dark:bg-gray-800/50">
              <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <div className="font-semibold">Unlimited Users</div>
              <div className="text-sm text-muted-foreground">Invite your entire team</div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 text-center dark:bg-gray-800/50">
              <FolderOpen className="mx-auto mb-2 h-8 w-8 text-purple-600" />
              <div className="font-semibold">Unlimited Projects</div>
              <div className="text-sm text-muted-foreground">Manage all your work</div>
            </div>
            <div className="rounded-lg bg-white/50 p-3 text-center dark:bg-gray-800/50">
              <Database className="mx-auto mb-2 h-8 w-8 text-orange-600" />
              <div className="font-semibold">100MB Storage</div>
              <div className="text-sm text-muted-foreground">Generous file storage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Features Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<MessageCircle className="h-6 w-6" />}
          title="Real-time Chat"
          description="Instant team communication"
          status="active"
          onClick={() => navigate('/team')}
        />
        <FeatureCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="Kanban Boards"
          description="Visual project management"
          status="active"
          onClick={() => navigate('/projects')}
        />
        <FeatureCard
          icon={<Video className="h-6 w-6" />}
          title="Video Recording"
          description="In-app screen capture"
          status="active"
          onClick={() => setIsVideoRecordingOpen(true)}
        />
      </div>

      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          description="Currently in progress"
          trend="up"
        />
        <MetricCard
          title="Total Tasks"
          value={totalTasks}
          description="Across all projects"
          trend="up"
        />
        <MetricCard
          title="Team Members"
          value={teamMembers.length}
          description="Active team members"
          trend="neutral"
        />
        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          description="Tasks completed this month"
          trend="up"
        />
        <MetricCard
          title="Storage Used"
          value="24.3MB"
          description="of 100MB available"
          trend="neutral"
        />
      </div>

      {/* Real-time Features & Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Live Updates */}
        <div className="lg:col-span-1">
          <LiveUpdates />
        </div>

        {/* Progress Chart */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Progress
            </CardTitle>
            <CardDescription>Weekly progress overview with real-time updates</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleChart data={progressData} type="line" />
          </CardContent>
        </Card>

        {/* Online Team Members */}
        <div className="lg:col-span-1">
          <OnlineUsers />
        </div>
      </div>

      {/* Enhanced Task Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Task Status with Kanban Preview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Task Status
            </CardTitle>
            <CardDescription>Current task distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusData.map(item => (
              <div
                key={item.label}
                className="flex cursor-pointer items-center justify-between rounded p-2 transition-colors hover:bg-muted/50"
                onClick={() => navigate('/projects')}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-gradient-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${(item.value / totalTasks) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm text-muted-foreground">{item.value}</span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="mt-4 w-full" onClick={() => navigate('/projects')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Kanban Board
            </Button>
          </CardContent>
        </Card>

        {/* Support & Features */}
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 shadow-soft dark:from-green-950/50 dark:to-blue-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Zap className="h-5 w-5" />
              24/7 Support
            </CardTitle>
            <CardDescription>Premium support included free</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span>Support team online</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Get instant help with our dedicated support team available around the clock.
            </div>
            <Button
              variant="outline"
              className="w-full border-green-200 text-green-700 hover:bg-green-50"
              size="sm"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your team with real-time sync</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
            <div className="flex items-center justify-center pt-3">
              <Badge variant="secondary" className="text-xs">
                <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Live updates active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Powerful tools at your fingertips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => setIsCreateTaskModalOpen(true)}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Create New Task
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => navigate('/projects')}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              View Kanban Boards
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => setIsVideoRecordingOpen(true)}
            >
              <Video className="mr-2 h-4 w-4" />
              Start Video Recording
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => navigate('/team')}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Team Chat
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Sprint Planning
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateProjectModal
        open={isCreateProjectModalOpen}
        onOpenChange={setIsCreateProjectModalOpen}
      />

      <CreateTaskModal open={isCreateTaskModalOpen} onOpenChange={setIsCreateTaskModalOpen} />

      <ViewReportsModal open={isViewReportsModalOpen} onOpenChange={setIsViewReportsModalOpen} />

      <VideoRecordingModal open={isVideoRecordingOpen} onOpenChange={setIsVideoRecordingOpen} />
    </div>
  );
};
