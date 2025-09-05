# 🚀 Pre-Commit Checklist

Before committing your code updates, follow this comprehensive checklist to ensure quality and prevent CI/CD failures.

## ✅ **Essential Pre-Commit Steps**

### **1. Code Quality Checks**

```bash
# 1️⃣ Check code formatting
pnpm run format:check

# 2️⃣ Auto-fix formatting if needed
pnpm run format

# 3️⃣ Run linting (currently needs TypeScript config fix)
pnpm run lint

# 4️⃣ Check TypeScript types
pnpm run type-check

# 5️⃣ Run all tests
pnpm run test

# 6️⃣ Run tests with coverage
pnpm run test:coverage

# 7️⃣ Build the application
pnpm run build
```

### **2. Git Status Check**

```bash
# Check what files are changed
git status

# Review your changes
git diff

# Check for untracked files that should be included
git ls-files --others --exclude-standard
```

### **3. Current Issues to Fix First**

#### **🔧 TypeScript ESLint Configuration**

The ESLint configuration needs to be updated. Currently failing because TypeScript parser isn't properly configured.

**Fix:**

```bash
# Install missing TypeScript ESLint dependencies
pnpm add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier

# Update .eslintrc.cjs with proper TypeScript support
```

#### **📦 Package Manager Consistency**

- ✅ Updated CI/CD to use `pnpm` instead of `npm`
- ✅ All workflows now use `pnpm install --frozen-lockfile`

## 🔍 **Specific Things to Check**

### **File-Specific Checks**

#### **📋 Package.json**

- [ ] All new dependencies are in correct section (dependencies vs devDependencies)
- [ ] Scripts are properly defined and work locally
- [ ] Version bumping follows semantic versioning

#### **🔧 Configuration Files**

- [ ] `.eslintrc.cjs` - ESLint configuration is valid
- [ ] `.prettierrc` - Prettier settings work as expected
- [ ] `tsconfig.json` - TypeScript compilation succeeds
- [ ] `vite.config.ts` - Build configuration is correct

#### **🧪 Tests**

- [ ] All existing tests still pass
- [ ] New features have corresponding tests
- [ ] Test coverage meets minimum threshold (80%)
- [ ] No test files are accidentally committed with `.only` or `.skip`

#### **📚 Documentation**

- [ ] README.md reflects current setup
- [ ] CONTRIBUTING.md is up to date
- [ ] Any new features are documented
- [ ] API changes are documented

### **🚨 Security Checks**

```bash
# Check for secrets or sensitive data
git diff --cached | grep -E "(password|secret|key|token|api_key)" || echo "✅ No obvious secrets found"

# Check for large files
find . -size +100M -not -path "./node_modules/*" -not -path "./.git/*" || echo "✅ No large files found"
```

### **🎯 Performance Checks**

```bash
# Check bundle size (after build)
pnpm run build:analyze  # if available

# Check for performance regressions in critical files
ls -la dist/assets/  # Check asset sizes after build
```

## 🚀 **Commit Process**

### **1. Staging Files**

```bash
# Stage specific files
git add <file1> <file2>

# Or stage all changes (be careful!)
git add .

# Review staged changes
git diff --cached
```

### **2. Commit Message Format**

Follow conventional commits format:

```bash
# Examples of good commit messages:
git commit -m "feat(auth): add two-factor authentication support"
git commit -m "fix(dashboard): resolve data loading issue on mobile"
git commit -m "docs: update contributing guidelines"
git commit -m "chore(deps): update development dependencies"
git commit -m "test: add unit tests for user authentication"
```

**Commit Types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test-related changes
- `chore`: Maintenance tasks
- `ci`: CI/CD related changes
- `perf`: Performance improvements

### **3. Pre-Commit Hook Verification**

The pre-commit hooks will automatically run:

- ✅ ESLint with auto-fix
- ✅ Prettier formatting
- ✅ TypeScript type checking
- ✅ Staged file linting

If hooks fail:

```bash
# Fix the issues manually, then re-stage and commit
pnpm run lint:fix
pnpm run format
git add .
git commit -m "your message"
```

## 🔄 **CI/CD Readiness Check**

### **Verify CI/CD Pipeline**

Before pushing, ensure your changes won't break the pipeline:

```bash
# Simulate CI checks locally
echo "🧹 Formatting..." && pnpm run format:check
echo "🔍 Linting..." && pnpm run lint
echo "📋 Type checking..." && pnpm run type-check
echo "🧪 Testing..." && pnpm run test:coverage
echo "🏗️ Building..." && pnpm run build
echo "✅ All checks passed! Ready to push."
```

### **Environment Variables**

- [ ] No hardcoded secrets in code
- [ ] Environment variables are documented
- [ ] `.env.example` is updated if needed

## 📊 **Quality Metrics to Meet**

### **Code Coverage**

- [ ] Overall coverage > 80%
- [ ] New features have tests
- [ ] Critical paths are well-tested

### **Performance**

- [ ] Build time < 5 minutes
- [ ] Bundle size is reasonable
- [ ] No obvious performance regressions

### **Security**

- [ ] No vulnerabilities in dependencies
- [ ] No secrets in code
- [ ] Proper input validation

## 🚨 **Red Flags - Don't Commit If:**

- ❌ Tests are failing
- ❌ TypeScript compilation errors
- ❌ ESLint errors (warnings might be OK)
- ❌ Build fails
- ❌ Secrets or API keys in code
- ❌ Large files (>100MB) without LFS
- ❌ Commented-out code blocks
- ❌ `console.log` statements in production code
- ❌ Temporary files or IDE-specific files

## 🎯 **Final Verification**

```bash
# Quick final check script
echo "🔍 Final verification..."
echo "✅ Working directory clean: $(git status --porcelain | wc -l) files changed"
echo "✅ Branch: $(git branch --show-current)"
echo "✅ Commit message follows convention"
echo "✅ All checks passed locally"
echo "🚀 Ready to push!"
```

## 🚀 **Push and Monitor**

```bash
# Push to your feature branch
git push origin your-branch-name

# Monitor the CI/CD pipeline
# Check GitHub Actions tab for build status
# Address any CI failures immediately
```

---

## 🛠️ **Quick Commands Reference**

```bash
# Full quality check sequence
pnpm run format && pnpm run lint && pnpm run type-check && pnpm run test && pnpm run build

# Commit with conventional format
git commit -m "type(scope): description"

# Push and track
git push -u origin branch-name
```

Remember: **Quality first, speed second!** Taking time for proper checks saves hours of debugging later. 🎯
