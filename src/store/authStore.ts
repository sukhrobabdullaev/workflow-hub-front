import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  // Workspace memberships
  workspaces: WorkspaceMembership[];
  currentWorkspaceId?: string;
}

interface WorkspaceMembership {
  workspaceId: string;
  workspaceName: string;
  role: 'admin' | 'manager' | 'member';
  isOwner: boolean; // True if this user created/owns the workspace
  joinedAt: string;
  invitedBy?: string; // User ID who invited them (if not owner)
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
  switchWorkspace: (workspaceId: string) => void;
  joinWorkspace: (
    workspaceId: string,
    role: 'admin' | 'manager' | 'member',
    invitedBy?: string
  ) => void;
  getCurrentWorkspace: () => WorkspaceMembership | null;
  getCurrentRole: () => 'admin' | 'manager' | 'member' | null;
  isWorkspaceOwner: () => boolean;
  // Testing function to add workspace
  addTestWorkspace: () => void;
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

// Mock user data for demo - updated for multi-workspace
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@workflowhub.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    plan: 'enterprise',
    planLimits: getPlanLimits('enterprise'),
    workspaces: [
      {
        workspaceId: 'ws-1',
        workspaceName: "John's Company",
        role: 'admin',
        isOwner: true,
        joinedAt: '2024-01-01',
      },
      {
        workspaceId: 'ws-3',
        workspaceName: 'Tech Startup Inc',
        role: 'manager',
        isOwner: false,
        joinedAt: '2024-06-01',
        invitedBy: '3',
      },
    ],
    currentWorkspaceId: 'ws-1',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@workflowhub.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    plan: 'professional',
    planLimits: getPlanLimits('professional'),
    workspaces: [
      {
        workspaceId: 'ws-2',
        workspaceName: "Sarah's Agency",
        role: 'admin',
        isOwner: true,
        joinedAt: '2024-02-01',
      },
      {
        workspaceId: 'ws-1',
        workspaceName: "John's Company",
        role: 'manager',
        isOwner: false,
        joinedAt: '2024-03-01',
        invitedBy: '1',
      },
    ],
    currentWorkspaceId: 'ws-2',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@techstartup.com',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    plan: 'professional',
    planLimits: getPlanLimits('professional'),
    workspaces: [
      {
        workspaceId: 'ws-3',
        workspaceName: 'Tech Startup Inc',
        role: 'admin',
        isOwner: true,
        joinedAt: '2024-05-01',
      },
    ],
    currentWorkspaceId: 'ws-3',
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
        // Mock registration - creates new workspace for the user
        await new Promise(resolve => setTimeout(resolve, 1000));
        // eslint-disable-next-line no-console
        console.log('Registration with password:', password);

        const plan = 'free';
        const userId = Date.now().toString();
        const workspaceId = `ws-${userId}`;

        const newUser: User = {
          id: userId,
          name,
          email,
          plan,
          planLimits: getPlanLimits(plan),
          twoFactorEnabled: false,
          onboardingCompleted: false,
          workspaces: [
            {
              workspaceId,
              workspaceName: `${name}'s Workspace`,
              role: 'admin',
              isOwner: true,
              joinedAt: new Date().toISOString(),
            },
          ],
          currentWorkspaceId: workspaceId,
        };

        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      socialAuth: async (provider: string, userData: Partial<User>) => {
        // Mock social authentication - creates new workspace for the user
        await new Promise(resolve => setTimeout(resolve, 1000));

        const plan = 'free';
        const userId = Date.now().toString();
        const workspaceId = `ws-${userId}`;
        const userName = userData.name || `${provider} User`;

        const newUser: User = {
          id: userId,
          name: userName,
          email: userData.email || `user@${provider}.com`,
          avatar: userData.avatar,
          plan,
          planLimits: getPlanLimits(plan),
          twoFactorEnabled: false,
          onboardingCompleted: false,
          workspaces: [
            {
              workspaceId,
              workspaceName: `${userName}'s Workspace`,
              role: 'admin',
              isOwner: true,
              joinedAt: new Date().toISOString(),
            },
          ],
          currentWorkspaceId: workspaceId,
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
          // Update workspace name with company name if provided
          const updatedWorkspaces = user.workspaces.map(ws =>
            ws.workspaceId === user.currentWorkspaceId && ws.isOwner
              ? { ...ws, workspaceName: data.companyName || ws.workspaceName }
              : ws
          );

          set({
            user: {
              ...user,
              ...data,
              onboardingCompleted: true,
              workspaces: updatedWorkspaces,
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

      switchWorkspace: (workspaceId: string) => {
        const { user } = get();
        if (user && user.workspaces.some(ws => ws.workspaceId === workspaceId)) {
          set({
            user: {
              ...user,
              currentWorkspaceId: workspaceId,
            },
          });
        }
      },

      joinWorkspace: (
        workspaceId: string,
        role: 'admin' | 'manager' | 'member',
        invitedBy?: string
      ) => {
        const { user } = get();
        if (user) {
          // Check if user is already in this workspace
          const existingMembership = user.workspaces.find(ws => ws.workspaceId === workspaceId);

          if (!existingMembership) {
            const newWorkspace: WorkspaceMembership = {
              workspaceId,
              workspaceName: 'Invited Workspace', // Would be fetched from API in real app
              role,
              isOwner: false,
              joinedAt: new Date().toISOString(),
              invitedBy,
            };

            set({
              user: {
                ...user,
                workspaces: [...user.workspaces, newWorkspace],
                currentWorkspaceId: workspaceId, // Switch to the new workspace
              },
            });
          }
        }
      },

      getCurrentWorkspace: () => {
        const { user } = get();
        if (!user || !user.currentWorkspaceId) return null;
        return user.workspaces.find(ws => ws.workspaceId === user.currentWorkspaceId) || null;
      },

      getCurrentRole: () => {
        const { getCurrentWorkspace } = get();
        const currentWorkspace = getCurrentWorkspace();
        return currentWorkspace?.role || null;
      },

      isWorkspaceOwner: () => {
        const { getCurrentWorkspace } = get();
        const currentWorkspace = getCurrentWorkspace();
        return currentWorkspace?.isOwner || false;
      },

      // Testing function to add workspace to current user
      addTestWorkspace: () => {
        const { user } = get();
        if (user) {
          const newWorkspace = {
            workspaceId: 'ws-test-' + Date.now(),
            workspaceName: 'Test Workspace',
            role: 'manager' as const,
            isOwner: false,
            joinedAt: new Date().toISOString(),
            invitedBy: 'system',
          };

          set({
            user: {
              ...user,
              workspaces: [...user.workspaces, newWorkspace],
            },
          });

          console.log('Added test workspace:', newWorkspace);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
