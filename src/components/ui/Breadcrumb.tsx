import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  separator?: string;
}

/**
 * Breadcrumb Navigation Component
 * Automatically generates breadcrumbs from current route or accepts manual items
 */
export function Breadcrumb({ 
  items, 
  className = '', 
  separator = '/' 
}: BreadcrumbProps) {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbs = items || generateBreadcrumbs(location.pathname);

  return (
    <nav aria-label="breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
      <Link
        to="/"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        Home
      </Link>

      {breadcrumbs.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="text-gray-500 dark:text-gray-400">{separator}</span>
          {item.path ? (
            <Link
              to={item.path}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/**
 * Auto-generate breadcrumb items from pathname
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  
  return paths.map((path, idx) => {
    const fullPath = '/' + paths.slice(0, idx + 1).join('/');
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    
    return {
      label,
      path: idx < paths.length - 1 ? fullPath : undefined,
    };
  });
}
