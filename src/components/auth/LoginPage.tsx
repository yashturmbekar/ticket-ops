import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { UserRole } from "../../types";
import "./LoginPage.css";

// Demo user credentials
const demoUsers = [
  {
    username: "admin@redfish.com",
    password: "admin123",
    role: UserRole.ADMIN,
    name: "Admin User",
  },
  {
    username: "manager@redfish.com",
    password: "manager123",
    role: UserRole.MANAGER,
    name: "Manager User",
  },
  {
    username: "tech@redfish.com",
    password: "tech123",
    role: UserRole.IT_STAFF,
    name: "IT Staff User",
  },
  {
    username: "employee@redfish.com",
    password: "employee123",
    role: UserRole.USER,
    name: "Employee User",
  },
];

export const LoginPage: React.FC = () => {
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const { toggleTheme, themeName } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isToggling, setIsToggling] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleThemeToggle = () => {
    setIsToggling(true);
    toggleTheme();
    setTimeout(() => setIsToggling(false), 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(username, password);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleDemoLogin = (demoUser: (typeof demoUsers)[0]) => {
    setUsername(demoUser.username);
    setPassword(demoUser.password);
    clearError();

    // Auto-login after setting credentials
    setTimeout(() => {
      login(demoUser.username, demoUser.password);
    }, 100);
  };

  return (
    <div className="login-page" data-theme={themeName}>
      <div className="login-container">
        <div className="login-header">
          <div className="theme-toggle-container">
            <button
              className={`theme-toggle-button ${isToggling ? "animating" : ""}`}
              onClick={handleThemeToggle}
              aria-label={`Switch to ${
                themeName === "light" ? "dark" : "light"
              } theme`}
            >
              {themeName === "light" ? "🌙" : "☀️"}
            </button>
          </div>
          <div className="logo">
            <img
              src="/redfish-logo.svg"
              alt="RedFish Ticket-Ops"
              className="logo-image"
            />
            <h1 className="logo-text">RedFish Ticket-Ops</h1>
          </div>
          <p className="login-subtitle">IT Service Management Platform</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="demo-section">
          <h3 className="demo-title">Demo Accounts</h3>
          <p className="demo-description">
            Click on any role below to login with demo credentials:
          </p>

          <div className="demo-users">
            {demoUsers.map((user) => (
              <button
                key={user.username}
                onClick={() => handleDemoLogin(user)}
                className="demo-user-button"
                disabled={isLoading}
              >
                <div className="demo-user-info">
                  <div className="demo-user-name">{user.name}</div>
                  <div className="demo-user-role">{user.role}</div>
                  <div className="demo-user-username">{user.username}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer">
          <p>&copy; 2025 RedFish Ticket-Ops. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
