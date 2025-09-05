import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { useState } from 'react';

// Mock data for approvals
const pendingApprovals = [
  {
    id: '1',
    type: 'timeoff',
    title: 'Vacation Request',
    requestor: {
      name: 'Sarah Johnson',
      email: 'sarah@workflowhub.com',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    details: {
      startDate: '2025-02-15',
      endDate: '2025-02-22',
      days: 6,
      reason: 'Family vacation planned for several months',
    },
    requestDate: '2025-01-10',
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: '2',
    type: 'expense',
    title: 'Conference Registration',
    requestor: {
      name: 'Mike Chen',
      email: 'mike@workflowhub.com',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    details: {
      amount: 1250,
      category: 'Professional Development',
      description: 'React Conference 2025 - 3 days training and networking',
      attachments: ['receipt.pdf', 'agenda.pdf'],
    },
    requestDate: '2025-01-08',
    priority: 'Low',
    status: 'Pending',
  },
  {
    id: '3',
    type: 'project',
    title: 'New Feature Proposal',
    requestor: {
      name: 'Lisa Garcia',
      email: 'lisa@workflowhub.com',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    details: {
      projectName: 'Advanced Analytics Dashboard',
      budget: 25000,
      timeline: '3 months',
      description: 'Implement real-time analytics with advanced filtering and export capabilities',
      resources: 2,
    },
    requestDate: '2025-01-05',
    priority: 'High',
    status: 'Pending',
  },
  {
    id: '4',
    type: 'access',
    title: 'System Access Request',
    requestor: {
      name: 'John Davis',
      email: 'john@workflowhub.com',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    details: {
      system: 'Production Database',
      level: 'Read-Only',
      justification: 'Need access for debugging production issues and performance monitoring',
    },
    requestDate: '2025-01-12',
    priority: 'High',
    status: 'Pending',
  },
];

const approvalHistory = [
  {
    id: '5',
    type: 'timeoff',
    title: 'Sick Leave',
    requestor: {
      name: 'Emma Wilson',
      email: 'emma@workflowhub.com',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    requestDate: '2024-12-20',
    approvedDate: '2024-12-20',
    status: 'Approved',
    approvedBy: 'You',
  },
  {
    id: '6',
    type: 'expense',
    title: 'Office Supplies',
    requestor: {
      name: 'Tom Anderson',
      email: 'tom@workflowhub.com',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    requestDate: '2024-12-18',
    approvedDate: '2024-12-19',
    status: 'Rejected',
    approvedBy: 'You',
    reason: 'Insufficient budget remaining for Q4',
  },
];

export const Approvals = () => {
  const user = useAuthStore(state => state.user);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewComments, setReviewComments] = useState('');

  // Access control
  if (user?.role === 'member') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="mb-2 text-xl font-semibold">Access Restricted</h2>
              <p className="text-muted-foreground">
                You don&apos;t have permission to view approvals.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'timeoff':
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        );
      case 'expense':
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        );
      case 'project':
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
          </svg>
        );
      case 'access':
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
            <circle cx="16.5" cy="7.5" r=".5" />
          </svg>
        );
      default:
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      case 'Low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'Pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleApprove = (approvalId: string) => {
    console.log('Approved:', approvalId);
    // Handle approval logic
  };

  const handleReject = (approvalId: string) => {
    console.log('Rejected:', approvalId);
    // Handle rejection logic
  };

  const openReviewModal = (approval: any) => {
    setSelectedApproval(approval);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
          <p className="text-muted-foreground">
            Review and manage pending approval requests from your team
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Export History</Button>
          <Button>Settings</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pendingApprovals.filter(a => a.priority === 'High').length}
            </div>
            <p className="text-xs text-muted-foreground">Urgent requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Requests processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Approval success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingApprovals.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <div className="space-y-4">
            {pendingApprovals.map(approval => (
              <Card key={approval.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          {getTypeIcon(approval.type)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{approval.title}</h3>
                          <Badge variant={getPriorityColor(approval.priority)}>
                            {approval.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={approval.requestor.avatar} />
                              <AvatarFallback>{approval.requestor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {approval.requestor.name}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Requested {format(new Date(approval.requestDate), 'MMM d, yyyy')}
                          </span>
                        </div>

                        {/* Type-specific details */}
                        {approval.type === 'timeoff' && (
                          <div className="space-y-1 text-sm">
                            <p>
                              <strong>Dates:</strong> {approval.details.startDate} to{' '}
                              {approval.details.endDate}
                            </p>
                            <p>
                              <strong>Duration:</strong> {approval.details.days} days
                            </p>
                            <p>
                              <strong>Reason:</strong> {approval.details.reason}
                            </p>
                          </div>
                        )}

                        {approval.type === 'expense' && (
                          <div className="space-y-1 text-sm">
                            <p>
                              <strong>Amount:</strong> ${approval.details.amount.toLocaleString()}
                            </p>
                            <p>
                              <strong>Category:</strong> {approval.details.category}
                            </p>
                            <p>
                              <strong>Description:</strong> {approval.details.description}
                            </p>
                          </div>
                        )}

                        {approval.type === 'project' && (
                          <div className="space-y-1 text-sm">
                            <p>
                              <strong>Project:</strong> {approval.details.projectName}
                            </p>
                            <p>
                              <strong>Budget:</strong> ${approval.details.budget.toLocaleString()}
                            </p>
                            <p>
                              <strong>Timeline:</strong> {approval.details.timeline}
                            </p>
                            <p>
                              <strong>Resources Needed:</strong> {approval.details.resources} team
                              members
                            </p>
                          </div>
                        )}

                        {approval.type === 'access' && (
                          <div className="space-y-1 text-sm">
                            <p>
                              <strong>System:</strong> {approval.details.system}
                            </p>
                            <p>
                              <strong>Access Level:</strong> {approval.details.level}
                            </p>
                            <p>
                              <strong>Justification:</strong> {approval.details.justification}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openReviewModal(approval)}>
                        Review
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleReject(approval.id)}>
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(approval.id)}>
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="space-y-4">
            {approvalHistory.map(approval => (
              <Card key={approval.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={approval.requestor.avatar} />
                        <AvatarFallback>{approval.requestor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{approval.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {approval.requestor.name} • Requested{' '}
                          {format(new Date(approval.requestDate), 'MMM d, yyyy')}
                        </p>
                        {approval.reason && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            <strong>Reason:</strong> {approval.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <Badge variant={getStatusColor(approval.status)}>{approval.status}</Badge>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(approval.approvedDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Request</DialogTitle>
            <DialogDescription>
              Review the details and provide feedback for this approval request.
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-medium">{selectedApproval.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Requested by {selectedApproval.requestor.name} on{' '}
                  {format(new Date(selectedApproval.requestDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  placeholder="Add any comments or feedback..."
                  value={reviewComments}
                  onChange={e => setReviewComments(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReject(selectedApproval.id);
                    setIsReviewModalOpen(false);
                    setReviewComments('');
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(selectedApproval.id);
                    setIsReviewModalOpen(false);
                    setReviewComments('');
                  }}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
