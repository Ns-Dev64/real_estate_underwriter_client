'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth'; // <-- import your context

export default function OAuthCallback() {
  const { setUser } = useAuth(); // <-- get setUser from context

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    const email = urlParams.get("email")!;
    const user = urlParams.get('user');
    
    if (error) {
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_ERROR', error }, window.location.origin);
        window.close();
      } else {
        window.location.href = `?error=${encodeURIComponent(error)}`;
      }
    } 
    else if (token && user) {
      try {
        // Decode the user parameter in case it's URL encoded
        const decodedUser = decodeURIComponent(user);
        const decodedEmail = decodeURIComponent(email);
        
        // Clean the username - remove any trailing characters like )}
        const cleanedUserName = decodedUser.replace(/[)}\s]+$/, '').trim();
        const cleanedEmail = decodedEmail.replace(/[)}\s]+$/, '').trim();
        
        console.log('Raw values from URL:', { user, email });
        console.log('Decoded values:', { decodedUser, decodedEmail });
        console.log('Cleaned values:', { cleanedUserName, cleanedEmail });

        // Create user payload
        let userPayload = {
          id: 'user-id',
          email: cleanedEmail,
          userName: cleanedUserName
        }
        
        console.log('OAuth success - storing user:', userPayload);

        // Store token & user data as JSON in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userPayload));

        // **Update global context**
        setUser(userPayload);

        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_SUCCESS', token, user: user }, window.location.origin);
          window.close();
        } else {
          window.location.href = '/';
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_ERROR', error: 'Failed to parse user data' }, window.location.origin);
          window.close();
        } else {
          alert("Error occurred while logging in");
        }
      }
    } 
    else {
      const errorMsg = 'Authentication failed - no data received';
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_ERROR', error: errorMsg }, window.location.origin);
        window.close();
      } else {
        alert("Error occurred while logging in");
      }
    }
  }, [setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">Processing Authentication</h2>
        <p className="mt-2 text-gray-600">Please wait while we complete your login...</p>
      </div>
    </div>
  );
}
