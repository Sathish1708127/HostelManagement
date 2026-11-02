import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { exchangePasswordResetCode, requestPasswordReset, updatePassword, verifyPasswordResetCode } from '../../lib/supabaseClient';

interface PasswordResetFormData {
  step: 'email' | 'code' | 'password';
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordResetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handledCode = useRef<string | null>(null);
  const [formData, setFormData] = useState<PasswordResetFormData>({
    step: 'email',
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code || handledCode.current === code) return;
    handledCode.current = code;
    setLoading(true);
    void exchangePasswordResetCode(code)
      .then(() => {
        setFormData((previous) => ({ ...previous, step: 'password' }));
        setToast({ message: 'Reset link verified. Choose a new password.', type: 'success' });
      })
      .catch((error: unknown) => {
        setToast({
          message: error instanceof Error ? error.message : 'The password reset link could not be verified.',
          type: 'error',
        });
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(formData.email);
      setFormData((prev) => ({ ...prev, step: 'code' }));
      setToast({ message: 'If the account exists, a password reset email has been sent.', type: 'success' });
    } catch (error) {
      setErrors({ email: error instanceof Error ? error.message : 'Unable to send a password reset email.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!/^\d{6}$/.test(formData.code.trim())) {
      newErrors.code = 'Enter the 6-digit code from your email.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await verifyPasswordResetCode(formData.email, formData.code.trim());
      setFormData((prev) => ({ ...prev, step: 'password' }));
      setToast({ message: 'Code verified successfully', type: 'success' });
    } catch (error) {
      setErrors({ code: error instanceof Error ? error.message : 'The verification code could not be verified.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await updatePassword(formData.newPassword);
      setToast({ message: 'Password reset successfully', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setErrors({ newPassword: error instanceof Error ? error.message : 'Password could not be reset.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <main className="auth-standalone">
      {toast && (
        <div className={`auth-toast ${toast.type}`} role="status">
          <span>{toast.message}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <section className="auth-card auth-standalone-card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔐 Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {formData.step === 'email' && 'Enter your email to receive a reset code'}
            {formData.step === 'code' && 'Enter the verification code'}
            {formData.step === 'password' && 'Create a new password'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="auth-step-indicator">
          {(['email', 'code', 'password'] as const).map((step, idx) => (
            <span key={step} className={['email', 'code', 'password'].indexOf(formData.step) >= idx ? 'active' : ''}>
              {idx + 1}
            </span>
          ))}
        </div>

        {/* Email Step */}
        {formData.step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button auth-submit"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* Code Step */}
        {formData.step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="auth-form">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Verification Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl tracking-widest ${
                  errors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.code && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.code}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Check your email for the 6-digit code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button auth-submit"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, step: 'email' }))}
              className="quiet-button auth-secondary"
            >
              Back
            </button>
          </form>
        )}

        {/* Password Step */}
        {formData.step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="auth-form">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password (min. 8 chars) *
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button auth-submit"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Links */}
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Login
          </Link>
        </div>
      </section>
    </main>
  );
}
