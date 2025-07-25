import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaChartLine,
  FaBolt,
  FaEye,
  FaChartBar,
  FaTasks,
  FaBusinessTime,
  FaCalendarCheck,
  FaBuilding,
  FaUser,
  FaUsers,
  FaUserCheck,
} from "react-icons/fa";
import { Loader, TicketTile } from "../common";
import type { Ticket } from "../../types";
import {
  searchTickets,
  searchMyTickets,
  searchAssignedTickets,
} from "../../services";
import { transformApiTicketsToTickets } from "../../utils/apiTransforms";
import { useNotifications } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { UserRole, type ApiTicketResponse } from "../../types";
import "./dashboardShared.css";

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
  slaBreaches: number;
  overdueTickets: number;
  avgResolutionTime: number;
  todayTickets: number;
  weeklyTickets: number;
  monthlyTickets: number;
  teamEfficiency: number;
  userSatisfaction: number;
  pendingApprovals?: number;
  teamMembers?: number;
  assignedTickets?: number;
  departmentTickets?: number;
}

interface DashboardConfig {
  showOrganizationTickets: boolean;
  showMyTickets: boolean;
  showAssignedTickets: boolean;
  showDepartmentTickets: boolean;
  tabOptions: Array<{
    key: string;
    label: string;
    icon: React.ReactElement;
  }>;
  statsConfig: Array<{
    key: keyof DashboardStats;
    label: string;
    icon: React.ReactElement;
    color: string;
    description: string;
  }>;
}

const getDashboardConfig = (role: UserRole): DashboardConfig => {
  const baseConfig = {
    showOrganizationTickets: false,
    showMyTickets: true,
    showAssignedTickets: false,
    showDepartmentTickets: false,
    tabOptions: [],
    statsConfig: [],
  };

  switch (role) {
    case UserRole.ORG_ADMIN:
    case UserRole.HELPDESK_ADMIN:
      return {
        ...baseConfig,
        showOrganizationTickets: true,
        showMyTickets: true,
        tabOptions: [
          {
            key: "my",
            label: "My Tickets",
            icon: <FaUser />,
          },
          {
            key: "organization",
            label: "Organization Tickets",
            icon: <FaBuilding />,
          },
        ],
        statsConfig: [
          {
            key: "totalTickets",
            label: "Total Tickets",
            icon: <FaTicketAlt />,
            color: "#3498db",
            description: "All tickets in the system",
          },
          {
            key: "openTickets",
            label: "Open Tickets",
            icon: <FaClock />,
            color: "#f39c12",
            description: "Currently active tickets",
          },
          {
            key: "resolvedTickets",
            label: "Resolved",
            icon: <FaCheckCircle />,
            color: "#27ae60",
            description: "Successfully resolved tickets",
          },
          {
            key: "criticalTickets",
            label: "Critical",
            icon: <FaExclamationTriangle />,
            color: "#e74c3c",
            description: "High priority tickets",
          },
          {
            key: "slaBreaches",
            label: "SLA Breaches",
            icon: <FaBolt />,
            color: "#dc3545",
            description: "Tickets exceeding SLA",
          },
          {
            key: "teamEfficiency",
            label: "Team Efficiency",
            icon: <FaChartBar />,
            color: "#28a745",
            description: "Team performance percentage",
          },
        ],
      };

    case UserRole.MANAGER:
      return {
        ...baseConfig,
        showAssignedTickets: true,
        showMyTickets: true,
        tabOptions: [
          {
            key: "my",
            label: "My Tickets",
            icon: <FaUser />,
          },
          {
            key: "assigned",
            label: "Assigned Tickets",
            icon: <FaTasks />,
          },
        ],
        statsConfig: [
          {
            key: "assignedTickets",
            label: "Assigned to Me",
            icon: <FaTasks />,
            color: "#3498db",
            description: "Tickets assigned to me",
          },
          {
            key: "openTickets",
            label: "Open Tickets",
            icon: <FaClock />,
            color: "#f39c12",
            description: "My open tickets",
          },
          {
            key: "resolvedTickets",
            label: "Resolved",
            icon: <FaCheckCircle />,
            color: "#27ae60",
            description: "Tickets I've resolved",
          },
          {
            key: "pendingApprovals",
            label: "Pending Approvals",
            icon: <FaUserCheck />,
            color: "#e67e22",
            description: "Tickets awaiting approval",
          },
          {
            key: "criticalTickets",
            label: "Critical",
            icon: <FaExclamationTriangle />,
            color: "#e74c3c",
            description: "High priority tickets",
          },
          {
            key: "teamMembers",
            label: "Team Members",
            icon: <FaUsers />,
            color: "#9b59b6",
            description: "Active team members",
          },
        ],
      };

    case UserRole.HELPDESK_DEPARTMENT:
      return {
        ...baseConfig,
        showDepartmentTickets: true,
        showAssignedTickets: true,
        showMyTickets: true,
        tabOptions: [
          {
            key: "department",
            label: "Department Tickets",
            icon: <FaBuilding />,
          },
          {
            key: "assigned",
            label: "Assigned Tickets",
            icon: <FaTasks />,
          },
          {
            key: "my",
            label: "My Tickets",
            icon: <FaUser />,
          },
          {
            key: "assigned",
            label: "Assigned Tickets",
            icon: <FaTasks />,
          },
          {
            key: "department",
            label: "Department Tickets",
            icon: <FaBuilding />,
          },
        ],
        statsConfig: [
          {
            key: "departmentTickets",
            label: "Department Tickets",
            icon: <FaBuilding />,
            color: "#3498db",
            description: "All department tickets",
          },
          {
            key: "assignedTickets",
            label: "Assigned to Me",
            icon: <FaTasks />,
            color: "#8e44ad",
            description: "Tickets assigned to me",
          },
          {
            key: "openTickets",
            label: "Open Tickets",
            icon: <FaClock />,
            color: "#f39c12",
            description: "Currently active tickets",
          },
          {
            key: "resolvedTickets",
            label: "Resolved",
            icon: <FaCheckCircle />,
            color: "#27ae60",
            description: "Successfully resolved tickets",
          },
          {
            key: "criticalTickets",
            label: "Critical",
            icon: <FaExclamationTriangle />,
            color: "#e74c3c",
            description: "High priority tickets",
          },
          {
            key: "avgResolutionTime",
            label: "Avg Resolution Time",
            icon: <FaBusinessTime />,
            color: "#6610f2",
            description: "Average resolution time (hours)",
          },
        ],
      };

    case UserRole.EMPLOYEE:
    case UserRole.HR:
    case UserRole.CXO:
    default:
      return {
        ...baseConfig,
        showMyTickets: true,
        tabOptions: [
          {
            key: "my",
            label: "My Tickets",
            icon: <FaUser />,
          },
        ],
        statsConfig: [
          {
            key: "totalTickets",
            label: "My Tickets",
            icon: <FaTicketAlt />,
            color: "#3498db",
            description: "All my tickets",
          },
          {
            key: "openTickets",
            label: "Open Tickets",
            icon: <FaClock />,
            color: "#f39c12",
            description: "My open tickets",
          },
          {
            key: "resolvedTickets",
            label: "Resolved",
            icon: <FaCheckCircle />,
            color: "#27ae60",
            description: "My resolved tickets",
          },
          {
            key: "criticalTickets",
            label: "Critical",
            icon: <FaExclamationTriangle />,
            color: "#e74c3c",
            description: "My critical tickets",
          },
          {
            key: "todayTickets",
            label: "Today",
            icon: <FaCalendarCheck />,
            color: "#17a2b8",
            description: "Tickets created today",
          },
          {
            key: "avgResolutionTime",
            label: "Avg Resolution Time",
            icon: <FaBusinessTime />,
            color: "#6610f2",
            description: "Average resolution time",
          },
        ],
      };
  }
};

export const UnifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const dashboardConfig = getDashboardConfig(user?.role || UserRole.EMPLOYEE);

  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    criticalTickets: 0,
    slaBreaches: 0,
    overdueTickets: 0,
    avgResolutionTime: 0,
    todayTickets: 0,
    weeklyTickets: 0,
    monthlyTickets: 0,
    teamEfficiency: 0,
    userSatisfaction: 0,
    pendingApprovals: 0,
    teamMembers: 0,
    assignedTickets: 0,
    departmentTickets: 0,
  });

  const [organizationTickets, setOrganizationTickets] = useState<Ticket[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([]);
  const [departmentTickets, setDepartmentTickets] = useState<Ticket[]>([]);

  const [activeTab, setActiveTab] = useState<string>(
    dashboardConfig.tabOptions[0]?.key || "my"
  );
  const [loading, setLoading] = useState(false);

  const handleTabClick = (tabKey: string) => {
    setLoading(true);
    setActiveTab(tabKey);
    // If you fetch data here, do it async and setLoading(false) after fetch
    setTimeout(() => setLoading(false), 600); // Simulate loading, replace with real fetch if needed
  };

  useEffect(() => {
    const calculateStats = (
      allTickets: Ticket[],
      _myTickets: Ticket[],
      assignedTickets: Ticket[],
      departmentTickets: Ticket[]
    ) => {
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 7);

      const monthStart = new Date(today);
      monthStart.setDate(today.getDate() - 30);

      // Base statistics calculation
      const totalTickets = allTickets.length;
      const openTickets = allTickets.filter(
        (t: Ticket) =>
          t.status === "RAISED" ||
          t.status === "IN_PROGRESS" ||
          t.status === "PENDING_APPROVAL"
      ).length;

      const resolvedTickets = allTickets.filter(
        (t: Ticket) => t.status === "RESOLVED" || t.status === "APPROVED"
      ).length;

      const criticalTickets = allTickets.filter(
        (t: Ticket) => t.priority === "CRITICAL" || t.priority === "HIGH"
      ).length;

      const overdueTickets = allTickets.filter((t: Ticket) => {
        if (
          t.slaDeadline &&
          (t.status === "RAISED" || t.status === "IN_PROGRESS")
        ) {
          return new Date(t.slaDeadline) < now;
        }
        return false;
      }).length;

      const todayTickets = allTickets.filter(
        (t: Ticket) => new Date(t.createdAt) >= today
      ).length;

      const weeklyTickets = allTickets.filter(
        (t: Ticket) => new Date(t.createdAt) >= weekStart
      ).length;

      const monthlyTickets = allTickets.filter(
        (t: Ticket) => new Date(t.createdAt) >= monthStart
      ).length;

      const resolvedThisMonth = allTickets.filter(
        (t: Ticket) =>
          (t.status === "RESOLVED" || t.status === "APPROVED") &&
          new Date(t.updatedAt) >= monthStart
      ).length;

      const teamEfficiency =
        monthlyTickets > 0
          ? Math.round((resolvedThisMonth / monthlyTickets) * 100)
          : 0;

      // Role-specific statistics
      let roleSpecificStats = {};

      if (user?.role === UserRole.MANAGER) {
        roleSpecificStats = {
          assignedTickets: assignedTickets.length,
          pendingApprovals: allTickets.filter(
            (t) => t.status === "PENDING_APPROVAL"
          ).length,
          teamMembers: 8, // This would come from a team API in a real implementation
        };
      } else if (user?.role === UserRole.HELPDESK_DEPARTMENT) {
        roleSpecificStats = {
          departmentTickets: departmentTickets.length,
          assignedTickets: assignedTickets.length,
        };
      }

      setStats({
        totalTickets,
        openTickets,
        resolvedTickets,
        criticalTickets,
        slaBreaches: overdueTickets,
        overdueTickets,
        avgResolutionTime: 6.5, // This would be calculated from actual resolution times
        todayTickets,
        weeklyTickets,
        monthlyTickets,
        teamEfficiency,
        userSatisfaction: 4.2, // This would come from satisfaction ratings
        ...roleSpecificStats,
      });
    };

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const promises: Promise<unknown>[] = [];

        // Always fetch my tickets
        promises.push(
          searchMyTickets({ createdBy: user?.id }, 0, 12, "createdDate,desc")
        );

        // Fetch organization tickets for admins
        if (dashboardConfig.showOrganizationTickets) {
          promises.push(
            searchTickets({}, 0, 100, "createdDate,desc"),
            searchTickets({}, 0, 12, "createdDate,desc")
          );
        }

        // Fetch assigned tickets for managers and helpdesk department
        if (dashboardConfig.showAssignedTickets) {
          promises.push(searchAssignedTickets({}, 0, 12, "createdDate,desc"));
        }

        // Fetch department tickets for helpdesk department
        if (dashboardConfig.showDepartmentTickets && user?.department) {
          promises.push(
            searchTickets(
              { assignedDepartmentId: user.department },
              0,
              12,
              "createdDate,desc"
            )
          );
        }

        const responses = await Promise.all(promises);
        let responseIndex = 0;

        // Process my tickets (always first)
        const myTicketsResponse = responses[responseIndex++] as {
          items?: ApiTicketResponse[];
        };
        const myApiTickets = myTicketsResponse.items || [];
        const myTransformedTickets = transformApiTicketsToTickets(myApiTickets);
        setMyTickets(myTransformedTickets);

        let allTicketsForStats: Ticket[] = myTransformedTickets;

        // Process organization tickets
        if (dashboardConfig.showOrganizationTickets) {
          const allTicketsResponse = responses[responseIndex++] as {
            items?: ApiTicketResponse[];
          };
          const recentTicketsResponse = responses[responseIndex++] as {
            items?: ApiTicketResponse[];
          };

          const allApiTickets = allTicketsResponse.items || [];
          const recentApiTickets = recentTicketsResponse.items || [];

          const allTransformedTickets =
            transformApiTicketsToTickets(allApiTickets);
          const recentTransformedTickets =
            transformApiTicketsToTickets(recentApiTickets);

          setOrganizationTickets(recentTransformedTickets);
          allTicketsForStats = allTransformedTickets;
        }

        let currentAssignedTickets: Ticket[] = [];
        let currentDepartmentTickets: Ticket[] = [];

        // Process assigned tickets
        if (dashboardConfig.showAssignedTickets) {
          const assignedTicketsResponse = responses[responseIndex++] as {
            items?: ApiTicketResponse[];
          };
          const assignedApiTickets = assignedTicketsResponse.items || [];
          const assignedTransformedTickets =
            transformApiTicketsToTickets(assignedApiTickets);
          setAssignedTickets(assignedTransformedTickets);
          currentAssignedTickets = assignedTransformedTickets;

          if (!dashboardConfig.showOrganizationTickets) {
            allTicketsForStats = [
              ...myTransformedTickets,
              ...assignedTransformedTickets,
            ];
          }
        }

        // Process department tickets
        if (dashboardConfig.showDepartmentTickets) {
          const departmentTicketsResponse = responses[responseIndex++] as {
            items?: ApiTicketResponse[];
          };
          const departmentApiTickets = departmentTicketsResponse.items || [];
          const departmentTransformedTickets =
            transformApiTicketsToTickets(departmentApiTickets);
          setDepartmentTickets(departmentTransformedTickets);
          currentDepartmentTickets = departmentTransformedTickets;

          if (!dashboardConfig.showOrganizationTickets) {
            allTicketsForStats = departmentTransformedTickets;
          }
        }

        // Calculate statistics based on role
        calculateStats(
          allTicketsForStats,
          myTransformedTickets,
          currentAssignedTickets,
          currentDepartmentTickets
        );
      } catch (error: unknown) {
        console.error("Error fetching dashboard data:", error);
        addNotification({
          type: "error",
          title: "Failed to load dashboard data",
          message: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [
    user,
    dashboardConfig.showOrganizationTickets,
    dashboardConfig.showAssignedTickets,
    dashboardConfig.showDepartmentTickets,
    addNotification,
  ]);

  const getCurrentTickets = () => {
    switch (activeTab) {
      case "organization":
        return organizationTickets;
      case "assigned":
        return assignedTickets;
      case "department":
        return departmentTickets;
      case "my":
      default:
        return myTickets;
    }
  };

  const getDashboardTitle = () => {
    switch (user?.role) {
      case UserRole.ORG_ADMIN:
      case UserRole.HELPDESK_ADMIN:
        return "Admin Dashboard";
      case UserRole.MANAGER:
        return "Manager Dashboard";
      case UserRole.HELPDESK_DEPARTMENT:
        return "Helpdesk Dashboard";
      case UserRole.EMPLOYEE:
      case UserRole.HR:
      case UserRole.CXO:
      default:
        return "Employee Dashboard";
    }
  };

  const getDashboardSubtitle = () => {
    switch (user?.role) {
      case UserRole.ORG_ADMIN:
      case UserRole.HELPDESK_ADMIN:
        return "Comprehensive IT helpdesk operations monitoring and management";
      case UserRole.MANAGER:
        return "Manage your team's tickets and track performance";
      case UserRole.HELPDESK_DEPARTMENT:
        return "Department ticket management and support operations";
      case UserRole.EMPLOYEE:
      case UserRole.HR:
      case UserRole.CXO:
      default:
        return "Track your tickets, access resources, and manage your IT requests";
    }
  };

  const formatStatValue = (key: keyof DashboardStats, value: number) => {
    if (key === "avgResolutionTime") {
      return `${value}h`;
    } else if (key === "teamEfficiency" || key === "userSatisfaction") {
      return key === "userSatisfaction" ? `${value}/5` : `${value}%`;
    }
    return value.toString();
  };

  const getStatCardClassName = (
    statConfig: DashboardConfig["statsConfig"][0]
  ) => {
    let className = "modern-stat-card";
    if (
      statConfig.key === "slaBreaches" ||
      statConfig.key === "overdueTickets"
    ) {
      className += " stat-highlight";
    }
    return className;
  };

  const getStatIconClassName = (
    statConfig: DashboardConfig["statsConfig"][0]
  ) => {
    switch (statConfig.color) {
      case "#3498db":
        return "modern-stat-icon primary";
      case "#f39c12":
        return "modern-stat-icon warning";
      case "#27ae60":
        return "modern-stat-icon success";
      case "#e74c3c":
        return "modern-stat-icon error";
      case "#dc3545":
        return "modern-stat-icon error";
      case "#17a2b8":
        return "modern-stat-icon info";
      case "#6610f2":
        return "modern-stat-icon info";
      case "#28a745":
        return "modern-stat-icon success";
      case "#e67e22":
        return "modern-stat-icon warning";
      case "#9b59b6":
        return "modern-stat-icon primary";
      default:
        return "modern-stat-icon primary";
    }
  };

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

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
    <div className="modern-dashboard">
      {/* Dashboard Header */}
      <div className="modern-dashboard-header">
        <div>
          <h1 className="modern-dashboard-title">{getDashboardTitle()}</h1>
          <p className="modern-dashboard-subtitle">{getDashboardSubtitle()}</p>
        </div>
        {(user.role === UserRole.ORG_ADMIN ||
          user.role === UserRole.HELPDESK_ADMIN) && (
          <div className="modern-dashboard-actions">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/reports")}
            >
              <FaChartLine />
              <span>Advanced Reports</span>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/tickets")}
            >
              <FaTasks />
              <span>Manage Tickets</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div
        className={`modern-stats-grid ${
          user.role?.toLowerCase() || "employee"
        }`}
      >
        {dashboardConfig.statsConfig.map((statConfig) => (
          <div
            key={statConfig.key}
            className={getStatCardClassName(statConfig)}
          >
            <div className="modern-stat-header">
              <div className={getStatIconClassName(statConfig)}>
                {statConfig.icon}
              </div>
            </div>
            <div className="modern-stat-value">
              {formatStatValue(statConfig.key, stats[statConfig.key] as number)}
            </div>
            <div className="modern-stat-label">{statConfig.label}</div>
            <div className="modern-stat-change neutral">
              <span>{statConfig.description}</span>
            </div>
            {(user.role === UserRole.ORG_ADMIN ||
              user.role === UserRole.HELPDESK_ADMIN) && (
              <div className="admin-metric-detail">
                <div className="metric-trend">
                  <span>
                    {statConfig.key === "totalTickets" &&
                      `Monthly: ${stats.monthlyTickets}`}
                    {statConfig.key === "openTickets" &&
                      `Today: ${stats.todayTickets}`}
                    {statConfig.key === "resolvedTickets" &&
                      `Avg Time: ${stats.avgResolutionTime}h`}
                    {statConfig.key === "criticalTickets" &&
                      `${
                        stats.openTickets > 0
                          ? Math.round(
                              (stats.criticalTickets / stats.openTickets) * 100
                            )
                          : 0
                      }% of active`}
                    {statConfig.key === "slaBreaches" &&
                      `Breaches: ${stats.slaBreaches}`}
                    {statConfig.key === "teamEfficiency" &&
                      `Satisfaction: ${stats.userSatisfaction}/5.0`}
                  </span>
                </div>
                <div className="metric-period">
                  {statConfig.key === "totalTickets" && "Last 30 days"}
                  {statConfig.key === "openTickets" && "New today"}
                  {statConfig.key === "resolvedTickets" && "Resolution time"}
                  {statConfig.key === "criticalTickets" &&
                    "Priority distribution"}
                  {statConfig.key === "slaBreaches" &&
                    "Immediate action needed"}
                  {statConfig.key === "teamEfficiency" && "User feedback"}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tickets Section */}
      <div className="modern-tickets-section">
        <div className="modern-section-header">
          <h2 className="modern-section-title">Active Tickets</h2>
          <div className="modern-section-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/tickets")}
            >
              <FaEye />
              <span>View All Tickets</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="modern-tabs">
          {dashboardConfig.tabOptions.map((tab) => (
            <button
              key={tab.key}
              className={`modern-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => handleTabClick(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="tab-count">
                {tab.key === "organization" && organizationTickets.length}
                {tab.key === "my" && myTickets.length}
                {tab.key === "assigned" && assignedTickets.length}
                {tab.key === "department" && departmentTickets.length}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="modern-tab-content">
          {loading && (
            <Loader
              centered
              text="Loading tickets..."
              minHeight="60vh"
              useTicketAnimation={true}
              ticketMessage="Searching and organizing your tickets..."
            />
          )}
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 200,
              }}
            >
              <div
                className="modern-spinner"
                style={{
                  width: 40,
                  height: 40,
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #FF5D5D",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          ) : (
            <div className="dashboard-tickets-grid">
              {getCurrentTickets().length > 0 ? (
                getCurrentTickets()
                  .slice(0, 8)
                  .map((ticket) => {
                    // Type cast to access extended properties from API transform
                    const extendedTicket = ticket as Ticket & {
                      assignedToDetails?: {
                        employeeName: string;
                        designation: string;
                      };
                      raiserEmployeeDetails?: {
                        employeeName: string;
                        designation: string;
                      };
                    };
                    return (
                      <TicketTile
                        key={ticket.id}
                        ticket={{
                          id: ticket.id,
                          ticketCode: `TKT-${ticket.id.slice(0, 8)}`,
                          title: ticket.title,
                          description: ticket.description,
                          status: ticket.status,
                          priority: ticket.priority,
                          assignedTo: ticket.assignedTo,
                          assignedToDetails: extendedTicket.assignedToDetails,
                          createdBy: ticket.createdBy,
                          raiserEmployeeDetails:
                            extendedTicket.raiserEmployeeDetails || {
                              employeeName: ticket.createdBy || "Unknown",
                              designation: "Employee",
                            },
                          department: ticket.assignedDepartmentName,
                          helpdeskDepartmentDetails: {
                            name: ticket.assignedDepartmentName || "Unknown",
                          },
                          createdAt: ticket.createdAt.toISOString(),
                          slaDeadline: ticket.slaDeadline?.toISOString(),
                          commentCount: ticket.totalCommentsCount || 0,
                          attachmentCount: ticket.attachments?.length || 0,
                          tags: ticket.tags,
                        }}
                        onClick={handleTicketClick}
                        compact={true}
                      />
                    );
                  })
              ) : (
                <div className="modern-empty-state-full">
                  <div className="modern-empty-icon">
                    <FaTicketAlt />
                  </div>
                  <h3>
                    {activeTab === "my"
                      ? "No tickets found!"
                      : "All caught up!"}
                  </h3>
                  <p>
                    {activeTab === "my"
                      ? "You don't have any active tickets at the moment."
                      : `No active ${activeTab} tickets at the moment. Your team is doing great!`}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(
                        activeTab === "my" ? "/tickets/create" : "/tickets"
                      )
                    }
                  >
                    <FaTicketAlt />
                    <span>
                      {activeTab === "my"
                        ? "Create New Ticket"
                        : "View All Tickets"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
