import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaLaptop,
  FaUsers,
  FaBook,
  FaChartBar,
  FaNetworkWired,
  FaCog,
  FaBuilding,
  FaShieldAlt,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types";
import "./SideNavModern.css";

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: UserRole[];
  badge?: string;
}

interface SideNavProps {
  isMobileMenuOpen?: boolean;
  isCollapsed?: boolean;
  onMobileMenuToggle?: () => void;
}

const SideNav: React.FC<SideNavProps> = ({
  isMobileMenuOpen = false,
  isCollapsed = false,
  onMobileMenuToggle,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/",
      icon: <FaTachometerAlt />,
    },
    {
      id: "tickets",
      label: "Tickets",
      path: "/tickets",
      icon: <FaTicketAlt />,
      badge: "12",
    },
    {
      id: "assets",
      label: "Assets",
      path: "/assets",
      icon: <FaLaptop />,
    },
    {
      id: "users",
      label: "Users",
      path: "/users",
      icon: <FaUsers />,
      roles: [UserRole.ADMIN, UserRole.MANAGER],
    },
    {
      id: "departments",
      label: "Departments",
      path: "/departments",
      icon: <FaBuilding />,
      roles: [UserRole.ADMIN],
    },
    {
      id: "knowledge",
      label: "Knowledge Base",
      path: "/knowledge",
      icon: <FaBook />,
    },
    {
      id: "reports",
      label: "Reports",
      path: "/reports",
      icon: <FaChartBar />,
      roles: [UserRole.ADMIN, UserRole.MANAGER],
    },
    {
      id: "network",
      label: "Network",
      path: "/network",
      icon: <FaNetworkWired />,
      roles: [UserRole.ADMIN, UserRole.IT_STAFF],
    },
    {
      id: "settings",
      label: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  const hasAccess = (item: NavItem): boolean => {
    if (!item.roles || !user?.role) return true;
    return item.roles.includes(user.role);
  };

  const isActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const filteredItems = navigationItems.filter(hasAccess);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="modern-sidebar-overlay" onClick={onMobileMenuToggle} />
      )}

      {/* Sidebar */}
      <nav
        className={`modern-sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileMenuOpen ? "mobile-open" : ""
        }`}
      >
        {/* Sidebar Header */}
        <div className="modern-sidebar-header">
          <div className="modern-sidebar-brand">
            <div className="modern-brand-icon">
              <FaShieldAlt />
            </div>
            {!isCollapsed && (
              <div className="modern-brand-content">
                <h3 className="modern-brand-title">IT Helpdesk</h3>
                <p className="modern-brand-subtitle">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <div className="modern-sidebar-content">
          <ul className="modern-nav-list">
            {filteredItems.map((item) => (
              <li key={item.id} className="modern-nav-item">
                <Link
                  to={item.path}
                  className={`modern-nav-link ${
                    isActive(item.path) ? "active" : ""
                  }`}
                  onClick={() => {
                    if (isMobileMenuOpen && onMobileMenuToggle) {
                      onMobileMenuToggle();
                    }
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="modern-nav-icon">{item.icon}</div>

                  {!isCollapsed && (
                    <>
                      <span className="modern-nav-label">{item.label}</span>
                      {item.badge && (
                        <span className="modern-nav-badge">{item.badge}</span>
                      )}
                    </>
                  )}

                  {isCollapsed && item.badge && (
                    <span className="modern-nav-badge-collapsed">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="modern-sidebar-footer">
          {!isCollapsed && user && (
            <div className="modern-user-card">
              <div className="modern-user-avatar">
                {user.firstName?.charAt(0) || user.username?.charAt(0) || "U"}
              </div>
              <div className="modern-user-info">
                <p className="modern-user-name">
                  {user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </p>
                <p className="modern-user-role">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default SideNav;
