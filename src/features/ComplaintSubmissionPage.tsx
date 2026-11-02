import React, { useState } from 'react';
import { Breadcrumb, Toast } from '../components/ui';

interface ComplaintForm {
  categoryId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments: File[];
}

const CATEGORIES = [
  'Maintenance Issue',
  'Cleanliness Concern',
  'Noise Complaint',
  'Facility Damage',
  'Mess Food Quality',
  'Security Issue',
  'Behavioral Complaint',
  'Service Quality',
];

const PRIORITY_COLORS = {
  low: 'bg-blue-100 dark:bg-blue-900/30',
  medium: 'bg-yellow-100 dark:bg-yellow-900/30',
  high: 'bg-orange-100 dark:bg-orange-900/30',
  urgent: 'bg-red-100 dark:bg-red-900/30',
};

export function ComplaintSubmissionPage() {
  const [formData, setFormData] = useState<ComplaintForm>({
    categoryId: '',
    title: '',
    description: '',
    priority: 'medium',
    attachments: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Call complaint submission API
      console.log('Submit complaint:', formData);
      setToast({ message: 'Complaint submitted successfully', type: 'success' });
      setSubmitted(true);
      
      setTimeout(() => {
        setFormData({
          categoryId: '',
          title: '',
          description: '',
          priority: 'medium',
          attachments: [],
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      setToast({ message: 'Failed to submit complaint', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, attachments: files }));
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complaint Submitted Successfully
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your complaint has been received. You&apos;ll receive updates via email.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Ticket ID: <span className="font-semibold">#COM-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
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
          Submit a Complaint
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please provide details about your issue. We&apos;ll get back to you soon.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat, idx) => (
                <option key={idx} value={idx}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.categoryId}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief summary of the issue"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <div className="flex gap-4">
              {(['low', 'medium', 'high', 'urgent'] as const).map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={level}
                    checked={formData.priority === level}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className={`px-3 py-1 rounded text-sm font-medium ${PRIORITY_COLORS[level]}`}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Please provide detailed information about your complaint..."
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attachments (Optional)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Max 5 files, 5MB each
            </p>
            {formData.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                    <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            {loading ? 'Submitting...' : '📝 Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
