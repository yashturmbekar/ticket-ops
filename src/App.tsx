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
import { LoginPage } from "./components/auth";
import { NotificationContainer } from "./components/common/NotificationContainer";
import CompactNav from "./components/layout/CompactNav";
import { DashboardPage } from "./pages/DashboardPage";
import { TicketsPage } from "./pages/TicketsPage.tsx";
import { AssetsPage } from "./pages/AssetsPage.tsx";
import { UsersPage } from "./pages/UsersPage.tsx";
import { KnowledgePage } from "./pages/KnowledgePage.tsx";
import { ReportsPage } from "./pages/ReportsPage.tsx";
import { NetworkPage } from "./pages/NetworkPage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";
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

// Layout wrapper component
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <CompactNav />
      <div className="compact-layout">{children}</div>
    </>
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
              <LayoutWrapper>
                <DashboardPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <TicketsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <AssetsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <UsersPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <KnowledgePage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <ReportsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/network"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <NetworkPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <AdminOnlyRoute>
              <LayoutWrapper>
                <SettingsPage />
              </LayoutWrapper>
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
