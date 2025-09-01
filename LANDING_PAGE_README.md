# WorkflowHub - Modern Project Management Platform

## Overview

WorkflowHub is a modern, feature-rich project management platform designed to streamline team collaboration and boost productivity. Built with React, TypeScript, and modern UI components, it offers a comprehensive solution for teams of all sizes.

## Features

### 🏠 **Landing Page**

- **Modern Design**: Clean, professional layout inspired by Jira and ClickUp
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Responsive**: Fully responsive design that works on all devices
- **Hero Section**: Compelling headline with gradient text effects
- **Feature Showcase**: Six key features with animated cards
- **Testimonials**: Social proof from satisfied customers
- **Pricing Plans**: Three-tier pricing structure (Starter, Professional, Enterprise)
- **Interactive Demo**: Modal-based demo video showcase
- **Call-to-Action**: Multiple conversion points throughout the page

### 🔐 **Authentication System**

- **Split-Screen Design**: Modern two-panel auth layout
- **Login/Register Forms**: Seamless switching between modes
- **Demo Credentials**: Built-in demo account for easy testing
- **Form Validation**: Comprehensive client-side validation
- **Success Redirects**: Automatic redirect to dashboard after auth
- **Persistent Sessions**: Zustand-powered auth state management

### 📊 **Dashboard & Project Management**

- **Project Cards**: Visual project overview with progress bars
- **Team Management**: Team member avatars and role assignments
- **Task Management**: Full CRUD operations for tasks
- **Kanban Board**: Drag-and-drop task management
- **Analytics**: Project insights and team performance metrics
- **Real-time Updates**: Live collaboration features

## Technology Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development experience
- **Vite** - Fast build tool and development server
- **Framer Motion** - Smooth animations and page transitions
- **React Router** - Client-side routing with protected routes

### UI Framework

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Beautiful, customizable icons
- **Custom Components** - Reusable UI components

### State Management

- **Zustand** - Lightweight state management
- **React Query** - Server state management and caching
- **Persistent Storage** - Local storage integration

### Development Tools

- **ESLint** - Code linting and formatting
- **TypeScript Compiler** - Type checking
- **Hot Module Replacement** - Fast development iteration

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── auth/              # Authentication forms
│   ├── layout/            # Layout components
│   ├── modals/            # Modal dialogs
│   ├── kanban/            # Kanban board components
│   └── DemoVideo.tsx      # Demo video component
├── pages/
│   ├── Landing.tsx        # Landing page
│   ├── Auth.tsx           # Authentication page
│   ├── Dashboard.tsx      # Main dashboard
│   ├── Projects.tsx       # Projects overview
│   └── ...
├── store/
│   ├── authStore.ts       # Authentication state
│   └── appStore.ts        # Application state
├── hooks/
│   └── use-toast.ts       # Toast notifications
└── lib/
    └── utils.ts           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd workflow-hub-front
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8081
   ```

### Demo Credentials

For testing the authentication system:

- **Email**: `john@workflowhub.com`
- **Password**: `password`

## Page Routes

### Public Routes

- `/` - Landing page (home)
- `/landing` - Landing page (explicit)
- `/auth` - Authentication (login/register)

### Protected Routes

- `/dashboard` - Main dashboard
- `/projects` - Projects overview
- `/project-management` - Kanban board
- `/team` - Team management
- `/analytics` - Analytics and reports
- `/settings` - User settings

## Key Components

### Landing Page Sections

1. **Navigation Bar**

   - Logo and branding
   - Navigation menu
   - Sign In/Get Started buttons
   - Sticky behavior on scroll

2. **Hero Section**

   - Gradient headline text
   - Feature callouts
   - Call-to-action buttons
   - Animated dashboard preview

3. **Features Section**

   - Six feature cards with icons
   - Hover animations
   - Responsive grid layout

4. **Testimonials**

   - Customer reviews
   - Star ratings
   - Customer avatars and details

5. **Pricing Section**

   - Three pricing tiers
   - Feature comparisons
   - Popular plan highlighting
   - CTA buttons for each plan

6. **Footer**
   - Company links
   - Product information
   - Support resources

### Authentication Flow

1. **Landing Page Entry**

   - Users land on the homepage
   - Clear CTAs direct to auth page

2. **Auth Page Design**

   - Split-screen layout
   - Left: Branding and benefits
   - Right: Login/register forms

3. **Form Handling**

   - Real-time validation
   - Loading states
   - Error handling
   - Success notifications

4. **Post-Auth Redirect**
   - Automatic redirect to dashboard
   - Session persistence
   - Welcome notifications

## Animations & Interactions

### Landing Page Animations

- **Fade in up**: Content appears from bottom
- **Stagger animations**: Sequential element reveals
- **Scroll triggers**: Animations triggered by viewport
- **Hover effects**: Interactive card and button states
- **Parallax elements**: Subtle background movement

### Demo Video Modal

- **Backdrop blur**: Professional modal overlay
- **Scale animation**: Smooth modal appearance
- **Feature showcase**: Animated feature cards
- **Auto-rotation**: Continuous demo elements

## Mock Data

The application includes comprehensive mock data for:

- **8 Projects**: Diverse project types and statuses
- **Team Members**: Multiple user roles and avatars
- **Tasks**: Various task states and priorities
- **Analytics**: Sample metrics and reports

## Responsive Design

### Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Optimizations

- **Collapsible navigation**: Hamburger menu
- **Stacked layouts**: Single-column on mobile
- **Touch-friendly buttons**: Larger tap targets
- **Optimized typography**: Readable text sizes

## Performance Optimizations

- **Code splitting**: Route-based lazy loading
- **Image optimization**: Responsive images
- **Bundle optimization**: Tree shaking and minification
- **Caching strategies**: React Query caching
- **CSS optimization**: Tailwind CSS purging

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## Environment Configuration

The application works out of the box with mock data. For production deployment:

1. **Environment variables** (if needed)
2. **API endpoint configuration**
3. **Authentication provider setup**
4. **Database connections**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**WorkflowHub** - Transform your team's productivity with modern project management tools.
