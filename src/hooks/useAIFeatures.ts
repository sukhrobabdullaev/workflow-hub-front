import { useToast } from '@/hooks/use-toast';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useState } from 'react';

export const useAIFeatures = () => {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { getCurrentPlan, usage, incrementUsage } = useSubscriptionStore();
  const { toast } = useToast();

  const currentPlan = getCurrentPlan();

  const checkAIUsage = (): boolean => {
    // For free plan, limit AI requests to 10 per month
    if (currentPlan.id === 'free') {
      if (usage.aiRequestsThisMonth >= 10) {
        setShowUpgradeDialog(true);
        return false;
      }
    }

    return true;
  };

  const useAIFeature = (): boolean => {
    if (!checkAIUsage()) {
      return false;
    }

    // For free plan, increment AI usage
    if (currentPlan.id === 'free') {
      incrementUsage('aiRequestsThisMonth');

      // Show warning when approaching limit
      const remaining = 10 - (usage.aiRequestsThisMonth + 1);
      if (remaining <= 2 && remaining > 0) {
        toast({
          title: 'AI Usage Warning',
          description: `You have ${remaining} AI requests remaining this month. Upgrade to Professional for unlimited AI features.`,
          variant: 'default',
        });
      }
    }

    return true;
  };

  const getRemainingAIRequests = (): number => {
    if (currentPlan.id === 'free') {
      return Math.max(0, 10 - usage.aiRequestsThisMonth);
    }
    return Infinity;
  };

  return {
    canUseAI: currentPlan.id !== 'free' || usage.aiRequestsThisMonth < 10,
    useAIFeature,
    getRemainingAIRequests,
    showUpgradeDialog,
    setShowUpgradeDialog,
    showUpgradePrompt: () => setShowUpgradeDialog(true),
  };
};
