import { UpgradeDialog } from '@/components/modals/UpgradeDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FreePlanBanner, PlanLimitIndicator } from '@/components/ui/plan-indicators';
import { useAIFeatures } from '@/hooks/useAIFeatures';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import {
  AlertCircle,
  Crown,
  Database,
  FolderOpen,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export const FreePlanDemo = () => {
  const [showFeatureUpgrade, setShowFeatureUpgrade] = useState(false);
  const { usage, checkLimit } = useSubscriptionStore();
  const { canUseAI, getRemainingAIRequests, showUpgradeDialog, setShowUpgradeDialog } =
    useAIFeatures();

  const handleFeatureClick = () => {
    if (!checkLimit('advancedAnalytics')) {
      setShowFeatureUpgrade(true);
    }
  };

  const handleAIFeatureClick = () => {
    if (!canUseAI) {
      setShowUpgradeDialog(true);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold">WorkflowHub Free Plan Demo</h1>
        <p className="text-muted-foreground">
          Experience how free plan limitations and upgrade prompts work in the app
        </p>
      </div>

      {/* Free Plan Banner */}
      <FreePlanBanner />

      {/* Plan Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Current Usage Overview
          </CardTitle>
          <CardDescription>Track your usage across different plan limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <PlanLimitIndicator feature="projects" />
            <PlanLimitIndicator feature="teamMembers" />
            <PlanLimitIndicator feature="storage" />
          </div>

          {/* AI Usage Indicator */}
          <div className="rounded-lg border bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI Features</span>
                {!canUseAI && <AlertCircle className="h-4 w-4 text-destructive" />}
              </div>
              <Badge variant={canUseAI ? 'secondary' : 'destructive'}>
                {usage.aiRequestsThisMonth} / 10 used
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {canUseAI ? `${getRemainingAIRequests()} remaining this month` : 'Limit reached'}
              </span>
              {!canUseAI && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAIFeatureClick}
                  className="h-6 px-2 text-xs"
                >
                  <Crown className="mr-1 h-3 w-3" />
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Access Demo */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Available Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">✅ Available in Free Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
              <FolderOpen className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Basic Projects</div>
                <div className="text-sm text-muted-foreground">Up to 3 projects</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Team Collaboration</div>
                <div className="text-sm text-muted-foreground">Up to 5 team members</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
              <Sparkles className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Basic AI Features</div>
                <div className="text-sm text-muted-foreground">10 requests per month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">🔒 Premium Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="h-auto w-full justify-start p-3"
              onClick={handleFeatureClick}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-orange-600" />
                  <Crown className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Advanced Analytics</div>
                  <div className="text-sm text-muted-foreground">Professional plan required</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto w-full justify-start p-3"
              onClick={handleAIFeatureClick}
              disabled={canUseAI}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-600" />
                  <Crown className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Unlimited AI Features</div>
                  <div className="text-sm text-muted-foreground">
                    {canUseAI ? `${getRemainingAIRequests()} requests remaining` : 'Limit reached'}
                  </div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Dialogs */}
      <UpgradeDialog
        open={showFeatureUpgrade}
        onOpenChange={setShowFeatureUpgrade}
        feature="Advanced Analytics"
        title="Premium Feature"
        description="Advanced analytics and reporting features are available in our Professional plan."
      />

      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        feature="AI Features"
        title="AI Request Limit Reached"
        description="You've used all 10 AI requests for this month. Upgrade to Professional for unlimited AI features."
      />
    </div>
  );
};
