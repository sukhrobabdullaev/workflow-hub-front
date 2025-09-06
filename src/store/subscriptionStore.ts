import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number;
  description?: string;
}

export interface Plan {
  id: 'free' | 'professional' | 'enterprise';
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: PlanFeature[];
  limits: {
    maxProjects: number;
    maxTeamMembers: number;
    storageGB: number;
    aiFeatures: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customIntegrations: boolean;
    ssoEnabled: boolean;
    apiAccess: boolean;
  };
  popular?: boolean;
}

export interface Usage {
  projects: number;
  teamMembers: number;
  storageUsedMB: number;
  aiRequestsThisMonth: number;
}

interface SubscriptionState {
  currentPlan: Plan['id'];
  usage: Usage;
  trialEndsAt: Date | null;
  isTrialActive: boolean;
  plans: Plan[];
  upgradeDialog: boolean;
  setUpgradeDialog: (open: boolean) => void;
  upgradeTo: (planId: Plan['id']) => Promise<boolean>;
  getCurrentPlan: () => Plan;
  checkLimit: (feature: keyof Plan['limits']) => boolean;
  getRemainingLimit: (feature: 'maxProjects' | 'maxTeamMembers') => number;
  getUsagePercentage: (feature: 'projects' | 'teamMembers' | 'storage') => number;
  incrementUsage: (feature: keyof Usage, amount?: number) => void;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    description: 'Perfect for small teams getting started',
    features: [
      { name: 'Up to 5 team members', included: true, limit: 5 },
      { name: 'Up to 3 projects', included: true, limit: 3 },
      { name: 'Basic task management', included: true },
      { name: 'Simple kanban boards', included: true },
      { name: 'Basic AI suggestions', included: true, description: '10 per month' },
      { name: 'Email support', included: true },
      { name: '10MB storage', included: true, limit: 10 },
      { name: 'Mobile app access', included: true },
      { name: 'Real-time collaboration', included: false },
      { name: 'Advanced AI features', included: false },
      { name: 'Video recording', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'Priority support', included: false },
      { name: 'API access', included: false },
    ],
    limits: {
      maxProjects: 3,
      maxTeamMembers: 5,
      storageGB: 0.01, // 10MB
      aiFeatures: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customIntegrations: false,
      ssoEnabled: false,
      apiAccess: false,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 8,
    yearlyPrice: 6,
    description: 'AI-powered features for growing teams',
    features: [
      { name: 'Everything in Free', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'Unlimited projects', included: true },
      { name: 'Advanced kanban boards', included: true },
      { name: 'AI Project Assistant', included: true },
      { name: 'Smart task prioritization', included: true },
      { name: 'AI-powered time estimation', included: true },
      { name: 'Automated reporting', included: true },
      { name: 'Real-time team chat', included: true },
      { name: 'Video recording', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Time tracking', included: true },
      { name: '1GB storage per user', included: true },
      { name: 'Priority support', included: true },
      { name: 'API access', included: true },
    ],
    limits: {
      maxProjects: -1, // unlimited
      maxTeamMembers: -1, // unlimited
      storageGB: 1, // 1GB per user
      aiFeatures: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customIntegrations: true,
      ssoEnabled: false,
      apiAccess: true,
    },
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 18,
    yearlyPrice: 15,
    description: 'Full AI suite for large organizations',
    features: [
      { name: 'Everything in Professional', included: true },
      { name: 'Advanced AI insights & predictions', included: true },
      { name: 'Burnout prevention AI', included: true },
      { name: 'Custom AI models', included: true },
      { name: 'AI meeting transcription', included: true },
      { name: 'Smart code review', included: true },
      { name: 'Auto-documentation generation', included: true },
      { name: 'Advanced security & compliance', included: true },
      { name: 'Single Sign-On (SSO)', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'White-label options', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Unlimited storage', included: true },
      { name: '24/7 phone support', included: true },
      { name: 'SLA guarantee', included: true },
    ],
    limits: {
      maxProjects: -1, // unlimited
      maxTeamMembers: -1, // unlimited
      storageGB: -1, // unlimited
      aiFeatures: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customIntegrations: true,
      ssoEnabled: true,
      apiAccess: true,
    },
  },
];

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      currentPlan: 'free',
      usage: {
        projects: 1,
        teamMembers: 1,
        storageUsedMB: 5,
        aiRequestsThisMonth: 3,
      },
      trialEndsAt: null,
      isTrialActive: false,
      plans,
      upgradeDialog: false,

      setUpgradeDialog: (open: boolean) => {
        set({ upgradeDialog: open });
      },

      upgradeTo: async (planId: Plan['id']) => {
        // Mock upgrade process
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real app, this would handle payment processing
        set({
          currentPlan: planId,
          upgradeDialog: false,
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          isTrialActive: planId !== 'free',
        });

        return true;
      },

      getCurrentPlan: () => {
        const { currentPlan } = get();
        return plans.find(plan => plan.id === currentPlan) || plans[0];
      },

      checkLimit: (feature: keyof Plan['limits']) => {
        const { currentPlan, usage } = get();
        const plan = plans.find(p => p.id === currentPlan) || plans[0];

        switch (feature) {
          case 'maxProjects':
            return plan.limits.maxProjects === -1 || usage.projects < plan.limits.maxProjects;
          case 'maxTeamMembers':
            return (
              plan.limits.maxTeamMembers === -1 || usage.teamMembers < plan.limits.maxTeamMembers
            );
          case 'aiFeatures':
            if (!plan.limits.aiFeatures) return false;
            return currentPlan === 'free' ? usage.aiRequestsThisMonth < 10 : true;
          default:
            return plan.limits[feature] === true;
        }
      },

      getRemainingLimit: (feature: 'maxProjects' | 'maxTeamMembers') => {
        const { currentPlan, usage } = get();
        const plan = plans.find(p => p.id === currentPlan) || plans[0];

        if (plan.limits[feature] === -1) return -1; // unlimited

        switch (feature) {
          case 'maxProjects':
            return Math.max(0, plan.limits.maxProjects - usage.projects);
          case 'maxTeamMembers':
            return Math.max(0, plan.limits.maxTeamMembers - usage.teamMembers);
          default:
            return 0;
        }
      },

      getUsagePercentage: (feature: 'projects' | 'teamMembers' | 'storage') => {
        const { currentPlan, usage } = get();
        const plan = plans.find(p => p.id === currentPlan) || plans[0];

        switch (feature) {
          case 'projects':
            if (plan.limits.maxProjects === -1) return 0;
            return (usage.projects / plan.limits.maxProjects) * 100;
          case 'teamMembers':
            if (plan.limits.maxTeamMembers === -1) return 0;
            return (usage.teamMembers / plan.limits.maxTeamMembers) * 100;
          case 'storage': {
            if (plan.limits.storageGB === -1) return 0;
            const storageLimitMB = plan.limits.storageGB * 1024;
            return (usage.storageUsedMB / storageLimitMB) * 100;
          }
          default:
            return 0;
        }
      },

      incrementUsage: (feature: keyof Usage, amount = 1) => {
        set(state => ({
          usage: {
            ...state.usage,
            [feature]: state.usage[feature] + amount,
          },
        }));
      },
    }),
    {
      name: 'subscription-storage',
    }
  )
);

// Helper hooks for common usage patterns
export const usePlanLimits = () => {
  const { getCurrentPlan, checkLimit, getRemainingLimit, getUsagePercentage } =
    useSubscriptionStore();
  const currentPlan = getCurrentPlan();

  return {
    plan: currentPlan,
    canCreateProject: checkLimit('maxProjects'),
    canAddTeamMember: checkLimit('maxTeamMembers'),
    hasAIFeatures: checkLimit('aiFeatures'),
    hasAdvancedAnalytics: checkLimit('advancedAnalytics'),
    hasPrioritySupport: checkLimit('prioritySupport'),
    remainingProjects: getRemainingLimit('maxProjects'),
    remainingTeamMembers: getRemainingLimit('maxTeamMembers'),
    projectsUsagePercentage: getUsagePercentage('projects'),
    teamMembersUsagePercentage: getUsagePercentage('teamMembers'),
    storageUsagePercentage: getUsagePercentage('storage'),
  };
};
