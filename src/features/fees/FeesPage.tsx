import { useState } from 'react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../app/providers';

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
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [invoices] = useState(mockInvoices);
  const visibleInvoices = invoices.filter((invoice) => !isStudent || invoice.student === user?.name);
  const totalDue = visibleInvoices.filter(i => i.status === 'unpaid' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);
  const totalCollected = visibleInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <main className="page-content">
      <Breadcrumbs crumbs={[{ label: 'Fees' }]} />
      <section className="page-heading">
        <div>
          <p className="eyebrow">{isStudent ? 'My account' : 'Accounting'}</p>
          <h1>Fees & payments</h1>
          <p>{isStudent ? 'Review your fee balance, due dates, and payment status.' : 'Manage fee structures, invoices, payments, refunds and receipts.'}</p>
        </div>
        {!isStudent && <button className="primary-button">Generate invoice</button>}
      </section>
      <section className="metric-grid compact">
        <article className="mini-metric"><span>Due this month</span><strong>{formatCurrency(totalDue)}</strong><small>Outstanding</small></article>
        <article className="mini-metric"><span>Collected</span><strong>{formatCurrency(totalCollected)}</strong><small>This month</small></article>
        <article className="mini-metric"><span>Overdue</span><strong>{visibleInvoices.filter((invoice) => invoice.status === 'overdue').length}</strong><small>Invoice overdue</small></article>
      </section>
      <section className="panel">
        <div className="panel-heading"><h2>Invoices</h2></div>
        <div className="data-table" role="table">
          <div className="data-row data-header" role="row">
            <span>Invoice</span><span>Student</span><span>Description</span><span>Amount</span><span>Due</span><span>Status</span><span />
          </div>
          {visibleInvoices.map((inv) => (
            <div className="data-row" role="row" key={inv.id}>
              <strong>{inv.id}</strong><span>{inv.student}</span><span>{inv.description}</span>
              <strong>{formatCurrency(inv.amount)}</strong><span>{inv.dueDate}</span>
              <StatusBadge>{inv.status}</StatusBadge>
              <span className="muted">{isStudent ? 'Receipt available after payment' : 'View'}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
