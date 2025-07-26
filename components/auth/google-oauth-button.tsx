'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { config } from '@/lib/config';

interface GoogleOAuthButtonProps {
  method?: 'popup' | 'redirect';
  disabled?: boolean;
}

export function GoogleOAuthButton({ method = 'popup', disabled }: GoogleOAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleGoogleLogin = () => {
    setLoading(true);
    const googleAuthUrl = `${config.BACKEND_URL}/google`;

    if (method === 'popup') {
      handlePopupLogin(googleAuthUrl);
    } else {
      handleRedirectLogin(googleAuthUrl);
    }
  };

  const handlePopupLogin = (authUrl: string) => {
    const popup = window.open(
      authUrl,
      'google-oauth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    if (!popup) {
      setLoading(false);
      alert('Please allow popups for this site to use Google login');
      return;
    }

    // Listen for messages from the popup
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'OAUTH_SUCCESS') {
        const { token, user } = event.data;
        
        // Store authentication data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update auth context
        setUser(user);
        
        // Close popup
        popup.close();
        setLoading(false);
        
        // Redirect to dashboard
        window.location.href = '/';
      } else if (event.data.type === 'OAUTH_ERROR') {
        console.error('OAuth Error:', event.data.error);
        setLoading(false);
        alert(`Authentication failed: ${event.data.error}`);
        popup.close();
      }
    };

    window.addEventListener('message', handleMessage);

    // Check if popup was closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        setLoading(false);
      }
    }, 1000);
  };

  const handleRedirectLogin = (authUrl: string) => {
    // For redirect method, just navigate to the auth URL
    // The backend should redirect back to /auth/callback after authentication
    window.location.href = authUrl;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleLogin}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      <svg
        className="mr-2 h-4 w-4"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </Button>
  );
}
