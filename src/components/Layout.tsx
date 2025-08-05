import { TopHeader } from './TopHeader';
import { MobileNavigation } from './MobileNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <main className="relative">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
}