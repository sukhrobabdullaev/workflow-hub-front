import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Download,
  Calendar,
  Users,
  Zap,
  Crown,
  Shield,
  Check,
  Star,
  TrendingUp,
  Building,
  FileText,
  DollarSign,
} from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    description: 'Perfect for small teams',
    features: [
      'Up to 10 team members',
      '5 projects',
      'Basic kanban boards',
      'Email support',
      '10GB storage',
    ],
    current: false,
    popular: false,
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'Best for growing teams',
    features: [
      'Up to 50 team members',
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '100GB storage',
      'Custom integrations',
    ],
    current: true,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For large organizations',
    features: [
      'Unlimited team members',
      'Unlimited projects',
      'Advanced security',
      'Dedicated support',
      '1TB storage',
      'Custom branding',
      'API access',
    ],
    current: false,
    popular: false,
  },
];

const invoices = [
  {
    id: 'INV-001',
    date: '2025-01-01',
    amount: '$29.00',
    status: 'paid',
    plan: 'Professional',
    period: 'Jan 2025',
  },
  {
    id: 'INV-002',
    date: '2024-12-01',
    amount: '$29.00',
    status: 'paid',
    plan: 'Professional',
    period: 'Dec 2024',
  },
  {
    id: 'INV-003',
    date: '2024-11-01',
    amount: '$29.00',
    status: 'paid',
    plan: 'Professional',
    period: 'Nov 2024',
  },
];

const usageData = {
  teamMembers: { current: 12, limit: 50 },
  projects: { current: 8, limit: null },
  storage: { current: 25, limit: 100 },
};

export const Billing = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
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

  const confirmUpgrade = () => {
    toast({
      title: 'Plan Updated',
      description: `Successfully upgraded to ${selectedPlan.name} plan.`,
    });
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
          <p className="mt-2 text-muted-foreground">Manage your subscription, billing, and usage</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Crown className="mr-2 h-4 w-4" />
          Upgrade Plan
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
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Billing History
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Usage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Current Plan */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-soft dark:from-blue-950/50 dark:to-purple-950/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-blue-600" />
                    Current Plan: Professional
                  </CardTitle>
                  <CardDescription>
                    You're on the Professional plan with full access to premium features
                  </CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">$29</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Jan 15</div>
                  <div className="text-sm text-muted-foreground">Next billing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12/50</div>
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
                <div className="text-2xl font-bold">$29.00</div>
                <p className="text-xs text-muted-foreground">+$0 from last month</p>
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
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">of 50 members</p>
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
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Unlimited available</p>
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
                <div className="text-2xl font-bold">25GB</div>
                <p className="text-xs text-muted-foreground">of 100GB available</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Recent Billing Activity</CardTitle>
              <CardDescription>Your latest billing events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Payment Successful</p>
                    <p className="text-sm text-muted-foreground">$29.00 charged on Jan 1, 2025</p>
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
                    <p className="text-sm text-muted-foreground">2 new members joined your team</p>
                  </div>
                  <Badge variant="outline">Recent</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="mt-6 space-y-6">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Choose Your Plan</h2>
            <p className="text-muted-foreground">
              Upgrade or downgrade your plan at any time. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map(plan => (
              <Card
                key={plan.name}
                className={`relative shadow-soft ${
                  plan.current ? 'ring-2 ring-blue-500' : ''
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
                {plan.current && (
                  <div className="absolute -top-2 right-4">
                    <Badge className="bg-green-600 text-white">Current Plan</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.current ? 'outline' : 'default'}
                    onClick={() => !plan.current && handleUpgrade(plan)}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade to ' + plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Download your invoices and view payment history</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
                        <Button variant="ghost" size="sm" onClick={() => downloadInvoice(invoice)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                    {usageData.teamMembers.current} of {usageData.teamMembers.limit}
                  </span>
                </div>
                <Progress
                  value={(usageData.teamMembers.current / usageData.teamMembers.limit) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {usageData.teamMembers.limit - usageData.teamMembers.current} members remaining
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
                  <span>{usageData.projects.current} projects</span>
                </div>
                <div className="py-4 text-center">
                  <Badge className="bg-blue-100 text-blue-800">Unlimited</Badge>
                </div>
                <p className="text-xs text-muted-foreground">No limit on your current plan</p>
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
                    {usageData.storage.current}GB of {usageData.storage.limit}GB
                  </span>
                </div>
                <Progress
                  value={(usageData.storage.current / usageData.storage.limit) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {usageData.storage.limit - usageData.storage.current}GB remaining
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>Your usage over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center rounded-lg bg-muted/20">
                <p className="text-muted-foreground">Usage charts would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upgrade Modal */}
      <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              Confirm your plan upgrade. You'll be charged immediately and your new features will be
              available right away.
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span>New Plan:</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Price:</span>
                  <span className="font-medium">{selectedPlan.price}/month</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpgradeModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpgrade} className="bg-gradient-primary hover:opacity-90">
              Confirm Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
