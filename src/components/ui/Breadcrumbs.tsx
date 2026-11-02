import { Link } from 'react-router-dom';

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  crumbs: Crumb[];
};

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.label}>
              {isLast || !crumb.href ? (
                <span aria-current={isLast ? 'page' : undefined}>{crumb.label}</span>
              ) : (
                <Link to={crumb.href}>{crumb.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

