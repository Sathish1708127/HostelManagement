import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Skeleton, EmptyState, ConfirmDialog } from '../../components/ui';

interface StudentProfile {
  id: number;
  uuid: string;
  email: string;
  name: string;
  phone: string;
  rollNumber: string;
  hostelId: number;
  roomId: number;
  profilePhoto?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  createdAt: string;
}

interface TimelineEvent {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  icon: string;
}

export function StudentDetailPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/v1/students/${studentId}`);
        // const data = await response.json();
        
        setStudent({
          id: 1,
          uuid: 'abc123',
          email: 'student1@college.local',
          name: 'John Doe',
          phone: '9876543210',
          rollNumber: '2024-00001',
          hostelId: 1,
          roomId: 101,
          profilePhoto: 'https://via.placeholder.com/150',
          dateOfBirth: '2005-01-15',
          gender: 'Male',
          address: '123 Main Street, City',
          createdAt: '2024-01-10',
        });

        // TODO: Replace with actual API call
        setTimeline([
          {
            id: 1,
            type: 'complaint',
            title: 'Complaint Submitted',
            description: 'Submitted a maintenance complaint',
            date: '2024-07-15',
            icon: '🔧',
          },
          {
            id: 2,
            type: 'leave',
            title: 'Leave Approved',
            description: 'Leave request approved for 5 days',
            date: '2024-07-10',
            icon: '✈️',
          },
          {
            id: 3,
            type: 'fee',
            title: 'Payment Received',
            description: 'Monthly fee payment processed',
            date: '2024-07-01',
            icon: '💳',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton height="h-10" width="w-64" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!student) {
    return <EmptyState title="Student Not Found" description="The student profile could not be found." />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <img
              src={student.profilePhoto}
              alt={student.name}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {student.name}
              </h1>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <p>📍 Roll: {student.rollNumber}</p>
                <p>📧 {student.email}</p>
                <p>📱 {student.phone}</p>
                <p>🛏️ Room {student.roomId}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/residents/${studentId}/edit`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              ✏️ Edit
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Complaints', value: '2', color: 'bg-orange-100 dark:bg-orange-900/30' },
          { label: 'Total Fees Due', value: '₹5,000', color: 'bg-red-100 dark:bg-red-900/30' },
          { label: 'Leave Balance', value: '10 days', color: 'bg-green-100 dark:bg-green-900/30' },
          { label: 'Attendance', value: '92%', color: 'bg-blue-100 dark:bg-blue-900/30' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.color} rounded-lg p-4 text-center`}
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Personal Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Date of Birth', value: student.dateOfBirth },
            { label: 'Gender', value: student.gender },
            { label: 'Address', value: student.address },
            { label: 'Member Since', value: student.createdAt },
          ].map((item, idx) => (
            <div key={idx}>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-lg text-gray-900 dark:text-white mt-1">
                {item.value || 'Not provided'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Activity Timeline
        </h2>
        <div className="space-y-4">
          {timeline.map((event, idx) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="text-2xl">{event.icon}</div>
                {idx < timeline.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600 mt-2" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {event.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete ${student.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          // TODO: Call delete API
          navigate('/residents');
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
