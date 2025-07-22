import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClock,
  FaUser,
  FaCalendar,
  FaComments,
  FaPaperclip,
  FaSave,
  FaTimes,
  FaEdit,
  FaExclamationTriangle,
  FaBuilding,
  FaTicketAlt,
  FaFlag,
  FaHistory,
  FaDownload,
  FaTrash,
  FaReply,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import {
  searchTickets,
  updateTicket,
  addComment,
  uploadAttachment,
} from "../services/ticketService";
import { UserRole, TicketStatus, Priority } from "../types";
import "../styles/ticketDetails.css";

interface TicketComment {
  id: string;
  content: string;
  author: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  isInternal: boolean;
  attachments?: {
    id: string;
    filename: string;
    size: number;
  }[];
}

interface TicketHistoryItem {
  id: string;
  action: string;
  changes: Record<string, { from: unknown; to: unknown }>;
  user: string;
  userName: string;
  createdAt: string;
}

interface TicketData {
  id: string;
  ticketCode: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  assignedDepartmentId: string;
  assignedToEmployeeId?: number;
  assignedToName?: string;
  raisedByEmployeeId: number;
  raiserEmployeeDetails: {
    employeeName: string;
    id: number;
    designation: string;
    profilePic?: string;
  };
  createdDate: string;
  lastModifiedDate: string;
  slaDeadline?: string;
  category?: string;
  tags?: string[];
  attachments?: {
    id: string;
    filename: string;
    size: number;
  }[];
  estimatedHours?: number;
  actualHours?: number;
}

const statusOptions = [
  { value: "RAISED", label: "Raised", color: "#6c757d" },
  { value: "IN_PROGRESS", label: "In Progress", color: "#007bff" },
  { value: "PENDING_APPROVAL", label: "Pending Approval", color: "#ffc107" },
  { value: "RESOLVED", label: "Resolved", color: "#28a745" },
  { value: "APPROVED", label: "Approved", color: "#20c997" },
  { value: "REJECTED", label: "Rejected", color: "#dc3545" },
];

const priorityOptions = [
  { value: "LOW", label: "Low", color: "#28a745" },
  { value: "MEDIUM", label: "Medium", color: "#ffc107" },
  { value: "HIGH", label: "High", color: "#fd7e14" },
  { value: "CRITICAL", label: "Critical", color: "#dc3545" },
];

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [history, setHistory] = useState<TicketHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "details" | "comments" | "history"
  >("details");

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<TicketData>>({});

  // Comment states
  const [newComment, setNewComment] = useState("");
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const [isAddingComment, setIsAddingComment] = useState(false);

  // Load ticket data
  useEffect(() => {
    const loadTicketData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Use searchTickets with ID filter since getTicketById is not working
        const searchCriteria = { id: id };
        const ticketResponse = await searchTickets(
          searchCriteria,
          0,
          1,
          "id,desc"
        );

        console.log("ticketResponse ticket:", ticketResponse);

        // Get the single ticket from API response - guaranteed to have exactly one ticket
        const foundTicket = ticketResponse.items?.[0];

        if (!foundTicket) {
          throw new Error("Ticket not found");
        }

        // Debug log to verify ticket data
        console.log("Found ticket:", foundTicket);
        console.log("Ticket code:", foundTicket.ticketCode);

        setTicket(foundTicket);
        // Set empty arrays for comments and history since APIs are removed
        setComments([]);
        setHistory([]);
      } catch (error) {
        console.error("Failed to load ticket data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTicketData();
  }, [id]);

  // Permission checks
  const canEdit = () => {
    if (!user || !ticket) return false;

    // Admin and IT staff can edit any ticket
    if (user.role === UserRole.ADMIN || user.role === UserRole.IT_STAFF) {
      return true;
    }

    // Assignee can edit tickets assigned to them
    if (
      ticket.assignedToEmployeeId &&
      user.id === ticket.assignedToEmployeeId.toString()
    ) {
      return true;
    }

    // Manager can edit tickets in their department
    if (user.role === UserRole.MANAGER) {
      return true; // Add department check here if needed
    }

    return false;
  };

  const canComment = () => {
    return !!user; // Any authenticated user can comment
  };

  // Handle field updates
  const handleFieldUpdate = async (field: string, value: unknown) => {
    if (!ticket || !canEdit()) return;

    try {
      setSaving(true);
      const updateData = { [field]: value };
      await updateTicket(ticket.id, updateData);

      setTicket((prev) => (prev ? { ...prev, [field]: value } : null));

      // History functionality removed - no longer reload history
    } catch (error) {
      console.error("Failed to update ticket:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle comment submission
  const handleAddComment = async () => {
    if (!ticket || !newComment.trim()) return;

    try {
      setIsAddingComment(true);

      // Add comment
      await addComment(ticket.id, newComment);

      // Upload attachments if any
      for (const file of commentAttachments) {
        await uploadAttachment(ticket.id, file);
      }

      // Comments functionality simplified - no longer reload comments from server
      // Just add the new comment to local state
      const newCommentObj = {
        id: Date.now().toString(),
        content: newComment,
        author: user?.id || "",
        authorName: user?.firstName + " " + user?.lastName || "Unknown",
        authorRole: user?.role || "User",
        createdAt: new Date().toISOString(),
        isInternal: false,
        attachments: [],
      };
      setComments((prev) => [...prev, newCommentObj]);

      // Clear form
      setNewComment("");
      setCommentAttachments([]);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsAddingComment(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setCommentAttachments((prev) => [...prev, ...files]);
  };

  // Remove attachment from comment
  const removeCommentAttachment = (index: number) => {
    setCommentAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.color || "#6c757d";
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const option = priorityOptions.find((opt) => opt.value === priority);
    return option?.color || "#6c757d";
  };

  if (loading) {
    return (
      <div className="ticket-details-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-details-page">
        <div className="error-message">
          <FaExclamationTriangle />
          <h3>Ticket Not Found</h3>
          <p>The requested ticket could not be found.</p>
          <button
            onClick={() => navigate("/tickets")}
            className="btn btn-primary"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-details-page">
      {/* Header */}
      <div className="ticket-header">
        <div className="header-left">
          <button
            onClick={() => navigate("/tickets")}
            className="btn btn-ghost btn-icon"
            title="Back to tickets"
          >
            <FaArrowLeft />
          </button>
          <div className="ticket-title-section">
            <h1>
              <FaTicketAlt />
              {ticket.ticketCode}
            </h1>
            <h2>{ticket.title}</h2>
          </div>
        </div>
        <div className="header-right">
          <div
            className="ticket-status-badge"
            style={{ backgroundColor: getStatusColor(ticket.status) }}
          >
            {statusOptions.find((opt) => opt.value === ticket.status)?.label ||
              ticket.status}
          </div>
          <div
            className="ticket-priority-badge"
            style={{ backgroundColor: getPriorityColor(ticket.priority) }}
          >
            <FaFlag />
            {priorityOptions.find((opt) => opt.value === ticket.priority)
              ?.label || ticket.priority}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="ticket-tabs">
        <button
          className={`tab ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          <FaTicketAlt />
          Details
        </button>
        <button
          className={`tab ${activeTab === "comments" ? "active" : ""}`}
          onClick={() => setActiveTab("comments")}
        >
          <FaComments />
          Comments ({comments.length})
        </button>
        <button
          className={`tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <FaHistory />
          History ({history.length})
        </button>
      </div>

      {/* Content */}
      <div className="ticket-content">
        {activeTab === "details" && (
          <div className="ticket-details-tab">
            {/* Main Info Card */}
            <div className="ticket-card">
              <div className="card-header">
                <h3>Ticket Information</h3>
                {canEdit() && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`btn ${
                      isEditing ? "btn-secondary" : "btn-primary"
                    }`}
                  >
                    {isEditing ? <FaTimes /> : <FaEdit />}
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                )}
              </div>
              <div className="card-body">
                <div className="ticket-info-grid">
                  {/* Status */}
                  <div className="info-field">
                    <label>Status</label>
                    {isEditing && canEdit() ? (
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          handleFieldUpdate("status", e.target.value)
                        }
                        className="form-control"
                        disabled={saving}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div
                        className="status-display"
                        style={{ color: getStatusColor(ticket.status) }}
                      >
                        {statusOptions.find(
                          (opt) => opt.value === ticket.status
                        )?.label || ticket.status}
                      </div>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="info-field">
                    <label>Priority</label>
                    {isEditing && canEdit() ? (
                      <select
                        value={ticket.priority}
                        onChange={(e) =>
                          handleFieldUpdate("priority", e.target.value)
                        }
                        className="form-control"
                        disabled={saving}
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div
                        className="priority-display"
                        style={{ color: getPriorityColor(ticket.priority) }}
                      >
                        <FaFlag />
                        {priorityOptions.find(
                          (opt) => opt.value === ticket.priority
                        )?.label || ticket.priority}
                      </div>
                    )}
                  </div>

                  {/* Created By */}
                  <div className="info-field">
                    <label>
                      <FaUser />
                      Raised By
                    </label>
                    <div className="user-info">
                      <span className="user-name">
                        {ticket.raiserEmployeeDetails.employeeName}
                      </span>
                      <span className="user-role">
                        {ticket.raiserEmployeeDetails.designation}
                      </span>
                    </div>
                  </div>

                  {/* Assigned To */}
                  <div className="info-field">
                    <label>
                      <FaUser />
                      Assigned To
                    </label>
                    {isEditing && canEdit() ? (
                      <input
                        type="text"
                        value={ticket.assignedToName || ""}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            assignedToName: e.target.value,
                          }))
                        }
                        className="form-control"
                        placeholder="Enter assignee name"
                      />
                    ) : (
                      <div className="assignee-info">
                        {ticket.assignedToName || "Unassigned"}
                      </div>
                    )}
                  </div>

                  {/* Department */}
                  <div className="info-field">
                    <label>
                      <FaBuilding />
                      Department
                    </label>
                    <div>{ticket.assignedDepartmentId}</div>
                  </div>

                  {/* Created Date */}
                  <div className="info-field">
                    <label>
                      <FaCalendar />
                      Created
                    </label>
                    <div>{formatDate(ticket.createdDate)}</div>
                  </div>

                  {/* Last Modified */}
                  <div className="info-field">
                    <label>
                      <FaClock />
                      Last Modified
                    </label>
                    <div>{formatDate(ticket.lastModifiedDate)}</div>
                  </div>

                  {/* SLA Deadline */}
                  {ticket.slaDeadline && (
                    <div className="info-field">
                      <label>
                        <FaExclamationTriangle />
                        SLA Deadline
                      </label>
                      <div className="sla-deadline">
                        {formatDate(ticket.slaDeadline)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="description-section">
                  <label>Description</label>
                  {isEditing && canEdit() ? (
                    <textarea
                      value={editData.description || ticket.description}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="form-control"
                      rows={5}
                      disabled={saving}
                    />
                  ) : (
                    <div className="description-content">
                      {ticket.description}
                    </div>
                  )}
                </div>

                {/* Save Changes */}
                {isEditing && canEdit() && (
                  <div className="edit-actions">
                    <button
                      onClick={async () => {
                        if (Object.keys(editData).length > 0) {
                          await Promise.all(
                            Object.entries(editData).map(([field, value]) =>
                              handleFieldUpdate(field, value)
                            )
                          );
                          setEditData({});
                        }
                        setIsEditing(false);
                      }}
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      <FaSave />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({});
                      }}
                      className="btn btn-secondary"
                      disabled={saving}
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="ticket-card">
                <div className="card-header">
                  <h3>
                    <FaPaperclip />
                    Attachments ({ticket.attachments.length})
                  </h3>
                </div>
                <div className="card-body">
                  <div className="attachments-list">
                    {ticket.attachments.map((attachment, index) => (
                      <div key={index} className="attachment-item">
                        <FaPaperclip />
                        <span className="attachment-name">
                          {attachment.filename || `Attachment ${index + 1}`}
                        </span>
                        <div className="attachment-actions">
                          <button className="btn btn-ghost btn-sm">
                            <FaDownload />
                          </button>
                          {canEdit() && (
                            <button className="btn btn-ghost btn-sm text-danger">
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="comments-tab">
            {/* Add Comment */}
            {canComment() && (
              <div className="add-comment-card ticket-card">
                <div className="card-header">
                  <h3>
                    <FaReply />
                    Add Comment
                  </h3>
                </div>
                <div className="card-body">
                  <div className="comment-form">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Enter your comment..."
                      className="form-control comment-textarea"
                      rows={4}
                    />

                    {/* Attachment section */}
                    <div className="comment-attachments">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="file-input"
                        style={{ display: "none" }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-outline-secondary btn-sm"
                        type="button"
                      >
                        <FaPaperclip />
                        Attach Files
                      </button>

                      {commentAttachments.length > 0 && (
                        <div className="selected-files">
                          {commentAttachments.map((file, index) => (
                            <div key={index} className="selected-file">
                              <span>{file.name}</span>
                              <button
                                onClick={() => removeCommentAttachment(index)}
                                className="btn btn-ghost btn-xs"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="comment-actions">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isAddingComment}
                        className="btn btn-primary"
                      >
                        {isAddingComment ? "Adding..." : "Add Comment"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="no-comments">
                  <FaComments />
                  <p>No comments yet</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-card ticket-card">
                    <div className="comment-header">
                      <div className="comment-author">
                        <div className="author-avatar">
                          {comment.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div className="author-info">
                          <span className="author-name">
                            {comment.authorName}
                          </span>
                          <span className="author-role">
                            {comment.authorRole}
                          </span>
                        </div>
                      </div>
                      <div className="comment-date">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="comment-attachments">
                        {comment.attachments.map((attachment, index) => (
                          <div key={index} className="attachment-item">
                            <FaPaperclip />
                            <span>{attachment.filename}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="history-tab">
            {history.length === 0 ? (
              <div className="no-history">
                <FaHistory />
                <p>No history available</p>
              </div>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <div key={item.id} className="history-item ticket-card">
                    <div className="history-header">
                      <div className="history-action">{item.action}</div>
                      <div className="history-date">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                    <div className="history-user">by {item.userName}</div>
                    {item.changes && Object.keys(item.changes).length > 0 && (
                      <div className="history-changes">
                        {Object.entries(item.changes).map(([field, change]) => (
                          <div key={field} className="change-item">
                            <strong>{field}:</strong> {String(change.from)} →{" "}
                            {String(change.to)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsPage;
