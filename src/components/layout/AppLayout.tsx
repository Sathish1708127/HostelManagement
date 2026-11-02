import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers';

type NavigationLink = {
  to: string;
  label: string;
  short: string;
};

const staffGroups: { label: string; links: NavigationLink[] }[] = [
  { label: 'Overview', links: [{ to: '/dashboard', label: 'Command center', short: 'DC' }, { to: '/calendar', label: 'Calendar', short: 'CA' }, { to: '/gallery', label: 'Gallery', short: 'GA' }] },
  { label: 'Residents & rooms', links: [{ to: '/residents', label: 'Residents', short: 'RE' }, { to: '/rooms', label: 'Rooms and beds', short: 'RB' }, { to: '/attendance', label: 'Attendance', short: 'AT' }] },
  { label: 'Resident services', links: [{ to: '/complaints', label: 'Service desk', short: 'SD' }, { to: '/leave', label: 'Leave and gate', short: 'LG' }, { to: '/medical', label: 'Medical centre', short: 'MC' }, { to: '/laundry', label: 'Laundry', short: 'LN' }, { to: '/cleaning', label: 'Housekeeping', short: 'HK' }, { to: '/mess', label: 'Mess operations', short: 'MO' }] },
  { label: 'Campus & community', links: [{ to: '/visitors', label: 'Visitors', short: 'VS' }, { to: '/bookings', label: 'Bookings', short: 'BK' }, { to: '/parcels', label: 'Parcels', short: 'PC' }, { to: '/lostfound', label: 'Lost and found', short: 'LF' }, { to: '/community', label: 'Community', short: 'CM' }, { to: '/announcements', label: 'Announcements', short: 'AN' }] },
  { label: 'Administration', links: [{ to: '/fees', label: 'Fees and payments', short: 'FP' }, { to: '/assets', label: 'Assets', short: 'AS' }, { to: '/checkout', label: 'Checkout', short: 'CK' }, { to: '/reports', label: 'Reports', short: 'RP' }] },
];

const studentGroups: { label: string; links: NavigationLink[] }[] = [
  { label: 'My hostel', links: [{ to: '/dashboard', label: 'My overview', short: 'OV' }, { to: '/rooms', label: 'My room', short: 'MR' }, { to: '/attendance', label: 'Attendance', short: 'AT' }, { to: '/calendar', label: 'Calendar', short: 'CA' }] },
  { label: 'Requests & care', links: [{ to: '/complaints', label: 'Service requests', short: 'RQ' }, { to: '/leave', label: 'Leave and gate pass', short: 'LP' }, { to: '/medical', label: 'Health and wellness', short: 'HW' }, { to: '/laundry', label: 'Laundry', short: 'LN' }, { to: '/cleaning', label: 'Cleaning', short: 'CL' }] },
  { label: 'Dining & campus', links: [{ to: '/mess', label: 'Mess and meals', short: 'MM' }, { to: '/visitors', label: 'Visitor requests', short: 'VR' }, { to: '/bookings', label: 'Facility bookings', short: 'FB' }, { to: '/parcels', label: 'Parcels', short: 'PC' }] },
  { label: 'Community', links: [{ to: '/announcements', label: 'Announcements', short: 'AN' }, { to: '/gallery', label: 'Gallery', short: 'GA' }, { to: '/lostfound', label: 'Lost and found', short: 'LF' }, { to: '/community', label: 'Community board', short: 'CM' }] },
  { label: 'My account', links: [{ to: '/fees', label: 'Fees and receipts', short: 'FE' }] },
];

function pageTitle(pathname: string) {
  if (pathname.startsWith('/residents')) return 'Residents';
  if (pathname.startsWith('/rooms')) return 'Rooms and beds';
  if (pathname.startsWith('/attendance')) return 'Attendance';
  if (pathname.startsWith('/visitors')) return 'Visitors';
  if (pathname.startsWith('/complaints')) return 'Service desk';
  if (pathname.startsWith('/leave')) return 'Leave and gate';
  if (pathname.startsWith('/laundry')) return 'Laundry';
  if (pathname.startsWith('/mess')) return 'Mess operations';
  if (pathname.startsWith('/cleaning')) return 'Housekeeping';
  if (pathname.startsWith('/medical')) return 'Medical centre';
  if (pathname.startsWith('/announcements')) return 'Announcements';
  if (pathname.startsWith('/fees')) return 'Fees';
  if (pathname.startsWith('/assets')) return 'Assets';
  if (pathname.startsWith('/parcels')) return 'Parcels';
  if (pathname.startsWith('/bookings')) return 'Bookings';
  if (pathname.startsWith('/lostfound')) return 'Lost and found';
  if (pathname.startsWith('/community')) return 'Community';
  if (pathname.startsWith('/calendar')) return 'Calendar';
  if (pathname.startsWith('/gallery')) return 'Gallery';
  if (pathname.startsWith('/checkout')) return 'Checkout';
  if (pathname.startsWith('/reports')) return 'Reports';
  return 'Command center';
}

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const groups = user?.role === 'student' ? studentGroups : staffGroups;

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <button
        className={`nav-backdrop ${menuOpen ? 'visible' : ''}`}
        aria-label="Close navigation"
        onClick={() => setMenuOpen(false)}
      />
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand brand-light"><span>HP</span>Hostel Pulse</div>
        <div className="hostel-switcher">
          <span>HN</span>
          <div><strong>Haven North</strong><small>Operations workspace</small></div>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {groups.map((group) => (
            <details className="nav-group" key={group.label} open={group.links.some((link) => location.pathname === link.to)}>
              <summary>{group.label}</summary>
              <div className="nav-group-links">
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <b>{link.short}</b>{link.label}
                  </NavLink>
                ))}
              </div>
            </details>
          ))}
        </nav>
        <div className="sidebar-status">
          <span className="status-dot" />
          <div><strong>All systems normal</strong><small>Last checked just now</small></div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
            <span /><span /><span />
          </button>
          <div>
            <small>Haven North /</small>
            <strong>{pageTitle(location.pathname)}</strong>
          </div>
          <label className="global-search">
            <span>Search</span>
            <input aria-label="Search workspace" placeholder="Residents, rooms, requests..." />
            <kbd>Ctrl K</kbd>
          </label>
          <div className="profile-menu">
            <span className="avatar">{user?.name.split(' ').map((name) => name[0]).join('').slice(0, 2)}</span>
            <div><strong>{user?.name}</strong><small>{user?.role.replace('_', ' ')}</small></div>
            <button onClick={handleSignOut}>Sign out</button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
