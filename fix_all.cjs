const fs = require('fs');

// ============================================================
// 1. UPDATE ROUTER
// ============================================================
const routerPath = 'd:/html/fun/Hostel Management/src/app/router.tsx';
let router = fs.readFileSync(routerPath, 'utf8');

// Add imports
const oldImportEnd = 'const Leave = lazy(() => import("../features/leave/LeavePage"));';
const newImports = oldImportEnd + '\n' +
  'const Medical = lazy(() => import("../features/medical/MedicalPage"));\n' +
  'const Announcements = lazy(() => import("../features/announcements/AnnouncementsPage"));\n' +
  'const Fees = lazy(() => import("../features/fees/FeesPage"));\n' +
  'const Assets = lazy(() => import("../features/assets/AssetsPage"));\n' +
  'const Parcels = lazy(() => import("../features/parcels/ParcelsPage"));\n' +
  'const Bookings = lazy(() => import("../features/bookings/BookingsPage"));\n' +
  'const LostFound = lazy(() => import("../features/lostfound/LostFoundPage"));\n' +
  'const Community = lazy(() => import("../features/community/CommunityPage"));\n' +
  'const Checkout = lazy(() => import("../features/checkout/CheckoutReadinessPage"));\n' +
  'const Reports = lazy(() => import("../features/reports/ReportsPage"));';

if (router.includes(oldImportEnd)) {
  router = router.replace(oldImportEnd, newImports);
}

// Add routes (already added from previous run, skip if already present)
if (!router.includes('<Route path="/medical"')) {
  const routeEnd = '          <Route path="/leave" element={<Leave />} />\n        </Route>';
  const newRoutes = '          <Route path="/leave" element={<Leave />} />\n' +
    '          <Route path="/medical" element={<Medical />} />\n' +
    '          <Route path="/announcements" element={<Announcements />} />\n' +
    '          <Route path="/fees" element={<Fees />} />\n' +
    '          <Route path="/assets" element={<Assets />} />\n' +
    '          <Route path="/parcels" element={<Parcels />} />\n' +
    '          <Route path="/bookings" element={<Bookings />} />\n' +
    '          <Route path="/lostfound" element={<LostFound />} />\n' +
    '          <Route path="/community" element={<Community />} />\n' +
    '          <Route path="/checkout" element={<Checkout />} />\n' +
    '          <Route path="/reports" element={<Reports />} />\n' +
    '        </Route>';
  router = router.replace(routeEnd, newRoutes);
}

fs.writeFileSync(routerPath, router, 'utf8');
console.log('Router updated!');

// ============================================================
// 2. UPDATE APP LAYOUT
// ============================================================
const layoutPath = 'd:/html/fun/Hostel Management/src/components/layout/AppLayout.tsx';
let layout = fs.readFileSync(layoutPath, 'utf8');

// Add staff links
const oldStaff = '  { to: \'/cleaning\', label: \'Housekeeping\', short: \'HK\' },\n  { to: \'/reports\', label: \'Reports\', short: \'RP\', disabled: true },';
const newStaff = '  { to: \'/cleaning\', label: \'Housekeeping\', short: \'HK\' },\n' +
  '  { to: \'/medical\', label: \'Medical centre\', short: \'MC\' },\n' +
  '  { to: \'/announcements\', label: \'Announcements\', short: \'AN\' },\n' +
  '  { to: \'/fees\', label: \'Fees and payments\', short: \'FP\' },\n' +
  '  { to: \'/assets\', label: \'Assets\', short: \'AS\' },\n' +
  '  { to: \'/parcels\', label: \'Parcels\', short: \'PC\' },\n' +
  '  { to: \'/bookings\', label: \'Bookings\', short: \'BK\' },\n' +
  '  { to: \'/lostfound\', label: \'Lost and found\', short: \'LF\' },\n' +
  '  { to: \'/community\', label: \'Community\', short: \'CM\' },\n' +
  '  { to: \'/checkout\', label: \'Checkout\', short: \'CK\' },\n' +
  '  { to: \'/reports\', label: \'Reports\', short: \'RP\' },';
if (layout.includes(oldStaff)) {
  layout = layout.replace(oldStaff, newStaff);
}

// Add page titles
const oldTitle = '  if (pathname.startsWith(\'/cleaning\')) return \'Housekeeping\';\n  return \'Command center\';';
const newTitle = '  if (pathname.startsWith(\'/cleaning\')) return \'Housekeeping\';\n' +
  '  if (pathname.startsWith(\'/medical\')) return \'Medical centre\';\n' +
  '  if (pathname.startsWith(\'/announcements\')) return \'Announcements\';\n' +
  '  if (pathname.startsWith(\'/fees\')) return \'Fees\';\n' +
  '  if (pathname.startsWith(\'/assets\')) return \'Assets\';\n' +
  '  if (pathname.startsWith(\'/parcels\')) return \'Parcels\';\n' +
  '  if (pathname.startsWith(\'/bookings\')) return \'Bookings\';\n' +
  '  if (pathname.startsWith(\'/lostfound\')) return \'Lost and found\';\n' +
  '  if (pathname.startsWith(\'/community\')) return \'Community\';\n' +
  '  if (pathname.startsWith(\'/checkout\')) return \'Checkout\';\n' +
  '  if (pathname.startsWith(\'/reports\')) return \'Reports\';\n' +
  '  return \'Command center\';';
if (layout.includes(oldTitle)) {
  layout = layout.replace(oldTitle, newTitle);
}

fs.writeFileSync(layoutPath, layout, 'utf8');
console.log('AppLayout updated!');

// ============================================================
// 3. CREATE MISSING FEATURE PAGES (FeesPage.tsx was missing)
// ============================================================
const feesDir = 'd:/html/fun/Hostel Management/src/features/fees';
if (!fs.existsSync(feesDir)) {
  fs.mkdirSync(feesDir, { recursive: true });
}

const feesPage = 'd:/html/fun/Hostel Management/src/features/fees/FeesPage.tsx';
if (!fs.existsSync(feesPage)) {
  const feesContent = `import { useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';

type Invoice = {
  id: string;
  student: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue' | 'partial';
};

const mockInvoices: Invoice[] = [
  { id: 'INV-001', student: 'Maya Gurung', description: 'Hostel fees - June 2026', amount: 12000, dueDate: '20 Jun', status: 'unpaid' },
  { id: 'INV-002', student: 'Arjun Rao', description: 'Mess charges - June 2026', amount: 4500, dueDate: '20 Jun', status: 'paid' },
  { id: 'INV-003', student: 'Zoya Khan', description: 'Hostel fees - June 2026', amount: 12000, dueDate: '20 Jun', status: 'overdue' },
  { id: 'INV-004', student: 'Nima Sherpa', description: 'Laundry charges', amount: 800, dueDate: '15 Jun', status: 'paid' },
];

function formatCurrency(amount: number) {
  return 'INR ' + amount.toLocaleString('en-IN');
}

export default function FeesPage() {
  const [invoices] = useState(mockInvoices);
  const totalDue = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);
  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Fees' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Accounting</p>
          <h1>Fees & payments</h1>
          <p>Manage fee structures, invoices, payments, refunds and receipts.</p>
        </div>
        <button className="primary-button">Generate invoice</button>
      </section>
      <section className="metric-grid compact">
        <article className="mini-metric"><span>Due this month</span><strong>{formatCurrency(totalDue)}</strong><small>Outstanding</small></article>
        <article className="mini-metric"><span>Collected</span><strong>{formatCurrency(totalCollected)}</strong><small>This month</small></article>
        <article className="mini-metric"><span>Overdue</span><strong>1</strong><small>Invoice overdue</small></article>
      </section>
      <section className="panel">
        <div className="panel-heading"><h2>Invoices</h2></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Invoice</span><span>Student</span><span>Description</span><span>Amount</span><span>Due</span><span>Status</span><span />
          </div>
          {invoices.map((inv) => (
            <div className="data-row" role="row" key={inv.id}>
              <strong>{inv.id}</strong><span>{inv.student}</span><span>{inv.description}</span>
              <strong>{formatCurrency(inv.amount)}</strong><span>{inv.dueDate}</span>
              <StatusBadge>{inv.status}</StatusBadge>
              <button className="row-action">View</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
`;
  fs.writeFileSync(feesPage, feesContent, 'utf8');
  console.log('FeesPage created!');
}

// Also create checkout dir if missing
const checkoutDir = 'd:/html/fun/Hostel Management/src/features/checkout';
if (!fs.existsSync(checkoutDir)) {
  fs.mkdirSync(checkoutDir, { recursive: true });
}
const checkoutPage = 'd:/html/fun/Hostel Management/src/features/checkout/CheckoutReadinessPage.tsx';
if (!fs.existsSync(checkoutPage)) {
  const checkoutContent = `import { useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';

type CheckoutItem = {
  id: string;
  student: string;
  room: string;
  category: string;
  item: string;
  status: 'pending' | 'cleared' | 'waived' | 'chargeable';
};

const mockItems: CheckoutItem[] = [
  { id: 'CO-001', student: 'Maya Gurung', room: 'B-204', category: 'Room inspection', item: 'Damage check pending', status: 'pending' },
  { id: 'CO-002', student: 'Maya Gurung', room: 'B-204', category: 'Fee clearance', item: 'Outstanding Rs 2,400', status: 'chargeable' },
];

export default function CheckoutReadinessPage() {
  const [items] = useState(mockItems);
  const pending = items.filter(i => i.status === 'pending').length;
  const chargeable = items.filter(i => i.status === 'chargeable').length;
  const cleared = items.filter(i => i.status === 'cleared' || i.status === 'waived').length;

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Checkout' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Departure readiness</p>
          <h1>Checkout readiness</h1>
          <p>Track pending items before a resident can be cleared for checkout.</p>
        </div>
        <button className="primary-button">Clear student</button>
      </section>
      <section className="metric-grid compact">
        <article className="mini-metric"><span>Pending items</span><strong>{pending}</strong><small>Needs resolution</small></article>
        <article className="mini-metric"><span>Chargeable</span><strong>{chargeable}</strong><small>Fees to collect</small></article>
        <article className="mini-metric"><span>Cleared</span><strong>{cleared}</strong><small>Completed</small></article>
      </section>
      <section className="panel">
        <div className="panel-heading"><h2>Checklist by student</h2></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Student</span><span>Room</span><span>Category</span><span>Item</span><span>Status</span><span />
          </div>
          {items.map((ci) => (
            <div className="data-row" role="row" key={ci.id}>
              <span>{ci.student}</span><strong>{ci.room}</strong><span>{ci.category}</span>
              <span>{ci.item}</span>
              <StatusBadge>{ci.status}</StatusBadge>
              <button className="row-action">Resolve</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
`;
  fs.writeFileSync(checkoutPage, checkoutContent, 'utf8');
  console.log('CheckoutReadinessPage created!');
}

// Also create lostfound dir if missing
const lostfoundDir = 'd:/html/fun/Hostel Management/src/features/lostfound';
if (!fs.existsSync(lostfoundDir)) {
  fs.mkdirSync(lostfoundDir, { recursive: true });
}
const lostfoundPage = 'd:/html/fun/Hostel Management/src/features/lostfound/LostFoundPage.tsx';
if (!fs.existsSync(lostfoundPage)) {
  const lfContent = `import { useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';

type LostFoundItem = {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'open' | 'matched' | 'resolved' | 'closed';
  reporter: string;
};

const mockItems: LostFoundItem[] = [
  { id: 'LF-001', type: 'lost', title: 'Black Casio Watch', description: 'Lost near the basketball court.', location: 'Basketball Court', date: '14 Jun', status: 'open', reporter: 'Maya Gurung' },
  { id: 'LF-002', type: 'found', title: 'Blue Water Bottle', description: 'Found in study room B-201.', location: 'Study Room B-201', date: '14 Jun', status: 'open', reporter: 'Arjun Rao' },
  { id: 'LF-003', type: 'found', title: 'Casio Calculator', description: 'Found in common room.', location: 'Common Room', date: '13 Jun', status: 'matched', reporter: 'Zoya Khan' },
];

export default function LostFoundPage() {
  const [items] = useState(mockItems);
  const [tab, setTab] = useState<'all' | 'lost' | 'found'>('all');
  const filtered = tab === 'all' ? items : items.filter(i => i.type === tab);

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Lost and Found' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Lost and Found</p>
          <h1>Lost and found</h1>
          <p>Report lost items, log found items, and resolve matches.</p>
        </div>
        <button className="primary-button">Report item</button>
      </section>
      <section className="metric-grid compact">
        <article className="mini-metric"><span>Lost items</span><strong>4</strong><small>Open cases</small></article>
        <article className="mini-metric"><span>Found items</span><strong>7</strong><small>Awaiting claims</small></article>
        <article className="mini-metric"><span>Resolved</span><strong>12</strong><small>This month</small></article>
      </section>
      <section className="panel">
        <div className="table-tools">
          <button className={'quiet-button ' + (tab === 'all' ? 'active' : '')} onClick={() => setTab('all')}>All</button>
          <button className={'quiet-button ' + (tab === 'lost' ? 'active' : '')} onClick={() => setTab('lost')}>Lost items</button>
          <button className={'quiet-button ' + (tab === 'found' ? 'active' : '')} onClick={() => setTab('found')}>Found items</button>
        </div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>ID</span><span>Type</span><span>Item</span><span>Location</span><span>Date</span><span>Status</span><span>Reporter</span><span />
          </div>
          {filtered.map((item) => (
            <div className="data-row" role="row" key={item.id}>
              <strong>{item.id}</strong>
              <StatusBadge>{item.type}</StatusBadge>
              <p><strong>{item.title}</strong><small>{item.description.substring(0, 40)}...</small></p>
              <span>{item.location}</span><span>{item.date}</span>
              <StatusBadge>{item.status}</StatusBadge>
              <span>{item.reporter}</span>
              <button className="row-action">Claim</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
`;
  fs.writeFileSync(lostfoundPage, lfContent, 'utf8');
  console.log('LostFoundPage created!');
}

// Create genres dirs
['lostfound', 'checkout', 'reports'].forEach(dir => {
  const fullDir = 'd:/html/fun/Hostel Management/src/features/' + dir;
  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir, { recursive: true });
    console.log('Created dir: ' + dir);
  }
});

// Reports page
const reportsPage = 'd:/html/fun/Hostel Management/src/features/reports/ReportsPage.tsx';
if (!fs.existsSync(reportsPage)) {
  const reportsContent = `import { useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const reportCards = [
  { title: 'Occupancy trends', desc: 'Monthly occupancy rates by block', icon: '📊', color: 'indigo' },
  { title: 'Complaint analytics', desc: 'Resolution times, categories, SLA', icon: '🔧', color: 'amber' },
  { title: 'Fee collection', desc: 'Collection rates, outstanding, trends', icon: '💰', color: 'teal' },
  { title: 'Attendance', desc: 'Roll call compliance, trends', icon: '📋', color: 'violet' },
  { title: 'Mess satisfaction', desc: 'Meal ratings, feedback trends', icon: '🍽️', color: 'amber' },
  { title: 'Leave patterns', desc: 'Peak leave days, approvals', icon: '✈️', color: 'indigo' },
  { title: 'Laundry operations', desc: 'Batch volumes, turnaround time', icon: '👕', color: 'teal' },
  { title: 'Medical cases', desc: 'Common illnesses, wellness trends', icon: '🏥', color: 'violet' },
  { title: 'Hostel Pulse', desc: 'Overall health score breakdown', icon: '❤️', color: 'danger' },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Reports' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Reports and analytics</h1>
          <p>View aggregate data across all hostel modules with exportable reports.</p>
        </div>
        <button className="primary-button">Export all</button>
      </section>
      <section className="metric-grid compact">
        <article className="mini-metric"><span>Reports available</span><strong>9</strong><small>All modules</small></article>
        <article className="mini-metric"><span>Last generated</span><strong>Today</strong><small>Auto-refresh daily</small></article>
        <article className="mini-metric"><span>Export format</span><strong>PDF/CSV</strong><small>All reports</small></article>
      </section>
      <section className="dashboard-grid" style={{ marginTop: 0 }}>
        {reportCards.map((r) => (
          <article
            key={r.title}
            className={'panel metric-card ' + r.color}
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedReport(r.title)}
          >
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{r.icon}</div>
            <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: 4 }}>{r.title}</strong>
            <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>{r.desc}</p>
          </article>
        ))}
      </section>
      {selectedReport && (
        <div className="panel" style={{ marginTop: 16 }}>
          <div className="panel-heading">
            <h2>{selectedReport}</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="quiet-button">PDF</button>
              <button className="quiet-button">CSV</button>
              <button className="quiet-button" onClick={() => setSelectedReport(null)}>Close</button>
            </div>
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <p>Report data will be fetched from the backend.</p>
            <p className="muted">Select date range and filters to generate the report.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
              <input type="date" className="styled-input" style={{ width: 160 }} />
              <input type="date" className="styled-input" style={{ width: 160 }} />
              <button className="primary-button">Generate</button>
            </div>
        </div>
      )}
    </main>
  );
}
`;
  fs.writeFileSync(reportsPage, reportsContent, 'utf8');
  console.log('ReportsPage created!');
}

console.log('All fixes complete!');
