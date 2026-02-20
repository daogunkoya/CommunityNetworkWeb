import { TopHeader } from './TopHeader';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <TopHeader />
      <main className="relative pt-16 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}