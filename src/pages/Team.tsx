import { AssignTaskModal, InviteMemberModal, TeamMemberProfileModal } from '@/components/modals';
import { UpgradeDialog } from '@/components/modals/UpgradeDialog';
import { OnlineUsers } from '@/components/realtime/OnlineUsers';
import { TeamChat } from '@/components/realtime/TeamChat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanLimitIndicator } from '@/components/ui/plan-indicators';
import type { TeamMember } from '@/store/appStore';
import { useAppStore } from '@/store/appStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Crown, Lock, MessageCircle, UserPlus, Users } from 'lucide-react';
import React, { useState } from 'react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-success/10 text-success';
    case 'away':
      return 'bg-warning/10 text-warning';
    case 'offline':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusIndicator = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-success';
    case 'away':
      return 'bg-warning';
    case 'offline':
      return 'bg-muted-foreground';
    default:
      return 'bg-muted-foreground';
  }
};

// Demo Chat Component for Free Users
const ChatDemo = ({ onUpgrade }: { onUpgrade: () => void }) => {
  const [visibleMessages, setVisibleMessages] = useState(1);
  const [showTyping, setShowTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(2);
  const [showReaction, setShowReaction] = useState<string | null>(null);
  const [typingUser, setTypingUser] = useState('');
  const [newMessageAlert, setNewMessageAlert] = useState(false);

  const demoMessages = [
    {
      id: '1',
      user: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      message: 'Great work on the new design! 🎨',
      time: '2 min ago',
      isOnline: true,
      reactions: ['👍', '�'],
    },
    {
      id: '2',
      user: 'Mike Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      message: 'The API integration is ready for testing ✅',
      time: '5 min ago',
      isOnline: true,
      reactions: ['✅', '🚀'],
    },
    {
      id: '3',
      user: 'Emily Davis',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      message: 'Can someone review the mobile screens? 📱',
      time: '8 min ago',
      isOnline: false,
      reactions: ['👀'],
    },
    {
      id: '4',
      user: 'Alex Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      message: 'I can help with the review! Will check it now �',
      time: 'now',
      isOnline: true,
      reactions: ['�', '�👍'],
    },
  ];

  const typingUsers = React.useMemo(() => ['John Smith', 'Lisa Wang', 'David Kim'], []);

  // Enhanced simulation with realistic timing
  React.useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Progressive message appearance with realistic timing
    timers.push(
      setTimeout(() => {
        setVisibleMessages(2);
        setNewMessageAlert(true);
        setTimeout(() => setNewMessageAlert(false), 2000);
      }, 2000)
    );

    // Show typing indicator
    timers.push(
      setTimeout(() => {
        setShowTyping(true);
        setTypingUser(typingUsers[0]);
      }, 3500)
    );

    // Add third message
    timers.push(
      setTimeout(() => {
        setShowTyping(false);
        setVisibleMessages(3);
        setShowReaction('3');
        setNewMessageAlert(true);
        setTimeout(() => setNewMessageAlert(false), 2000);
      }, 5500)
    );

    // Clear reaction and show new typing
    timers.push(
      setTimeout(() => {
        setShowReaction(null);
        setShowTyping(true);
        setTypingUser(typingUsers[1]);
      }, 7500)
    );

    // Add final message with reactions
    timers.push(
      setTimeout(() => {
        setShowTyping(false);
        setVisibleMessages(4);
        setShowReaction('4');
        setNewMessageAlert(true);
        setTimeout(() => setNewMessageAlert(false), 2000);
      }, 9500)
    );

    // Simulate online count changes
    timers.push(setTimeout(() => setOnlineUsers(3), 4000));
    timers.push(setTimeout(() => setOnlineUsers(4), 8000));
    timers.push(setTimeout(() => setOnlineUsers(5), 12000));

    // Clear final reaction
    timers.push(setTimeout(() => setShowReaction(null), 12000));

    // Restart the cycle
    timers.push(
      setTimeout(() => {
        setVisibleMessages(1);
        setOnlineUsers(2);
      }, 15000)
    );

    return () => timers.forEach(clearTimeout);
  }, [typingUsers]);

  return (
    <Card className="h-full">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Team Chat
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary"
          >
            <Crown className="mr-1 h-3 w-3" />
            Pro
          </Badge>
          {/* Enhanced online indicator with pulsing animation */}
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className={newMessageAlert ? 'animate-bounce font-medium text-primary' : ''}>
              {onlineUsers} online
            </span>
          </div>
        </CardTitle>
        {/* Overlay for demo */}
        <div
          className="absolute inset-0 z-10 cursor-pointer rounded-t-lg bg-black/5 backdrop-blur-[2px] transition-all hover:bg-black/10"
          onClick={onUpgrade}
        />
      </CardHeader>
      <CardContent className="relative">
        <div className="max-h-80 space-y-4 overflow-hidden">
          {demoMessages.slice(0, visibleMessages).map((msg, index) => (
            <div
              key={msg.id}
              className="flex animate-fade-in gap-3 opacity-60"
              style={{
                animationDelay: `${index * 300}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.avatar} alt={msg.user} />
                  <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                </Avatar>
                {msg.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 animate-pulse rounded-full border-2 border-background bg-success" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                  {msg.id === '4' && (
                    <Badge variant="outline" className="h-4 px-1 py-0 text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{msg.message}</p>
                {/* Enhanced message reactions with animations */}
                {msg.reactions.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {msg.reactions.map((reaction, idx) => (
                      <span
                        key={idx}
                        className={`rounded bg-muted px-1 py-0.5 text-xs transition-all hover:scale-110 ${
                          showReaction === msg.id ? 'animate-bounce' : ''
                        }`}
                        style={{ animationDelay: `${idx * 200}ms` }}
                      >
                        {reaction}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Enhanced typing indicator with user name */}
          {showTyping && (
            <div className="flex animate-fade-in gap-3 opacity-60">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {typingUser
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{typingUser}</span>
                  <span className="animate-pulse text-xs text-primary">typing...</span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo Input with enhanced features */}
        <div className="mt-4 space-y-2">
          <div className="flex gap-2 opacity-60">
            <div className="relative flex-1 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <span className="animate-pulse">Type a message...</span>
              {/* Simulated cursor */}
              <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-primary" />
            </div>
            <Button size="sm" variant="ghost" className="px-3" disabled>
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>

          {/* Feature indicators */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground opacity-60">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              File sharing
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              @mentions
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              Reactions
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              Voice messages
            </div>
          </div>
        </div>

        {/* Upgrade Overlay */}
        <div className="absolute inset-0 flex items-center justify-center rounded-b-lg bg-gradient-to-t from-background/95 via-background/70 to-transparent">
          <div className="animate-fade-in text-center">
            <div className="mb-3 flex justify-center">
              <div className="relative rounded-full bg-primary/10 p-3 backdrop-blur-sm">
                <Lock className="h-6 w-6 text-primary" />
                {/* Pulsing ring around lock */}
                <div className="absolute inset-0 animate-ping rounded-full border-2 border-primary/20" />
              </div>
            </div>
            <h3 className="mb-2 font-semibold">Real-time Team Chat</h3>
            <p className="mb-4 max-w-xs text-sm text-muted-foreground">
              Collaborate instantly with your team through real-time messaging, file sharing, and
              more
            </p>
            <Button
              onClick={onUpgrade}
              className="relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 shadow-lg transition-all duration-300 hover:from-primary/90 hover:to-purple-600/90 hover:shadow-xl"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const Team = () => {
  const { teamMembers, tasks } = useAppStore();
  const { getCurrentPlan, checkLimit } = useSubscriptionStore();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const currentPlan = getCurrentPlan();
  const isFreePlan = currentPlan.id === 'free';

  const handleViewProfile = (member: TeamMember) => {
    setSelectedMember(member);
    setIsProfileModalOpen(true);
  };

  const handleAssignTask = (member: TeamMember) => {
    setSelectedMember(member);
    setIsAssignTaskModalOpen(true);
  };

  const handleInviteMember = () => {
    if (isFreePlan && !checkLimit('maxTeamMembers')) {
      // The InviteMemberModal will handle the upgrade prompt
      // Just open it and let it show the limit error
    }
    setIsInviteMemberModalOpen(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Team Member Limit Indicator */}
      {isFreePlan && (
        <div className="max-w-sm">
          <PlanLimitIndicator feature="teamMembers" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Users className="h-8 w-8" />
            {isFreePlan ? 'Team Management' : 'Team Collaboration'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isFreePlan
              ? 'Manage up to 5 team members and basic collaboration'
              : 'Manage your team members and communicate in real-time'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleInviteMember}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {isFreePlan ? `Invite Member (${teamMembers.length}/5)` : 'Invite Member'}
          </Button>
          {!isFreePlan && (
            <Button
              className="bg-gradient-primary flex items-center gap-2 hover:opacity-90"
              onClick={() => {}} // Could open chat in fullscreen
            >
              <MessageCircle className="h-4 w-4" />
              Open Chat
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Team Members + Chat */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Team Members Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {teamMembers.map(member => {
              const memberTasks = tasks.filter(task => task.assignee === member.id);
              const completedTasks = memberTasks.filter(task => task.status === 'done').length;
              const activeTasks = memberTasks.filter(task => task.status === 'in-progress').length;

              return (
                <Card
                  key={member.id}
                  className="shadow-soft transition-all duration-200 hover:shadow-elevated"
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-primary/10 text-lg text-primary">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${getStatusIndicator(member.status)}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <Badge
                          className={`mt-1 ${getStatusColor(member.status)}`}
                          variant="secondary"
                        >
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">{member.email}</div>

                      {/* Task Statistics */}
                      <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{activeTasks}</div>
                          <div className="text-xs text-muted-foreground">Active Tasks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success">{completedTasks}</div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleViewProfile(member)}
                        >
                          View Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAssignTask(member)}
                        >
                          Assign Task
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Real-time Chat */}
        <div className="lg:col-span-1">
          {isFreePlan ? <ChatDemo onUpgrade={() => setShowUpgradeDialog(true)} /> : <TeamChat />}
        </div>
      </div>

      {/* Online Users Display */}
      {!isFreePlan && (
        <div className="mt-6">
          <OnlineUsers />
        </div>
      )}

      <TeamMemberProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        member={selectedMember}
      />

      {/* Assign Task Modal */}
      <AssignTaskModal
        open={isAssignTaskModalOpen}
        onOpenChange={setIsAssignTaskModalOpen}
        member={selectedMember}
      />

      {/* Invite Member Modal */}
      <InviteMemberModal open={isInviteMemberModalOpen} onOpenChange={setIsInviteMemberModalOpen} />

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        title="Unlock Real-time Team Chat"
        description="Upgrade to Professional to access real-time team communication, file sharing, and advanced collaboration features."
      />
    </div>
  );
};
