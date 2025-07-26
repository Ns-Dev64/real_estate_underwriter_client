'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import { Building2, LogOut, User } from 'lucide-react';

export function Header() {
  const { user, logout, loading } = useAuth();
  
  // Debug: Log user state with detailed structure

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-semibold text-foreground">RealEstate Analyzer</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>
              {loading ? 'Loading...' : (
                (user && user.userName) || 
                (user && user.email) || 
                (user && typeof user === 'string' ? user : null) ||
                'User'
              )}
            </span>
          </div>
          
          <ThemeToggle />
          
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}