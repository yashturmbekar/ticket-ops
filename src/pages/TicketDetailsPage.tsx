import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClock,
  FaUser,
  FaCalendar,
  FaPaperclip,
  FaSave,
  FaTimes,
  FaEdit,
  FaExclamationTriangle,
  FaBuilding,
  FaTicketAlt,
  FaFlag,
  FaDownload,
  FaTrash,
  FaReply,
  FaEye,
  FaFileAlt,
  FaImage,
  FaVideo,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFile,
  FaComments,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import {
  searchTickets,
  updateTicket,
  addComment,
  uploadAttachment,
} from "../services/ticketService";
import "../styles/ticketDetailsNew.css";

// Constants
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

// User roles
const UserRole = {
  ADMIN: "admin",
  IT_STAFF: "it_staff",
  MANAGER: "manager",
  EMPLOYEE: "employee",
} as const;

interface Ticket {
  id: string;
  ticketCode: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdDate: string;
  lastModifiedDate: string;
  slaDeadline?: string;
  raiserEmployeeDetails: {
    employeeName: string;
    designation: string;
  };
  assignedToEmployeeId?: string;
  assignedToName?: string;
  assignedDepartmentId: string;
  attachments?: Array<{
    filename: string;
    size: number;
  }>;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  isInternal: boolean;
  attachments?: Array<{
    filename: string;
  }>;
}

const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // State
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Record<string, unknown>>({});

  // Comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load ticket details
  useEffect(() => {
    const loadTicket = async () => {
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

        if (foundTicket) {
          setTicket(foundTicket);
        } else {
          addNotification({
            type: "error",
            title: "Ticket Not Found",
            message: "The requested ticket could not be found.",
          });
          navigate("/tickets");
        }
      } catch (error) {
        console.error("Failed to load ticket:", error);
        addNotification({
          type: "error",
          title: "Loading Error",
          message: "Failed to load ticket details",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id, navigate, addNotification]);

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

      // Add the new comment to local state
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

  // Get file type icon
  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FaFilePdf />;
      case "doc":
      case "docx":
        return <FaFileWord />;
      case "xls":
      case "xlsx":
        return <FaFileExcel />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return <FaImage />;
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return <FaVideo />;
      case "txt":
      case "md":
        return <FaFileAlt />;
      default:
        return <FaFile />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="ticket-details-page-new">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-details-page-new">
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
    <div className="ticket-details-page-new">
      {/* Main Content - Two Column Layout */}
      <div className="ticket-main-content">
        {/* Left Column - Ticket Details */}
        <div className="left-column">
          {/* Ticket Details Card */}
          <div className="details-card">
            <div className="card-header">
              <div className="header-left">
                <button
                  onClick={() => navigate("/tickets")}
                  className="back-button"
                  title="Back to tickets"
                >
                  <FaArrowLeft />
                </button>
                <div className="ticket-title-section">
                  <div className="ticket-code">
                    <FaTicketAlt />
                    {ticket.ticketCode}
                  </div>
                  <h2 className="ticket-title">{ticket.title}</h2>
                </div>
              </div>
              <div className="header-right">
                <div
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(ticket.status) }}
                >
                  {statusOptions.find((opt) => opt.value === ticket.status)
                    ?.label || ticket.status}
                </div>
                <div
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                >
                  <FaFlag />
                  {priorityOptions.find((opt) => opt.value === ticket.priority)
                    ?.label || ticket.priority}
                </div>
                {canEdit() && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`edit-button ${isEditing ? "editing" : ""}`}
                  >
                    {isEditing ? <FaTimes /> : <FaEdit />}
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                )}
              </div>
            </div>
            <div className="card-content">
              {/* Description */}
              <div className="detail-section">
                <label>Description</label>
                {isEditing && canEdit() ? (
                  <textarea
                    value={
                      (editData.description as string) || ticket.description
                    }
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="form-control description-textarea"
                    rows={6}
                    disabled={saving}
                  />
                ) : (
                  <div className="description-content">
                    {ticket.description}
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div className="details-grid">
                <div className="detail-item">
                  <label>
                    <FaUser />
                    Raised By
                  </label>
                  <div className="detail-value">
                    <div className="user-info">
                      <span className="user-name">
                        {ticket.raiserEmployeeDetails.employeeName}
                      </span>
                      <span className="user-role">
                        {ticket.raiserEmployeeDetails.designation}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  <label>
                    <FaUser />
                    Assigned To
                  </label>
                  <div className="detail-value">
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
                      <span>{ticket.assignedToName || "Unassigned"}</span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <label>
                    <FaBuilding />
                    Department
                  </label>
                  <div className="detail-value">
                    {ticket.assignedDepartmentId}
                  </div>
                </div>

                <div className="detail-item">
                  <label>Status</label>
                  <div className="detail-value">
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
                      <span
                        className="status-display"
                        style={{ color: getStatusColor(ticket.status) }}
                      >
                        {statusOptions.find(
                          (opt) => opt.value === ticket.status
                        )?.label || ticket.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <label>Priority</label>
                  <div className="detail-value">
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
                      <span
                        className="priority-display"
                        style={{ color: getPriorityColor(ticket.priority) }}
                      >
                        <FaFlag />
                        {priorityOptions.find(
                          (opt) => opt.value === ticket.priority
                        )?.label || ticket.priority}
                      </span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <label>
                    <FaCalendar />
                    Created
                  </label>
                  <div className="detail-value">
                    {formatDate(ticket.createdDate)}
                  </div>
                </div>

                <div className="detail-item">
                  <label>
                    <FaClock />
                    Last Modified
                  </label>
                  <div className="detail-value">
                    {formatDate(ticket.lastModifiedDate)}
                  </div>
                </div>

                {ticket.slaDeadline && (
                  <div className="detail-item">
                    <label>
                      <FaExclamationTriangle />
                      SLA Deadline
                    </label>
                    <div className="detail-value sla-deadline">
                      {formatDate(ticket.slaDeadline)}
                    </div>
                  </div>
                )}
              </div>

              {/* Save Changes Button */}
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
                </div>
              )}
            </div>
          </div>

          {/* Original Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="attachments-card">
              <div className="card-header">
                <h2>
                  <FaPaperclip />
                  Original Attachments ({ticket.attachments.length})
                </h2>
              </div>
              <div className="card-content">
                <div className="attachments-grid">
                  {ticket.attachments.map((attachment, index) => (
                    <div key={index} className="attachment-item">
                      <div className="attachment-icon">
                        {getFileIcon(attachment.filename || `file-${index}`)}
                      </div>
                      <div className="attachment-info">
                        <div className="attachment-name">
                          {attachment.filename || `Attachment ${index + 1}`}
                        </div>
                        <div className="attachment-size">
                          {formatFileSize(attachment.size || 0)}
                        </div>
                      </div>
                      <div className="attachment-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          title="Download"
                        >
                          <FaDownload />
                        </button>
                        <button className="btn btn-ghost btn-sm" title="View">
                          <FaEye />
                        </button>
                        {canEdit() && (
                          <button
                            className="btn btn-ghost btn-sm btn-danger"
                            title="Delete"
                          >
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

        {/* Right Column - Comments and Activity */}
        <div className="right-column">
          {/* Previous Comments */}
          <div className="comments-card">
            <div className="card-header">
              <h2>
                <FaComments />
                Comments & Activity ({comments.length})
              </h2>
            </div>
            <div className="card-content">
              <div className="comments-list">
                {comments.length === 0 ? (
                  <div className="no-comments">
                    <FaComments />
                    <p>No comments yet. Be the first to add a comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-author">
                          <div className="author-avatar">
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div className="author-info">
                            <div className="author-name">
                              {comment.authorName}
                            </div>
                            <div className="author-role">
                              {comment.authorRole}
                            </div>
                            <div className="comment-date">
                              {formatDate(comment.createdAt)}
                            </div>
                          </div>
                        </div>
                        {comment.isInternal && (
                          <div className="internal-badge">Internal</div>
                        )}
                      </div>
                      <div className="comment-content">{comment.content}</div>
                      {comment.attachments &&
                        comment.attachments.length > 0 && (
                          <div className="comment-attachments">
                            {comment.attachments.map((attachment, index) => (
                              <div key={index} className="comment-attachment">
                                {getFileIcon(attachment.filename)}
                                <span>{attachment.filename}</span>
                                <button className="btn btn-ghost btn-xs">
                                  <FaDownload />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Add Comment Section */}
          {canComment() && (
            <div className="add-comment-card">
              <div className="card-header">
                <h2>
                  <FaReply />
                  Add Comment
                </h2>
              </div>
              <div className="card-content">
                <div className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type your comment here..."
                    className="comment-textarea"
                    rows={4}
                  />

                  {/* Attachment section */}
                  <div className="comment-attachments-section">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="file-input"
                      style={{ display: "none" }}
                    />

                    <div className="attachment-controls">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-outline add-attachment-btn"
                        type="button"
                      >
                        <FaPaperclip />
                        Add Attachments
                      </button>

                      {commentAttachments.length > 0 && (
                        <span className="attachment-count">
                          {commentAttachments.length} file(s) selected
                        </span>
                      )}
                    </div>

                    {commentAttachments.length > 0 && (
                      <div className="selected-attachments">
                        {commentAttachments.map((file, index) => (
                          <div key={index} className="selected-attachment">
                            <div className="attachment-preview">
                              {getFileIcon(file.name)}
                              <div className="attachment-details">
                                <div className="attachment-name">
                                  {file.name}
                                </div>
                                <div className="attachment-size">
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeCommentAttachment(index)}
                              className="btn btn-ghost btn-xs remove-attachment"
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
                      className="btn btn-primary submit-comment"
                    >
                      {isAddingComment ? "Adding..." : "Add Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
