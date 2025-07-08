import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PageLayout } from "./components/common/PageLayout";
import { NotificationContainer } from "./components/common/NotificationContainer";
import { RoleDashboard } from "./components/dashboards/RoleDashboard";
import { TicketsPage } from "./pages/TicketsPage";
import { AssetsPage } from "./pages/AssetsPage";
import { UsersPage } from "./pages/UsersPage";
import { KnowledgePage } from "./pages/KnowledgePage";
import { ReportsPage } from "./pages/ReportsPage";
import { NetworkPage } from "./pages/NetworkPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TicketRules } from "./components/admin/TicketRules";
import { AdminSettings } from "./components/admin/AdminSettings";
import { useAuth } from "./hooks/useAuth";
import { UserRole } from "./types";
import "./styles/globals.css";

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Only Route component
const AdminOnlyRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Login component (temporary)
const LoginPage: React.FC = () => {
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const [email, setEmail] = React.useState("admin@example.com");
  const [password, setPassword] = React.useState("password123");

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Clear any previous errors
    console.log("Attempting login with:", { email, password });
    try {
      await login(email, password);
    } catch (err) {
      // Error will be handled by the auth context
      console.error("Login failed:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-surface)",
      }}
    >
      <div
        style={{
          background: "var(--color-background)",
          padding: "2rem",
          borderRadius: "var(--border-radius-lg)",
          boxShadow: "var(--color-shadow)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
          IT Support Login
        </h1>
        <div
          style={{
            background: "#e3f2fd",
            padding: "1rem",
            borderRadius: "var(--border-radius-md)",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            color: "#1976d2",
          }}
        >
          <strong>Demo Credentials:</strong>
          <br />
          Email: admin@example.com
          <br />
          Password: password123
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--border-radius-md)",
                fontSize: "1rem",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--border-radius-md)",
                fontSize: "1rem",
              }}
              required
            />
          </div>
          {error && (
            <div
              style={{
                color: "var(--color-error)",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--border-radius-md)",
              fontSize: "1rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main App component
const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageLayout>
                <RoleDashboard />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <PageLayout>
                <TicketsPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <PageLayout>
                <AssetsPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <PageLayout>
                <UsersPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge"
          element={
            <ProtectedRoute>
              <PageLayout>
                <KnowledgePage />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <PageLayout>
                <ReportsPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/network"
          element={
            <ProtectedRoute>
              <PageLayout>
                <NetworkPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageLayout>
                <SettingsPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ticket-rules"
          element={
            <AdminOnlyRoute>
              <PageLayout>
                <TicketRules />
              </PageLayout>
            </AdminOnlyRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminOnlyRoute>
              <PageLayout>
                <AdminSettings />
              </PageLayout>
            </AdminOnlyRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <NotificationContainer />
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
