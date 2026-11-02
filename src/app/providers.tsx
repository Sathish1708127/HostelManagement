import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import supabase, { type AuthSession } from '../lib/supabaseClient';

export type AppRole =
  | 'super_admin'
  | 'warden'
  | 'accountant'
  | 'mess_manager'
  | 'maintenance_staff'
  | 'cleaning_staff'
  | 'security_guard'
  | 'student'
  | 'parent_guardian';

export type AppUser = {
  id: string;
  email: string;
  name: string;
  role: AppRole;
};

type AuthContextValue = {
  user: AppUser | null;
  session: Session | AuthSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapUser(user: User | AuthSession['user']): AppUser {
  const role = (user.user_metadata?.role as AppRole | undefined) ?? 'student';
  return {
    id: user.id,
    email: user.email ?? '',
    name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Resident',
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | AuthSession | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ? mapUser(data.session.user) : null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ? mapUser(nextSession.user) : null);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      async signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
      },
      async signOut() {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
      },
    }),
    [loading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
