import { useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';

type Asset = {
  id: string;
  name: string;
  category: string;
  location: string;
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  assignedTo: string;
  lastMaintenance: string;
};

const mockAssets: Asset[] = [
  { id: 'AST-001', name: 'Projector - Epson EB-2155W', category: 'Electronics', location: 'Seminar Hall', status: 'available', assignedTo: '--', lastMaintenance: '12 May' },
  { id: 'AST-002', name: 'Whiteboard - 6x4 ft', category: 'Furniture', location: 'Study Room B-201', status: 'assigned', assignedTo: 'B-201', lastMaintenance: '--' },
  { id: 'AST-003', name: 'Water cooler', category: 'Appliance', location: 'Floor 2 Corridor', status: 'maintenance', assignedTo: '--', lastMaintenance: '10 Jun' },
  { id: 'AST-004', name: 'Sofa set (3-seater)', category: 'Furniture', location: 'Common Room', status: 'available', assignedTo: '--', lastMaintenance: '20 Apr' },
];

export default function AssetsPage() {
  const [assets] = useState(mockAssets);

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Assets' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Assets & inventory</h1>
          <p>Track hostel assets, assignments, and maintenance logs.</p>
        </div>
        <button className="primary-button">Add asset</button>
      </section>

      <section className="metric-grid compact">
        <article className="mini-metric"><span>Total assets</span><strong>284</strong><small>Registered</small></article>
        <article className="mini-metric"><span>Under maintenance</span><strong>12</strong><small>Needs service</small></article>
        <article className="mini-metric"><span>Retired this month</span><strong>3</strong><small>Decommissioned</small></article>
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Asset register</h2></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Asset ID</span><span>Name</span><span>Category</span><span>Location</span><span>Status</span><span>Assigned to</span><span>Last maint</span><span />
          </div>
          {assets.map((a) => (
            <div className="data-row" role="row" key={a.id}>
              <strong>{a.id}</strong><span>{a.name}</span><span>{a.category}</span><span>{a.location}</span>
              <StatusBadge>{a.status.replace('_', ' ')}</StatusBadge>
              <span>{a.assignedTo}</span><span>{a.lastMaintenance}</span>
              <button className="row-action">View</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
