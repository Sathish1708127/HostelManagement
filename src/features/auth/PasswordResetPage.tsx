import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toast } from '../../components/ui/CoreComponents';

interface PasswordResetFormData {
  step: 'email' | 'code' | 'password';
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordResetPage() {
  const navigate = useNavigate();
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
      // TODO: Call password reset API to send verification code
      console.log('Send reset code to:', formData.email);
      setFormData((prev) => ({ ...prev, step: 'code' }));
      setToast({ message: 'Verification code sent to your email', type: 'success' });
    } catch (error) {
      setErrors({ email: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Verification code is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to verify code
      console.log('Verify code:', formData.code);
      setFormData((prev) => ({ ...prev, step: 'password' }));
      setToast({ message: 'Code verified successfully', type: 'success' });
    } catch (error) {
      setErrors({ code: String(error) });
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
      // TODO: Call API to reset password
      console.log('Reset password for:', formData.email);
      setToast({ message: 'Password reset successfully', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setErrors({ newPassword: String(error) });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8">
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
        <div className="flex justify-between mb-8">
          {(['email', 'code', 'password'] as const).map((step, idx) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  ['email', 'code', 'password'].indexOf(formData.step) >= idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                {idx + 1}
              </div>
              {idx < 2 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    ['email', 'code', 'password'].indexOf(formData.step) > idx
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Email Step */}
        {formData.step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
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
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* Code Step */}
        {formData.step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
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
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, step: 'email' }))}
              className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Back
            </button>
          </form>
        )}

        {/* Password Step */}
        {formData.step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
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
      </div>
    </div>
  );
}
