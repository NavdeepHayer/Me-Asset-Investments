import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  adminChecked: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  // Admin functions
  adminListUsers: () => Promise<{ users: AdminUser[] | null; error: string | null }>;
  adminInviteUser: (email: string) => Promise<{ error: string | null }>;
  adminResetUserPassword: (email: string) => Promise<{ error: string | null }>;
  adminToggleAdmin: (userId: string) => Promise<{ is_admin: boolean | null; error: string | null }>;
  adminDeleteUser: (userId: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Edge function URL - will be set from environment
const getEdgeFunctionUrl = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    return null;
  }
  return `${supabaseUrl}/functions/v1/admin-user-management`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  // Check admin status when user changes
  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.is_admin || false);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
    } finally {
      setAdminChecked(true);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminStatus(session.user.id);
      } else {
        setAdminChecked(true);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
          setAdminChecked(true);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setIsAdmin(false);
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  // Admin API helper
  const callAdminApi = async (body: Record<string, unknown>) => {
    const edgeFunctionUrl = getEdgeFunctionUrl();
    if (!edgeFunctionUrl) {
      return { data: null, error: 'Supabase not configured' };
    }

    if (!session?.access_token) {
      return { data: null, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: data.error || 'Request failed' };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Request failed' };
    }
  };

  // Admin functions
  const adminListUsers = async () => {
    const { data, error } = await callAdminApi({ action: 'list-users' });
    if (error) return { users: null, error };
    return { users: data?.users || [], error: null };
  };

  const adminInviteUser = async (email: string) => {
    const { error } = await callAdminApi({ action: 'invite', email });
    return { error };
  };

  const adminResetUserPassword = async (email: string) => {
    const { error } = await callAdminApi({ action: 'reset-password', email });
    return { error };
  };

  const adminToggleAdmin = async (userId: string) => {
    const { data, error } = await callAdminApi({ action: 'toggle-admin', userId });
    if (error) return { is_admin: null, error };
    return { is_admin: data?.is_admin, error: null };
  };

  const adminDeleteUser = async (userId: string) => {
    const { error } = await callAdminApi({ action: 'delete-user', userId });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    adminChecked,
    signIn,
    signUp,
    signOut,
    resetPassword,
    adminListUsers,
    adminInviteUser,
    adminResetUserPassword,
    adminToggleAdmin,
    adminDeleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
