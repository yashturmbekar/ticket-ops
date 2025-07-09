import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumb.css";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  customItems?: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  customItems,
}) => {
  const location = useLocation();

  const routeMap: Record<string, string> = {
    "/": "Dashboard",
    "/tickets": "Tickets",
    "/assets": "Assets",
    "/users": "Users",
    "/knowledge": "Knowledge Base",
    "/reports": "Reports",
    "/network": "Network",
    "/settings": "Settings",
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;
    if (items) return items;

    const pathnames = location.pathname.split("/").filter((x) => x);

    const breadcrumbs: BreadcrumbItem[] = [{ label: "Dashboard", path: "/" }];

    if (pathnames.length > 0) {
      let currentPath = "";

      pathnames.forEach((pathname, index) => {
        currentPath += `/${pathname}`;
        const isLast = index === pathnames.length - 1;

        breadcrumbs.push({
          label:
            routeMap[currentPath] ||
            pathname.charAt(0).toUpperCase() + pathname.slice(1),
          path: isLast ? undefined : currentPath,
          isActive: isLast,
        });
      });
    } else {
      breadcrumbs[0].isActive = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <div className="breadcrumb-container">
        <div className="breadcrumb-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>
        <ol className="breadcrumb-list">
          {breadcrumbs.map((item, index) => (
            <li key={index} className="breadcrumb-item">
              {item.path && !item.isActive ? (
                <Link to={item.path} className="breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`breadcrumb-text ${item.isActive ? "active" : ""}`}
                >
                  {item.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9.29 15.88L13.17 12 9.29 8.12a.996.996 0 1 1 1.41-1.41l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3a.996.996 0 0 1-1.41-1.42z" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
