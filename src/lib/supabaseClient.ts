import { createClient, type EmailOtpType, type Session, type User } from '@supabase/supabase-js';

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
        const normalizedEmail = email.toLowerCase();
        const role = normalizedEmail.includes('student')
          ? 'student'
          : normalizedEmail.includes('guardian')
            ? 'parent_guardian'
            : 'warden';
        session = {
          access_token: 'mock-token',
          user: {
            id: `demo-${role}`,
            email,
            user_metadata: {
              full_name: role === 'student' ? 'Maya Gurung' : role === 'parent_guardian' ? 'Maya Guardian' : 'Aarav Sharma',
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

const realSupabase = useMock ? null : createClient(supabaseUrl as string, supabaseAnonKey as string);

export const supabase = realSupabase ?? createMockClient();

function requireSupabase() {
  if (!realSupabase) {
    throw new Error('This authentication action requires a configured Supabase project and is unavailable in local demo mode.');
  }
  return realSupabase;
}

export async function registerWithEmail(input: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  rollNumber: string;
  hostelId?: string;
}) {
  const { data, error } = await requireSupabase().auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${window.location.origin}/verify-email`,
      data: {
        full_name: input.fullName,
        phone: input.phone,
        roll_number: input.rollNumber,
        hostel_id: input.hostelId,
        role: 'student',
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function requestPasswordReset(email: string) {
  const { error } = await requireSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function verifyPasswordResetCode(email: string, token: string) {
  const { error } = await requireSupabase().auth.verifyOtp({ email, token, type: 'recovery' });
  if (error) throw error;
}

export async function exchangePasswordResetCode(code: string) {
  const { error } = await requireSupabase().auth.exchangeCodeForSession(code);
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await requireSupabase().auth.updateUser({ password });
  if (error) throw error;
}

export async function verifyEmailLink(input: { code: string | null; tokenHash: string | null; type: string | null }) {
  const client = requireSupabase();
  if (input.code) {
    const { error } = await client.auth.exchangeCodeForSession(input.code);
    if (error) throw error;
    return;
  }
  if (!input.tokenHash) throw new Error('Verification token not found.');

  const tokenTypes: EmailOtpType[] = ['signup', 'invite', 'magiclink', 'recovery', 'email_change', 'email'];
  const type = tokenTypes.find((candidate) => candidate === input.type) ?? 'signup';
  const { error } = await client.auth.verifyOtp({ token_hash: input.tokenHash, type });
  if (error) throw error;
}

export async function resendVerificationEmail(email: string) {
  const { error } = await requireSupabase().auth.resend({ type: 'signup', email });
  if (error) throw error;
}

export default supabase;
