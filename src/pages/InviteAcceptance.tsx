import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { AlertCircle, CheckCircle, Loader2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export const InviteAcceptance = () => {
  const { inviteId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, joinWorkspace, user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [inviteValid, setInviteValid] = useState(false);
  const [inviteData, setInviteData] = useState<{
    teamName: string;
    inviterName: string;
    role: string;
    expired: boolean;
  } | null>(null);

  const role = searchParams.get('role');
  const expires = searchParams.get('expires');

  useEffect(() => {
    const validateInvite = async () => {
      if (!inviteId || !role) {
        setIsLoading(false);
        return;
      }

      try {
        // Simulate API call to validate invite
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock invite validation
        const mockInviteData = {
          teamName: 'WorkflowHub Team',
          inviterName: 'John Smith',
          role: role,
          expired: expires !== 'never' && expires ? Date.now() > Date.parse('2025-01-20') : false, // Mock expiry check
        };

        setInviteData(mockInviteData);
        setInviteValid(!mockInviteData.expired);
      } catch {
        setInviteValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateInvite();
  }, [inviteId, role, expires]);

  const handleAcceptInvite = async () => {
    if (!inviteData || !role || !inviteId) return;

    setIsLoading(true);

    try {
      if (!isAuthenticated) {
        // Redirect to auth with invite info
        navigate(`/auth?invite=${inviteId}&role=${role}`);
        return;
      }

      // Check if user already has workspaces (existing workspace owner)
      const hasExistingWorkspaces = user?.workspaces && user.workspaces.length > 0;

      if (hasExistingWorkspaces) {
        // User has their own workspace - joining as invited member with specified role
        joinWorkspace(`ws-${inviteId}`, role as 'admin' | 'manager' | 'member', '1'); // Mock inviter ID

        toast({
          title: 'Joined team successfully!',
          description: `You've joined ${inviteData.teamName} as a ${inviteData.role}. You can switch between your workspaces anytime.`,
        });
      } else {
        // This shouldn't happen in normal flow, but handle it
        toast({
          title: 'Error',
          description: 'Please complete your own workspace setup first.',
          variant: 'destructive',
        });
        navigate('/onboarding');
        return;
      }

      navigate('/dashboard');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to accept invite. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Validating invite...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!inviteValid || !inviteData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle>Invalid Invite</CardTitle>
            <CardDescription>
              {inviteData?.expired
                ? 'This invite link has expired.'
                : 'This invite link is invalid or has been revoked.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => navigate('/auth')}>
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle>Team Invitation</CardTitle>
          <CardDescription>You&apos;ve been invited to join {inviteData.teamName}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>{inviteData.inviterName}</strong> has invited you to join their team
            </p>
            <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-3">
              <Users className="h-4 w-4" />
              <span className="font-medium">Role: {inviteData.role}</span>
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-blue-50 p-3 text-xs text-muted-foreground dark:bg-blue-950/20">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              Note about role assignment:
            </p>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• Users who sign up independently become Administrators</li>
              <li>• Invited users receive the role specified in the invitation</li>
              <li>
                • Your role will be: <strong>{inviteData.role}</strong>
              </li>
            </ul>
          </div>

          <Button className="w-full" onClick={handleAcceptInvite} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept Invitation
              </>
            )}
          </Button>

          <Button variant="outline" className="w-full" onClick={() => navigate('/auth')}>
            Decline & Go to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
