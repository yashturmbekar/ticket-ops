import React from "react";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";
import { Loader } from "../components/common";
import { RoleWelcome } from "../components/common/RoleWelcome";
import { AdminDashboard } from "../components/dashboards/AdminDashboard";
import { ManagerDashboard } from "../components/dashboards/ManagerDashboard";
import { EmployeeDashboard } from "../components/dashboards/EmployeeDashboard";
import "../styles/dashboard.css";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Loader centered text="Loading dashboard..." minHeight="60vh" />;
  }

  // Common dashboard layout with role welcome
  const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <div className="dashboard-container">
      <RoleWelcome />
      {children}
    </div>
  );

  // Render different dashboard based on user role
  switch (user.role) {
    case UserRole.ORG_ADMIN:
      return (
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      );
    case UserRole.MANAGER:
      return (
        <DashboardLayout>
          <ManagerDashboard />
        </DashboardLayout>
      );
    case UserRole.HR:
      return (
        <DashboardLayout>
          <EmployeeDashboard />
        </DashboardLayout>
      );
    case UserRole.CXO:
      return (
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      );
    case UserRole.EMPLOYEE:
      return (
        <DashboardLayout>
          <EmployeeDashboard />
        </DashboardLayout>
      );
    default:
      return (
        <DashboardLayout>
          <EmployeeDashboard />
        </DashboardLayout>
      );
  }
};
