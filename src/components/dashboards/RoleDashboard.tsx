import React from "react";
import { AdminDashboard } from "./AdminDashboardNew";
import { ManagerDashboard } from "./ManagerDashboardNew";
import { EmployeeDashboard } from "./EmployeeDashboardNew";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types";

export const RoleDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case UserRole.ORG_ADMIN:
      return <AdminDashboard />;
    case UserRole.CXO:
      return <AdminDashboard />;
    case UserRole.MANAGER:
      return <ManagerDashboard />;
    case UserRole.HR:
      return <EmployeeDashboard />;
    case UserRole.EMPLOYEE:
      return <EmployeeDashboard />;
    default:
      return <EmployeeDashboard />;
  }
};
