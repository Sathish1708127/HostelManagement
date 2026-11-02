import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../Common/Dashboard';
import StudentEntry from './student';
import StudentEntry1 from './StudentEntry';
import MessReviewForm from './MessReveiw';
import MedicalIssues from './MedicalIssues';
import LeaveApplication from './LeaveApplication';
import Laundry from './Laundry';
import Complaints from './Complaints';
import CleaningReview from './CleaningReview';
import Fees from './feees';
import Sidebar2 from '../Common/Sidebar2';

const studRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Sidebar2 />
        <Dashboard />
      </>
    ),
  },
  {
    path: '/student-details',
    element: (
      <>
        <Sidebar2 />
        <StudentEntry1 />
      </>
    ),
  },
  {
    path: '/mess-review',
    element: (
      <>
        <Sidebar2 />
        <MessReviewForm />
      </>
    ),
  },
  {
    path: '/medical',
    element: (
      <>
        <Sidebar2 />
        <MedicalIssues />
      </>
    ),
  },
  {
    path: '/leave-application',
    element: (
      <>
        <Sidebar2 />
        <LeaveApplication />
      </>
    ),
  },
  {
    path: '/laundry',
    element: (
      <>
        <Sidebar2 />
        <Laundry />
      </>
    ),
  },
  {
    path: '/complaints',
    element: (
      <>
        <Sidebar2 />
        <Complaints />
      </>
    ),
  },
  {
    path: '/cleaning-review',
    element: (
      <>
        <Sidebar2 />
        <CleaningReview />
      </>
    ),
  },
  {
    path: '/fees',
    element: (
      <>
        <Sidebar2 />
        <Fees />
      </>
    ),
  },
]);

export default studRouter;
