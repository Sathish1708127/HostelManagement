import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Modal } from '../../components/ui/CoreComponents';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  rollNumber: string;
  hostelId?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    rollNumber: '',
    hostelId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Valid 10-digit phone number required';
    }
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Call registration API
      console.log('Register:', formData);
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrors({ submit: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
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
      <Modal
        isOpen={success}
        title="Registration Successful!"
        onClose={() => navigate('/login')}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Your account has been created. Please check your email to verify your address.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Redirecting to login...
        </p>
      </Modal>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🏠 Hostel Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@college.local"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Roll Number *
            </label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="2024-00001"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.rollNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.rollNumber && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.rollNumber}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone (10 digits) *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              maxLength={10}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password (min. 8 chars) *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
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

          {/* Form Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
