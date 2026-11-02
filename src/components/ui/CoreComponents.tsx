import { ReactNode } from 'react';
import React from 'react';

// DataTable Component
interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  loading?: boolean;
  pagination?: { page: number; pageSize: number; total: number };
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  emptyState?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  pagination,
  onPageChange,
  onSort,
  emptyState,
  className = '',
}: DataTableProps<T>) {
  if (loading) {
    return <div className={`p-6 text-center ${className}`}>Loading...</div>;
  }

  if (data.length === 0) {
    return (
      <div className={`p-12 text-center text-gray-500 ${className}`}>
        {emptyState || 'No data available'}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() =>
                  col.sortable && onSort?.(String(col.key), 'asc')
                }
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && <span className="text-xs">↕</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={keyExtractor(row, idx)}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              ← Prev
            </button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.page}
            </span>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'danger' }[];
  size?: 'sm' | 'md' | 'lg';
  closeButton?: boolean;
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  actions = [],
  size = 'md',
  closeButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-96',
    md: 'w-[600px]',
    lg: 'w-[800px]',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${sizeClasses[size]} max-h-[90vh] overflow-auto`}>
        {(title || closeButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>}
            {closeButton && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {actions.length > 0 && (
          <div className="flex gap-2 justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`px-4 py-2 rounded font-medium ${
                  action.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Drawer Component
interface DrawerProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  position?: 'left' | 'right';
  width?: string;
  closeButton?: boolean;
}

export function Drawer({
  isOpen,
  title,
  children,
  onClose,
  position = 'right',
  width = 'w-80',
  closeButton = true,
}: DrawerProps) {
  if (!isOpen) return null;

  const positionClasses = position === 'left' ? 'left-0' : 'right-0';

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 cursor-pointer"
        onClick={onClose}
      />
      <div
        className={`fixed top-0 ${positionClasses} ${width} h-screen bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto transition-transform duration-300`}
      >
        {(title || closeButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
            {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>}
            {closeButton && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </>
  );
}

// Toast Component
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className={`${bgColor[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:opacity-80">
        ✕
      </button>
    </div>
  );
}

// Skeleton Loader Component
export function Skeleton({
  height = 'h-4',
  width = 'w-full',
  className = '',
}: {
  height?: string;
  width?: string;
  className?: string;
}) {
  return (
    <div
      className={`${height} ${width} ${className} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
    />
  );
}

// FileUploader Component
interface FileUploaderProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  label?: string;
  preview?: boolean;
}

export function FileUploader({
  onUpload,
  accept = '*',
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  label = 'Click to upload',
  preview = true,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter((f) => f.size <= maxSize);
    setFiles(validFiles);
    onUpload(validFiles);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple={multiple}
          accept={accept}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="text-gray-600 dark:text-gray-400">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-500">or drag and drop</p>
        </div>
      </div>

      {preview && files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// EmptyState Component
interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ConfirmDialog Component
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantColor = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded font-medium text-white ${variantColor[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ErrorBoundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error) ?? (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">Something went wrong</h3>
            <p className="text-sm text-red-700 dark:text-red-400">{this.state.error.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
