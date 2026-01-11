/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { authService, type UserInfo } from '@/lib/services';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: 'ADMIN' | 'TUTOR' | 'STUDENT') => boolean;
  hasAnyRole: (roles: Array<'ADMIN' | 'TUTOR' | 'STUDENT'>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        // Validate storedUser before parsing
        if (accessToken && storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
          try {
            setUser(JSON.parse(storedUser));
          } catch (parseError) {
            // Invalid JSON in localStorage, clear it
            console.warn('Invalid user data in localStorage, clearing...');
            localStorage.removeItem('user');
          }

          // Verify token is still valid
          try {
            const response = await authService.getCurrentUser();
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          } catch (error) {
            // Token invalid, clear storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      const { accessToken, refreshToken, user: userData } = response.data;

      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const hasRole = useCallback((role: 'ADMIN' | 'TUTOR' | 'STUDENT'): boolean => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles: Array<'ADMIN' | 'TUTOR' | 'STUDENT'>): boolean => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}