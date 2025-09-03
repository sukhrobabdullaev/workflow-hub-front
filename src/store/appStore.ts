import { create } from "zustand";

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  mentions: string[]; // User IDs mentioned in the comment
  attachments: TaskAttachment[];
  reactions: TaskReaction[];
  timestamp: Date;
  edited?: Date;
  parentId?: string; // For reply threads
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: "file" | "image" | "video" | "recording";
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TaskReaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "completed" | "on-hold";
  progress: number;
  dueDate: string;
  teamMembers: string[];
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: string;
  projectId: string;
  sprintId?: string; // Connect task to sprint
  storyPoints?: number; // For sprint velocity calculation
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: "active" | "away" | "offline";
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "completed" | "cancelled";
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  velocity: number;
  burndownData: number[];
  taskIds: string[]; // Tasks assigned to this sprint
}

interface AppState {
  projects: Project[];
  tasks: Task[];
  teamMembers: TeamMember[];
  sprints: Sprint[];
  sidebarCollapsed: boolean;
  currentProject: string | null;

  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentProject: (projectId: string | null) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task["status"]) => void;

  // Sprint Actions
  addSprint: (sprint: Omit<Sprint, "id">) => void;
  updateSprint: (id: string, data: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  startSprint: (id: string) => void;
  completeSprint: (id: string) => void;

  // Sprint-Task Connection Actions
  assignTaskToSprint: (taskId: string, sprintId: string) => void;
  removeTaskFromSprint: (taskId: string) => void;
  getSprintTasks: (sprintId: string) => Task[];
  updateSprintProgress: (sprintId: string) => void;

  // Comment Actions
  addComment: (
    taskId: string,
    comment: Omit<TaskComment, "id" | "timestamp">
  ) => void;
  updateComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  addReaction: (
    commentId: string,
    reaction: Omit<TaskReaction, "id" | "timestamp">
  ) => void;
  removeReaction: (commentId: string, userId: string, emoji: string) => void;
  addAttachment: (
    taskId: string,
    attachment: Omit<TaskAttachment, "id" | "uploadedAt">
  ) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design",
    status: "active",
    progress: 65,
    dueDate: "2025-02-15",
    teamMembers: ["1", "2", "3"],
    tasks: [],
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Native iOS and Android app for customer portal",
    status: "planning",
    progress: 25,
    dueDate: "2025-04-30",
    teamMembers: ["2", "4", "5"],
    tasks: [],
  },
  {
    id: "3",
    name: "Data Migration",
    description: "Migrate legacy data to new cloud infrastructure",
    status: "completed",
    progress: 100,
    dueDate: "2024-12-20",
    teamMembers: ["1", "6"],
    tasks: [],
  },
  {
    id: "4",
    name: "Marketing Campaign",
    description: "Q1 2025 digital marketing initiative",
    status: "active",
    progress: 40,
    dueDate: "2025-03-31",
    teamMembers: ["2", "3", "4"],
    tasks: [],
  },
  {
    id: "5",
    name: "Infrastructure Upgrade",
    description: "Server hardware and software updates",
    status: "on-hold",
    progress: 15,
    dueDate: "2025-08-15",
    teamMembers: ["1", "6"],
    tasks: [],
  },
  {
    id: "6",
    name: "Customer Portal",
    description: "Self-service customer dashboard with analytics",
    status: "planning",
    progress: 5,
    dueDate: "2025-09-30",
    teamMembers: ["4", "5", "6"],
    tasks: [],
  },
  {
    id: "7",
    name: "E-commerce Platform",
    description: "Build comprehensive online store with payment integration",
    status: "active",
    progress: 80,
    dueDate: "2025-01-31",
    teamMembers: ["1", "2", "4", "6"],
    tasks: [],
  },
  {
    id: "8",
    name: "API Documentation",
    description: "Complete technical documentation for REST APIs",
    status: "completed",
    progress: 100,
    dueDate: "2024-11-15",
    teamMembers: ["3", "5"],
    tasks: [],
  },
];

const mockTasks: Task[] = [
  // Website Redesign tasks
  {
    id: "1",
    title: "Design Homepage Mockup",
    description: "Create wireframes and visual design",
    status: "done",
    priority: "high",
    assignee: "2",
    projectId: "1",
    comments: [
      {
        id: "c1",
        taskId: "1",
        userId: "2",
        userName: "Sarah Chen",
        content:
          "Initial wireframes are complete! 🎨 Take a look and let me know your thoughts.",
        mentions: [],
        attachments: [],
        reactions: [
          {
            id: "r1",
            emoji: "👍",
            userId: "1",
            userName: "Alex Rodriguez",
            timestamp: new Date("2025-01-15T10:30:00Z"),
          },
          {
            id: "r2",
            emoji: "🎉",
            userId: "3",
            userName: "Emily Johnson",
            timestamp: new Date("2025-01-15T11:00:00Z"),
          },
        ],
        timestamp: new Date("2025-01-15T09:00:00Z"),
      },
      {
        id: "c2",
        taskId: "1",
        userId: "1",
        userName: "Alex Rodriguez",
        content:
          "Looks great! The color scheme really pops. @Sarah Chen can we adjust the hero section slightly?",
        mentions: ["2"],
        attachments: [],
        reactions: [],
        timestamp: new Date("2025-01-15T10:30:00Z"),
      },
    ],
    attachments: [
      {
        id: "a1",
        name: "homepage-mockup-v1.pdf",
        url: "/mock-files/homepage-mockup-v1.pdf",
        type: "file",
        size: 1248576,
        uploadedBy: "2",
        uploadedAt: new Date("2025-01-15T09:00:00Z"),
      },
    ],
  },
  {
    id: "2",
    title: "Implement Header Component",
    description: "Build responsive navigation header",
    status: "in-progress",
    priority: "high",
    assignee: "1",
    projectId: "1",
    comments: [
      {
        id: "c3",
        taskId: "2",
        userId: "1",
        userName: "Alex Rodriguez",
        content:
          "Working on the responsive breakpoints. Should be ready for review by EOD.",
        mentions: [],
        attachments: [],
        reactions: [],
        timestamp: new Date("2025-01-16T14:00:00Z"),
      },
    ],
  },
  {
    id: "3",
    title: "Content Management Setup",
    description: "Configure CMS for easy content updates",
    status: "todo",
    priority: "medium",
    assignee: "3",
    projectId: "1",
  },

  // Mobile App tasks
  {
    id: "4",
    title: "User Authentication Flow",
    description: "Implement login and registration",
    status: "todo",
    priority: "high",
    assignee: "4",
    projectId: "2",
  },
  {
    id: "5",
    title: "API Integration",
    description: "Connect app to backend services",
    status: "todo",
    priority: "medium",
    assignee: "5",
    projectId: "2",
  },

  // Data Migration tasks
  {
    id: "6",
    title: "Database Schema Design",
    description: "Plan new database structure",
    status: "done",
    priority: "high",
    assignee: "1",
    projectId: "3",
  },
  {
    id: "7",
    title: "Data Validation",
    description: "Verify migrated data integrity",
    status: "done",
    priority: "medium",
    assignee: "6",
    projectId: "3",
  },
];

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@workflowhub.com",
    role: "Lead Developer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@workflowhub.com",
    role: "UI/UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@workflowhub.com",
    role: "Frontend Developer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "away",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@workflowhub.com",
    role: "Mobile Developer",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    status: "active",
  },
  {
    id: "5",
    name: "Alex Rodriguez",
    email: "alex@workflowhub.com",
    role: "Backend Developer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    status: "offline",
  },
  {
    id: "6",
    name: "Lisa Wong",
    email: "lisa@workflowhub.com",
    role: "DevOps Engineer",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    status: "active",
  },
];

const mockSprints: Sprint[] = [
  {
    id: "1",
    name: "Sprint 2.3",
    goal: "Complete user authentication and implement task commenting system",
    startDate: "2025-01-20",
    endDate: "2025-02-03",
    status: "active",
    projectId: "1",
    totalTasks: 18,
    completedTasks: 12,
    inProgressTasks: 4,
    todoTasks: 2,
    velocity: 8.5,
    burndownData: [18, 16, 14, 12, 10, 8, 6, 4, 2, 0],
    taskIds: [],
  },
  {
    id: "2",
    name: "Sprint 2.2",
    goal: "Kanban board enhancements and team collaboration features",
    startDate: "2025-01-06",
    endDate: "2025-01-19",
    status: "completed",
    projectId: "1",
    totalTasks: 15,
    completedTasks: 15,
    inProgressTasks: 0,
    todoTasks: 0,
    velocity: 9.2,
    burndownData: [15, 13, 11, 9, 7, 5, 3, 1, 0],
    taskIds: [],
  },
  {
    id: "3",
    name: "Sprint 2.4",
    goal: "Analytics dashboard and reporting features",
    startDate: "2025-02-04",
    endDate: "2025-02-17",
    status: "planning",
    projectId: "1",
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    velocity: 0,
    burndownData: [],
    taskIds: [],
  },
];

export const useAppStore = create<AppState>((set) => ({
  projects: mockProjects,
  tasks: mockTasks,
  teamMembers: mockTeamMembers,
  sprints: mockSprints,
  sidebarCollapsed: false,
  currentProject: null,

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setCurrentProject: (projectId) => set({ currentProject: projectId }),

  addProject: (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      tasks: [],
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
  },

  updateProject: (id, data) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      tasks: state.tasks.filter((t) => t.projectId !== id),
    }));
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTask: (id, data) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  moveTask: (taskId, newStatus) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    }));
  },

  // Comment Management
  addComment: (taskId, commentData) => {
    const newComment: TaskComment = {
      ...commentData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, comments: [...(t.comments || []), newComment] }
          : t
      ),
    }));
  },

  updateComment: (commentId, content) => {
    set((state) => ({
      tasks: state.tasks.map((t) => ({
        ...t,
        comments: t.comments?.map((c) =>
          c.id === commentId ? { ...c, content, edited: new Date() } : c
        ),
      })),
    }));
  },

  deleteComment: (commentId) => {
    set((state) => ({
      tasks: state.tasks.map((t) => ({
        ...t,
        comments: t.comments?.filter((c) => c.id !== commentId),
      })),
    }));
  },

  addReaction: (commentId, reactionData) => {
    const newReaction: TaskReaction = {
      ...reactionData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    set((state) => ({
      tasks: state.tasks.map((t) => ({
        ...t,
        comments: t.comments?.map((c) => {
          if (c.id === commentId) {
            // Remove existing reaction from same user with same emoji
            const filteredReactions = c.reactions.filter(
              (r) =>
                !(
                  r.userId === reactionData.userId &&
                  r.emoji === reactionData.emoji
                )
            );
            return { ...c, reactions: [...filteredReactions, newReaction] };
          }
          return c;
        }),
      })),
    }));
  },

  removeReaction: (commentId, userId, emoji) => {
    set((state) => ({
      tasks: state.tasks.map((t) => ({
        ...t,
        comments: t.comments?.map((c) =>
          c.id === commentId
            ? {
                ...c,
                reactions: c.reactions.filter(
                  (r) => !(r.userId === userId && r.emoji === emoji)
                ),
              }
            : c
        ),
      })),
    }));
  },

  addAttachment: (taskId, attachmentData) => {
    const newAttachment: TaskAttachment = {
      ...attachmentData,
      id: Date.now().toString(),
      uploadedAt: new Date(),
    };

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, attachments: [...(t.attachments || []), newAttachment] }
          : t
      ),
    }));
  },

  removeAttachment: (taskId, attachmentId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              attachments: t.attachments?.filter((a) => a.id !== attachmentId),
            }
          : t
      ),
    }));
  },

  // Sprint Actions
  addSprint: (sprintData) => {
    const newSprint: Sprint = {
      ...sprintData,
      id: Date.now().toString(),
    };
    set((state) => ({ sprints: [...state.sprints, newSprint] }));
  },

  updateSprint: (id, data) => {
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
  },

  deleteSprint: (id) => {
    set((state) => ({
      sprints: state.sprints.filter((s) => s.id !== id),
    }));
  },

  startSprint: (id) => {
    set((state) => ({
      sprints: state.sprints.map((s) =>
        s.id === id ? { ...s, status: "active" as const } : s
      ),
    }));
  },

  completeSprint: (id) => {
    set((state) => ({
      sprints: state.sprints.map((s) =>
        s.id === id ? { ...s, status: "completed" as const } : s
      ),
    }));
  },

  // Sprint-Task Connection Actions
  assignTaskToSprint: (taskId, sprintId) => {
    set((state) => {
      const updatedTasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, sprintId } : t
      );
      return { tasks: updatedTasks };
    });
  },

  removeTaskFromSprint: (taskId) => {
    set((state) => {
      const updatedTasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, sprintId: undefined } : t
      );
      return { tasks: updatedTasks };
    });
  },

  getSprintTasks: (sprintId) => {
    const state = useAppStore.getState();
    return state.tasks.filter((task) => task.sprintId === sprintId);
  },

  updateSprintProgress: (sprintId) => {
    set((state) => {
      const sprintTasks = state.tasks.filter(
        (task) => task.sprintId === sprintId
      );
      const totalTasks = sprintTasks.length;
      const completedTasks = sprintTasks.filter(
        (task) => task.status === "done"
      ).length;
      const inProgressTasks = sprintTasks.filter(
        (task) => task.status === "in-progress"
      ).length;
      const todoTasks = sprintTasks.filter(
        (task) => task.status === "todo"
      ).length;

      const updatedSprints = state.sprints.map((sprint) =>
        sprint.id === sprintId
          ? {
              ...sprint,
              totalTasks,
              completedTasks,
              inProgressTasks,
              todoTasks,
              taskIds: sprintTasks.map((task) => task.id),
            }
          : sprint
      );

      return { sprints: updatedSprints };
    });
  },
}));
