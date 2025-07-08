import React from "react";
import { AdminDashboard } from "./AdminDashboard";
import { ManagerDashboard } from "./ManagerDashboard";
import { EmployeeDashboard } from "./EmployeeDashboard";
import { OperationsDashboard } from "./OperationsDashboard";
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
