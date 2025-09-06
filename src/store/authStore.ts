import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member';
  plan: 'free' | 'professional' | 'enterprise';
  planLimits?: {
    maxProjects: number;
    maxTeamMembers: number;
    storageGB: number;
    aiFeatures: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
  };
  companyName?: string;
  companySize?: string;
  industry?: string;
  goals?: string[];
  twoFactorEnabled?: boolean;
  onboardingCompleted?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  socialAuth: (provider: string, userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  completeOnboarding: (data: Partial<User>) => void;
  enableTwoFactor: () => void;
}

// Helper function to get plan limits
const getPlanLimits = (plan: 'free' | 'professional' | 'enterprise') => {
  switch (plan) {
    case 'free':
      return {
        maxProjects: 3,
        maxTeamMembers: 5,
        storageGB: 0.01, // 10MB
        aiFeatures: false,
        advancedAnalytics: false,
        prioritySupport: false,
      };
    case 'professional':
      return {
        maxProjects: -1, // unlimited
        maxTeamMembers: -1, // unlimited
        storageGB: 1, // 1GB per user
        aiFeatures: true,
        advancedAnalytics: true,
        prioritySupport: true,
      };
    case 'enterprise':
      return {
        maxProjects: -1, // unlimited
        maxTeamMembers: -1, // unlimited
        storageGB: -1, // unlimited
        aiFeatures: true,
        advancedAnalytics: true,
        prioritySupport: true,
      };
  }
};

// Mock user data for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@workflowhub.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    plan: 'enterprise',
    planLimits: getPlanLimits('enterprise'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@workflowhub.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'manager',
    plan: 'professional',
    planLimits: getPlanLimits('professional'),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication - in real app, this would call an API
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'password') {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: async (name: string, email: string, password: string) => {
        // Mock registration - TODO: Replace with API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // eslint-disable-next-line no-console
        console.log('Registration with password:', password);

        const plan = 'free';
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role: 'member',
          plan,
          planLimits: getPlanLimits(plan),
          twoFactorEnabled: false,
          onboardingCompleted: false,
        };

        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      socialAuth: async (provider: string, userData: Partial<User>) => {
        // Mock social authentication
        await new Promise(resolve => setTimeout(resolve, 1000));

        const plan = 'free';
        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name || `${provider} User`,
          email: userData.email || `user@${provider}.com`,
          avatar: userData.avatar,
          role: 'member',
          plan,
          planLimits: getPlanLimits(plan),
          twoFactorEnabled: false,
          onboardingCompleted: false,
        };

        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      completeOnboarding: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...data,
              onboardingCompleted: true,
            },
          });
        }
      },

      enableTwoFactor: () => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              twoFactorEnabled: true,
            },
          });
        }
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data } });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
