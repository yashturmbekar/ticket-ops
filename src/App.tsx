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
import AppLayout from "./components/layout/AppLayout";
import { TicketsPage } from "./pages/TicketsPageNew";
import { CreateTicketPage } from "./pages/CreateTicketPage";
import { AssetsPage } from "./pages/AssetsPage.tsx";
import { UsersPage } from "./pages/UsersPage.tsx";
import { KnowledgePage } from "./pages/KnowledgePage.tsx";
import { ReportsPage } from "./pages/ReportsPage.tsx";
import { NetworkPage } from "./pages/NetworkPage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";
import DepartmentsCreatePage from "./pages/DepartmentsCreatePage";
import DepartmentsPage from "./pages/DepartmentsPage";
import { useAuth } from "./hooks/useAuth";
import { UserRole } from "./types";
import "./styles/globals.css";
import { RoleDashboard } from "./components/dashboards/RoleDashboard";

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
  return <AppLayout>{children}</AppLayout>;
};

// Main App component
const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <RoleDashboard />
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
          path="/tickets/create"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <CreateTicketPage />
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
          path="/departments"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <DepartmentsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/create"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <DepartmentsCreatePage />
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
