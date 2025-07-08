import React from "react";
import {
  FaTicketAlt,
  FaLaptop,
  FaUsers,
  FaNetworkWired,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import type { DashboardStats } from "../types";
import "../styles/dashboard.css";

// Mock data - in a real app, this would come from an API
const mockStats: DashboardStats = {
  totalTickets: 1247,
  openTickets: 89,
  resolvedTickets: 1158,
  overdueTickets: 12,
  avgResolutionTime: 4.2,
  totalAssets: 542,
  activeAssets: 498,
  maintenanceAssets: 44,
  totalUsers: 156,
  activeUsers: 142,
  networkDevices: 28,
  onlineDevices: 26,
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType;
  color: string;
  change?: string;
}> = ({ title, value, icon: Icon, color, change }) => (
  <Card className="stat-card">
    <div className="stat-card-content">
      <div className="stat-card-header">
        <h3 className="stat-card-title">{title}</h3>
        <div className="stat-card-icon" style={{ color }}>
          <Icon />
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      {change && <div className="stat-card-change">{change}</div>}
    </div>
  </Card>
);

const RecentTickets: React.FC = () => {
  const recentTickets = [
    {
      id: "T-001",
      title: "Email server down",
      priority: "Critical",
      status: "Open",
      time: "2 hours ago",
    },
    {
      id: "T-002",
      title: "Printer not working",
      priority: "Medium",
      status: "In Progress",
      time: "4 hours ago",
    },
    {
      id: "T-003",
      title: "Password reset request",
      priority: "Low",
      status: "Resolved",
      time: "6 hours ago",
    },
    {
      id: "T-004",
      title: "VPN connection issues",
      priority: "High",
      status: "Open",
      time: "1 day ago",
    },
    {
      id: "T-005",
      title: "Software installation",
      priority: "Medium",
      status: "In Progress",
      time: "2 days ago",
    },
  ];

  return (
    <Card
      header={
        <div className="flex justify-content-between align-items-center">
          <h3>Recent Tickets</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      }
    >
      <div className="recent-tickets">
        {recentTickets.map((ticket) => (
          <div key={ticket.id} className="recent-ticket-item">
            <div className="recent-ticket-header">
              <span className="recent-ticket-id">{ticket.id}</span>
              <span
                className={`recent-ticket-priority priority-${ticket.priority.toLowerCase()}`}
              >
                {ticket.priority}
              </span>
            </div>
            <div className="recent-ticket-title">{ticket.title}</div>
            <div className="recent-ticket-footer">
              <span
                className={`recent-ticket-status status-${ticket.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {ticket.status}
              </span>
              <span className="recent-ticket-time">{ticket.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const QuickActions: React.FC = () => (
  <Card header={<h3>Quick Actions</h3>}>
    <div className="quick-actions">
      <Button variant="primary" fullWidth icon={<FaTicketAlt />}>
        Create New Ticket
      </Button>
      <Button variant="outline" fullWidth icon={<FaLaptop />}>
        Add Asset
      </Button>
      <Button variant="outline" fullWidth icon={<FaUsers />}>
        Add User
      </Button>
      <Button variant="outline" fullWidth icon={<FaNetworkWired />}>
        Check Network Status
      </Button>
    </div>
  </Card>
);

export const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your IT Support Dashboard</p>
      </div>

      <div className="dashboard-stats">
        <StatCard
          title="Total Tickets"
          value={mockStats.totalTickets}
          icon={FaTicketAlt}
          color="var(--color-primary)"
          change="+12% from last month"
        />
        <StatCard
          title="Open Tickets"
          value={mockStats.openTickets}
          icon={FaExclamationTriangle}
          color="var(--color-warning)"
          change="+5% from last week"
        />
        <StatCard
          title="Resolved Today"
          value={mockStats.resolvedTickets}
          icon={FaCheckCircle}
          color="var(--color-success)"
          change="+8% from yesterday"
        />
        <StatCard
          title="Overdue"
          value={mockStats.overdueTickets}
          icon={FaClock}
          color="var(--color-error)"
          change="-3% from last week"
        />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <RecentTickets />

          <Card header={<h3>System Health</h3>}>
            <div className="system-health">
              <div className="health-item">
                <div className="health-item-header">
                  <FaNetworkWired className="health-item-icon" />
                  <span>Network Status</span>
                </div>
                <span className="health-status status-online">Online</span>
              </div>
              <div className="health-item">
                <div className="health-item-header">
                  <FaLaptop className="health-item-icon" />
                  <span>Active Assets</span>
                </div>
                <span className="health-value">
                  {mockStats.activeAssets}/{mockStats.totalAssets}
                </span>
              </div>
              <div className="health-item">
                <div className="health-item-header">
                  <FaUsers className="health-item-icon" />
                  <span>Active Users</span>
                </div>
                <span className="health-value">
                  {mockStats.activeUsers}/{mockStats.totalUsers}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="dashboard-sidebar">
          <QuickActions />

          <Card header={<h3>Recent Activity</h3>}>
            <div className="recent-activity">
              <div className="activity-item">
                <div className="activity-time">2 min ago</div>
                <div className="activity-text">
                  Ticket T-001 assigned to John Smith
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-time">15 min ago</div>
                <div className="activity-text">Asset A-234 updated</div>
              </div>
              <div className="activity-item">
                <div className="activity-time">1 hour ago</div>
                <div className="activity-text">
                  New user registered: Jane Doe
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-time">3 hours ago</div>
                <div className="activity-text">Network device came online</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
