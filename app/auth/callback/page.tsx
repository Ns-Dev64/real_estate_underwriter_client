'use client';

import { useEffect } from 'react';

export default function OAuthCallback() {
  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    const user = urlParams.get('user');

    if (error) {
      // Send error to parent window (for popup)
      if (window.opener) {
        window.opener.postMessage({
          type: 'OAUTH_ERROR',
          error: error
        }, window.location.origin);
        window.close();
      } else {
        // For full page redirect, redirect to login with error
        window.location.href = `?error=${encodeURIComponent(error)}`;
      }
    } else if (token && user) {
      try {
        const userData = decodeURIComponent(user);
        
        if (window.opener) {
          // Send success data to parent window (popup approach)
          window.opener.postMessage({
            type: 'OAUTH_SUCCESS',
            user: userData
          }, window.location.origin);
          window.close();
        } else {
          // Full page redirect approach - store in localStorage and redirect
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          window.location.href = '/';
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
        if (window.opener) {
          window.opener.postMessage({
            type: 'OAUTH_ERROR',
            error: 'Failed to parse user data'
          }, window.location.origin);
          window.close();
        } else {
           alert("error occured while logging in");
        }
      }
    } else {
      // No token or user data
      const errorMsg = 'Authentication failed - no data received';
      if (window.opener) {
        window.opener.postMessage({
          type: 'OAUTH_ERROR',
          error: errorMsg
        }, window.location.origin);
        window.close();
      } else {
           alert("error occured while logging in");
      }
    }
  }, []);

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