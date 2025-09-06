import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import {
  AlertTriangle,
  Bell,
  Bot,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppHeader = () => {
  const { user, logout } = useAuthStore();
  const { getCurrentPlan, setUpgradeDialog } = useSubscriptionStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showNotificationPreview, setShowNotificationPreview] = useState(false);

  const currentPlan = getCurrentPlan();
  const isFreePlan = currentPlan.id === 'free';

  const [notifications] = useState([
    {
      id: 1,
      title: 'High Priority: Critical Bug',
      description:
        'Security vulnerability detected in payment module - requires immediate attention',
      time: '2 min ago',
      unread: true,
      priority: 'critical',
      type: 'alert',
    },
    {
      id: 2,
      title: '🎉 Milestone Achieved',
      description: 'Q4 Marketing Campaign reached 150% of target goals ahead of schedule',
      time: '15 min ago',
      unread: true,
      priority: 'high',
      type: 'success',
    },
    {
      id: 3,
      title: 'AI Task Assignment',
      description: 'Smart workflow assigned 3 tasks to Sarah based on her expertise in React',
      time: '1 hour ago',
      unread: true,
      priority: 'medium',
      type: 'ai',
    },
    {
      id: 4,
      title: 'Budget Alert',
      description: 'Project "Mobile App Redesign" is 85% through allocated budget',
      time: '2 hours ago',
      unread: false,
      priority: 'medium',
      type: 'warning',
    },
    {
      id: 5,
      title: 'Team Chat Mention',
      description: '@john mentioned you in #dev-team: "Great work on the API optimization!"',
      time: '3 hours ago',
      unread: false,
      priority: 'low',
      type: 'mention',
    },
    {
      id: 6,
      title: 'Deadline Reminder',
      description: 'UI/UX Design Review due in 2 days - 4 tasks pending approval',
      time: '4 hours ago',
      unread: false,
      priority: 'medium',
      type: 'reminder',
    },
  ]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isFreePlan) {
          setUpgradeDialog(true);
        } else {
          setOpen(true);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFreePlan, setUpgradeDialog]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'manager':
        return <ShieldCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getNotificationIcon = (type: string, _priority: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ai':
        return <Bot className="h-4 w-4 text-purple-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'mention':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-blue-500';
      case 'low':
        return 'bg-gray-500';
      default:
        return 'bg-primary';
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      manager: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      member: 'bg-gradient-to-r from-green-500 to-emerald-500',
    };
    return colors[role as keyof typeof colors] || colors.member;
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="p-2 transition-colors hover:bg-accent/50" />
            {/* Enhanced Search */}
            <div className="relative hidden md:block">
              <Button
                variant="outline"
                className={`w-64 justify-start text-muted-foreground transition-all duration-200 hover:bg-accent/50 ${
                  isFreePlan
                    ? 'border-dashed border-primary/50 bg-gradient-to-r from-primary/5 to-purple-500/5'
                    : ''
                }`}
                onClick={() => {
                  if (isFreePlan) {
                    setUpgradeDialog(true);
                  } else {
                    setOpen(true);
                  }
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                {isFreePlan ? 'Search (Pro)' : 'Search projects, tasks...'}
                {isFreePlan ? (
                  <Crown className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-primary" />
                ) : (
                  <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium opacity-100 lg:inline-flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                )}
              </Button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className={`md:hidden ${isFreePlan ? 'border border-dashed border-primary/50 bg-gradient-to-r from-primary/5 to-purple-500/5' : ''}`}
              onClick={() => {
                if (isFreePlan) {
                  setUpgradeDialog(true);
                } else {
                  setOpen(true);
                }
              }}
            >
              <Search className="h-4 w-4" />
              {isFreePlan && <Crown className="ml-1 h-3 w-3 text-primary" />}
            </Button>

            {/* Notifications */}
            {isFreePlan ? (
              <DropdownMenu
                open={showNotificationPreview}
                onOpenChange={setShowNotificationPreview}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative border border-dashed border-primary/50 bg-gradient-to-r from-primary/5 to-purple-500/5 transition-colors hover:bg-accent/50"
                    onClick={() => setShowNotificationPreview(true)}
                  >
                    <Bell className="h-4 w-4 opacity-60" />
                    <Crown className="absolute -right-1 -top-1 h-3 w-3 text-primary" />
                    {/* Demo notification badge with animation */}
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 animate-pulse rounded-full border-0 bg-gradient-to-r from-red-500 to-pink-500 p-0 text-[10px] opacity-60">
                      6
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96" align="end">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      Smart Notifications
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary"
                      >
                        <Crown className="mr-1 h-3 w-3" />
                        Pro
                      </Badge>
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-600 opacity-60"
                    >
                      6 new
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="relative max-h-80 overflow-hidden">
                    {/* Enhanced demo notifications */}
                    <div className="space-y-1">
                      {notifications.slice(0, 4).map((notification, index) => (
                        <div
                          key={notification.id}
                          className={`flex cursor-default items-start gap-3 border-l-2 p-3 opacity-70 transition-all duration-300 hover:bg-accent/50 ${
                            notification.priority === 'critical'
                              ? 'border-red-500'
                              : notification.priority === 'high'
                                ? 'border-orange-500'
                                : notification.priority === 'medium'
                                  ? 'border-blue-500'
                                  : 'border-gray-300'
                          }`}
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: showNotificationPreview
                              ? 'slideInFromRight 0.3s ease-out forwards'
                              : 'none',
                          }}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-sm font-medium">
                                    {notification.title}
                                  </p>
                                  {notification.unread && (
                                    <div
                                      className={`h-2 w-2 rounded-full ${getPriorityColor(notification.priority)} animate-pulse`}
                                    />
                                  )}
                                </div>
                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                  {notification.description}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                  <p className="text-xs text-muted-foreground/70">
                                    {notification.time}
                                  </p>
                                  {notification.priority === 'critical' && (
                                    <Badge className="border-red-200 bg-red-500/10 text-xs text-red-600">
                                      Critical
                                    </Badge>
                                  )}
                                  {notification.type === 'ai' && (
                                    <Badge className="border-purple-200 bg-purple-500/10 text-xs text-purple-600">
                                      AI Powered
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Upgrade Overlay */}
                    <div className="from-background/98 absolute inset-0 flex items-center justify-center bg-gradient-to-t via-background/85 to-background/20">
                      <div className="max-w-sm space-y-4 p-6 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-purple-500/10 px-4 py-2 text-sm font-medium text-primary">
                          <Crown className="h-4 w-4" />
                          Pro Feature Preview
                        </div>
                        <div>
                          <h3 className="mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-xl font-semibold text-transparent">
                            Intelligent Notifications
                          </h3>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                              <Bot className="h-4 w-4 text-purple-500" />
                              <span>AI-powered priority detection</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span>Real-time project insights</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span>Critical issue alerts</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setShowNotificationPreview(false);
                            setUpgradeDialog(true);
                          }}
                          className="bg-gradient-to-r from-primary to-purple-600 shadow-lg transition-all duration-200 hover:from-primary/90 hover:to-purple-600/90 hover:shadow-xl"
                        >
                          <Crown className="mr-2 h-4 w-4" />
                          Unlock Smart Notifications
                        </Button>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative transition-colors hover:bg-accent/50"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-0 bg-gradient-to-r from-red-500 to-pink-500 p-0 text-[10px]">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96" align="end">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      Smart Notifications
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Pro
                      </Badge>
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-600"
                    >
                      {unreadCount} new
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    <div className="space-y-1">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`flex cursor-pointer items-start gap-3 border-l-2 p-3 transition-colors hover:bg-accent/50 ${
                            notification.priority === 'critical'
                              ? 'border-red-500'
                              : notification.priority === 'high'
                                ? 'border-orange-500'
                                : notification.priority === 'medium'
                                  ? 'border-blue-500'
                                  : 'border-gray-300'
                          } ${notification.unread ? 'bg-accent/20' : ''}`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-sm font-medium">
                                    {notification.title}
                                  </p>
                                  {notification.unread && (
                                    <div
                                      className={`h-2 w-2 rounded-full ${getPriorityColor(notification.priority)}`}
                                    />
                                  )}
                                </div>
                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                  {notification.description}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                  <p className="text-xs text-muted-foreground/70">
                                    {notification.time}
                                  </p>
                                  {notification.priority === 'critical' && (
                                    <Badge className="border-red-200 bg-red-500/10 text-xs text-red-600">
                                      Critical
                                    </Badge>
                                  )}
                                  {notification.type === 'ai' && (
                                    <Badge className="border-purple-200 bg-purple-500/10 text-xs text-purple-600">
                                      AI Powered
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pro Actions */}
                    <div className="mt-2 border-t p-3">
                      <div className="flex items-center justify-between text-xs">
                        <Button variant="ghost" size="sm" className="h-8">
                          Mark all as read
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8">
                          View all notifications
                        </Button>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full transition-all duration-200 hover:ring-2 hover:ring-primary/20"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-background">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 font-semibold text-primary">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {user?.role && (
                    <div className="absolute -bottom-1 -right-1">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${getRoleBadge(user.role)}`}
                      >
                        {getRoleIcon(user.role)}
                      </div>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      {user?.role && (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getRoleBadge(user.role)} border-0 text-white`}
                        >
                          {user.role}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <DropdownMenuItem onClick={() => navigate('/billing')} className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {isFreePlan ? (
            <CommandGroup heading="Upgrade Required">
              <CommandItem
                onSelect={() => {
                  setUpgradeDialog(true);
                  setOpen(false);
                }}
              >
                <Crown className="mr-2 h-4 w-4 text-primary" />
                Advanced Search is a Pro Feature - Upgrade Now
              </CommandItem>
            </CommandGroup>
          ) : (
            <>
              <CommandGroup heading="Quick Actions">
                <CommandItem
                  onSelect={() => {
                    navigate('/projects/new');
                    setOpen(false);
                  }}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Create New Project
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate('/tasks/new');
                    setOpen(false);
                  }}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Add Task
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate('/team/invite');
                    setOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Invite Team Member
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Navigation">
                <CommandItem
                  onSelect={() => {
                    navigate('/dashboard');
                    setOpen(false);
                  }}
                >
                  Dashboard
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate('/projects');
                    setOpen(false);
                  }}
                >
                  Projects
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate('/team');
                    setOpen(false);
                  }}
                >
                  Team
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate('/analytics');
                    setOpen(false);
                  }}
                >
                  Analytics
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
