import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBell,
  FaUser,
  FaCalendar,
  FaComment,
} from "react-icons/fa";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { PageLayout } from "../common/PageLayout";
import { useAuth } from "../../hooks/useAuth";
import { ticketService } from "../../services";
import type { Ticket, Priority, TicketStatus, Category } from "../../types";
import "./EmployeeDashboard.css";

interface TicketCounts {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  pending: number;
}

interface CreateTicketForm {
  title: string;
  category: string;
  description: string;
  priority: Priority;
  attachments: File[];
}

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketCounts, setTicketCounts] = useState<TicketCounts>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    pending: 0,
  });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createForm, setCreateForm] = useState<CreateTicketForm>({
    title: "",
    category: "",
    description: "",
    priority: "medium" as Priority,
    attachments: [],
  });

  const loadUserTickets = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await ticketService.getTickets({
        createdBy: user.id,
        limit: 50,
      });

      const userTickets = response.data.data;
      setTickets(userTickets);

      // Calculate counts
      const counts = {
        total: userTickets.length,
        open: userTickets.filter((t) => t.status === "open").length,
        inProgress: userTickets.filter((t) => t.status === "in_progress")
          .length,
        resolved: userTickets.filter((t) => t.status === "resolved").length,
        pending: userTickets.filter((t) => t.status === "pending").length,
      };
      setTicketCounts(counts);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserTickets();
  }, [user, loadUserTickets]);

  const handleCreateTicket = async () => {
    try {
      await ticketService.createTicket({
        title: createForm.title,
        description: createForm.description,
        category: createForm.category as Category, // Cast to Category type
        priority: createForm.priority,
        tags: [],
        attachments: [],
      });

      setShowCreateModal(false);
      setCreateForm({
        title: "",
        category: "",
        description: "",
        priority: "medium" as Priority,
        attachments: [],
      });
      loadUserTickets();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  const getStatusColor = (status: TicketStatus): string => {
    switch (status) {
      case "open":
        return "#dc3545";
      case "in_progress":
        return "#007bff";
      case "pending":
        return "#ffc107";
      case "resolved":
        return "#28a745";
      case "closed":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case "critical":
        return "#dc3545";
      case "high":
        return "#fd7e14";
      case "medium":
        return "#ffc107";
      case "low":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return <FaExclamationTriangle />;
      case "in_progress":
        return <FaClock />;
      case "pending":
        return <FaClock />;
      case "resolved":
        return <FaCheckCircle />;
      case "closed":
        return <FaCheckCircle />;
      default:
        return <FaTicketAlt />;
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="employee-dashboard loading">
          <div className="loading-spinner">Loading your tickets...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="employee-dashboard">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.firstName}!</h1>
            <p>Manage your support tickets and requests</p>
          </div>
          <Button
            variant="primary"
            icon={<FaPlus />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Ticket
          </Button>
        </div>

        {/* Ticket Overview Cards */}
        <div className="ticket-overview">
          <Card className="overview-card total">
            <div className="card-icon">
              <FaTicketAlt />
            </div>
            <div className="card-content">
              <h3>Total Tickets</h3>
              <p className="card-number">{ticketCounts.total}</p>
            </div>
          </Card>

          <Card className="overview-card open">
            <div className="card-icon">
              <FaExclamationTriangle />
            </div>
            <div className="card-content">
              <h3>Open</h3>
              <p className="card-number">{ticketCounts.open}</p>
            </div>
          </Card>

          <Card className="overview-card progress">
            <div className="card-icon">
              <FaClock />
            </div>
            <div className="card-content">
              <h3>In Progress</h3>
              <p className="card-number">{ticketCounts.inProgress}</p>
            </div>
          </Card>

          <Card className="overview-card resolved">
            <div className="card-icon">
              <FaCheckCircle />
            </div>
            <div className="card-content">
              <h3>Resolved</h3>
              <p className="card-number">{ticketCounts.resolved}</p>
            </div>
          </Card>
        </div>

        {/* Notifications Section */}
        {ticketCounts.open > 0 && (
          <Card className="notifications-card">
            <div className="notification-header">
              <FaBell />
              <h3>Recent Updates</h3>
            </div>
            <div className="notifications-list">
              <div className="notification-item">
                <span className="notification-text">
                  You have {ticketCounts.open} open ticket
                  {ticketCounts.open !== 1 ? "s" : ""} awaiting response
                </span>
                <span className="notification-time">Just now</span>
              </div>
            </div>
          </Card>
        )}

        {/* My Tickets Section */}
        <div className="tickets-section">
          <div className="section-header">
            <h2>My Tickets</h2>
            <div className="ticket-filters">
              <Button variant="outline" size="sm">
                All
              </Button>
              <Button variant="outline" size="sm">
                Open
              </Button>
              <Button variant="outline" size="sm">
                In Progress
              </Button>
              <Button variant="outline" size="sm">
                Resolved
              </Button>
            </div>
          </div>

          <div className="tickets-grid">
            {tickets.length === 0 ? (
              <Card className="empty-state">
                <FaTicketAlt size={48} />
                <h3>No tickets yet</h3>
                <p>Create your first support ticket to get started</p>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Ticket
                </Button>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="ticket-card"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="ticket-header">
                    <div className="ticket-status">
                      {getStatusIcon(ticket.status)}
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(ticket.status),
                        }}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>
                    <span
                      className="priority-badge"
                      style={{
                        backgroundColor: getPriorityColor(ticket.priority),
                      }}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <div className="ticket-content">
                    <h3>{ticket.title}</h3>
                    <p className="ticket-description">
                      {ticket.description.length > 100
                        ? `${ticket.description.substring(0, 100)}...`
                        : ticket.description}
                    </p>
                  </div>

                  <div className="ticket-footer">
                    <div className="ticket-meta">
                      <span className="ticket-id">#{ticket.id}</span>
                      <span className="ticket-date">
                        <FaCalendar />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {ticket.comments.length > 0 && (
                      <div className="ticket-comments">
                        <FaComment />
                        <span>{ticket.comments.length}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Create Ticket Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Ticket"
        >
          <div className="create-ticket-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={createForm.category}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                required
              >
                <option value="">Select a category</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="network">Network</option>
                <option value="access">Access Request</option>
                <option value="email">Email</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={createForm.priority}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    priority: e.target.value as Priority,
                  }))
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Detailed description of the issue..."
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label>Attachments (Optional)</label>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    attachments: Array.from(e.target.files || []),
                  }))
                }
              />
            </div>

            <div className="modal-actions">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateTicket}
                disabled={
                  !createForm.title ||
                  !createForm.category ||
                  !createForm.description
                }
              >
                Create Ticket
              </Button>
            </div>
          </div>
        </Modal>

        {/* Ticket Detail Modal */}
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket #${selectedTicket?.id}`}
        >
          {selectedTicket && (
            <div className="ticket-detail">
              <div className="detail-header">
                <h3>{selectedTicket.title}</h3>
                <div className="detail-badges">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(selectedTicket.status),
                    }}
                  >
                    {selectedTicket.status.replace("_", " ")}
                  </span>
                  <span
                    className="priority-badge"
                    style={{
                      backgroundColor: getPriorityColor(
                        selectedTicket.priority
                      ),
                    }}
                  >
                    {selectedTicket.priority}
                  </span>
                </div>
              </div>

              <div className="detail-content">
                <div className="detail-section">
                  <h4>Description</h4>
                  <p>{selectedTicket.description}</p>
                </div>

                <div className="detail-section">
                  <h4>Details</h4>
                  <div className="detail-meta">
                    <div className="meta-item">
                      <span className="meta-label">Created:</span>
                      <span>
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Category:</span>
                      <span>{selectedTicket.category}</span>
                    </div>
                    {selectedTicket.assignedTo && (
                      <div className="meta-item">
                        <span className="meta-label">Assigned to:</span>
                        <span>{selectedTicket.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedTicket.comments.length > 0 && (
                  <div className="detail-section">
                    <h4>Comments</h4>
                    <div className="comments-list">
                      {selectedTicket.comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-header">
                            <FaUser />
                            <span className="comment-author">
                              {comment.userId}
                            </span>
                            <span className="comment-date">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageLayout>
  );
};
