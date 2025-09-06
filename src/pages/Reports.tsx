import { UpgradeDialog } from '@/components/modals/UpgradeDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FreePlanBanner } from '@/components/ui/plan-indicators';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Crown } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Mock data for reports
const productivityData = [
  { month: 'Jan', tasks: 120, completed: 95, efficiency: 79 },
  { month: 'Feb', tasks: 135, completed: 118, efficiency: 87 },
  { month: 'Mar', tasks: 150, completed: 142, efficiency: 95 },
  { month: 'Apr', tasks: 160, completed: 148, efficiency: 93 },
  { month: 'May', tasks: 140, completed: 135, efficiency: 96 },
  { month: 'Jun', tasks: 180, completed: 172, efficiency: 96 },
];

const teamPerformanceData = [
  { name: 'Sarah Johnson', tasks: 45, completed: 42, rate: 93 },
  { name: 'Mike Chen', tasks: 38, completed: 35, rate: 92 },
  { name: 'Lisa Garcia', tasks: 52, completed: 46, rate: 88 },
  { name: 'John Davis', tasks: 41, completed: 38, rate: 93 },
  { name: 'Emma Wilson', tasks: 48, completed: 44, rate: 92 },
];

const projectStatusData = [
  { name: 'Completed', value: 35, color: '#22C55E' },
  { name: 'In Progress', value: 45, color: '#3B82F6' },
  { name: 'Planning', value: 15, color: '#F59E0B' },
  { name: 'On Hold', value: 5, color: '#EF4444' },
];

export const Reports = () => {
  const user = useAuthStore(state => state.user);
  const { currentPlan } = useSubscriptionStore();
  const isFreePlan = currentPlan === 'free';
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Access control
  if (user?.role === 'member') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="mb-2 text-xl font-semibold">Access Restricted</h2>
              <p className="text-muted-foreground">
                You don&apos;t have permission to view reports.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Free Plan Banner */}
      {isFreePlan && <FreePlanBanner />}

      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            {isFreePlan
              ? 'Basic insights into team performance and project progress'
              : 'Comprehensive insights into team performance and project progress'}
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod} disabled={isFreePlan}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button disabled={isFreePlan} onClick={() => isFreePlan && setShowUpgradeDialog(true)}>
            {isFreePlan ? (
              <>
                <Crown className="mr-2 h-4 w-4" />
                Export PDF (Pro)
              </>
            ) : (
              'Export PDF'
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="productivity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="team" disabled={isFreePlan}>
            Team Performance {isFreePlan && '(Pro)'}
          </TabsTrigger>
          <TabsTrigger value="projects" disabled={isFreePlan}>
            Project Status {isFreePlan && '(Pro)'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="productivity" className="space-y-6">
          {isFreePlan ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Basic Productivity Overview
                  <Button
                    size="sm"
                    onClick={() => setShowUpgradeDialog(true)}
                    className="bg-gradient-to-r from-primary to-primary/80"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade for Advanced Charts
                  </Button>
                </CardTitle>
                <CardDescription>Limited insights available on Free plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                    <span className="font-medium">This Month&apos;s Tasks</span>
                    <span className="text-2xl font-bold">24</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                    <span className="font-medium">Completed Tasks</span>
                    <span className="text-2xl font-bold text-green-600">18</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                    <span className="font-medium">Completion Rate</span>
                    <span className="text-2xl font-bold text-blue-600">75%</span>
                  </div>
                  <div className="mt-6 rounded-lg border-2 border-dashed border-primary/30 p-4 text-center">
                    <Crown className="mx-auto mb-2 h-12 w-12 text-primary/60" />
                    <p className="text-sm text-muted-foreground">
                      Upgrade to Professional for detailed charts, trends, and analytics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Team Productivity Trends</CardTitle>
                <CardDescription>Track task completion and efficiency over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#3B82F6" name="Total Tasks" />
                    <Bar dataKey="completed" fill="#22C55E" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Performance</CardTitle>
              <CardDescription>
                Compare team member productivity and completion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformanceData.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-medium">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.completed}/{member.tasks} tasks completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{member.rate}%</div>
                        <div className="text-xs text-muted-foreground">completion rate</div>
                      </div>
                      <Badge variant={member.rate >= 90 ? 'default' : 'secondary'}>
                        {member.rate >= 90 ? 'Excellent' : 'Good'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>Overview of current project statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
                <CardDescription>Detailed breakdown of project metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectStatusData.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="font-medium">{status.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{status.value}%</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((status.value / 100) * 24)} projects
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        title="Unlock Advanced Reports & Analytics"
        description="Upgrade to Professional to access detailed charts, team performance insights, project analytics, and data export features."
      />
    </div>
  );
};
