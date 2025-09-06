import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { CheckCircle, Crown, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
  title?: string;
  description?: string;
}

export const UpgradeDialog = ({
  open,
  onOpenChange,
  feature,
  title = 'Upgrade to Unlock This Feature',
  description = 'Get access to advanced features and remove limits with our Professional plan.',
}: UpgradeDialogProps) => {
  const navigate = useNavigate();
  const { plans, currentPlan } = useSubscriptionStore();

  const professionalPlan = plans.find(p => p.id === 'professional');
  const currentPlanData = plans.find(p => p.id === currentPlan);

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate('/billing');
  };

  const getFeatureIcon = (featureName: string) => {
    if (featureName.toLowerCase().includes('ai')) return <Sparkles className="h-4 w-4" />;
    if (featureName.toLowerCase().includes('member')) return <Crown className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-left">{title}</DialogTitle>
              <DialogDescription className="text-left">{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Plan Limitations */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium">Current Plan: {currentPlanData?.name}</h4>
              <Badge variant="secondary">{currentPlan === 'free' ? 'Free' : 'Paid'}</Badge>
            </div>
            {feature && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getFeatureIcon(feature)}
                <span>Limited: {feature}</span>
              </div>
            )}
          </div>

          {/* Professional Plan Benefits */}
          {professionalPlan && (
            <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium">Professional Plan</h4>
                <div className="text-right">
                  <div className="text-lg font-bold">${professionalPlan.price}/mo</div>
                  <div className="text-xs text-muted-foreground">
                    or ${professionalPlan.yearlyPrice}/mo yearly
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  'Unlimited projects & team members',
                  'Advanced AI features',
                  'Video recording & screen sharing',
                  'Advanced analytics & reporting',
                  'Priority support',
                  'API access',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trial Information */}
          <div className="text-center text-sm text-muted-foreground">
            🎉 Start with a 14-day free trial • Cancel anytime
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} className="bg-gradient-to-r from-primary to-primary/80">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
