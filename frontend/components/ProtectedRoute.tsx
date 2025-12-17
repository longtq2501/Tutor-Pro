'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<'ADMIN' | 'TUTOR' | 'STUDENT'>;
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, hasAnyRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Check role requirements
      if (requiredRoles && requiredRoles.length > 0) {
        if (!hasAnyRole(requiredRoles)) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [loading, isAuthenticated, user, router, requiredRoles, hasAnyRole]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or not authorized
  if (!isAuthenticated || (requiredRoles && !hasAnyRole(requiredRoles))) {
    return null;
  }

  // Authorized, render children
  return <>{children}</>;
}