'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { Building2 } from 'lucide-react';

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState('login');
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    // Check for OAuth error in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      setOauthError(decodeURIComponent(error));
      // Clear the error from URL without page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Building2 className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-2xl font-bold text-foreground">RealEstate Analyzer</h1>
        </div>

        {oauthError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Authentication failed: {oauthError}
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Analyze real estate deals with precision and confidence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register" className="space-y-4">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}