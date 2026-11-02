import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Modal } from '../../components/ui/CoreComponents';

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('Verification token not found');
        return;
      }

      try {
        // TODO: Call email verification API with token
        console.log('Verifying email with token:', token);
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setStatus('error');
        setMessage('Email verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);

    try {
      // TODO: Call resend verification email API
      console.log('Resend verification to:', resendEmail);
      setShowResendForm(false);
      setMessage('Verification email sent! Check your inbox.');
    } catch (error) {
      setMessage('Failed to send email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8 text-center">
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
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Resend Verification Email
            </button>
          </>
        )}

        <div className="mt-6">
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>

      {/* Resend Email Modal */}
      <Modal
        isOpen={showResendForm}
        title="Resend Verification Email"
        onClose={() => setShowResendForm(false)}
      >
        <form onSubmit={handleResendEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={resendLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            {resendLoading ? 'Sending...' : 'Resend Email'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
