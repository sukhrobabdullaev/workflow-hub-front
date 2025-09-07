# Role Assignment Logic

## Overview

WorkflowHub implements a clear role assignment system that distinguishes between users who sign up independently versus those who are invited to join an existing workspace.

## Role Assignment Rules

### 1. Independent Signup → Administrator

**When:** A user signs up independently (not through an invite) and completes onboarding

**Result:** User becomes an **Administrator** of their own workspace with full privileges

**Implementation:**

- `authStore.ts` - `register()` function creates new workspace and assigns `role: 'admin'` with `isOwner: true`
- `authStore.ts` - `completeOnboarding()` updates workspace name and confirms admin status
- `authStore.ts` - `socialAuth()` function also creates workspace and assigns `role: 'admin'`

**Rationale:** Independent signups are workspace creators who should have full control over their workspace

### 2. Invited Users → Assigned Role in Target Workspace

**When:** A user is invited via email or invite link to join an existing workspace

**Result:** User joins the workspace with the role specified in the invitation

**Edge Case Handling:**

- **New User**: User signs up via invite → Gets assigned role in target workspace (no own workspace)
- **Existing User**: User with existing workspace → Joins as additional workspace member with assigned role

**Available Roles:**

- **Member**: Can view and work on assigned tasks
- **Manager**: Can manage projects and assign tasks to team members
- **Administrator**: Full access to all features including user management and billing

**Implementation:**

- InviteMemberModal allows role selection for email invites
- Invite links contain role parameter: `/join/{inviteId}?role={selectedRole}&expires={expiry}`
- InviteAcceptance page uses `joinWorkspace()` function to add user to workspace with specified role
- Users can be members of multiple workspaces with different roles in each

### 3. Multi-Workspace Support

**Scenario:** An existing workspace owner receives an invite to join another workspace

**Behavior:**

- User maintains their original workspace where they are the admin/owner
- User joins the new workspace with the role specified in the invite
- User can switch between workspaces using the workspace switcher in the sidebar
- Each workspace maintains its own role assignments and permissions

**Implementation:**

- `User.workspaces[]` array stores all workspace memberships
- `User.currentWorkspaceId` tracks the active workspace
- `switchWorkspace()` function changes the active workspace
- UI components use `getCurrentRole()` to determine permissions for current workspace
- Workspace switcher shows all available workspaces with role indicators

## User Experience

### For Independent Signups

1. User visits landing page and signs up
2. User completes onboarding flow
3. System automatically assigns Administrator role
4. Completion message: "You are now the Administrator of your workspace"

### For Invited Users (New Users)

1. User receives invite email or link with specified role
2. User clicks invite link → InviteAcceptance page
3. Page displays team info and their assigned role
4. User signs up and joins with the specified role
5. No onboarding flow (joins existing workspace directly)

### For Invited Users (Existing Workspace Owners)

1. User receives invite email or link with specified role
2. User clicks invite link → InviteAcceptance page
3. Page detects user already has workspace(s) and shows multi-workspace context
4. User accepts invite and joins as additional workspace member with specified role
5. User can switch between workspaces using sidebar switcher
6. Each workspace maintains independent role assignments

## UI Clarifications

### InviteMemberModal

- Clear role descriptions for each option
- Info card explaining role assignment logic
- Distinction between workspace creator (admin) and invited users

### Onboarding Flow

- Completion message emphasizes admin status
- Sets expectation that user will be the workspace administrator

### Profile Pages

- Role-specific information and privilege descriptions
- Clear indication of current user's permissions

## Code Locations

- **Role Assignment Logic**: `/src/store/authStore.ts`
- **Invite Modal**: `/src/components/modals/InviteMemberModal.tsx`
- **Invite Acceptance**: `/src/pages/InviteAcceptance.tsx`
- **Onboarding**: `/src/pages/Onboarding.tsx`
- **Profile Display**: `/src/pages/Profile.tsx`

## Future Implementation Notes

For production implementation, you'll need:

1. **Backend API endpoints**:
   - `POST /api/invites` - Create invite
   - `GET /api/invites/:id` - Validate invite
   - `POST /api/invites/:id/accept` - Accept invite

2. **Database schema**:
   - Invites table with role, expiry, team_id
   - User-team relationships with roles

3. **Email service** for sending invite emails

4. **Role-based permissions** enforcement in backend APIs

## Testing Scenarios

1. **Independent Signup**:
   - Sign up → Complete onboarding → Verify admin role
   - Social auth → Complete onboarding → Verify admin role

2. **Email Invites**:
   - Send invite with each role → Verify role assignment
   - Test expired invites → Verify rejection

3. **Invite Links**:
   - Generate link with role → Accept → Verify role
   - Test expired links → Verify rejection

4. **Mixed Scenarios**:
   - Multiple admins in same workspace
   - Role changes by existing admins
   - Permission inheritance and restrictions
