import React from "react";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";
import { AdminDashboard } from "../components/dashboards/AdminDashboard";
import { ManagerDashboard } from "../components/dashboards/ManagerDashboard";
import { OperationsDashboard } from "../components/dashboards/OperationsDashboard";
import { EmployeeDashboard } from "../components/dashboards/EmployeeDashboard";
import "../styles/dashboard.css";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Render different dashboard based on user role
  switch (user.role) {
    case UserRole.ADMIN:
      return <AdminDashboard />;
    case UserRole.MANAGER:
      return <ManagerDashboard />;
    case UserRole.IT_STAFF:
      return <OperationsDashboard />;
    case UserRole.USER:
      return <EmployeeDashboard />;
    default:
      return <EmployeeDashboard />;
  }
};
