import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const CompactNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/" },
    { id: "tickets", label: "Tickets", path: "/tickets" },
    { id: "assets", label: "Assets", path: "/assets" },
    { id: "users", label: "Users", path: "/users" },
    { id: "knowledge", label: "Knowledge", path: "/knowledge" },
    { id: "reports", label: "Reports", path: "/reports" },
    { id: "network", label: "Network", path: "/network" },
    { id: "settings", label: "Settings", path: "/settings" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="compact-navigation">
      <a href="#" className="compact-logo" onClick={() => navigate("/")}>
        <img src="/redfish-logo.svg" alt="Redfish" width="24" height="24" />
        IT Ticket System
      </a>

      <div className="compact-nav-divider"></div>

      {navItems.map((item) => (
        <button
          key={item.id}
          className={`compact-nav-item ${isActive(item.path) ? "active" : ""}`}
          onClick={() => handleNavigation(item.path)}
        >
          {item.label}
        </button>
      ))}

      <div className="compact-user-info">
        <div>
          <div className="user-name">
            {user ? `${user.firstName} ${user.lastName}` : "User"}
          </div>
          <div className="user-role">{user?.role || "Role"}</div>
        </div>
        <button className="compact-logout" onClick={logout} title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H4v16h10v-2h2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10z" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default CompactNav;
