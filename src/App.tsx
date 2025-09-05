import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Projects } from '@/pages/Projects';
import { ProjectManagement } from '@/pages/ProjectManagement';
import { Team } from '@/pages/Team';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { Auth } from '@/pages/Auth';
import { Landing } from '@/pages/Landing';
import { OnboardingFlow } from '@/pages/Onboarding';
import { Profile } from '@/pages/Profile';
import { Billing } from '@/pages/Billing';
import { UserManagement } from '@/pages/UserManagement';
import { Reports } from '@/pages/Reports';
import { ResourcePlanning } from '@/pages/ResourcePlanning';
import { Approvals } from '@/pages/Approvals';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry for 4xx errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/landing" element={<Landing />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingFlow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Projects />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-management"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Team />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Analytics />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Billing />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <UserManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          {/*  */}
          <Route
            path="/approvals"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Approvals />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>        </BrowserRouter>
    </TooltipProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
