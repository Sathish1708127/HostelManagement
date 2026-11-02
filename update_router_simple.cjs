const fs = require('fs');
const p = 'd:/html/fun/Hostel Management/src/app/router.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  'const Leave = lazy(() => import("../features/leave/LeavePage"));',
  'const Leave = lazy(() => import("../features/leave/LeavePage"));\nconst Medical = lazy(() => import("../features/medical/MedicalPage"));\nconst Announcements = lazy(() => import("../features/announcements/AnnouncementsPage"));\nconst Fees = lazy(() => import("../features/fees/FeesPage"));\nconst Assets = lazy(() => import("../features/assets/AssetsPage"));\nconst Parcels = lazy(() => import("../features/parcels/ParcelsPage"));\nconst Bookings = lazy(() => import("../features/bookings/BookingsPage"));\nconst LostFound = lazy(() => import("../features/lostfound/LostFoundPage"));\nconst Community = lazy(() => import("../features/community/CommunityPage"));\nconst Checkout = lazy(() => import("../features/checkout/CheckoutReadinessPage"));\nconst Reports = lazy(() => import("../features/reports/ReportsPage"));'
);

c = c.replace(
  '          <Route path="/leave" element={<Leave />} />\n        </Route>',
  '          <Route path="/leave" element={<Leave />} />\n          <Route path="/medical" element={<Medical />} />\n          <Route path="/announcements" element={<Announcements />} />\n          <Route path="/fees" element={<Fees />} />\n          <Route path="/assets" element={<Assets />} />\n          <Route path="/parcels" element={<Parcels />} />\n          <Route path="/bookings" element={<Bookings />} />\n          <Route path="/lostfound" element={<LostFound />} />\n          <Route path="/community" element={<Community />} />\n          <Route path="/checkout" element={<Checkout />} />\n          <Route path="/reports" element={<Reports />} />\n        </Route>'
);

fs.writeFileSync(p, c, 'utf8');
console.log('Router updated!');
