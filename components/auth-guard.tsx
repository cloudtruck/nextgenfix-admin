'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Public routes that don't require authentication
      const publicRoutes = ['/login', '/signup'];
      const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

      if (!isPublicRoute) {
        // Check for token in localStorage
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          // No token found, redirect to login
          router.push('/login');
          return;
        }
      } else {
        // If on public route and has token, redirect to dashboard
        const token = localStorage.getItem('adminToken');
        if (token) {
          router.push('/dashboard');
          return;
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Show nothing while checking (prevents flash of unauthorized content)
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
