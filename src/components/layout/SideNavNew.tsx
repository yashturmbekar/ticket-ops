import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEmployeeProfile } from "../../hooks/useEmployeeProfile";
import { UserRole } from "../../types";
import {
  getProfileImageUrl,
  getDisplayName,
  getDisplayRole,
} from "../../utils/profileUtils";
import { USER_ROLE_LABELS } from "../../constants/userRoles";
import "./SideNav.css";

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

const SideNav: React.FC = () => {
  const { user, logout } = useAuth();
  const { profile } = useEmployeeProfile();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest(".side-nav")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
    },
    {
      id: "tickets",
      label: "Tickets",
      path: "/tickets",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" />
        </svg>
      ),
    },
    {
      id: "assets",
      label: "Assets",
      path: "/assets",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
        </svg>
      ),
    },
    {
      id: "users",
      label: "Users",
      path: "/users",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v-2.5c0-.83.67-1.5 1.5-1.5S10 10.67 10 11.5V16h3v2H4zM12.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V16h3v2h-9v-6.5zM12 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2z" />
        </svg>
      ),
    },
    {
      id: "knowledge",
      label: "Knowledge Base",
      path: "/knowledge",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
    },
    {
      id: "reports",
      label: "Reports",
      path: "/reports",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
        </svg>
      ),
    },
    {
      id: "network",
      label: "Network",
      path: "/network",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v6h2V5h14v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 15l3-3-3-3v6zm6 0l3-3-3-3v6z" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      path: "/settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
        </svg>
      ),
      roles: [UserRole.ADMIN],
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const canAccessItem = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role as UserRole);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={toggleMobileMenu} />
      )}
      <nav
        className={`side-nav ${isCollapsed ? "collapsed" : ""} ${
          isMobileMenuOpen ? "mobile-open" : ""
        }`}
      >
        <div className="side-nav-header">
          <div className="brand">
            <img src="/redfish-logo.svg" alt="Redfish" width="24" height="24" />
            {!isCollapsed && <span className="brand-text">Ticket-Ops</span>}
          </div>
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
        </div>

        <div className="side-nav-content">
          <ul className="nav-menu">
            {navItems.filter(canAccessItem).map((item) => (
              <li key={item.id} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                  title={isCollapsed ? item.label : undefined}
                  onClick={toggleMobileMenu}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="side-nav-footer">
          <div className="user-info">
            <div className="user-avatar">
              {profile?.profilePic ? (
                <img
                  src={
                    getProfileImageUrl(
                      profile.profilePic,
                      profile.profilePicContentType
                    ) || ""
                  }
                  alt={profile.employeeName}
                  width="24"
                  height="24"
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
            {!isCollapsed && (
              <div className="user-details">
                <div className="user-name">
                  {getDisplayName(
                    profile?.employeeName,
                    user?.firstName,
                    user?.lastName,
                    user?.username
                  )}
                </div>
                <div className="user-role">
                  {getDisplayRole(
                    profile?.designation,
                    user?.role,
                    USER_ROLE_LABELS
                  )}
                </div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H4v16h10v-2h2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10z" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
