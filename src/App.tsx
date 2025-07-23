import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Snackbar } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { LoginPage } from "./components/auth";
import { NotificationContainer } from "./components/common/NotificationContainer";
import AppLayout from "./components/layout/AppLayout";
import { TicketsPage } from "./pages/TicketsDashboardPage.tsx";
import { CreateTicketPage } from "./pages/CreateTicketPage";
import TicketDetailsPageProfessional from "./pages/GetTicketDetailsPage.tsx";
import { AssetsPage } from "./pages/AssetsPage.tsx";
import { UsersPage } from "./pages/UsersPage.tsx";
import { KnowledgePage } from "./pages/KnowledgePage.tsx";
import { ReportsPage } from "./pages/ReportsPage.tsx";
import { NetworkPage } from "./pages/NetworkPage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";
import DepartmentsCreatePage from "./pages/CreateDepartmentsPage.tsx";
import DepartmentsPage from "./pages/DepartmentsPage";
import DepartmentsEditPage from "./pages/EditDepartmentPage.tsx";
import { useAuth } from "./hooks/useAuth";
import { usePermissions } from "./hooks/usePermissions";
import { UserRole, Permission } from "./types";
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from "./constants";
import { jwtDecode } from "jwt-decode";
import "./styles/globals.css";
import { RoleDashboard } from "./components/dashboards/RoleDashboard";

// Interfaces for JWT token structure
interface DecodedToken {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  isPaid?: boolean;
  iat: number;
  exp: number;
}

// Notification state interface
interface NotificationState {
  open: boolean;
  message: string;
  type: "success" | "error";
}

// Token validation and user authentication hook
const useTokenAuth = () => {
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  const validateToken = React.useCallback(() => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const urlParams = new URLSearchParams(window.location.search);
      const queryToken = urlParams.get("token");
      const userEmail = urlParams.get("email");

      // Handle URL token parameter
      if (!token && queryToken) {
        const userData = {
          username: userEmail,
          email: userEmail,
        };
        localStorage.setItem(AUTH_TOKEN_KEY, queryToken);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      }

      const currentToken = token || queryToken;

      if (!currentToken && !location.pathname.includes("login")) {
        console.warn("No token found. Redirecting to login.");
        navigate("/login");
        setIsLoading(false);
        return false;
      }

      if (currentToken) {
        try {
          const decodedToken: DecodedToken = jwtDecode(currentToken);
          console.log("Decoded Token:", decodedToken);
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            console.warn("Token expired. Redirecting to login.");
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(USER_DATA_KEY);
            navigate("/login");
            setIsLoading(false);
            return false;
          }

          // Check subscription status for certain roles
          if (
            !decodedToken.isPaid &&
            decodedToken.role === UserRole.ORG_ADMIN
          ) {
            navigate("/subscription-required");
            setIsLoading(false);
            return false;
          } else if (
            !decodedToken.isPaid &&
            decodedToken.role !== UserRole.ORG_ADMIN
          ) {
            navigate("/subscription-expired");
            setIsLoading(false);
            return false;
          }

          setIsTokenValid(true);
          setIsLoading(false);
          return true;
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_DATA_KEY);
          navigate("/login");
          setIsLoading(false);
          return false;
        }
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Token validation error:", error);
      setIsLoading(false);
      return false;
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return { isTokenValid, isLoading, validateToken };
};

// Enhanced Protected Route component with permission validation
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
}> = ({ children, requiredPermissions, requiredRole, requiredRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isTokenValid, isLoading: tokenLoading } = useTokenAuth();
  const {
    hasPermission,
    hasRole,
    isLoading: permissionsLoading,
    isSubscriptionActive,
  } = usePermissions();

  if (isLoading || tokenLoading || permissionsLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !isTokenValid) {
    return <Navigate to="/login" replace />;
  }

  // Check subscription for admin users
  if (!isSubscriptionActive && user?.role === UserRole.ORG_ADMIN) {
    return <Navigate to="/subscription-required" replace />;
  } else if (!isSubscriptionActive) {
    return <Navigate to="/subscription-expired" replace />;
  }

  // Check single role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check multiple roles access (user needs ANY of these roles)
  if (requiredRoles && requiredRoles.length > 0) {
    const hasAnyRequiredRole = requiredRoles.some((role) => hasRole(role));
    if (!hasAnyRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permission-based access
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every((permission) =>
      hasPermission(permission)
    );

    if (!hasRequiredPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

// Layout wrapper component
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <AppLayout>{children}</AppLayout>;
};

// Main App Content component with routing
const AppContent: React.FC = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    type: "success",
  });

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Subscription/Error Pages */}
        <Route
          path="/subscription-required"
          element={
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h2>Subscription Required</h2>
              <p>Admin access requires an active subscription.</p>
            </div>
          }
        />
        <Route
          path="/subscription-expired"
          element={
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h2>Subscription Expired</h2>
              <p>Your subscription has expired. Please renew to continue.</p>
            </div>
          }
        />
        <Route
          path="/unauthorized"
          element={
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h2>Unauthorized Access</h2>
              <p>You don't have permission to access this page.</p>
            </div>
          }
        />

        {/* Role-Specific Dashboard Routes */}
        <Route
          path="/dashboard/hr"
          element={
            <ProtectedRoute requiredRole={UserRole.HR}>
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>HR Dashboard</h1>
                  <p>Employee management, onboarding, and HR analytics</p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/executive"
          element={
            <ProtectedRoute requiredRole={UserRole.CXO}>
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>Executive Dashboard</h1>
                  <p>
                    Strategic overview, company metrics, and executive reports
                  </p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute requiredRole={UserRole.MANAGER}>
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>Manager Dashboard</h1>
                  <p>
                    Team management, performance tracking, and departmental
                    reports
                  </p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />

        {/* HR-specific Routes */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute
              requiredRoles={[UserRole.HR, UserRole.ORG_ADMIN, UserRole.CXO]}
            >
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>Employee Management</h1>
                  <p>Manage employee records, onboarding, and HR processes</p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <ProtectedRoute requiredRoles={[UserRole.HR, UserRole.ORG_ADMIN]}>
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>Payroll Management</h1>
                  <p>
                    Salary processing, benefits administration, and payroll
                    reports
                  </p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />

        {/* Manager-specific Routes */}
        <Route
          path="/team"
          element={
            <ProtectedRoute requiredRoles={[UserRole.MANAGER, UserRole.CXO]}>
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>Team Management</h1>
                  <p>
                    Team performance, project assignments, and team analytics
                  </p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/performance"
          element={
            <ProtectedRoute
              requiredRoles={[UserRole.MANAGER, UserRole.HR, UserRole.CXO]}
            >
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>Performance Management</h1>
                  <p>
                    Employee evaluations, goal tracking, and performance reviews
                  </p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />

        {/* Executive-specific Routes */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredRoles={[UserRole.CXO, UserRole.ORG_ADMIN]}>
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>Business Analytics</h1>
                  <p>
                    Company-wide metrics, strategic insights, and business
                    intelligence
                  </p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute requiredRoles={[UserRole.CXO, UserRole.ORG_ADMIN]}>
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>Budget & Finance</h1>
                  <p>
                    Financial planning, budget allocation, and expense tracking
                  </p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />

        {/* Helpdesk Admin Routes */}
        <Route
          path="/sla"
          element={
            <ProtectedRoute
              requiredRoles={[UserRole.ORG_ADMIN, UserRole.MANAGER]}
            >
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>SLA Management</h1>
                  <p>
                    Service level agreements, response times, and resolution
                    tracking
                  </p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/escalations"
          element={
            <ProtectedRoute
              requiredRoles={[UserRole.MANAGER, UserRole.ORG_ADMIN]}
            >
              <LayoutWrapper>
                <div style={{ padding: "2rem" }}>
                  <h1>Escalation Management</h1>
                  <p>
                    Ticket escalations, critical issues, and priority handling
                  </p>
                </div>
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />

        {/* Existing Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <TicketDetailsPageProfessional />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assets"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ORG_ADMIN]}>
              <LayoutWrapper>
                <AssetsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRoles={[UserRole.HR, UserRole.ORG_ADMIN]}>
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
            <ProtectedRoute
              requiredRoles={[
                UserRole.CXO,
                UserRole.MANAGER,
                UserRole.ORG_ADMIN,
              ]}
            >
              <LayoutWrapper>
                <ReportsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/network"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ORG_ADMIN]}>
              <LayoutWrapper>
                <NetworkPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <ProtectedRoute requiredRole={UserRole.ORG_ADMIN}>
              <LayoutWrapper>
                <DepartmentsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/create"
          element={
            <ProtectedRoute requiredRole={UserRole.ORG_ADMIN}>
              <LayoutWrapper>
                <DepartmentsCreatePage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/edit/:id"
          element={
            <ProtectedRoute requiredRole={UserRole.ORG_ADMIN}>
              <LayoutWrapper>
                <DepartmentsEditPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ORG_ADMIN, UserRole.CXO]}>
              <LayoutWrapper>
                <SettingsPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        message={notification.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor:
              notification.type === "success" ? "#4caf50" : "#f44336",
          },
        }}
      />

      <NotificationContainer />
    </Router>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Handle token from URL parameters on app initialization
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const urlParams = new URLSearchParams(window.location.search);
    const queryToken = urlParams.get("token");
    const userEmail = urlParams.get("email");

    if (!token && queryToken) {
      const userData = {
        username: userEmail,
        email: userEmail,
      };
      localStorage.setItem(AUTH_TOKEN_KEY, queryToken);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
  }, []);

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
