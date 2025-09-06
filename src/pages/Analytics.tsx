import { UpgradeDialog } from '@/components/modals/UpgradeDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/appStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { BarChart3, Crown, Lock, Target, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

// Enhanced chart component
const Chart = ({
  data,
  type = 'bar',
  title,
}: {
  data: number[];
  type?: 'bar' | 'line' | 'area';
  title?: string;
}) => {
  const max = Math.max(...data);

  if (title) {
    // Title is provided, can be used for chart header
  }

  if (type === 'area') {
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (value / max) * 70 - 10;
        return `${x},${y}`;
      })
      .join(' ');

    const areaPoints = `0,90 ${points} 100,90`;

    return (
      <div className="h-48 w-full">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#areaGradient)" />
          <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (value / max) * 70 - 10;
            return <circle key={index} cx={x} cy={y} r="2" fill="hsl(var(--primary))" />;
          })}
        </svg>
      </div>
    );
  }

  if (type === 'line') {
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (value / max) * 80 - 10;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="h-48 w-full">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (value / max) * 80 - 10;
            return <circle key={index} cx={x} cy={y} r="3" fill="hsl(var(--primary))" />;
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-48 items-end justify-center gap-2 px-4">
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-gradient-primary group relative min-w-0 flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80"
          style={{ height: `${(value / max) * 100}%`, minHeight: '8px' }}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 transform rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
};

export const Analytics = () => {
  const { projects, tasks } = useAppStore();
  const { getCurrentPlan } = useSubscriptionStore();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const currentPlan = getCurrentPlan();
  const isFreePlan = currentPlan.id === 'free';

  // Sample analytics data
  const weeklyProgress = [45, 52, 61, 58, 67, 73, 68];
  const monthlyTasks = [24, 31, 28, 35, 42, 38, 45, 52, 48, 55, 61, 58];
  const teamPerformance = [85, 92, 78, 88, 95, 82];
  const projectCompletion = [100, 65, 25, 80, 90, 45];

  // Calculate key metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const overallProgress = Math.round(
    projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects
  );

  // For free plan, show basic analytics only
  if (isFreePlan) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              <BarChart3 className="h-8 w-8" />
              Basic Reports
            </h1>
            <p className="mt-2 text-muted-foreground">Simple project insights for your free plan</p>
          </div>
        </div>

        {/* Basic metrics for free plan */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}/3</div>
              <p className="text-xs text-muted-foreground">Free plan limit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <p className="text-xs text-muted-foreground">Overall completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Upgrade Prompt */}
        <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Advanced Analytics</h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              Unlock detailed insights, team performance tracking, time analytics, and custom
              reports with Professional plan.
            </p>
            <Button
              onClick={() => setShowUpgradeDialog(true)}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade for Advanced Analytics
            </Button>
          </CardContent>
        </Card>

        <UpgradeDialog
          open={showUpgradeDialog}
          onOpenChange={setShowUpgradeDialog}
          feature="Advanced Analytics"
          title="Unlock Powerful Analytics"
          description="Get detailed insights, team performance tracking, time analytics, and custom reports with Professional plan."
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <BarChart3 className="h-8 w-8" />
            Analytics & Reports
          </h1>
          <p className="mt-2 text-muted-foreground">Comprehensive insights and project analytics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Target className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallProgress}%</div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects}</div>
                <p className="text-xs text-muted-foreground">Out of {totalProjects} total</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tasks.filter(t => t.status === 'done').length}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">Average productivity</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Project completion trends over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart data={weeklyProgress} type="area" />
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Monthly Task Distribution</CardTitle>
                <CardDescription>Task completion throughout the year</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart data={monthlyTasks} type="bar" />
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Individual team member productivity scores</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart data={teamPerformance} type="line" />
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Project Completion Rates</CardTitle>
                <CardDescription>Progress across different projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart data={projectCompletion} type="bar" />
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics Table */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Comprehensive project analytics and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Project</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Progress</th>
                      <th className="p-3 text-left">Tasks</th>
                      <th className="p-3 text-left">Team Size</th>
                      <th className="p-3 text-left">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => {
                      const projectTasks = tasks.filter(t => t.projectId === project.id);
                      const completedTasks = projectTasks.filter(t => t.status === 'done').length;

                      return (
                        <tr key={project.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{project.name}</td>
                          <td className="p-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                project.status === 'active'
                                  ? 'bg-success/10 text-success'
                                  : project.status === 'completed'
                                    ? 'bg-primary/10 text-primary'
                                    : project.status === 'planning'
                                      ? 'bg-warning/10 text-warning'
                                      : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 rounded-full bg-muted">
                                <div
                                  className="bg-gradient-primary h-full rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span className="text-xs">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="p-3">
                            {completedTasks}/{projectTasks.length}
                          </td>
                          <td className="p-3">{project.teamMembers.length}</td>
                          <td className="p-3">{new Date(project.dueDate).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Chart data={teamPerformance} type="bar" />
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Chart data={monthlyTasks} type="area" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Custom Reports
              </CardTitle>
              <CardDescription>Generate detailed reports for stakeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="mb-2 h-6 w-6" />
                  Project Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="mb-2 h-6 w-6" />
                  Team Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
