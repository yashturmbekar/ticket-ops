import React from "react";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { USER_ROLE_LABELS } from "../../constants/userRoles";
import "./Header.css";

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout } = useAuth();
  const { themeName, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || "User";
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
            <span className="logo-text">RedFish IT</span>
          </div>
        </div>

        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${themeName === "light" ? "dark" : "light"} mode`}
          >
            {themeName === "light" ? "🌙" : "☀️"}
          </button>

          <div className="user-menu">
            <span className="user-name">{getUserDisplayName()}</span>
            <span className="user-role">
              {user?.role && USER_ROLE_LABELS[user.role]}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
