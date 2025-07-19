import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaTicketAlt,
  FaPlus,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { USER_ROLE_LABELS } from "../../constants/userRoles";
import "./Header.css";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout } = useAuth();
  const { themeName, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isUserMenuOpen &&
        !(event.target as Element).closest(".user-dropdown")
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        isNotificationOpen &&
        !(event.target as Element).closest(".notification-dropdown")
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
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsUserMenuOpen(false);
  };

  const handleNewTicket = () => {
    navigate("/dashboard", { state: { activeTab: "create" } });
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    // Navigate to profile page
    console.log("Navigate to profile page");
  };

  const handleSettingsClick = () => {
    setIsUserMenuOpen(false);
    // Navigate to settings page
    console.log("Navigate to settings page");
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={onMenuToggle}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <FaBars />
          </button>
          <div className="logo">
            <img
              src="/redfish-logo.svg"
              alt="RedFish IT"
              className="logo-image"
            />
            <div className="logo-text">
              <span className="logo-primary">RedFish</span>
              <span className="logo-secondary">Ticket-Ops</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tickets, users, assets..."
              className="search-input"
            />
          </div>
        </div>

        <div className="header-right">
          <div className="header-actions">
            <button
              className="action-btn create-ticket-btn"
              onClick={handleNewTicket}
            >
              <FaPlus />
              <span>New Ticket</span>
            </button>

            <div className="notification-dropdown">
              <button
                className="notification-btn"
                onClick={toggleNotifications}
                aria-label="Notifications"
              >
                <FaBell />
                <span className="notification-badge">3</span>
              </button>

              {isNotificationOpen && (
                <div className="notification-menu">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <button className="mark-all-read">Mark all as read</button>
                  </div>
                  <div className="notification-list">
                    <div className="notification-item">
                      <FaTicketAlt className="notification-icon" />
                      <div className="notification-content">
                        <p>New ticket assigned to you</p>
                        <span className="notification-time">2 min ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <FaTicketAlt className="notification-icon" />
                      <div className="notification-content">
                        <p>Ticket #1234 updated</p>
                        <span className="notification-time">5 min ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <FaTicketAlt className="notification-icon" />
                      <div className="notification-content">
                        <p>High priority ticket created</p>
                        <span className="notification-time">10 min ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="notification-footer">
                    <button className="view-all-btn">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${
                themeName === "light" ? "dark" : "light"
              } mode`}
            >
              {themeName === "light" ? <FaMoon /> : <FaSun />}
            </button>
          </div>

          <div className="user-dropdown">
            <button
              className="user-menu-toggle"
              onClick={toggleUserMenu}
              aria-expanded={isUserMenuOpen}
            >
              <div className="user-avatar">{getUserInitials()}</div>
              <div className="user-info">
                <span className="user-name">{getUserDisplayName()}</span>
                <span className="user-role">
                  {user?.role && USER_ROLE_LABELS[user.role]}
                </span>
              </div>
              <FaChevronDown
                className={`chevron ${isUserMenuOpen ? "rotated" : ""}`}
              />
            </button>

            {isUserMenuOpen && (
              <div className="user-menu">
                <div className="user-menu-header">
                  <div className="user-avatar-large">{getUserInitials()}</div>
                  <div className="user-details">
                    <span className="user-name-large">
                      {getUserDisplayName()}
                    </span>
                    <span className="user-email">{user?.email}</span>
                    <span className="user-role-badge">
                      {user?.role && USER_ROLE_LABELS[user.role]}
                    </span>
                  </div>
                </div>

                <div className="user-menu-divider"></div>

                <div className="user-menu-items">
                  <button
                    className="user-menu-item"
                    onClick={handleProfileClick}
                  >
                    <FaUser />
                    <span>Profile</span>
                  </button>
                  <button
                    className="user-menu-item"
                    onClick={handleSettingsClick}
                  >
                    <FaCog />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="user-menu-divider"></div>

                <button
                  className="user-menu-item logout-item"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
