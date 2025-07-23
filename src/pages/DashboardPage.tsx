import React from "react";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";
import { Loader } from "../components/common";
import { AdminDashboard } from "../components/dashboards/AdminDashboard";
import { ManagerDashboard } from "../components/dashboards/ManagerDashboard";
import { OperationsDashboard } from "../components/dashboards/OperationsDashboard";
import { EmployeeDashboard } from "../components/dashboards/EmployeeDashboard";
import "../styles/dashboard.css";
import { useLocation } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return <Loader centered text="Loading dashboard..." minHeight="60vh" />;
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
      return <EmployeeDashboard initialTab={location.state?.activeTab} />;
    default:
      return <EmployeeDashboard initialTab={location.state?.activeTab} />;
  }
};
