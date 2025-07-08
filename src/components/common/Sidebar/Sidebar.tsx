import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaLaptop,
  FaUsers,
  FaBook,
  FaChartBar,
  FaNetworkWired,
  FaCog,
  FaPlus,
} from "react-icons/fa";
import { Button } from "../Button";
import { useAuth } from "../../../hooks/useAuth";
import { Permission } from "../../../types";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType;
  permission?: Permission;
  badge?: string | number;
}

const navItems: NavItem[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: FaTachometerAlt,
    permission: Permission.TICKET_VIEW,
  },
  {
    path: "/tickets",
    label: "Tickets",
    icon: FaTicketAlt,
    permission: Permission.TICKET_VIEW,
  },
  {
    path: "/assets",
    label: "Assets",
    icon: FaLaptop,
    permission: Permission.ASSET_VIEW,
  },
  {
    path: "/users",
    label: "Users",
    icon: FaUsers,
    permission: Permission.USER_VIEW,
  },
  {
    path: "/knowledge",
    label: "Knowledge Base",
    icon: FaBook,
    permission: Permission.KNOWLEDGE_VIEW,
  },
  {
    path: "/reports",
    label: "Reports",
    icon: FaChartBar,
    permission: Permission.REPORT_VIEW,
  },
  {
    path: "/network",
    label: "Network",
    icon: FaNetworkWired,
    permission: Permission.NETWORK_VIEW,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: FaCog,
    permission: Permission.ADMIN_SETTINGS,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { hasPermission } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-text">IT Support</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <Button
              variant="primary"
              size="sm"
              icon={<FaPlus />}
              fullWidth
              className="sidebar-action-btn"
              onClick={() => {
                // TODO: Navigate to create ticket
                onClose();
              }}
            >
              New Ticket
            </Button>
          </div>

          <div className="sidebar-section">
            <ul className="sidebar-nav-list">
              {filteredNavItems.map((item) => (
                <li key={item.path} className="sidebar-nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-nav-link ${isActive ? "active" : ""}`
                    }
                    onClick={onClose}
                  >
                    <span className="sidebar-nav-icon">
                      <item.icon />
                    </span>
                    <span className="sidebar-nav-text">{item.label}</span>
                    {item.badge && (
                      <span className="sidebar-nav-badge">{item.badge}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-content">
            <small className="sidebar-footer-text">
              © 2024 IT Support System
            </small>
          </div>
        </div>
      </aside>
    </>
  );
};
