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
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import {
  CreateProjectModal,
  CreateTaskModal,
  ViewReportsModal,
  VideoRecordingModal,
} from '@/components/modals';
import { useNavigate } from 'react-router-dom';
import { LiveUpdates } from '@/components/realtime/LiveUpdates';
import { OnlineUsers } from '@/components/realtime/OnlineUsers';
import {
  Video,
  Users,
  CheckSquare,
  FolderOpen,
  MessageCircle,
  Database,
  BarChart3,
  Zap,
  Infinity,
  Play,
  Calendar
} from 'lucide-react';

// Simple chart component for demonstration
const SimpleChart = ({
  data,
  type = 'bar',
}: {
  data: number[];
  type?: 'bar' | 'line';
}) => {
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
        <svg viewBox="0 0 100 100" className="w-full h-full">
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
    <div className="h-32 flex items-end justify-center gap-2">
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-gradient-primary rounded-t-sm flex-1 min-w-0 transition-all duration-300 hover:opacity-80"
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
  <Card className="shadow-soft hover:shadow-elevated transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {trend && (
        <div
          className={`text-xs px-2 py-1 rounded-full ${trend === 'up'
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
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor()}`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
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
    className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
          {icon}
        </div>
        <Badge
          variant={status === 'active' ? 'default' : 'secondary'}
          className="text-xs"
        >
          {status === 'active' ? 'Active' : 'Coming Soon'}
        </Badge>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  const { projects, tasks, teamMembers } = useAppStore();
  const navigate = useNavigate();

  // Modal states
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isViewReportsModalOpen, setIsViewReportsModalOpen] = useState(false);
  const [isVideoRecordingOpen, setIsVideoRecordingOpen] = useState(false);

  // Calculate metrics
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => setIsCreateProjectModalOpen(true)}
          >
            New Project
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsViewReportsModalOpen(true)}
          >
            View Reports
          </Button>
        </div>
      </div>

      {/* Feature Highlights Banner */}
      <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Infinity className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Unlimited Everything - Free Forever!
            </CardTitle>
          </div>
          <CardDescription className="text-lg">
            Experience all premium features without any limitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <CheckSquare className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="font-semibold">Unlimited Tasks</div>
              <div className="text-sm text-muted-foreground">No limits on your productivity</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">Unlimited Users</div>
              <div className="text-sm text-muted-foreground">Invite your entire team</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="font-semibold">Unlimited Projects</div>
              <div className="text-sm text-muted-foreground">Manage all your work</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <Database className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="font-semibold">100MB Storage</div>
              <div className="text-sm text-muted-foreground">Generous file storage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<MessageCircle className="w-6 h-6" />}
          title="Real-time Chat"
          description="Instant team communication"
          status="active"
          onClick={() => navigate('/team')}
        />
        <FeatureCard
          icon={<BarChart3 className="w-6 h-6" />}
          title="Kanban Boards"
          description="Visual project management"
          status="active"
          onClick={() => navigate('/projects')}
        />
        <FeatureCard
          icon={<Video className="w-6 h-6" />}
          title="Video Recording"
          description="In-app screen capture"
          status="active"
          onClick={() => setIsVideoRecordingOpen(true)}
        />
      </div>

      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Live Updates */}
        <div className="lg:col-span-1">
          <LiveUpdates />
        </div>

        {/* Progress Chart */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status with Kanban Preview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Task Status
            </CardTitle>
            <CardDescription>Current task distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusData.map(item => (
              <div
                key={item.label}
                className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                onClick={() => navigate('/projects')}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-300"
                      style={{ width: `${(item.value / totalTasks) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/projects')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Kanban Board
            </Button>
          </CardContent>
        </Card>

        {/* Support & Features */}
        <Card className="shadow-soft bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Zap className="w-5 h-5" />
              24/7 Support
            </CardTitle>
            <CardDescription>Premium support included free</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
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
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                Live updates active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
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
              <CheckSquare className="w-4 h-4 mr-2" />
              Create New Task
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => navigate('/projects')}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              View Kanban Boards
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => setIsVideoRecordingOpen(true)}
            >
              <Video className="w-4 h-4 mr-2" />
              Start Video Recording
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => navigate('/team')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Team Chat
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
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

      <CreateTaskModal
        open={isCreateTaskModalOpen}
        onOpenChange={setIsCreateTaskModalOpen}
      />

      <ViewReportsModal
        open={isViewReportsModalOpen}
        onOpenChange={setIsViewReportsModalOpen}
      />

      <VideoRecordingModal
        open={isVideoRecordingOpen}
        onOpenChange={setIsVideoRecordingOpen}
      />
    </div>
  );
};
