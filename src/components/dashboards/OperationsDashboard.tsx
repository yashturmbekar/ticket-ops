import React, { useState, useEffect } from "react";
import {
  FaTicketAlt,
  FaClock,
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTasks,
  FaComments,
  FaArrowUp,
  FaSearch,
  FaEye,
  FaLink,
  FaUserPlus,
  FaCalendar,
  FaUser,
  FaFlag,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { PageLayout } from "../common/PageLayout";
import { useAuth } from "../../hooks/useAuth";
import { ticketService, knowledgeService } from "../../services";
import type { Ticket, TicketStatus, Priority } from "../../types";
import "./OperationsDashboard.css";

interface OperationsMetrics {
  assignedTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  avgResolutionTime: number;
  slaBreaches: number;
  teamAvgResolutionTime: number;
  performanceScore: number;
}

interface TicketAction {
  id: string;
  type: "status" | "assign" | "escalate" | "note" | "link_kb";
  label: string;
  icon: React.ReactNode;
  color?: string;
}

export const OperationsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<OperationsMetrics>({
    assignedTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedToday: 0,
    avgResolutionTime: 0,
    slaBreaches: 0,
    teamAvgResolutionTime: 0,
    performanceScore: 0,
  });
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [groupTickets, setGroupTickets] = useState<Ticket[]>([]);
  const [closedTickets, setClosedTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState<"my" | "group" | "closed">("my");
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<TicketAction | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const ticketActions: TicketAction[] = [
    {
      id: "in_progress",
      type: "status",
      label: "Start Working",
      icon: <FaPlay />,
      color: "#2196f3",
    },
    {
      id: "pending",
      type: "status",
      label: "Set Pending",
      icon: <FaPause />,
      color: "#ff9800",
    },
    {
      id: "resolved",
      type: "status",
      label: "Mark Resolved",
      icon: <FaCheckCircle />,
      color: "#4caf50",
    },
    {
      id: "assign",
      type: "assign",
      label: "Reassign",
      icon: <FaUserPlus />,
      color: "#9c27b0",
    },
    {
      id: "escalate",
      type: "escalate",
      label: "Escalate",
      icon: <FaArrowUp />,
      color: "#f44336",
    },
    {
      id: "note",
      type: "note",
      label: "Add Note",
      icon: <FaComments />,
      color: "#607d8b",
    },
    {
      id: "link_kb",
      type: "link_kb",
      label: "Link KB Article",
      icon: <FaLink />,
      color: "#795548",
    },
  ];

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load tickets assigned to the current user
      const myTicketsResponse = await ticketService.getTickets({
        page: 1,
        limit: 100,
      });

      if (myTicketsResponse.success) {
        const tickets = myTicketsResponse.data.data;
        setMyTickets(tickets.filter((t) => t.status !== "closed"));
        setClosedTickets(tickets.filter((t) => t.status === "closed"));

        // Calculate metrics
        const assignedTickets = tickets.filter(
          (t) => t.status !== "closed"
        ).length;
        const openTickets = tickets.filter((t) => t.status === "open").length;
        const inProgressTickets = tickets.filter(
          (t) => t.status === "in_progress"
        ).length;
        const resolvedToday = tickets.filter(
          (t) =>
            t.status === "resolved" &&
            new Date(t.updatedAt).toDateString() === new Date().toDateString()
        ).length;

        const slaBreaches = 0; // Mock data since slaBreachTime property doesn't exist

        setMetrics({
          assignedTickets,
          openTickets,
          inProgressTickets,
          resolvedToday,
          avgResolutionTime: 2.3, // Mock data
          slaBreaches,
          teamAvgResolutionTime: 2.7, // Mock data
          performanceScore: 87, // Mock data
        });
      }

      // Load group/team tickets (mock data)
      setGroupTickets([
        {
          id: "T001",
          title: "Network connectivity issues in Building A",
          description: "Users report intermittent connectivity issues",
          status: "open",
          priority: "high",
          category: "network",
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "user1",
          assignedTo: "agent2",
          slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
          tags: ["network", "urgent"],
          attachments: [],
          comments: [],
        },
        {
          id: "T002",
          title: "Printer driver installation required",
          description: "New printer needs driver installation",
          status: "in_progress",
          priority: "medium",
          category: "hardware",
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "user2",
          assignedTo: "agent3",
          slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
          tags: ["hardware", "driver"],
          attachments: [],
          comments: [],
        },
      ]);

      // Load knowledge articles
      const kbResponse = await knowledgeService.getArticles({
        page: 1,
        limit: 10,
      });
      if (kbResponse.data) {
        console.log("Knowledge articles loaded:", kbResponse.data.length);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleTicketAction = async (ticketId: string, action: TicketAction) => {
    try {
      setSelectedAction(action);
      setShowActionModal(true);

      // Implementation would depend on the specific action type
      console.log(`Performing ${action.type} action on ticket ${ticketId}`);
    } catch (error) {
      console.error(`Error performing ${action.type}:`, error);
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return "#f44336";
      case "in_progress":
        return "#2196f3";
      case "pending":
        return "#ff9800";
      case "resolved":
        return "#4caf50";
      case "closed":
        return "#9e9e9e";
      default:
        return "#757575";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "critical":
        return "#d32f2f";
      case "high":
        return "#f57c00";
      case "medium":
        return "#1976d2";
      case "low":
        return "#388e3c";
      default:
        return "#757575";
    }
  };

  const getFilteredTickets = (tickets: Ticket[]) => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        filterStatus === "all" || ticket.status === filterStatus;
      const matchesPriority =
        filterPriority === "all" || ticket.priority === filterPriority;
      const matchesSearch =
        !searchTerm ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  };

  const getCurrentTickets = () => {
    switch (activeTab) {
      case "my":
        return getFilteredTickets(myTickets);
      case "group":
        return getFilteredTickets(groupTickets);
      case "closed":
        return getFilteredTickets(closedTickets);
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="operations-dashboard">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="operations-dashboard">
        <div className="dashboard-header">
          <h1>Operations Dashboard</h1>
          <p>Welcome back, {user?.email}! Here's your ticket overview.</p>
        </div>

        {/* Performance Metrics */}
        <div className="metrics-grid">
          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaTicketAlt />
              </div>
              <div className="metric-details">
                <h3>{metrics.assignedTickets}</h3>
                <p>Assigned Tickets</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaTasks />
              </div>
              <div className="metric-details">
                <h3>{metrics.openTickets}</h3>
                <p>Open Tickets</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaPlay />
              </div>
              <div className="metric-details">
                <h3>{metrics.inProgressTickets}</h3>
                <p>In Progress</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaCheckCircle />
              </div>
              <div className="metric-details">
                <h3>{metrics.resolvedToday}</h3>
                <p>Resolved Today</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaClock />
              </div>
              <div className="metric-details">
                <h3>{metrics.avgResolutionTime}h</h3>
                <p>Avg Resolution Time</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card sla-breach">
            <div className="metric-content">
              <div className="metric-icon">
                <FaExclamationTriangle />
              </div>
              <div className="metric-details">
                <h3>{metrics.slaBreaches}</h3>
                <p>SLA Breaches</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Comparison */}
        <Card className="performance-comparison">
          <h3>Performance Comparison</h3>
          <div className="comparison-grid">
            <div className="comparison-item">
              <span className="comparison-label">Your Avg Resolution Time</span>
              <span className="comparison-value">
                {metrics.avgResolutionTime}h
              </span>
            </div>
            <div className="comparison-item">
              <span className="comparison-label">Team Average</span>
              <span className="comparison-value">
                {metrics.teamAvgResolutionTime}h
              </span>
            </div>
            <div className="comparison-item">
              <span className="comparison-label">Performance Score</span>
              <span className="comparison-value">
                {metrics.performanceScore}%
              </span>
            </div>
          </div>
        </Card>

        {/* Ticket List */}
        <Card className="ticket-list-card">
          <div className="ticket-list-header">
            <h3>Ticket Management</h3>

            {/* Tab Navigation */}
            <div className="ticket-tabs">
              <button
                className={`tab-button ${activeTab === "my" ? "active" : ""}`}
                onClick={() => setActiveTab("my")}
              >
                <FaUser />
                My Tickets ({myTickets.length})
              </button>
              <button
                className={`tab-button ${
                  activeTab === "group" ? "active" : ""
                }`}
                onClick={() => setActiveTab("group")}
              >
                <FaUsers />
                Group Tickets ({groupTickets.length})
              </button>
              <button
                className={`tab-button ${
                  activeTab === "closed" ? "active" : ""
                }`}
                onClick={() => setActiveTab("closed")}
              >
                <FaCheckCircle />
                Closed Tickets ({closedTickets.length})
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-controls">
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as TicketStatus | "all")
                }
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) =>
                  setFilterPriority(e.target.value as Priority | "all")
                }
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Tickets */}
          <div className="tickets-container">
            {getCurrentTickets().map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <div className="ticket-info">
                    <h4>{ticket.title}</h4>
                    <p className="ticket-id">#{ticket.id}</p>
                  </div>
                  <div className="ticket-badges">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(ticket.status) }}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                    <span
                      className="priority-badge"
                      style={{
                        backgroundColor: getPriorityColor(ticket.priority),
                      }}
                    >
                      <FaFlag /> {ticket.priority}
                    </span>
                  </div>
                </div>

                <div className="ticket-meta">
                  <span>
                    <FaCalendar />{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    <FaUser /> {ticket.createdBy}
                  </span>
                </div>

                <p className="ticket-description">{ticket.description}</p>

                <div className="ticket-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <FaEye />
                    View Details
                  </Button>

                  {activeTab !== "closed" && (
                    <div className="action-buttons">
                      {ticketActions.slice(0, 3).map((action) => (
                        <Button
                          key={action.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleTicketAction(ticket.id, action)}
                          style={{ color: action.color }}
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <Modal
            isOpen={!!selectedTicket}
            onClose={() => setSelectedTicket(null)}
            title={`Ticket #${selectedTicket.id}`}
          >
            <div className="ticket-detail">
              <h3>{selectedTicket.title}</h3>
              <div className="ticket-detail-meta">
                <p>
                  <strong>Status:</strong> {selectedTicket.status}
                </p>
                <p>
                  <strong>Priority:</strong> {selectedTicket.priority}
                </p>
                <p>
                  <strong>Category:</strong> {selectedTicket.category}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedTicket.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(selectedTicket.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <p>
                <strong>Description:</strong>
              </p>
              <p>{selectedTicket.description}</p>

              {activeTab !== "closed" && (
                <div className="ticket-detail-actions">
                  <h4>Available Actions:</h4>
                  <div className="action-grid">
                    {ticketActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        onClick={() =>
                          handleTicketAction(selectedTicket.id, action)
                        }
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Action Modal */}
        {showActionModal && selectedAction && (
          <Modal
            isOpen={showActionModal}
            onClose={() => setShowActionModal(false)}
            title={selectedAction.label}
          >
            <div className="action-modal">
              <p>Action: {selectedAction.label}</p>
              <p>
                This is where the specific action interface would be
                implemented.
              </p>
              <div className="action-modal-buttons">
                <Button variant="primary">Execute</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowActionModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </PageLayout>
  );
};
