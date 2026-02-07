import { createBrowserRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AnnouncementsAdmin from './AnnouncementsAdmin';
import ComplaintsAdmin from './ComplaintsAdmin';
import RoomManagement from './RoomManagement';
import StudentDetails from './StudentDetails';
import MessMenuAdmin from './MessMenuAdmin';
import Sidebar from '../Common/Sidebar';

const adminRouter = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <>
        <Sidebar />
        <AdminDashboard />
      </>
    ),
  },
  {
    path: '/admin/announcements',
    element: (
      <>
        <Sidebar />
        <AnnouncementsAdmin />
      </>
    ),
  },
  {
    path: '/admin/complaints',
    element: (
      <>
        <Sidebar />
        <ComplaintsAdmin />
      </>
    ),
  },
  {
    path: '/admin/room-management',
    element: (
      <>
        <Sidebar />
        <RoomManagement />
      </>
    ),
  },
  {
    path: '/admin/student-details',
    element: (
      <>
        <Sidebar />
        <StudentDetails />
      </>
    ),
  },
  {
    path: '/admin/mess-menu',
    element: (
      <>
        <Sidebar />
        <MessMenuAdmin />
      </>
    ),
  },
]);

export default adminRouter;
