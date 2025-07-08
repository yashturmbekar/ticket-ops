import React from "react";
import { FaBars, FaBell, FaUser, FaMoon, FaSun } from "react-icons/fa";
import { Button } from "../Button";
import { useAuth } from "../../../hooks/useAuth";
import { useTheme } from "../../../hooks/useTheme";
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

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Button
            variant="outline"
            size="sm"
            icon={<FaBars />}
            onClick={onMenuToggle}
            className="menu-toggle"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
          <div className="header-logo">
            <h1 className="header-title">IT Ticket Management</h1>
          </div>
        </div>

        <div className="header-right">
          <Button
            variant="outline"
            size="sm"
            icon={themeName === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleTheme}
            aria-label={`Switch to ${
              themeName === "light" ? "dark" : "light"
            } theme`}
          />

          <Button
            variant="outline"
            size="sm"
            icon={<FaBell />}
            aria-label="Notifications"
          />

          {user && (
            <div className="user-menu">
              <Button
                variant="outline"
                size="sm"
                icon={<FaUser />}
                onClick={handleLogout}
                aria-label="User menu"
              >
                {user.firstName} {user.lastName}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
