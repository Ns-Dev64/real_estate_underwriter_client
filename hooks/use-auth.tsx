'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { config } from '@/lib/config';

interface User {
  id: string;
  email: string;
  userName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, userName: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshToken: () => Promise<boolean>;
  makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // Try to parse as JSON first (new format)
        const parsedUser = JSON.parse(userData);
        
        // Clean the userName if it has trailing characters
        if (parsedUser.userName) {
          parsedUser.userName = parsedUser.userName.replace(/[)}\s]+$/, '').trim();
        }
        if (parsedUser.email) {
          parsedUser.email = parsedUser.email.replace(/[)}\s]+$/, '').trim();
        }
                
        // Update localStorage with cleaned data
        localStorage.setItem('user', JSON.stringify(parsedUser));
        setUser(parsedUser);
      } catch (error) {
        // If JSON parsing fails, assume it's old format (plain string)
        // Convert old format to new format
        const cleanedUserName = decodeURIComponent(userData).replace(/[)}\s]+$/, '').trim();
        const userPayload = {
          id: 'user-id',
          email: '', // We don't have email in old format
          userName: cleanedUserName
        };
        // Update localStorage with new format
        localStorage.setItem('user', JSON.stringify(userPayload));
        setUser(userPayload);
      }
    }
    setLoading(false);
  }, []);

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh');
      if (!refreshTokenValue) {
        return false;
      }

      const response = await fetch(`${config.BACKEND_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const newToken = data.token || data.data?.token;
      const userName = data.userName || data.data?.userName;

      if (newToken) {
        localStorage.setItem('token', newToken);
        
        // Update user data if we have userName
        if (userName && user) {
          const updatedUser = { ...user, userName };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('token');
    
    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    };

    let response = await fetch(url, requestOptions);

    // If request fails with 401, try to refresh token
    if (response.status === 401) {
      const refreshSuccess = await refreshToken();
      
      if (refreshSuccess) {
        // Retry the request with new token
        const newToken = localStorage.getItem('token');
        const retryOptions = {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          },
        };
        response = await fetch(url, retryOptions);
      } else {
        // Refresh failed, logout user
        logout();
        window.location.href = '/';
        throw new Error('Authentication failed');
      }
    }

    return response;
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${config.BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {

      throw new Error('Login failed');
    }

    const data = await response.json();
    const user = {
      id: 'user-id', // Backend doesn't return user ID in login response
      email: email,
      userName: data.username,
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('refresh',data.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };



  const register = async (email: string, userName: string, password: string) => {
    const response = await fetch(`${config.BACKEND_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, userName, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    // After registration, automatically log in
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("refresh");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Enhanced setUser function that also persists to localStorage
  const setUserWithPersistence = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  const contextValue = { 
    user, 
    loading, 
    login, 
    register, 
    logout, 
    setUser: setUserWithPersistence,
    refreshToken,
    makeAuthenticatedRequest
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}