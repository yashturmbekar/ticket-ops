import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaChevronRight } from "react-icons/fa";
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
  const [ticketCode, setTicketCode] = useState<string | null>(null);

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

  // Check if we're on a ticket details page and get the ticket code
  useEffect(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    
    if (
      pathnames[0] === "tickets" &&
      pathnames.length === 2 &&
      pathnames[1] !== "create"
    ) {
      const ticketId = pathnames[1];
      const storedTicketCode = sessionStorage.getItem(`ticketCode_${ticketId}`);
      setTicketCode(storedTicketCode);
      
      // Set up an interval to check for ticket code updates
      const interval = setInterval(() => {
        const updatedTicketCode = sessionStorage.getItem(`ticketCode_${ticketId}`);
        if (updatedTicketCode && updatedTicketCode !== ticketCode) {
          setTicketCode(updatedTicketCode);
        }
      }, 100);

      return () => clearInterval(interval);
    } else {
      setTicketCode(null);
    }
  }, [location.pathname, ticketCode]);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;
    if (items) return items;

    const pathnames = location.pathname.split("/").filter((x) => x);

    // Only show Dashboard > Departments > Edit-{id} for /departments/edit/:id
    if (
      pathnames[0] === "departments" &&
      pathnames[1] === "edit" &&
      pathnames.length === 3
    ) {
      return [
        // Only Departments and Edit-{id} (Dashboard is always rendered as the home link)
        { label: "Departments", path: "/departments", isActive: false },
        { label: `Edit-${pathnames[2]}`, isActive: true },
      ];
    }

    const breadcrumbs: BreadcrumbItem[] = [];

    if (pathnames.length > 0) {
      let currentPath = "";

      pathnames.forEach((pathname, index) => {
        currentPath += `/${pathname}`;
        const isLast = index === pathnames.length - 1;

        // Special handling for ticket details - check if it's a ticket ID route
        if (
          pathnames[0] === "tickets" &&
          pathnames.length === 2 &&
          !routeMap[currentPath] && // Not a known route like "/tickets/create"
          pathname !== "create" // Explicitly exclude create route
        ) {
          // Use the reactive ticket code state instead of directly accessing sessionStorage
          const label = ticketCode || `Ticket ${pathname}`;
          breadcrumbs.push({
            label,
            path: isLast ? undefined : currentPath,
            isActive: isLast,
          });
          return;
        }

        // Special handling for /departments/edit/:id - show only one breadcrumb: Edit-{id}
        if (
          pathnames[0] === "departments" &&
          pathnames[1] === "edit" &&
          pathnames.length === 3
        ) {
          // Only push Departments and Edit-{id}
          breadcrumbs.push({
            label: routeMap["/departments"] || "Departments",
            path: "/departments",
            isActive: false,
          });
          breadcrumbs.push({
            label: `Edit-${pathnames[2]}`,
            isActive: true,
          });
          return breadcrumbs;
        }

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
