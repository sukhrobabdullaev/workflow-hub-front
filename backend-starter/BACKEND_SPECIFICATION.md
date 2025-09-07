# WorkflowHub Backend Specification

## Overview

This document provides a comprehensive specification for building the WorkflowHub backend based on the frontend implementation. The backend should support all current frontend features and provide a scalable foundation for future enhancements.

## Technology Stack Recommendations

### Core Framework

- **Node.js with Express.js** (JavaScript/TypeScript)
- **Python with FastAPI** (Python)
- **Go with Gin/Fiber** (Go)
- **Java with Spring Boot** (Java)

### Database

- **PostgreSQL** (Primary recommendation - supports complex relationships)
- **MongoDB** (Alternative for document-based approach)

### Authentication

- **JWT tokens** for session management
- **OAuth2** for social authentication
- **bcrypt** for password hashing

### File Storage

- **AWS S3** / **Google Cloud Storage** / **Azure Blob Storage**
- **Local storage** for development

### Real-time Features

- **Socket.io** (Node.js)
- **WebSockets** (any framework)

## Database Schema

### 1. Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- NULL for social auth users
    avatar_url VARCHAR(500),
    plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'professional', 'enterprise')),
    company_name VARCHAR(255),
    company_size VARCHAR(100),
    industry VARCHAR(100),
    goals TEXT[], -- Array of goals
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Workspaces Table

```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'professional', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Workspace Memberships Table

```sql
CREATE TABLE workspace_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'member')),
    is_owner BOOLEAN DEFAULT FALSE,
    invited_by UUID REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, user_id)
);
```

### 4. Projects Table

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'on-hold')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    due_date DATE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Project Members Table

```sql
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100), -- Project-specific role
    added_by UUID REFERENCES users(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);
```

### 6. Kanban Columns Table

```sql
CREATE TABLE kanban_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    color VARCHAR(100),
    position INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT kanban_columns_scope_check CHECK (
        (workspace_id IS NOT NULL AND project_id IS NULL) OR
        (workspace_id IS NULL AND project_id IS NOT NULL)
    )
);
```

### 7. Tasks Table

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(100) NOT NULL, -- References kanban_columns.id or predefined statuses
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    assignee_id UUID REFERENCES users(id),
    due_date TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Task Comments Table

```sql
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    mentions UUID[], -- Array of mentioned user IDs
    parent_id UUID REFERENCES task_comments(id), -- For reply threads
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Task Attachments Table

```sql
CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('file', 'image', 'video', 'recording')),
    file_size BIGINT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Comment Reactions Table

```sql
CREATE TABLE comment_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES task_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id, emoji)
);
```

### 11. Invitations Table

```sql
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'member')),
    invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 12. Subscription Plans Table

```sql
CREATE TABLE subscription_plans (
    id VARCHAR(50) PRIMARY KEY, -- 'free', 'professional', 'enterprise'
    name VARCHAR(100) NOT NULL,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    max_projects INTEGER, -- -1 for unlimited
    max_team_members INTEGER, -- -1 for unlimited
    storage_gb DECIMAL(10,2), -- -1 for unlimited
    ai_features BOOLEAN DEFAULT FALSE,
    advanced_analytics BOOLEAN DEFAULT FALSE,
    priority_support BOOLEAN DEFAULT FALSE,
    features JSONB DEFAULT '[]'
);
```

### 13. Subscription Usage Table

```sql
CREATE TABLE subscription_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    projects_used INTEGER DEFAULT 0,
    team_members_used INTEGER DEFAULT 0,
    storage_used_gb DECIMAL(10,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "companyName": "string?" // Optional
}
```

#### POST /api/auth/login

```json
{
  "email": "string",
  "password": "string"
}
```

#### POST /api/auth/social

```json
{
  "provider": "google|github|microsoft",
  "token": "string",
  "userData": {
    "name": "string",
    "email": "string",
    "avatar": "string?"
  }
}
```

#### POST /api/auth/logout

#### POST /api/auth/refresh

#### POST /api/auth/forgot-password

#### POST /api/auth/reset-password

#### GET /api/auth/verify-email/:token

#### POST /api/auth/resend-verification

### User Endpoints

#### GET /api/user/profile

#### PUT /api/user/profile

#### POST /api/user/complete-onboarding

#### POST /api/user/enable-2fa

#### POST /api/user/verify-2fa

#### POST /api/user/upload-avatar

### Workspace Endpoints

#### GET /api/workspaces

#### POST /api/workspaces

#### GET /api/workspaces/:id

#### PUT /api/workspaces/:id

#### DELETE /api/workspaces/:id

#### POST /api/workspaces/:id/switch

### Workspace Member Endpoints

#### GET /api/workspaces/:id/members

#### POST /api/workspaces/:id/invite

#### PUT /api/workspaces/:id/members/:userId

#### DELETE /api/workspaces/:id/members/:userId

#### GET /api/workspaces/:id/invitations

#### POST /api/invitations/:token/accept

#### DELETE /api/invitations/:id

### Project Endpoints

#### GET /api/workspaces/:workspaceId/projects

#### POST /api/workspaces/:workspaceId/projects

#### GET /api/projects/:id

#### PUT /api/projects/:id

#### DELETE /api/projects/:id

#### GET /api/projects/:id/members

#### POST /api/projects/:id/members

#### DELETE /api/projects/:id/members/:userId

### Task Endpoints

#### GET /api/projects/:projectId/tasks

#### POST /api/projects/:projectId/tasks

#### GET /api/tasks/:id

#### PUT /api/tasks/:id

#### DELETE /api/tasks/:id

#### PATCH /api/tasks/:id/move

### Kanban Column Endpoints

#### GET /api/workspaces/:workspaceId/columns

#### GET /api/projects/:projectId/columns

#### POST /api/workspaces/:workspaceId/columns

#### POST /api/projects/:projectId/columns

#### PUT /api/columns/:id

#### DELETE /api/columns/:id

### Comment Endpoints

#### GET /api/tasks/:taskId/comments

#### POST /api/tasks/:taskId/comments

#### PUT /api/comments/:id

#### DELETE /api/comments/:id

#### POST /api/comments/:id/reactions

#### DELETE /api/comments/:id/reactions

### File Upload Endpoints

#### POST /api/upload/avatar

#### POST /api/upload/attachment

#### DELETE /api/attachments/:id

### Analytics Endpoints

#### GET /api/workspaces/:workspaceId/analytics

#### GET /api/projects/:projectId/analytics

#### GET /api/workspaces/:workspaceId/reports

### Subscription Endpoints

#### GET /api/subscription/plans

#### GET /api/workspaces/:workspaceId/subscription

#### POST /api/workspaces/:workspaceId/upgrade

#### GET /api/workspaces/:workspaceId/usage

#### GET /api/workspaces/:workspaceId/billing/invoices

## Business Logic Requirements

### 1. Authentication & Authorization

- JWT-based authentication
- Role-based access control (admin, manager, member)
- Workspace-level permissions
- Social authentication support
- Two-factor authentication
- Email verification

### 2. Workspace Management

- Multi-workspace support
- Workspace switching
- Owner vs member roles
- Invitation system with email tokens
- Workspace settings and preferences

### 3. Project Management

- CRUD operations for projects
- Project member management
- Progress tracking
- Due date management
- Project status lifecycle

### 4. Task Management

- Kanban board functionality
- Custom column support
- Task assignment and reassignment
- Priority levels
- Due dates and reminders
- Task dependencies (future feature)

### 5. Collaboration Features

- Commenting system with threading
- @mentions with notifications
- Emoji reactions
- File attachments
- Real-time updates via WebSockets

### 6. Subscription Management

- Plan limits enforcement
- Usage tracking
- Upgrade/downgrade flows
- Feature gating
- Billing integration (Stripe recommended)

### 7. File Management

- Secure file upload
- File type validation
- Size limits based on plan
- Cloud storage integration
- File deletion and cleanup

### 8. Real-time Features

- Live task updates
- Online user presence
- Real-time notifications
- Live collaboration indicators

## Security Considerations

### 1. Data Protection

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting

### 2. Authentication Security

- Password strength requirements
- Secure password hashing (bcrypt)
- JWT token expiration
- Refresh token rotation
- Account lockout mechanisms

### 3. Authorization

- Resource-level permissions
- Workspace isolation
- API endpoint protection
- File access control

### 4. Data Privacy

- GDPR compliance
- Data encryption at rest
- Secure data transmission (HTTPS)
- Audit logging

## Performance Optimization

### 1. Database Optimization

- Proper indexing strategy
- Query optimization
- Connection pooling
- Read replicas for scaling

### 2. Caching Strategy

- Redis for session storage
- Application-level caching
- Database query caching
- CDN for static assets

### 3. API Performance

- Pagination for list endpoints
- Response compression
- API versioning
- Background job processing

## Deployment Considerations

### 1. Infrastructure

- Docker containerization
- Cloud deployment (AWS/GCP/Azure)
- Load balancing
- Auto-scaling
- Health checks

### 2. Monitoring

- Application performance monitoring
- Error tracking
- Log aggregation
- Metrics and alerting

### 3. Backup & Recovery

- Database backups
- File storage backups
- Disaster recovery plan
- Data retention policies

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/worklowhub
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secure-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# File Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=workflowhub-files
AWS_S3_REGION=us-east-1

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password

# Stripe (for billing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8080
```

## Frontend Integration Points

The backend should maintain compatibility with the current frontend by:

1. **Matching Data Structures**: Ensure API responses match the TypeScript interfaces
2. **Error Handling**: Consistent error response format
3. **Authentication Flow**: Support the current login/register/social auth flows
4. **WebSocket Events**: Real-time updates for collaborative features
5. **File Upload**: Support the current file attachment system

This specification provides a complete foundation for building a production-ready backend that supports all current frontend features and provides room for future growth.
