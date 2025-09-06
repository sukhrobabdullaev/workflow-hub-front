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
import {
  Bell,
  CreditCard,
  Crown,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  User,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppHeader = () => {
  const { user, logout } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: 'New task assigned',
      description: 'Review the marketing campaign proposal',
      time: '2 min ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Project update',
      description: 'Development sprint completed',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Meeting reminder',
      description: 'Team standup in 15 minutes',
      time: '3 hours ago',
      unread: false,
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
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-lg">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 blur-sm" />
              </div>
              <span className="hidden bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-lg font-bold text-transparent sm:block">
                WorkflowHub
              </span>
            </div>

            {/* Enhanced Search */}
            <div className="relative hidden md:block">
              <Button
                variant="outline"
                className="w-64 justify-start text-muted-foreground transition-all duration-200 hover:bg-accent/50"
                onClick={() => setOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                Search projects, tasks...
                <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium opacity-100 lg:inline-flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
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
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Badge variant="secondary">{unreadCount} new</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notification => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start p-3 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex w-full items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{notification.title}</p>
                            {notification.unread && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground/70">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

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
        </CommandList>
      </CommandDialog>
    </>
  );
};
