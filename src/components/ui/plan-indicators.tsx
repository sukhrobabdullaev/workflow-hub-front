import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { AlertCircle, Crown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { UpgradeDialog } from '../modals/UpgradeDialog';

interface PlanLimitIndicatorProps {
  feature: 'projects' | 'teamMembers' | 'storage';
  className?: string;
  showUpgradeButton?: boolean;
}

export const PlanLimitIndicator = ({
  feature,
  className = '',
  showUpgradeButton = true,
}: PlanLimitIndicatorProps) => {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { getCurrentPlan, getUsagePercentage, getRemainingLimit, usage } = useSubscriptionStore();

  const currentPlan = getCurrentPlan();
  const usagePercentage = getUsagePercentage(feature);
  const remaining = getRemainingLimit(feature as 'maxProjects' | 'maxTeamMembers');

  const getFeatureLabel = () => {
    switch (feature) {
      case 'projects':
        return 'Projects';
      case 'teamMembers':
        return 'Team Members';
      case 'storage':
        return 'Storage';
      default:
        return '';
    }
  };

  const getCurrentUsage = () => {
    switch (feature) {
      case 'projects':
        return usage.projects;
      case 'teamMembers':
        return usage.teamMembers;
      case 'storage':
        return `${(usage.storageUsedMB / 1024).toFixed(1)}GB`;
      default:
        return 0;
    }
  };

  const getMaxLimit = () => {
    switch (feature) {
      case 'projects':
        return currentPlan.limits.maxProjects;
      case 'teamMembers':
        return currentPlan.limits.maxTeamMembers;
      case 'storage':
        return `${currentPlan.limits.storageGB}GB`;
      default:
        return 0;
    }
  };

  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usagePercentage >= 100;

  if (currentPlan.id !== 'free') {
    return null; // Don't show limits for paid plans
  }

  return (
    <>
      <div className={`rounded-lg border bg-card p-3 ${className}`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{getFeatureLabel()}</span>
            {isAtLimit && <AlertCircle className="h-4 w-4 text-destructive" />}
          </div>
          <Badge variant={isAtLimit ? 'destructive' : 'secondary'}>
            {getCurrentUsage()} / {getMaxLimit()}
          </Badge>
        </div>

        <Progress
          value={usagePercentage}
          className={`mb-2 ${
            isAtLimit
              ? '[&>div]:bg-destructive'
              : isNearLimit
                ? '[&>div]:bg-orange-500'
                : '[&>div]:bg-primary'
          }`}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {isAtLimit
              ? 'Limit reached'
              : isNearLimit
                ? `${remaining} remaining`
                : `${remaining} remaining`}
          </span>

          {showUpgradeButton && isNearLimit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUpgradeDialog(true)}
              className="h-6 px-2 text-xs"
            >
              <Crown className="mr-1 h-3 w-3" />
              Upgrade
            </Button>
          )}
        </div>
      </div>

      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        feature={getFeatureLabel()}
        title={`You're ${isAtLimit ? 'at' : 'approaching'} your ${getFeatureLabel().toLowerCase()} limit`}
        description={`Upgrade to Professional to get unlimited ${getFeatureLabel().toLowerCase()} and unlock advanced features.`}
      />
    </>
  );
};

interface FreePlanBannerProps {
  className?: string;
}

export const FreePlanBanner = ({ className = '' }: FreePlanBannerProps) => {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { getCurrentPlan } = useSubscriptionStore();

  const currentPlan = getCurrentPlan();

  if (currentPlan.id !== 'free') {
    return null;
  }

  return (
    <>
      <div
        className={`rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10 p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">You&apos;re on the Free plan</h3>
              <p className="text-sm text-muted-foreground">
                Upgrade to unlock unlimited projects, AI features, and more
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowUpgradeDialog(true)}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade
          </Button>
        </div>
      </div>

      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        title="Unlock the Full Power of WorkflowHub"
        description="Upgrade to Professional and remove all limits while gaining access to advanced AI features."
      />
    </>
  );
};
