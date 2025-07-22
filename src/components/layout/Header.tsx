import React, { useState, useEffect } from "react";
import { FaBars, FaBell, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { USER_ROLE_LABELS } from "../../constants/userRoles";
import "./HeaderModern.css";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuToggle: () => void;
  onSidebarToggle?: () => void;
  isMenuOpen: boolean;
  isCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  onSidebarToggle,
  isCollapsed = false,
}) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isUserMenuOpen &&
        !(event.target as Element).closest(".modern-user-dropdown")
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        isNotificationOpen &&
        !(event.target as Element).closest(".modern-notification-dropdown")
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen, isNotificationOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const getUserDisplayName = () => {
    console.log("User data:", user); // Debug log
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || "User";
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0).toUpperCase()}${user.lastName
        .charAt(0)
        .toUpperCase()}`;
    }
    if (user?.username) {
      const username = user.username.toUpperCase();
      return username.length >= 2 ? username.substring(0, 2) : username;
    }
    return "U";
  };

  const toggleUserMenu = () => {
    console.log("Toggle user menu clicked, current state:", isUserMenuOpen);
    console.log("User data in toggle:", user);
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsUserMenuOpen(false);
  };

  const getRoleLabel = () => {
    if (!user?.role) return "User";
    return USER_ROLE_LABELS[user.role] || "User";
  };

  return (
    <header className="modern-header">
      <div className="modern-header-left">
        {/* Mobile menu toggle */}
        <button
          className="modern-mobile-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <FaBars />
        </button>

        {/* Desktop sidebar toggle */}
        {onSidebarToggle && (
          <button
            className="modern-sidebar-toggle"
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <FaAngleRight /> : <FaAngleLeft />}
          </button>
        )}

        {/* Logo and brand */}
        <div className="modern-brand">
          <img
            src="/redfish-logo.svg"
            alt="Redfish"
            className="modern-brand-logo"
          />
          <span className="modern-brand-text">Ticket-Ops</span>
        </div>
      </div>

      <div className="modern-header-right">
        {/* Notifications */}
        <div className="modern-notification-dropdown">
          <button
            className="modern-icon-btn modern-notification-btn"
            onClick={toggleNotifications}
            aria-expanded={isNotificationOpen}
            title="Notifications"
          >
            <FaBell />
            <span className="modern-notification-badge">3</span>
          </button>

          {isNotificationOpen && (
            <div className="modern-dropdown-menu modern-notification-menu">
              <div className="modern-dropdown-header">
                <h3>Notifications</h3>
                <button className="modern-text-btn">Mark all read</button>
              </div>
              <div className="modern-notification-list">
                <div className="modern-notification-item">
                  <div className="modern-notification-content">
                    <p className="modern-notification-title">
                      New ticket assigned
                    </p>
                    <p className="modern-notification-text">
                      Ticket #T-001 has been assigned to you
                    </p>
                    <span className="modern-notification-time">
                      2 minutes ago
                    </span>
                  </div>
                </div>
                <div className="modern-notification-item">
                  <div className="modern-notification-content">
                    <p className="modern-notification-title">SLA Warning</p>
                    <p className="modern-notification-text">
                      Ticket #T-015 is approaching SLA deadline
                    </p>
                    <span className="modern-notification-time">
                      15 minutes ago
                    </span>
                  </div>
                </div>
                <div className="modern-notification-item">
                  <div className="modern-notification-content">
                    <p className="modern-notification-title">System Update</p>
                    <p className="modern-notification-text">
                      Maintenance scheduled for tonight at 2 AM
                    </p>
                    <span className="modern-notification-time">1 hour ago</span>
                  </div>
                </div>
              </div>
              <div className="modern-dropdown-footer">
                <button className="modern-text-btn">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Name */}
        <span className="modern-user-name-display">
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username || "User"}
        </span>

        {/* User Profile Photo */}
        <div className="modern-user-dropdown">
          <button
            className="modern-user-profile-btn"
            onClick={toggleUserMenu}
            aria-expanded={isUserMenuOpen}
          >
            <div className="modern-user-avatar">{getUserInitials()}</div>
          </button>

          {isUserMenuOpen && (
            <div
              className="modern-dropdown-menu modern-user-menu"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #ccc",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 9999,
              }}
            >
              <div className="modern-dropdown-header">
                <div className="modern-user-profile">
                  <div className="modern-user-avatar-large">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="modern-user-name">{getUserDisplayName()}</p>
                    <p className="modern-user-role">{getRoleLabel()}</p>
                  </div>
                </div>
              </div>

              <div className="modern-dropdown-divider" />

              <button
                className="modern-dropdown-item"
                onClick={() => {
                  navigate("/profile");
                  setIsUserMenuOpen(false);
                }}
              >
                <span>My Account</span>
              </button>

              <button
                className="modern-dropdown-item"
                onClick={() => {
                  navigate("/settings");
                  setIsUserMenuOpen(false);
                }}
              >
                <span>Change Password</span>
              </button>

              <div className="modern-dropdown-divider" />

              <button
                className="modern-dropdown-item modern-logout-item"
                onClick={handleLogout}
              >
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
