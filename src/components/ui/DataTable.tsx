import { type ReactNode } from 'react';

export type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  width?: string;
  hideOnMobile?: boolean;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  total?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  bulkActions?: ReactNode;
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  loading = false,
  error = null,
  emptyMessage = 'No records found.',
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  total,
  pageSize,
  onPageSizeChange,
  bulkActions,
}: DataTableProps<T>) {
  if (error) {
    return (
      <div className="data-error" role="alert">
        <p>Unable to load data.</p>
        <p className="error-detail">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="data-loading">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-cell" style={{ width: '40%' }} />
            <div className="skeleton-cell" style={{ width: '25%' }} />
            <div className="skeleton-cell" style={{ width: '20%' }} />
            <div className="skeleton-cell" style={{ width: '15%' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">
      {bulkActions && <div className="table-bulk-actions">{bulkActions}</div>}
      <div className="data-table" role="table" aria-label="Data table">
        <div className="data-row data-header" role="row">
          {columns.map((col) => (
            <span
              key={col.key}
              className={`header-cell${col.sortable ? ' sortable' : ''}${sortKey === col.key ? ` sorted-${sortDir}` : ''}`}
              style={col.width ? { width: col.width } : undefined}
              onClick={() => col.sortable && onSort?.(col.key)}
              role="columnheader"
              aria-sort={
                sortKey === col.key
                  ? sortDir === 'asc' ? 'ascending' : 'descending'
                  : undefined
              }
            >
              {col.label}
              {col.sortable && <span className="sort-icon" />}
            </span>
          ))}
        </div>
        {data.length === 0 ? (
          <div className="empty-state">{emptyMessage}</div>
        ) : (
          data.map((row) => (
            <div
              className={`data-row${onRowClick ? ' clickable' : ''}`}
              role="row"
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter') onRowClick(row); } : undefined}
            >
              {columns.map((col) => (
                <span
                  key={col.key}
                  className={`data-cell${col.hideOnMobile ? ' hide-mobile' : ''}`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </span>
              ))}
            </div>
          ))
        )}
      </div>
      {(page !== undefined && totalPages !== undefined && onPageChange) && (
        <div className="table-pagination">
          <div className="pagination-info">
            {total !== undefined && pageSize !== undefined && (
              <span>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</span>
            )}
          </div>
          <div className="pagination-controls">
            <button
              className="quiet-button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </button>
            <span className="page-indicator">{page} / {totalPages}</span>
            <button
              className="quiet-button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </button>
          </div>
          {onPageSizeChange && (
            <select
              value={pageSize ?? 20}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Page size"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          )}
        </div>
      )}
    </div>
  );
}

