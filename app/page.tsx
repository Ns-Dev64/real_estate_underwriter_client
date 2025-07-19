'use client';

import { AuthTabs } from '@/components/auth/auth-tabs';
import { Dashboard } from '@/components/dashboard/dashboard';
import { ThemeProvider } from '@/components/theme-provider';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        {user ? <Dashboard /> : <AuthTabs />}
      </div>
    </ThemeProvider>
  );
}