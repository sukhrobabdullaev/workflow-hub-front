import { SidebarProvider } from '@/components/ui/sidebar';
import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const AppLayout = ({ children, showFooter = false }: AppLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-surface">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">{children}</main>
          {showFooter && <AppFooter />}
        </div>
      </div>
    </SidebarProvider>
  );
};
