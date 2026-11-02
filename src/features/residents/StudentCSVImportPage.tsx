import React, { useState } from 'react';
import { Breadcrumb, FileUploader, Modal, Toast } from '../../components/ui';

interface StudentImportRow {
  fullName: string;
  email: string;
  rollNumber: string;
  phone: string;
  hostelId: string;
  error?: string;
}

export function StudentCSVImportPage() {
  const [, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<StudentImportRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;

    const uploadedFile = files[0];

    // Parse CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const rows: StudentImportRow[] = [];
        const newErrors: string[] = [];

        // Skip header
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const [fullName, email, rollNumber, phone, hostelId] = lines[i].split(',').map((s) => s.trim());

          const row: StudentImportRow = { fullName, email, rollNumber, phone, hostelId };

          // Validate row
          if (!fullName) {
            row.error = 'Full name required';
            newErrors.push(`Row ${i + 1}: ${row.error}`);
          }
          if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            row.error = 'Invalid email';
            newErrors.push(`Row ${i + 1}: ${row.error}`);
          }
          if (!phone.match(/^\d{10}$/)) {
            row.error = 'Phone must be 10 digits';
            newErrors.push(`Row ${i + 1}: ${row.error}`);
          }

          rows.push(row);
        }

        setPreview(rows);
        setErrors(newErrors);
      } catch (error) {
        setErrors(['Failed to parse CSV file']);
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      // TODO: Call bulk import API
      console.log('Importing students:', preview);
      setToast({ message: `${preview.length} students imported successfully`, type: 'success' });
      setFile(null);
      setPreview([]);
      setShowConfirm(false);
    } catch (error) {
      setToast({ message: 'Import failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
          Import Students via CSV
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Upload a CSV file with columns: Full Name, Email, Roll Number, Phone, Hostel ID
        </p>

        {/* CSV Format Example */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">CSV Format Example:</p>
          <code className="text-sm text-blue-800 dark:text-blue-400 block">
            Full Name,Email,Roll Number,Phone,Hostel ID<br />
            John Doe,john@college.local,2024-00001,9876543210,1<br />
            Jane Smith,jane@college.local,2024-00002,9876543211,1
          </code>
        </div>

        {/* File Upload */}
        <FileUploader
          onUpload={handleFileUpload}
          accept=".csv"
          label="Upload CSV file"
          preview={false}
        />

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
              ⚠️ {errors.length} validation issue(s):
            </p>
            <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
              {errors.slice(0, 5).map((error, idx) => (
                <li key={idx}>• {error}</li>
              ))}
              {errors.length > 5 && (
                <li>• +{errors.length - 5} more errors</li>
              )}
            </ul>
          </div>
        )}

        {/* Preview Table */}
        {preview.length > 0 && (
          <div className="mt-6">
            <p className="font-semibold text-gray-900 dark:text-white mb-3">
              Preview ({preview.length} rows)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-4 py-2 text-left">Full Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Roll Number</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2">{row.fullName}</td>
                      <td className="px-4 py-2">{row.email}</td>
                      <td className="px-4 py-2">{row.rollNumber}</td>
                      <td className="px-4 py-2">{row.phone}</td>
                      <td className="px-4 py-2">
                        {row.error ? (
                          <span className="text-red-600 dark:text-red-400">❌ {row.error}</span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">✅ Valid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {preview.length > 10 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                +{preview.length - 10} more rows
              </p>
            )}
          </div>
        )}

        {/* Import Button */}
        {preview.length > 0 && errors.length === 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
          >
            ✅ Import {preview.length} Students
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        title="Confirm Import"
        onClose={() => setShowConfirm(false)}
        actions={[
          { label: 'Cancel', onClick: () => setShowConfirm(false) },
          { label: 'Import', onClick: handleImport, variant: 'primary' },
        ]}
      >
        <p className="text-gray-700 dark:text-gray-300">
          You are about to import <strong>{preview.length} students</strong>. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
