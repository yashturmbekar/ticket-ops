import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  getMyTickets,
  createTicket,
  searchHelpdeskDepartments,
  type HelpdeskDepartment,
} from "../../services";
import type { Ticket, Priority, TicketStatus } from "../../types";
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
  attachments: File[];
}

interface EmployeeDashboardProps {
  initialTab?: "my-tickets" | "create" | "knowledge";
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  initialTab,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [departments, setDepartments] = useState<HelpdeskDepartment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);
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
    attachments: [],
  });
  const [activeTab, setActiveTab] = useState<
    "my-tickets" | "create" | "knowledge"
  >(initialTab || "my-tickets");

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyTickets();

      if (response && response.data) {
        const userTickets = response.data;
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
      } else if (Array.isArray(response)) {
        const userTickets = response;
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
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDepartments = useCallback(async () => {
    try {
      const response = await searchHelpdeskDepartments();
      console.log("Departments response:", response);
      if (response && Array.isArray(response)) {
        setDepartments(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      setDepartments([]);
    }
  }, []);

  useEffect(() => {
    loadTickets();
    loadDepartments();
  }, [loadTickets, loadDepartments]);

  const handleTicketClick = (ticket: Ticket) => {
    // TODO: Implement ticket detail view or navigation
    console.log("Ticket clicked:", ticket);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createTicket({
        title: createForm.title,
        description: createForm.description,
        assignedDepartmentId: createForm.category, // Now contains the department ID
        comment: null, // Using description as comment for now
        attachments: createForm.attachments,
      });

      if (response) {
        setShowCreateModal(false);
        setCreateForm({
          title: "",
          category: "",
          description: "",
          attachments: [],
        });
        // Clear file inputs
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (modalFileInputRef.current) {
          modalFileInputRef.current.value = "";
        }
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
      case "HIGH":
        return <span className="compact-badge high">High</span>;
      case "MEDIUM":
        return <span className="compact-badge medium">Medium</span>;
      case "LOW":
        return <span className="compact-badge low">Low</span>;
      default:
        return <span className="compact-badge">{priority}</span>;
    }
  };

  const getDepartmentName = (categoryId: string) => {
    const department = departments.find((dept) => dept.id === categoryId);
    return department ? department.name : categoryId;
  };

  const getFilePreview = (file: File) => {
    const isImage = file.type.startsWith("image/");

    if (isImage) {
      const url = URL.createObjectURL(file);
      return (
        <img
          src={url}
          alt={file.name}
          className="file-preview-image"
          onLoad={() => URL.revokeObjectURL(url)}
        />
      );
    }

    // File type icons
    const getFileIcon = (type: string) => {
      if (type.includes("pdf")) return "📄";
      if (type.includes("word") || type.includes("document")) return "📝";
      if (type.includes("excel") || type.includes("spreadsheet")) return "📊";
      if (type.includes("powerpoint") || type.includes("presentation"))
        return "📽️";
      if (type.includes("video")) return "🎥";
      if (type.includes("audio")) return "🎵";
      if (
        type.includes("zip") ||
        type.includes("rar") ||
        type.includes("archive")
      )
        return "📦";
      if (type.includes("text")) return "📃";
      return "📎";
    };

    return (
      <div className="file-preview-icon">
        <span className="file-icon">{getFileIcon(file.type)}</span>
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
          onClick={() => {
            setActiveTab("my-tickets");
            loadTickets();
          }}
        >
          My Tickets
        </button>
        <button
          className={`compact-btn ${activeTab === "create" ? "primary" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Create Ticket
        </button>
        {/* <button
          className={`compact-btn ${
            activeTab === "knowledge" ? "primary" : ""
          }`}
          onClick={() => setActiveTab("knowledge")}
        >
          Knowledge Base
        </button> */}
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
              {(tickets || []).map((ticket) => (
                <tr key={ticket.id} onClick={() => handleTicketClick(ticket)}>
                  <td>#{ticket.id.slice(0, 8)}</td>
                  <td>{ticket.title}</td>
                  <td>{getDepartmentName(ticket.category)}</td>
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
                onChange={(e) => {
                  setCreateForm({ ...createForm, title: e.target.value });
                  // setCreateForm((prev) => ({
                  //   ...prev,
                  //   title: e.target.value,
                  // }))
                }}
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
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
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
            <div className="compact-form-group">
              <label>Attachments</label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setCreateForm({ ...createForm, attachments: files });
                }}
                className="compact-input"
                accept="*/*"
              />
              {createForm.attachments.length > 0 && (
                <div className="attachment-list">
                  <small>Selected files:</small>
                  <div className="attachment-grid">
                    {createForm.attachments.map((file, index) => (
                      <div key={index} className="attachment-preview-item">
                        <div className="file-preview-container">
                          {getFilePreview(file)}
                          <button
                            type="button"
                            onClick={() => {
                              const newAttachments =
                                createForm.attachments.filter(
                                  (_, i) => i !== index
                                );
                              setCreateForm({
                                ...createForm,
                                attachments: newAttachments,
                              });
                            }}
                            className="remove-attachment-overlay"
                            title="Remove file"
                          >
                            ×
                          </button>
                        </div>
                        <div className="file-info">
                          <span className="file-name" title={file.name}>
                            {file.name}
                          </span>
                          <span className="file-size">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="actions-container">
              <button
                type="submit"
                className="compact-btn primary"
                onSubmit={handleCreateTicket}
              >
                Create Ticket
              </button>
              <button
                type="button"
                className="compact-btn"
                onClick={() => {
                  setCreateForm({
                    title: "",
                    category: "",
                    description: "",
                    attachments: [],
                  });
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
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
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
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
              <div className="compact-form-group">
                <label>Attachments</label>
                <input
                  ref={modalFileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setCreateForm({ ...createForm, attachments: files });
                  }}
                  className="compact-input"
                  accept="*/*"
                />
                {createForm.attachments.length > 0 && (
                  <div className="attachment-list">
                    <small>Selected files:</small>
                    <div className="attachment-grid">
                      {createForm.attachments.map((file, index) => (
                        <div key={index} className="attachment-preview-item">
                          <div className="file-preview-container">
                            {getFilePreview(file)}
                            <button
                              type="button"
                              onClick={() => {
                                const newAttachments =
                                  createForm.attachments.filter(
                                    (_, i) => i !== index
                                  );
                                setCreateForm({
                                  ...createForm,
                                  attachments: newAttachments,
                                });
                              }}
                              className="remove-attachment-overlay"
                              title="Remove file"
                            >
                              ×
                            </button>
                          </div>
                          <div className="file-info">
                            <span className="file-name" title={file.name}>
                              {file.name}
                            </span>
                            <span className="file-size">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
