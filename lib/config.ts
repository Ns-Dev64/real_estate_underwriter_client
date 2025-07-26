export const config = {
  // Backend API URL - can be overridden by environment variable
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://real-estate-underwriter-server.onrender.com/api/v1',
  
  // Frontend URL for OAuth callbacks
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
} as const;
