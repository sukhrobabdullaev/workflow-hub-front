import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/store/appStore';
import type { TeamMember } from '@/store/appStore';
import { TeamMemberProfileModal, AssignTaskModal, InviteMemberModal } from '@/components/modals';
import { TeamChat } from '@/components/realtime/TeamChat';
import { OnlineUsers } from '@/components/realtime/OnlineUsers';
import { useState } from 'react';
import { MessageCircle, Users, UserPlus } from 'lucide-react';

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

export const Team = () => {
  const { teamMembers, tasks } = useAppStore();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

  const handleViewProfile = (member: TeamMember) => {
    setSelectedMember(member);
    setIsProfileModalOpen(true);
  };

  const handleAssignTask = (member: TeamMember) => {
    setSelectedMember(member);
    setIsAssignTaskModalOpen(true);
  };

  const handleInviteMember = () => {
    setIsInviteMemberModalOpen(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Users className="h-8 w-8" />
            Team Collaboration
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your team members and communicate in real-time
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleInviteMember}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
          <Button
            className="bg-gradient-primary flex items-center gap-2 hover:opacity-90"
            onClick={() => {}} // Could open chat in fullscreen
          >
            <MessageCircle className="h-4 w-4" />
            Open Chat
          </Button>
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
          <TeamChat />
        </div>
      </div>

      {/* Online Users Display */}
      <div className="mt-6">
        <OnlineUsers />
      </div>

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
    </div>
  );
};
