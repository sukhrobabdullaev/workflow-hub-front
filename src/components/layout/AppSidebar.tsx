import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuthStore } from '@/store/authStore';

// Navigation menu items organized by sections with clear connections to pages
const getNavigationSections = (userRole: string) => [
  {
    label: 'Main',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: 'dashboard',
        description: 'Overview and quick actions'
      },
      {
        title: 'Projects',
        url: '/projects',
        icon: 'folders',
        description: 'Manage all projects'
      },
      {
        title: 'Kanban Board',
        url: '/project-management',
        icon: 'kanban',
        description: 'Task management board'
      },
    ]
  },
  {
    label: 'Agile & Team',
    items: [
      {
        title: 'Team',
        url: '/team',
        icon: 'users',
        description: 'Team members and collaboration'
      },
      {
        title: 'Analytics',
        url: '/analytics',
        icon: 'chart-pie',
        description: 'Reports and insights'
      },
    ]
  },
  {
    label: 'Management',
    items: [
      ...(userRole === 'admin' || userRole === 'manager' ? [{
        title: 'Reports',
        url: '/reports',
        icon: 'chart-bar',
        description: 'Analytics and performance reports'
      }] : []),
      // ...(userRole === 'admin' || userRole === 'manager' ? [{
      //   title: 'Approvals',
      //   url: '/approvals',
      //   icon: 'check-circle',
      //   description: 'Review and approve requests'
      // }] : []),
      ...(userRole === 'admin' ? [{
        title: 'User Management',
        url: '/user-management',
        icon: 'users-cog',
        description: 'Manage users and permissions'
      }] : []),
      ...(userRole === 'admin' || userRole === 'manager' ? [{
        title: 'Billing',
        url: '/billing',
        icon: 'credit-card',
        description: 'Billing and subscription'
      }] : []),
    ].filter(Boolean)
  },
  {
    label: 'Account',
    items: [
      {
        title: 'Profile',
        url: '/profile',
        icon: 'user',
        description: 'Personal profile and preferences'
      },
      {
        title: 'Settings',
        url: '/settings',
        icon: 'settings',
        description: 'Account and preferences'
      },
    ]
  }
].filter(section => section.items.length > 0);

const IconComponent = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const iconMap = {
    dashboard: (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    folders: (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        <path d="M2 10h20" />
      </svg>
    ),
    'chart-bar': (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="12" width="4" height="9" />
        <rect x="10" y="6" width="4" height="15" />
        <rect x="17" y="3" width="4" height="18" />
      </svg>
    ),
    users: (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    'chart-pie': (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    ),
    settings: (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
      </svg>
    ),
    sprint: (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    kanban: (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="5" height="18" />
        <rect x="10" y="3" width="5" height="12" />
        <rect x="17" y="3" width="5" height="8" />
      </svg>
    ),
    user: (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    'users-cog': (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M22 12h-4m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
        <path d="M14 8.5l2.5-2.5M14 15.5l2.5 2.5" />
      </svg>
    ),
    'credit-card': (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    calendar: (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    'check-circle': (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22,4 12,14.01 9,11.01" />
      </svg>
    ),
  };

  return iconMap[name as keyof typeof iconMap] || iconMap.dashboard;
};

export const AppSidebar = () => {
  const { open } = useSidebar();
  const user = useAuthStore(state => state.user);

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `${isActive
      ? 'bg-sidebar-accent text-sidebar-primary font-medium'
      : 'hover:bg-sidebar-accent/50'
    }`;

  const collapsed = !open;
  const navigationSections = getNavigationSections(user?.role || 'member');

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="WorkflowHub Logo"
              className={`w-8 h-8 ${collapsed ? 'mx-auto' : ''}`}
            />

            {!collapsed && (
              <div>
                <h2 className="font-bold text-sidebar-foreground">
                  WorkflowHub
                </h2>
                <p className="text-xs text-sidebar-foreground/60">Enterprise</p>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        {!collapsed && user && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {navigationSections.map(section => (
          <SidebarGroup key={section.label} className="flex-1">
            <SidebarGroupLabel className="px-4 py-2 text-sidebar-foreground/60">
              {!collapsed && section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild className="mx-2">
                            <NavLink
                              to={item.url}
                              className={getNavClassName}
                              end={item.url === '/dashboard'}
                            >
                              <IconComponent
                                name={item.icon}
                                className="w-5 h-5 flex-shrink-0"
                              />
                              {!collapsed && <span className="ml-3">{item.title}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right" className="font-medium">
                            <p>{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
