import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import {
  Building,
  Check,
  CreditCard,
  Crown,
  DollarSign,
  Download,
  FileText,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const invoices = [
  {
    id: 'INV-001',
    date: '2025-01-01',
    amount: '$8.00',
    status: 'paid',
    plan: 'Professional',
    period: 'Jan 2025',
  },
  {
    id: 'INV-002',
    date: '2024-12-01',
    amount: '$8.00',
    status: 'paid',
    plan: 'Professional',
    period: 'Dec 2024',
  },
  {
    id: 'INV-003',
    date: '2024-11-01',
    amount: '$8.00',
    status: 'paid',
    plan: 'Professional',
    period: 'Nov 2024',
  },
];

export const Billing = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { getCurrentPlan, usage, plans, upgradeTo, getUsagePercentage, getRemainingLimit } =
    useSubscriptionStore();

  const currentPlan = getCurrentPlan();
  const isFreePlan = currentPlan.id === 'free';

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Only allow admin and manager roles to access billing
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="mx-auto max-w-md text-center">
          <CardHeader>
            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Only administrators and managers can access billing information.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleUpgrade = plan => {
    setSelectedPlan(plan);
    setIsUpgradeModalOpen(true);
  };

  const confirmUpgrade = async () => {
    if (selectedPlan) {
      const success = await upgradeTo(selectedPlan.id);
      if (success) {
        toast({
          title: 'Plan Updated',
          description: `Successfully upgraded to ${selectedPlan.name} plan.`,
        });
      } else {
        toast({
          title: 'Upgrade Failed',
          description: 'There was an issue upgrading your plan. Please try again.',
          variant: 'destructive',
        });
      }
    }
    setIsUpgradeModalOpen(false);
  };

  const downloadInvoice = invoice => {
    toast({
      title: 'Download Started',
      description: `Downloading invoice ${invoice.id}...`,
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <CreditCard className="h-8 w-8" />
            Billing & Subscription
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isFreePlan
              ? 'You are currently on the Free plan. Upgrade to unlock advanced features.'
              : 'Manage your subscription, billing, and usage'}
          </p>
        </div>
        <Button
          className="bg-gradient-primary hover:opacity-90"
          onClick={() => setIsUpgradeModalOpen(true)}
        >
          <Crown className="mr-2 h-4 w-4" />
          {isFreePlan ? 'Upgrade Plan' : 'Change Plan'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2" disabled={isFreePlan}>
            <FileText className="h-4 w-4" />
            Billing History {isFreePlan && '(Pro)'}
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2" disabled={isFreePlan}>
            <Building className="h-4 w-4" />
            Usage {isFreePlan && '(Pro)'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Current Plan */}
          <Card
            className={`shadow-soft ${
              isFreePlan
                ? 'bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50'
                : 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50'
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Crown
                      className={`h-5 w-5 ${isFreePlan ? 'text-slate-600' : 'text-blue-600'}`}
                    />
                    Current Plan: {currentPlan.name}
                  </CardTitle>
                  <CardDescription>
                    {isFreePlan
                      ? "You're on the Free plan. Upgrade to unlock advanced features and grow your team."
                      : `You're on the ${currentPlan.name} plan with full access to premium features`}
                  </CardDescription>
                </div>
                <Badge
                  className={
                    isFreePlan
                      ? 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                  }
                >
                  {isFreePlan ? 'Free' : 'Active'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${isFreePlan ? 'text-slate-600' : 'text-blue-600'}`}
                  >
                    ${currentPlan.price}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${isFreePlan ? 'text-slate-600' : 'text-green-600'}`}
                  >
                    {isFreePlan ? 'Free' : 'Jan 15'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isFreePlan ? 'No billing' : 'Next billing'}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${isFreePlan ? 'text-slate-600' : 'text-purple-600'}`}
                  >
                    {usage.teamMembers}/{currentPlan.limits.maxTeamMembers}
                  </div>
                  <div className="text-sm text-muted-foreground">Team members</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4" />
                  Monthly Spend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentPlan.price}.00</div>
                <p className="text-xs text-muted-foreground">
                  {isFreePlan ? 'Free forever' : '+$0 from last month'}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  Team Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usage.teamMembers}</div>
                <p className="text-xs text-muted-foreground">
                  of {currentPlan.limits.maxTeamMembers} members
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Building className="h-4 w-4" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usage.projects}</div>
                <p className="text-xs text-muted-foreground">
                  {currentPlan.limits.maxProjects === -1
                    ? 'Unlimited available'
                    : `of ${currentPlan.limits.maxProjects} available`}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  Storage Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isFreePlan
                    ? `${Math.round(usage.storageUsedMB)}MB`
                    : `${Math.round(usage.storageUsedMB / 1024)}GB`}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {isFreePlan ? '10MB' : `${currentPlan.limits.storageGB}GB`} available
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                {isFreePlan ? 'Your latest account activity' : 'Your latest billing events'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isFreePlan ? (
                  <>
                    <div className="flex items-center gap-4 rounded-lg border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Account Created</p>
                        <p className="text-sm text-muted-foreground">
                          Welcome to WorkflowHub! Start exploring features.
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Free
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg border border-dashed p-3 opacity-60">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <Crown className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Upgrade to unlock more features</p>
                        <p className="text-sm text-muted-foreground">
                          Get unlimited projects, team collaboration, and AI features
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="bg-gradient-to-r from-primary to-purple-600"
                      >
                        Upgrade
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4 rounded-lg border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Payment Successful</p>
                        <p className="text-sm text-muted-foreground">
                          ${currentPlan.price}.00 charged on Jan 1, 2025
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Paid
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Team Member Added</p>
                        <p className="text-sm text-muted-foreground">
                          2 new members joined your team
                        </p>
                      </div>
                      <Badge variant="outline">Recent</Badge>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="mt-6 space-y-6">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Choose Your Plan</h2>
            <p className="text-muted-foreground">
              {isFreePlan
                ? 'Upgrade to unlock advanced features and grow your team.'
                : 'Upgrade or downgrade your plan at any time. No hidden fees.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map(plan => {
              const isCurrent = plan.id === currentPlan.id;
              return (
                <Card
                  key={plan.id}
                  className={`relative shadow-soft ${
                    isCurrent ? 'ring-2 ring-blue-500' : ''
                  } ${plan.popular ? 'border-blue-200' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">
                        <Star className="mr-1 h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-2 right-4">
                      <Badge className="bg-green-600 text-white">Current Plan</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.slice(0, 6).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check
                            className={`h-4 w-4 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}
                          />
                          <span className={feature.included ? '' : 'text-gray-400 line-through'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={isCurrent ? 'outline' : 'default'}
                      onClick={() => !isCurrent && handleUpgrade(plan)}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Current Plan' : 'Upgrade to ' + plan.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    {isFreePlan
                      ? 'No billing history available on the Free plan'
                      : 'Download your invoices and view payment history'}
                  </CardDescription>
                </div>
                {!isFreePlan && (
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isFreePlan ? (
                <div className="space-y-4 py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">No Billing History</h3>
                    <p className="mb-4 text-muted-foreground">
                      You&apos;re on the Free plan, so there&apos;s no billing history to show.
                    </p>
                    <Button
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="bg-gradient-to-r from-primary to-purple-600"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{invoice.plan}</TableCell>
                        <TableCell>{invoice.period}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-green-700"
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadInvoice(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Used</span>
                  <span>
                    {usage.teamMembers} of {currentPlan.limits.maxTeamMembers}
                  </span>
                </div>
                <Progress value={getUsagePercentage('teamMembers')} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {getRemainingLimit('maxTeamMembers')} members remaining
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Used</span>
                  <span>{usage.projects} projects</span>
                </div>
                <div className="py-4 text-center">
                  {currentPlan.limits.maxProjects === -1 ? (
                    <Badge className="bg-blue-100 text-blue-800">Unlimited</Badge>
                  ) : (
                    <Progress value={getUsagePercentage('projects')} className="h-2" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentPlan.limits.maxProjects === -1
                    ? 'No limit on your current plan'
                    : `${getRemainingLimit('maxProjects')} projects remaining`}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Used</span>
                  <span>
                    {isFreePlan
                      ? `${Math.round(usage.storageUsedMB)}MB of 10MB`
                      : `${Math.round(usage.storageUsedMB / 1024)}GB of ${currentPlan.limits.storageGB}GB`}
                  </span>
                </div>
                <Progress value={getUsagePercentage('storage')} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {isFreePlan
                    ? `${Math.max(0, 10 - Math.round(usage.storageUsedMB))}MB remaining`
                    : `${Math.max(0, currentPlan.limits.storageGB - Math.round(usage.storageUsedMB / 1024))}GB remaining`}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>
                {isFreePlan
                  ? 'Upgrade to Professional to view detailed usage analytics and trends'
                  : 'Your usage over the past 6 months'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative flex h-64 items-center justify-center rounded-lg bg-muted/20">
                {isFreePlan ? (
                  <div className="space-y-3 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      <Crown className="h-4 w-4" />
                      Pro Feature
                    </div>
                    <p className="text-muted-foreground">
                      Usage charts and analytics available with Pro plan
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="bg-gradient-to-r from-primary to-purple-600"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Usage charts would be displayed here</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upgrade Modal */}
      <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? `Upgrade to ${selectedPlan.name}` : 'Choose a Plan'}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan
                ? `Confirm your plan upgrade. You'll be charged immediately and your new features will be available right away.`
                : 'Select a plan to upgrade your account and unlock premium features.'}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span>Current Plan:</span>
                  <span className="font-medium">{currentPlan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>New Plan:</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Price:</span>
                  <span className="font-medium">${selectedPlan.price}/month</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {plans
                .filter(plan => plan.id !== currentPlan.id)
                .map(plan => (
                  <Card
                    key={plan.id}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${plan.price}/month</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUpgradeModalOpen(false);
                setSelectedPlan(null);
              }}
            >
              Cancel
            </Button>
            {selectedPlan ? (
              <Button onClick={confirmUpgrade} className="bg-gradient-primary hover:opacity-90">
                Confirm Upgrade
              </Button>
            ) : (
              <Button disabled>Select a Plan</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
