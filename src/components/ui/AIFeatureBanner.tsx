import { UpgradeDialog } from '@/components/modals/UpgradeDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { AlertCircle, Crown, Sparkles } from 'lucide-react';
import { useState } from 'react';

export const AIFeatureBanner = () => {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { getCurrentPlan, usage } = useSubscriptionStore();

  const currentPlan = getCurrentPlan();

  // Only show for free plan users
  if (currentPlan.id !== 'free') {
    return null;
  }

  const aiUsagePercentage = (usage.aiRequestsThisMonth / 10) * 100;
  const remainingRequests = 10 - usage.aiRequestsThisMonth;

  if (remainingRequests > 5) {
    return null; // Don't show banner unless close to limit
  }

  return (
    <>
      <Card
        className={`border ${remainingRequests === 0 ? 'border-destructive/50 bg-destructive/5' : 'border-orange-200 bg-orange-50 dark:bg-orange-950/20'}`}
      >
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${remainingRequests === 0 ? 'bg-destructive/10' : 'bg-orange-100 dark:bg-orange-900/30'}`}
            >
              {remainingRequests === 0 ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : (
                <Sparkles
                  className={`h-5 w-5 ${remainingRequests === 0 ? 'text-destructive' : 'text-orange-600'}`}
                />
              )}
            </div>
            <div className="flex-1">
              <h3
                className={`font-medium ${remainingRequests === 0 ? 'text-destructive' : 'text-orange-800 dark:text-orange-200'}`}
              >
                {remainingRequests === 0 ? 'AI Requests Limit Reached' : 'AI Requests Running Low'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {remainingRequests === 0
                  ? "You've used all 10 AI requests for this month. Upgrade to Professional for unlimited AI features."
                  : `You have ${remainingRequests} AI requests remaining this month. Upgrade for unlimited access.`}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1">
                  <div className="mb-1 text-xs text-muted-foreground">
                    {usage.aiRequestsThisMonth} / 10 used ({aiUsagePercentage.toFixed(0)}%)
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all duration-300 ${
                        remainingRequests === 0 ? 'bg-destructive' : 'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min(aiUsagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowUpgradeDialog(true)}
                  className={
                    remainingRequests === 0
                      ? 'bg-destructive hover:bg-destructive/90'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }
                >
                  <Crown className="mr-1 h-3 w-3" />
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        feature="AI Features"
        title="Unlock Unlimited AI Power"
        description="Upgrade to Professional for unlimited AI requests, advanced AI features, and priority processing."
      />
    </>
  );
};
