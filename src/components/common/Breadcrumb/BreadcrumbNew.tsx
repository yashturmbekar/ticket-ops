import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaChevronRight } from "react-icons/fa";
import "./BreadcrumbModern.css";

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
    "/tickets/create": "Create Ticket",
    "/assets": "Assets",
    "/users": "Users",
    "/knowledge": "Knowledge Base",
    "/reports": "Reports",
    "/network": "Network",
    "/settings": "Settings",
    "/departments": "Departments",
    "/departments/create": "Create Department",
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;
    if (items) return items;

    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (pathnames.length > 0) {
      let currentPath = "";

      pathnames.forEach((pathname, index) => {
        currentPath += `/${pathname}`;
        const isLast = index === pathnames.length - 1;

        // Skip adding breadcrumb if it's the same as the previous one
        const label =
          routeMap[currentPath] ||
          pathname.charAt(0).toUpperCase() + pathname.slice(1);

        breadcrumbs.push({
          label,
          path: isLast ? undefined : currentPath,
          isActive: isLast,
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on the dashboard
  if (location.pathname === "/" || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="modern-breadcrumb" aria-label="breadcrumb">
      <ol className="modern-breadcrumb-list">
        {/* Home/Dashboard Link */}
        <li className="modern-breadcrumb-item">
          <Link to="/" className="modern-breadcrumb-link">
            <FaHome className="modern-breadcrumb-home-icon" />
            <span>Dashboard</span>
          </Link>
        </li>

        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <li className="modern-breadcrumb-separator">
              <FaChevronRight />
            </li>
            <li
              className={`modern-breadcrumb-item ${
                breadcrumb.isActive ? "active" : ""
              }`}
            >
              {breadcrumb.path ? (
                <Link to={breadcrumb.path} className="modern-breadcrumb-link">
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className="modern-breadcrumb-current">
                  {breadcrumb.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
