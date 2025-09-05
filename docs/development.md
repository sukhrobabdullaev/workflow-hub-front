# Development Workflow Guide

This guide outlines the recommended development workflow for contributing to the Workflow Hub project.

## 🎯 Overview

Our development workflow is designed to ensure code quality, maintainability, and seamless collaboration. We follow Git Flow principles with automated quality gates and CI/CD integration.

## 🌊 Git Flow

### Branch Strategy

```
main (production)
├── develop (integration)
├── feature/user-authentication
├── feature/kanban-improvements
├── bugfix/task-assignment-issue
└── hotfix/critical-security-patch
```

### Branch Types

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: New features and enhancements
- **`bugfix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes
- **`chore/*`**: Maintenance and tooling updates

## 🚀 Development Process

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/your-org/workflow-hub-front.git
cd workflow-hub-front

# Install dependencies
npm install

# Setup pre-commit hooks
npm run prepare

# Start development server
npm run dev
```

### 2. Create Feature Branch

```bash
# Ensure you're on develop branch
git checkout develop
git pull origin develop

# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Or use git flow if available
git flow feature start your-feature-name
```

### 3. Development Cycle

#### Write Code

- Follow our [coding standards](#coding-standards)
- Use TypeScript for type safety
- Follow React best practices
- Write self-documenting code

#### Add Tests

```bash
# Run tests continuously during development
npm run test:watch

# Write tests for new functionality
# Place test files adjacent to source files
# Example: src/components/Button.test.tsx
```

#### Commit Changes

```bash
# Stage your changes
git add .

# Commit with conventional commit format
git commit -m "feat(auth): add two-factor authentication"

# Pre-commit hooks will automatically:
# - Run ESLint and fix issues
# - Format code with Prettier
# - Run type checking
# - Execute relevant tests
```

### 4. Quality Checks

Before pushing, ensure all quality gates pass:

```bash
# Run all linting
npm run lint

# Check TypeScript types
npm run type-check

# Run all tests with coverage
npm run test:coverage

# Build the project
npm run build

# Format check
npm run format:check
```

### 5. Push and Create Pull Request

```bash
# Push your feature branch
git push origin feature/your-feature-name

# Create pull request using GitHub UI
# Fill out the PR template completely
```

## 📋 Pull Request Process

### PR Requirements

- [ ] **Description**: Clear description of changes and motivation
- [ ] **Type**: Bug fix, feature, documentation, etc.
- [ ] **Testing**: Evidence that changes work as intended
- [ ] **Documentation**: Updated if necessary
- [ ] **Breaking Changes**: Clearly documented if any

### Automated Checks

Every PR triggers automated checks:

1. **Lint & Format**: ESLint and Prettier validation
2. **Type Check**: TypeScript compilation
3. **Tests**: Unit tests with coverage reporting
4. **Build**: Production build verification
5. **Security**: Vulnerability scanning
6. **Performance**: Lighthouse audit (for UI changes)

### Review Process

1. **Automated Review**: CI checks must pass
2. **Code Review**: At least one team member review required
3. **QA Review**: For user-facing changes
4. **Security Review**: For security-related changes

### Merge Requirements

- ✅ All CI checks passing
- ✅ Approved by required reviewers
- ✅ Up to date with target branch
- ✅ No merge conflicts

## 🏗️ Coding Standards

### TypeScript Guidelines

```typescript
// Use explicit interfaces for props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Use proper function component typing
const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  disabled = false,
  onClick,
  children,
}) => {
  // Component implementation
};

// Export with proper naming
export { Button };
export type { ButtonProps };
```

### React Guidelines

```typescript
// Use functional components with hooks
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  // Use proper hook patterns
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Custom hooks for reusable logic
  const { permissions } = useUserPermissions(userId);

  // Effect cleanup
  useEffect(() => {
    const controller = new AbortController();

    fetchUser(userId, { signal: controller.signal })
      .then(setUser)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [userId]);

  // Early returns for better readability
  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage />;

  return (
    <div className="user-profile">
      {/* Component JSX */}
    </div>
  );
};
```

### Testing Guidelines

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Button } from './Button';

describe('Button Component', () => {
  // Test user interactions
  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test accessibility
  it('is accessible', () => {
    render(<Button disabled>Disabled button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  // Test error conditions
  it('handles error states gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Test error scenario

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
```

### Styling Guidelines

```typescript
// Use Tailwind CSS classes with consistent patterns
const Card: React.FC<CardProps> = ({ variant, children }) => {
  const baseStyles = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  const variantStyles = {
    default: 'border-border',
    outline: 'border-2 border-primary',
    ghost: 'border-transparent shadow-none'
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant])}>
      {children}
    </div>
  );
};

// Use CSS variables for theming
// Define in index.css:
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
}
```

## 🔄 Release Process

### Version Bumping

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes (`2.0.0`)
- **MINOR**: New features, backward compatible (`1.1.0`)
- **PATCH**: Bug fixes, backward compatible (`1.0.1`)

### Release Workflow

1. **Feature Freeze**: Stop merging new features
2. **Release Branch**: Create from develop
3. **Testing**: Comprehensive QA testing
4. **Documentation**: Update changelog and docs
5. **Merge**: Merge to main and tag release
6. **Deploy**: Automated deployment to production

### Hotfix Process

For critical production issues:

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-issue

# Make minimal fix
# Test thoroughly
# Update version number

# Merge to main and develop
git checkout main
git merge hotfix/critical-issue
git tag v1.0.1

git checkout develop
git merge hotfix/critical-issue
```

## 🚨 Emergency Procedures

### Rollback Process

1. **Immediate**: Revert to previous deployment
2. **Investigation**: Identify root cause
3. **Fix**: Implement proper solution
4. **Deploy**: Test and redeploy

### Incident Response

1. **Assess**: Determine severity and impact
2. **Communicate**: Notify stakeholders
3. **Resolve**: Implement immediate fix
4. **Post-mortem**: Document learnings

## 📊 Metrics and Monitoring

### Code Quality Metrics

- **Test Coverage**: Minimum 80%
- **Build Time**: Target < 5 minutes
- **Bundle Size**: Monitor and optimize
- **Performance**: Lighthouse scores > 90

### Team Metrics

- **PR Size**: Aim for < 400 lines changed
- **Review Time**: Target < 24 hours
- **Deployment Frequency**: Multiple times per day
- **Lead Time**: From commit to production

## 🛠️ Tools and Automation

### Required Tools

- **VS Code**: With recommended extensions
- **Git**: Version 2.30+
- **Node.js**: Version 18+
- **Browser**: Chrome for development

### VS Code Extensions

Install recommended extensions for optimal experience:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens
- GitHub Copilot (if available)

### Automation

- **Pre-commit**: Automatic code formatting and linting
- **CI/CD**: Automated testing and deployment
- **Dependabot**: Automatic dependency updates
- **Security**: Automated vulnerability scanning

## 📚 Additional Resources

- [Contributing Guidelines](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [API Documentation](./api.md)
- [Component Library](./components.md)
- [Deployment Guide](./deployment.md)

---

For questions about the development workflow, please:

- Check existing documentation
- Search closed issues and discussions
- Create a new discussion for questions
- Contact the development team
