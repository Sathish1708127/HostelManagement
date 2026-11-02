import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const AppLayout = lazy(() => import('../components/layout/AppLayout'));
const Dashboard = lazy(() => import('../features/dashboard/DashboardPage'));
const Calendar = lazy(() => import('../features/calendar/CalendarPage'));
const Gallery = lazy(() => import('../features/gallery/GalleryPage'));
const Residents = lazy(() => import('../features/residents/ResidentsPage'));
const Rooms = lazy(() => import('../features/rooms/RoomsPage'));
const Login = lazy(() => import('./Login'));
const Register = lazy(() => import('../features/auth/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const PasswordReset = lazy(() => import('../features/auth/PasswordResetPage').then((module) => ({ default: module.PasswordResetPage })));
const EmailVerification = lazy(() => import('../features/auth/EmailVerificationPage').then((module) => ({ default: module.EmailVerificationPage })));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const Attendance = lazy(() => import('../features/attendance/AttendancePage'));
const Visitors = lazy(() => import('../features/visitors/VisitorsPage'));
const Laundry = lazy(() => import('../features/laundry/LaundryPage'));
const Mess = lazy(() => import('../features/mess/MessPage'));
const Cleaning = lazy(() => import('../features/cleaning/CleaningPage'));
const Complaints = lazy(() => import('../features/complaints/ComplaintsPage'));
const Leave = lazy(() => import('../features/leave/LeavePage'));
const Medical = lazy(() => import('../features/medical/MedicalPage'));
const Announcements = lazy(() => import('../features/announcements/AnnouncementsPage'));
const Fees = lazy(() => import('../features/fees/FeesPage'));
const Assets = lazy(() => import('../features/assets/AssetsPage'));
const Parcels = lazy(() => import('../features/parcels/ParcelsPage'));
const Bookings = lazy(() => import('../features/bookings/BookingsPage'));
const LostFound = lazy(() => import('../features/lostfound/LostFoundPage'));
const Community = lazy(() => import('../features/community/CommunityPage'));
const Checkout = lazy(() => import('../features/checkout/CheckoutReadinessPage'));
const Reports = lazy(() => import('../features/reports/ReportsPage'));
const staffRoles = ['super_admin', 'warden', 'accountant', 'mess_manager', 'maintenance_staff', 'cleaning_staff', 'security_guard'] as const;
const residentRoles = [...staffRoles, 'student'] as const;
const hostelRoles = [...residentRoles, 'parent_guardian'] as const;

function LoadingScreen() {
  return <div className="page-loader" role="status">Loading Hostel Pulse...</div>;
}

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route
          element={
            <ProtectedRoute roles={[...hostelRoles]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<ProtectedRoute roles={[...hostelRoles]}><Dashboard /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute roles={[...hostelRoles]}><Calendar /></ProtectedRoute>} />
          <Route path="/gallery" element={<ProtectedRoute roles={[...hostelRoles]}><Gallery /></ProtectedRoute>} />
          <Route path="/residents" element={<ProtectedRoute roles={[...staffRoles]}><Residents /></ProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute roles={[...residentRoles]}><Rooms /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute roles={[...residentRoles]}><Attendance /></ProtectedRoute>} />
          <Route path="/visitors" element={<ProtectedRoute roles={['super_admin', 'warden', 'security_guard', 'student']}><Visitors /></ProtectedRoute>} />
          <Route path="/laundry" element={<ProtectedRoute roles={[...residentRoles]}><Laundry /></ProtectedRoute>} />
          <Route path="/mess" element={<ProtectedRoute roles={[...hostelRoles]}><Mess /></ProtectedRoute>} />
          <Route path="/cleaning" element={<ProtectedRoute roles={[...residentRoles]}><Cleaning /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute roles={[...residentRoles]}><Complaints /></ProtectedRoute>} />
          <Route path="/leave" element={<ProtectedRoute roles={[...residentRoles]}><Leave /></ProtectedRoute>} />
          <Route path="/medical" element={<ProtectedRoute roles={['super_admin', 'warden', 'student']}><Medical /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute roles={[...hostelRoles]}><Announcements /></ProtectedRoute>} />
          <Route path="/fees" element={<ProtectedRoute roles={['super_admin', 'warden', 'accountant', 'student']}><Fees /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute roles={[...staffRoles]}><Assets /></ProtectedRoute>} />
          <Route path="/parcels" element={<ProtectedRoute roles={[...residentRoles]}><Parcels /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute roles={[...residentRoles]}><Bookings /></ProtectedRoute>} />
          <Route path="/lostfound" element={<ProtectedRoute roles={[...residentRoles]}><LostFound /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute roles={[...residentRoles]}><Community /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute roles={['super_admin', 'warden']}><Checkout /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute roles={['super_admin', 'warden', 'accountant']}><Reports /></ProtectedRoute>} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
