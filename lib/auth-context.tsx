"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  address?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        // Handle error silently
        console.error("Error checking authentication status", err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      router.push('/'); // Redirect to home page after login
    } catch (err: any) {
      console.error('Login error:', err);
      // Extract error message from response if available
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(userData);
      // After registration, log the user in
      await authService.login(userData.email, userData.password);
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      router.push('/'); // Redirect to home page after registration
    } catch (err: any) {
      console.error('Registration error:', err);
      // Extract error message from response if available
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // We're making this async to allow for a proper loading state in UI
    authService.logout();
    setUser(null);
    await router.push('/login');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
