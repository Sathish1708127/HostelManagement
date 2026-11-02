import React, { useState } from 'react';
import { Breadcrumb, Toast, DatePicker } from '../components/ui';

interface LeaveApplicationForm {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  reason: string;
  emergencyContact: string;
}

export function LeaveApplicationPage() {
  const [formData, setFormData] = useState<LeaveApplicationForm>({
    fromDate: undefined,
    toDate: undefined,
    reason: '',
    emergencyContact: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromDate) newErrors.fromDate = 'Start date is required';
    if (!formData.toDate) newErrors.toDate = 'End date is required';
    if (formData.fromDate && formData.toDate && formData.fromDate > formData.toDate) {
      newErrors.toDate = 'End date must be after start date';
    }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    if (formData.reason.length < 10) newErrors.reason = 'Reason must be at least 10 characters';
    if (!formData.emergencyContact.match(/^\d{10}$/)) newErrors.emergencyContact = '10-digit phone required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDays = () => {
    if (!formData.fromDate || !formData.toDate) return 0;
    const diff = Math.ceil((formData.toDate.getTime() - formData.fromDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Call leave application API
      console.log('Submit leave:', formData);
      setToast({ message: 'Leave application submitted successfully', type: 'success' });
      setSubmitted(true);
    } catch (error) {
      setToast({ message: 'Failed to submit leave application', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Leave Application Submitted
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your leave application has been submitted for approval.
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>From: {formData.fromDate?.toLocaleDateString()}</p>
            <p>To: {formData.toDate?.toLocaleDateString()}</p>
            <p>Duration: {calculateDays()} days</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <Breadcrumb />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Apply for Leave
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Submit your leave request for approval. Your warden will review and respond.
        </p>

        {/* Leave Balance Card */}
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-300">Available Leave Balance</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">15 days</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-700 dark:text-green-300">Used: 10 days</p>
              <p className="text-sm text-green-700 dark:text-green-300">Total: 30 days/semester</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DatePicker
              label="From Date *"
              value={formData.fromDate}
              onChange={(date) => setFormData((prev) => ({ ...prev, fromDate: date }))}
              error={errors.fromDate}
              minDate={new Date()}
            />
            <DatePicker
              label="To Date *"
              value={formData.toDate}
              onChange={(date) => setFormData((prev) => ({ ...prev, toDate: date }))}
              error={errors.toDate}
              minDate={formData.fromDate || new Date()}
            />
          </div>

          {/* Duration Display */}
          {formData.fromDate && formData.toDate && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-900 dark:text-blue-300">
                <span className="font-semibold text-2xl">{calculateDays()} days</span> of leave requested
              </p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Leave *
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2 ${
                errors.reason ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Select reason</option>
              <option value="Family Emergency">Family Emergency</option>
              <option value="Personal Work">Personal Work</option>
              <option value="Medical">Medical</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Other">Other</option>
            </select>
            {errors.reason && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.reason}</p>
            )}
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Emergency Contact (10-digit phone) *
            </label>
            <input
              type="tel"
              value={formData.emergencyContact}
              onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
              placeholder="9876543210"
              maxLength={10}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.emergencyContact ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.emergencyContact && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.emergencyContact}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            {loading ? 'Submitting...' : '✈️ Apply for Leave'}
          </button>
        </form>
      </div>
    </div>
  );
}
