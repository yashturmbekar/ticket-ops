import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/common";
import { UnifiedDashboard } from "../components/dashboards/UnifiedDashboard";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Loader
        centered
        text="Loading dashboard..."
        minHeight="60vh"
        useTicketAnimation={true}
        ticketMessage="Authenticating and preparing your workspace..."
      />
    );
  }

  return (
    <div className="dashboard-container">
      <UnifiedDashboard />
    </div>
  );
};
