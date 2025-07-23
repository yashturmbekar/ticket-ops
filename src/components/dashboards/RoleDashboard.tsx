import React from "react";
import { AdminDashboard } from "./AdminDashboardNew";
import { ManagerDashboard } from "./ManagerDashboardNew";
import { EmployeeDashboard } from "./EmployeeDashboardNew";
import { OperationsDashboard } from "./OperationsDashboardNew";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types";

export const RoleDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

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
