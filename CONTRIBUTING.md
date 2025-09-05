# Contributing Guidelines

Thank you for your interest in contributing to our project! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher (or pnpm/yarn equivalent)
- Git

### Setup Development Environment

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/workflow-hub-front.git
   cd workflow-hub-front
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up pre-commit hooks**

   ```bash
   npm run prepare
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `chore/description` - Maintenance tasks
- `docs/description` - Documentation updates

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**

```
feat(auth): add two-factor authentication
fix(dashboard): resolve data loading issue
docs: update API documentation
style: format code according to prettier rules
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Writing Tests

- Write tests for all new features and bug fixes
- Place test files next to the source files with `.test.tsx` or `.spec.tsx` extension
- Use descriptive test names that explain what is being tested
- Follow the AAA pattern: Arrange, Act, Assert

### Test Coverage Requirements

- Maintain minimum 80% code coverage
- All new features must include tests
- Bug fixes must include regression tests

## 🎨 Code Style

### ESLint and Prettier

Our project uses ESLint and Prettier for code formatting and linting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Format code
npm run format
```

### Code Style Guidelines

- Use TypeScript for all new code
- Follow React functional component patterns with hooks
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused
- Use absolute imports with the `@/` alias

### Component Guidelines

- Use PascalCase for component names
- Export components as named exports
- Include proper TypeScript interfaces for props
- Use React.memo() for performance optimization when appropriate

## 📚 Documentation

- Update README.md if your changes affect setup or usage
- Add JSDoc comments for new functions and components
- Update type definitions when modifying interfaces
- Include examples in documentation when helpful

## 🔄 Pull Request Process

### Before Submitting

1. **Check your code**

   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```

2. **Update documentation**
   - Update README if necessary
   - Add/update comments for complex code
   - Update CHANGELOG.md

3. **Test thoroughly**
   - Test your changes locally
   - Test edge cases
   - Ensure no regressions

### PR Requirements

- [ ] Code follows our style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console.log statements (use console.warn/error if needed)
- [ ] TypeScript errors resolved
- [ ] Performance impact considered

### PR Description Template

Use our PR template and include:

- Clear description of changes
- Type of change (feature, bugfix, etc.)
- Testing instructions
- Screenshots for UI changes
- Breaking changes (if any)

## 🐛 Bug Reports

When filing a bug report, include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment details (OS, browser, Node.js version)
- Console errors or logs

## 💡 Feature Requests

For feature requests, include:

- Problem statement
- Proposed solution
- Use cases and benefits
- Possible alternatives considered
- Implementation suggestions (optional)

## 🚨 Security Issues

For security vulnerabilities:

- **DO NOT** open a public issue
- Email us directly at security@example.com
- Include detailed description and reproduction steps
- We'll respond within 48 hours

## 📞 Getting Help

- **Questions:** Open a discussion on GitHub
- **Bugs:** Create an issue with the bug template
- **Chat:** Join our Discord/Slack community
- **Documentation:** Check our wiki and README

## 🏆 Recognition

Contributors are recognized in:

- CONTRIBUTORS.md file
- Release notes for significant contributions
- Annual contributor spotlight

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to make this project better! 🎉
