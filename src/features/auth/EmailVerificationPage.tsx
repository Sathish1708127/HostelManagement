import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resendVerificationEmail, verifyEmailLink } from '../../lib/supabaseClient';

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    let active = true;
    let redirectTimer: number | undefined;

    async function verifyEmail() {
      try {
        const code = searchParams.get('code');
        const tokenHash = searchParams.get('token_hash') ?? searchParams.get('token');
        if (!code && !tokenHash) throw new Error('Verification link is missing its token.');
        await verifyEmailLink({ code, tokenHash, type: searchParams.get('type') });
        if (!active) return;
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to login...');
        redirectTimer = window.setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        if (!active) return;
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Email verification failed. Please try again.');
      }
    }

    void verifyEmail();
    return () => {
      active = false;
      if (redirectTimer !== undefined) window.clearTimeout(redirectTimer);
    };
  }, [searchParams, navigate]);

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);

    try {
      await resendVerificationEmail(resendEmail);
      setShowResendForm(false);
      setResendMessage('If the address is registered, a verification email has been sent.');
    } catch (error) {
      setResendMessage(error instanceof Error ? error.message : 'Failed to send the verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="auth-standalone">
      <section className="auth-card auth-standalone-card auth-verification">
        {status === 'verifying' && (
          <>
            <div className="text-5xl mb-4 animate-spin">⏳</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verifying Email
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your email has been successfully verified. Redirecting to login...
            </p>
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <button
              onClick={() => setShowResendForm(true)}
              className="primary-button auth-submit"
            >
              Resend Verification Email
            </button>
          </>
        )}
        {resendMessage && <p className="text-sm text-gray-600 dark:text-gray-400 mt-4" role="status">{resendMessage}</p>}

        <div className="mt-6">
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </section>
      {showResendForm && <div className="auth-modal-backdrop">
        <section className="auth-card auth-standalone-card" role="dialog" aria-modal="true" aria-labelledby="resend-title">
          <div className="auth-modal-heading">
            <h2 id="resend-title">Resend verification email</h2>
            <button type="button" className="quiet-button" aria-label="Close" onClick={() => setShowResendForm(false)}>×</button>
          </div>
          <form onSubmit={handleResendEmail} className="auth-form">
            <label>
              Email address
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </label>
            <button type="submit" disabled={resendLoading} className="primary-button auth-submit">
              {resendLoading ? 'Sending...' : 'Resend email'}
            </button>
          </form>
        </section>
      </div>}
    </main>
  );
}
