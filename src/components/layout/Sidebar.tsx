import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/tickets", label: "Tickets", icon: "🎫" },
    { path: "/assets", label: "Assets", icon: "💼" },
    { path: "/users", label: "Users", icon: "👥" },
    { path: "/knowledge", label: "Knowledge Base", icon: "📚" },
    { path: "/reports", label: "Reports", icon: "📊" },
    { path: "/network", label: "Network", icon: "🌐" },
  ];

  const adminItems = [{ path: "/settings", label: "Settings", icon: "⚙️" }];

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-title">Main</h3>
            <ul className="nav-list">
              {menuItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      isActive(item.path) ? "active" : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {user?.role === UserRole.ADMIN && (
            <div className="nav-section">
              <h3 className="nav-title">Administration</h3>
              <ul className="nav-list">
                {adminItems.map((item) => (
                  <li key={item.path} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link ${
                        isActive(item.path) ? "active" : ""
                      }`}
                      onClick={handleLinkClick}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};
