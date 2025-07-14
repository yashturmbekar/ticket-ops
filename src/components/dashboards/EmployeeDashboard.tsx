import React, { useState, useEffect, useCallback } from "react";
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createForm, setCreateForm] = useState<CreateTicketForm>({
    title: "",
    category: "",
    description: "",
    priority: "medium",
    attachments: [],
  });
  const [activeTab, setActiveTab] = useState<
    "my-tickets" | "create" | "knowledge"
  >("my-tickets");

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ticketService.getTickets({
        page: 1,
        limit: 50,
        createdBy: user?.id,
      });

      if (response.success) {
        const userTickets = response.data.data;
        setTickets(userTickets);

        // Calculate counts
        const counts: TicketCounts = {
          total: userTickets.length,
          open: userTickets.filter((t: Ticket) => t.status === "open").length,
          inProgress: userTickets.filter(
            (t: Ticket) => t.status === "in_progress"
          ).length,
          resolved: userTickets.filter((t: Ticket) => t.status === "resolved")
            .length,
          pending: userTickets.filter((t: Ticket) => t.status === "pending")
            .length,
        };
        setTicketCounts(counts);
      }
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleTicketClick = (ticket: Ticket) => {
    // TODO: Implement ticket detail view or navigation
    console.log("Ticket clicked:", ticket);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ticketService.createTicket({
        title: createForm.title,
        description: createForm.description,
        category: createForm.category as Category,
        priority: createForm.priority,
      });

      if (response.success) {
        setShowCreateModal(false);
        setCreateForm({
          title: "",
          category: "",
          description: "",
          priority: "medium",
          attachments: [],
        });
        loadTickets();
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return <span className="compact-badge open">Open</span>;
      case "in_progress":
        return <span className="compact-badge in-progress">In Progress</span>;
      case "resolved":
        return <span className="compact-badge closed">Resolved</span>;
      case "pending":
        return <span className="compact-badge warning">Pending</span>;
      default:
        return <span className="compact-badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "high":
        return <span className="compact-badge high">High</span>;
      case "medium":
        return <span className="compact-badge medium">Medium</span>;
      case "low":
        return <span className="compact-badge low">Low</span>;
      default:
        return <span className="compact-badge">{priority}</span>;
    }
  };

  if (loading) {
    return (
      <div className="compact-header">
        <h1>Employee Dashboard</h1>
        <p>Loading your tickets...</p>
      </div>
    );
  }

  return (
    <>
      <div className="compact-header">
        <h1>Employee Dashboard</h1>
        <div className="actions-container">
          <button
            className="compact-btn primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Ticket
          </button>
          <button className="compact-btn" onClick={loadTickets}>
            Refresh
          </button>
        </div>
      </div>

      {/* Ticket Counts */}
      <div className="compact-stats">
        <div className="compact-stat-card">
          <div className="compact-stat-value">{ticketCounts.total}</div>
          <div className="compact-stat-label">Total Tickets</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{ticketCounts.open}</div>
          <div className="compact-stat-label">Open</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{ticketCounts.inProgress}</div>
          <div className="compact-stat-label">In Progress</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{ticketCounts.resolved}</div>
          <div className="compact-stat-label">Resolved</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{ticketCounts.pending}</div>
          <div className="compact-stat-label">Pending</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="actions-container">
        <button
          className={`compact-btn ${
            activeTab === "my-tickets" ? "primary" : ""
          }`}
          onClick={() => setActiveTab("my-tickets")}
        >
          My Tickets
        </button>
        <button
          className={`compact-btn ${activeTab === "create" ? "primary" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Create Ticket
        </button>
        <button
          className={`compact-btn ${
            activeTab === "knowledge" ? "primary" : ""
          }`}
          onClick={() => setActiveTab("knowledge")}
        >
          Knowledge Base
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "my-tickets" && (
        <div className="compact-card">
          <h3>My Tickets</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} onClick={() => handleTicketClick(ticket)}>
                  <td>#{ticket.id.slice(0, 8)}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.category}</td>
                  <td>{getPriorityBadge(ticket.priority)}</td>
                  <td>{getStatusBadge(ticket.status)}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <button className="compact-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "create" && (
        <div className="compact-card">
          <h3>Create New Ticket</h3>
          <form onSubmit={handleCreateTicket} className="compact-form">
            <div className="compact-form-group">
              <label>Title</label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm({ ...createForm, title: e.target.value })
                }
                required
                className="compact-input"
              />
            </div>
            <div className="compact-form-group">
              <label>Category</label>
              <select
                value={createForm.category}
                onChange={(e) =>
                  setCreateForm({ ...createForm, category: e.target.value })
                }
                required
                className="compact-input"
              >
                <option value="">Select Category</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="network">Network</option>
                <option value="security">Security</option>
                <option value="access">Access</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="compact-form-group">
              <label>Priority</label>
              <select
                value={createForm.priority}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    priority: e.target.value as Priority,
                  })
                }
                className="compact-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="compact-form-group">
              <label>Description</label>
              <textarea
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                required
                rows={4}
                className="compact-input"
              />
            </div>
            <div className="actions-container">
              <button type="submit" className="compact-btn primary">
                Create Ticket
              </button>
              <button
                type="button"
                className="compact-btn"
                onClick={() =>
                  setCreateForm({
                    title: "",
                    category: "",
                    description: "",
                    priority: "medium",
                    attachments: [],
                  })
                }
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "knowledge" && (
        <div className="compact-card">
          <h3>Knowledge Base</h3>
          <div className="actions-container">
            <input
              type="search"
              placeholder="Search knowledge base..."
              className="compact-search"
            />
            <button className="compact-btn">Search</button>
          </div>
          <div className="compact-grid compact-grid-2">
            <div className="compact-card">
              <h4>Common Issues</h4>
              <ul>
                <li>
                  <a href="#">Password Reset</a>
                </li>
                <li>
                  <a href="#">VPN Connection Issues</a>
                </li>
                <li>
                  <a href="#">Software Installation</a>
                </li>
                <li>
                  <a href="#">Email Setup</a>
                </li>
                <li>
                  <a href="#">Printer Problems</a>
                </li>
              </ul>
            </div>
            <div className="compact-card">
              <h4>IT Policies</h4>
              <ul>
                <li>
                  <a href="#">Security Policy</a>
                </li>
                <li>
                  <a href="#">Acceptable Use Policy</a>
                </li>
                <li>
                  <a href="#">Remote Work Guidelines</a>
                </li>
                <li>
                  <a href="#">Software Licensing</a>
                </li>
                <li>
                  <a href="#">Data Protection</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div
          className="compact-modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="compact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="compact-modal-header">
              <h3>Create New Ticket</h3>
              <button
                className="compact-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="compact-form">
              <div className="compact-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, title: e.target.value })
                  }
                  required
                  className="compact-input"
                />
              </div>
              <div className="compact-form-group">
                <label>Category</label>
                <select
                  value={createForm.category}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, category: e.target.value })
                  }
                  required
                  className="compact-input"
                >
                  <option value="">Select Category</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="network">Network</option>
                  <option value="security">Security</option>
                  <option value="access">Access</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="compact-form-group">
                <label>Priority</label>
                <select
                  value={createForm.priority}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      priority: e.target.value as Priority,
                    })
                  }
                  className="compact-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="compact-form-group">
                <label>Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      description: e.target.value,
                    })
                  }
                  required
                  rows={4}
                  className="compact-input"
                />
              </div>
              <div className="actions-container">
                <button type="submit" className="compact-btn primary">
                  Create Ticket
                </button>
                <button
                  type="button"
                  className="compact-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
