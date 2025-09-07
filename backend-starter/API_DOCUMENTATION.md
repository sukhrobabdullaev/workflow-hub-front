# WorkflowHub API Documentation

## Authentication

### Login

**POST** `/api/auth/login`

**Request:**

```json
{
  "email": "john@workflowhub.com",
  "password": "password"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "John Smith",
    "email": "john@workflowhub.com",
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "plan": "enterprise",
    "planLimits": {
      "maxProjects": -1,
      "maxTeamMembers": -1,
      "storageGB": -1,
      "aiFeatures": true,
      "advancedAnalytics": true,
      "prioritySupport": true
    },
    "companyName": "Acme Corp",
    "companySize": "50-200",
    "industry": "Technology",
    "goals": ["improve_collaboration", "increase_productivity"],
    "twoFactorEnabled": false,
    "onboardingCompleted": true,
    "workspaces": [
      {
        "workspaceId": "ws-1",
        "workspaceName": "John's Company",
        "role": "admin",
        "isOwner": true,
        "joinedAt": "2024-01-01T00:00:00Z",
        "invitedBy": null
      },
      {
        "workspaceId": "ws-3",
        "workspaceName": "Tech Startup Inc",
        "role": "manager",
        "isOwner": false,
        "joinedAt": "2024-06-01T00:00:00Z",
        "invitedBy": "3"
      }
    ],
    "currentWorkspaceId": "ws-1"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Register

**POST** `/api/auth/register`

**Request:**

```json
{
  "name": "John Smith",
  "email": "john@workflowhub.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "John Smith",
    "email": "john@workflowhub.com",
    "plan": "free",
    "planLimits": {
      "maxProjects": 3,
      "maxTeamMembers": 5,
      "storageGB": 0.01,
      "aiFeatures": false,
      "advancedAnalytics": false,
      "prioritySupport": false
    },
    "twoFactorEnabled": false,
    "onboardingCompleted": false,
    "workspaces": [
      {
        "workspaceId": "ws-1",
        "workspaceName": "John Smith's Workspace",
        "role": "admin",
        "isOwner": true,
        "joinedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "currentWorkspaceId": "ws-1"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Social Authentication

**POST** `/api/auth/social`

**Request:**

```json
{
  "provider": "google",
  "token": "google_oauth_token",
  "userData": {
    "name": "John Smith",
    "email": "john@gmail.com",
    "avatar": "https://lh3.googleusercontent.com/..."
  }
}
```

### Complete Onboarding

**PUT** `/api/user/onboarding`

**Request:**

```json
{
  "companyName": "Acme Corp",
  "companySize": "50-200",
  "industry": "Technology",
  "goals": ["improve_collaboration", "increase_productivity"]
}
```

## Workspaces

### Get User Workspaces

**GET** `/api/workspaces`

**Response:**

```json
{
  "success": true,
  "workspaces": [
    {
      "workspaceId": "ws-1",
      "workspaceName": "John's Company",
      "role": "admin",
      "isOwner": true,
      "joinedAt": "2024-01-01T00:00:00Z",
      "memberCount": 12,
      "projectCount": 5
    }
  ],
  "currentWorkspaceId": "ws-1"
}
```

### Switch Workspace

**POST** `/api/workspaces/switch`

**Request:**

```json
{
  "workspaceId": "ws-2"
}
```

### Invite Member

**POST** `/api/workspaces/:workspaceId/invite`

**Request:**

```json
{
  "email": "sarah@example.com",
  "role": "manager"
}
```

**Response:**

```json
{
  "success": true,
  "invitation": {
    "id": "inv-1",
    "email": "sarah@example.com",
    "role": "manager",
    "token": "unique-invitation-token",
    "expiresAt": "2024-02-01T00:00:00Z"
  }
}
```

## Projects

### Get Projects

**GET** `/api/workspaces/:workspaceId/projects`

**Response:**

```json
{
  "success": true,
  "projects": [
    {
      "id": "1",
      "name": "Website Redesign",
      "description": "Complete overhaul of company website with modern design",
      "status": "active",
      "progress": 65,
      "dueDate": "2025-02-15",
      "teamMembers": ["1", "2", "3"],
      "taskCount": 12,
      "completedTasks": 8,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create Project

**POST** `/api/workspaces/:workspaceId/projects`

**Request:**

```json
{
  "name": "Mobile App Development",
  "description": "Native iOS and Android app for customer portal",
  "dueDate": "2025-04-30",
  "teamMembers": ["2", "4", "5"]
}
```

## Tasks

### Get Tasks

**GET** `/api/projects/:projectId/tasks`

**Response:**

```json
{
  "success": true,
  "tasks": [
    {
      "id": "1",
      "title": "Design Homepage Mockup",
      "description": "Create wireframes and visual design",
      "status": "done",
      "priority": "high",
      "assignee": "2",
      "dueDate": "2025-01-20T00:00:00Z",
      "projectId": "1",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z",
      "comments": [
        {
          "id": "c1",
          "taskId": "1",
          "userId": "2",
          "userName": "Sarah Chen",
          "userAvatar": "https://images.unsplash.com/...",
          "content": "Initial wireframes are complete! 🎨 Take a look and let me know your thoughts.",
          "mentions": [],
          "attachments": [],
          "reactions": [
            {
              "id": "r1",
              "emoji": "👍",
              "userId": "1",
              "userName": "Alex Rodriguez",
              "timestamp": "2025-01-15T10:30:00Z"
            }
          ],
          "timestamp": "2025-01-15T09:00:00Z",
          "edited": null,
          "parentId": null
        }
      ],
      "attachments": [
        {
          "id": "a1",
          "name": "homepage-mockup-v1.pdf",
          "url": "/files/attachments/homepage-mockup-v1.pdf",
          "type": "file",
          "size": 1248576,
          "uploadedBy": "2",
          "uploadedAt": "2025-01-15T09:00:00Z"
        }
      ]
    }
  ]
}
```

### Create Task

**POST** `/api/projects/:projectId/tasks`

**Request:**

```json
{
  "title": "Implement User Authentication",
  "description": "Add login and registration functionality",
  "status": "todo",
  "priority": "high",
  "assignee": "1",
  "dueDate": "2025-02-01T00:00:00Z"
}
```

### Move Task

**PATCH** `/api/tasks/:taskId/move`

**Request:**

```json
{
  "status": "in-progress"
}
```

## Comments

### Add Comment

**POST** `/api/tasks/:taskId/comments`

**Request:**

```json
{
  "content": "Great work on this task! @john can you review the design?",
  "mentions": ["1"],
  "parentId": null
}
```

### Add Reaction

**POST** `/api/comments/:commentId/reactions`

**Request:**

```json
{
  "emoji": "👍"
}
```

## Kanban Columns

### Get Columns

**GET** `/api/workspaces/:workspaceId/columns`
**GET** `/api/projects/:projectId/columns`

**Response:**

```json
{
  "success": true,
  "columns": [
    {
      "id": "todo",
      "title": "To Do",
      "color": "bg-slate-100 dark:bg-slate-800",
      "position": 0,
      "isDefault": true,
      "projectId": null
    },
    {
      "id": "in-progress",
      "title": "In Progress",
      "color": "bg-blue-50 dark:bg-blue-900/20",
      "position": 1,
      "isDefault": true,
      "projectId": null
    },
    {
      "id": "done",
      "title": "Done",
      "color": "bg-green-50 dark:bg-green-900/20",
      "position": 2,
      "isDefault": true,
      "projectId": null
    }
  ]
}
```

### Create Column

**POST** `/api/workspaces/:workspaceId/columns`

**Request:**

```json
{
  "title": "Testing",
  "color": "bg-yellow-50 dark:bg-yellow-900/20",
  "position": 3
}
```

## Team Members

### Get Team Members

**GET** `/api/workspaces/:workspaceId/members`

**Response:**

```json
{
  "success": true,
  "members": [
    {
      "id": "1",
      "name": "John Smith",
      "email": "john@workflowhub.com",
      "role": "Lead Developer",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      "status": "active",
      "workspaceRole": "admin",
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## File Upload

### Upload Attachment

**POST** `/api/upload/attachment`

**Request:** (multipart/form-data)

```
file: [file]
taskId: "1"
```

**Response:**

```json
{
  "success": true,
  "attachment": {
    "id": "a1",
    "name": "document.pdf",
    "url": "/files/attachments/a1/document.pdf",
    "type": "file",
    "size": 1248576,
    "uploadedBy": "1",
    "uploadedAt": "2025-01-15T09:00:00Z"
  }
}
```

## Analytics & Reports

### Get Workspace Analytics

**GET** `/api/workspaces/:workspaceId/analytics`

**Response:**

```json
{
  "success": true,
  "analytics": {
    "productivity": [
      {
        "month": "Jan",
        "tasks": 120,
        "completed": 95,
        "efficiency": 79
      }
    ],
    "teamPerformance": [
      {
        "name": "Sarah Johnson",
        "tasks": 45,
        "completed": 42,
        "rate": 93
      }
    ],
    "projectStatus": [
      {
        "name": "Completed",
        "value": 35,
        "color": "#22C55E"
      }
    ]
  }
}
```

## Subscription & Billing

### Get Subscription Plans

**GET** `/api/subscription/plans`

**Response:**

```json
{
  "success": true,
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "priceMonthly": 0,
      "priceYearly": 0,
      "maxProjects": 3,
      "maxTeamMembers": 5,
      "storageGB": 0.01,
      "aiFeatures": false,
      "advancedAnalytics": false,
      "prioritySupport": false,
      "features": [
        "Up to 3 projects",
        "Up to 5 team members",
        "10MB storage",
        "Basic kanban boards"
      ]
    },
    {
      "id": "professional",
      "name": "Professional",
      "priceMonthly": 8,
      "priceYearly": 80,
      "maxProjects": -1,
      "maxTeamMembers": -1,
      "storageGB": 1,
      "aiFeatures": true,
      "advancedAnalytics": true,
      "prioritySupport": true,
      "features": [
        "Unlimited projects",
        "Unlimited team members",
        "1GB storage per user",
        "AI-powered features",
        "Advanced analytics",
        "Priority support"
      ]
    }
  ]
}
```

### Get Usage Statistics

**GET** `/api/workspaces/:workspaceId/usage`

**Response:**

```json
{
  "success": true,
  "usage": {
    "projects": {
      "used": 2,
      "limit": 3,
      "percentage": 67
    },
    "teamMembers": {
      "used": 4,
      "limit": 5,
      "percentage": 80
    },
    "storage": {
      "used": 0.008,
      "limit": 0.01,
      "percentage": 80
    }
  }
}
```

## WebSocket Events

### Connection

```javascript
// Client connects to: ws://localhost:3000/ws?token=jwt_token
```

### Real-time Events

#### Task Updated

```json
{
  "event": "task:updated",
  "data": {
    "taskId": "1",
    "projectId": "1",
    "changes": {
      "status": "in-progress"
    },
    "updatedBy": {
      "id": "1",
      "name": "John Smith"
    },
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

#### New Comment

```json
{
  "event": "comment:added",
  "data": {
    "taskId": "1",
    "comment": {
      "id": "c2",
      "content": "Looking good!",
      "userId": "1",
      "userName": "John Smith",
      "timestamp": "2025-01-15T10:30:00Z"
    }
  }
}
```

#### User Online Status

```json
{
  "event": "user:status",
  "data": {
    "userId": "1",
    "status": "online",
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Email is required",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Invalid credentials
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `WORKSPACE_LIMIT_EXCEEDED` - Plan limits exceeded
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `FILE_TOO_LARGE` - File size exceeds limit
- `INVALID_FILE_TYPE` - Unsupported file type
