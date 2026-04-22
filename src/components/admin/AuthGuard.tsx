import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '@/src/lib/supabase';

export function AuthGuard() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await authService.getSession();
        
        if (!session) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        // Validate Profile
        const { data: profile, error } = await authService.getProfile(session.user.id);
        
        if (error || !profile || profile.role !== 'admin' || !profile.is_active) {
          console.error('Unauthorized access attempt:', error || 'Invalid role or inactive account');
          await authService.signOut();
          setAuthenticated(false);
        } else {
          setAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
