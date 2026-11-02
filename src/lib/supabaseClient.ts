import { createClient, type Session, type User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const useMock = import.meta.env.VITE_SUPABASE_MOCK === 'true';

export type AuthSession = Pick<Session, 'access_token'> & {
  user: Pick<User, 'id' | 'email'> & {
    user_metadata?: {
      full_name?: string;
      role?: string;
    };
  };
};

type AuthListener = (event: string, session: AuthSession | null) => void;

function createMockClient() {
  const sessionKey = 'hostel-pulse:demo-session';
  const savedSession = localStorage.getItem(sessionKey);
  let session: AuthSession | null = savedSession
    ? (JSON.parse(savedSession) as AuthSession)
    : null;
  const listeners = new Set<AuthListener>();

  return {
    auth: {
      async getSession() {
        return { data: { session }, error: null };
      },
      onAuthStateChange(listener: AuthListener) {
        listeners.add(listener);
        return {
          data: {
            subscription: {
              unsubscribe: () => listeners.delete(listener),
            },
          },
        };
      },
      async signInWithPassword({ email }: { email: string; password: string }) {
        const role = email.toLowerCase().includes('student') ? 'student' : 'warden';
        session = {
          access_token: 'mock-token',
          user: {
            id: `demo-${role}`,
            email,
            user_metadata: {
              full_name: role === 'student' ? 'Maya Gurung' : 'Aarav Sharma',
              role,
            },
          },
        };
        localStorage.setItem(sessionKey, JSON.stringify(session));
        listeners.forEach((listener) => listener('SIGNED_IN', session));
        return { data: { session }, error: null };
      },
      async signOut() {
        session = null;
        localStorage.removeItem(sessionKey);
        listeners.forEach((listener) => listener('SIGNED_OUT', null));
        return { error: null };
      },
    },
  };
}

if (!useMock && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables. Enable VITE_SUPABASE_MOCK for local development.');
}

export const supabase = useMock
  ? createMockClient()
  : createClient(supabaseUrl as string, supabaseAnonKey as string);

export default supabase;
