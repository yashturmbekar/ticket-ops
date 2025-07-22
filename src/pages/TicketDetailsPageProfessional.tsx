import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTicketById, getTicketComments } from "../services/ticketService";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaUserTie,
  FaEdit,
  FaPaperclip,
  FaDownload,
  FaTimes,
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaFileArchive,
  FaFileCode,
  FaFileExcel,
  FaFileWord,
  FaFilePowerpoint,
  FaFile,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import "../styles/ticketDetailsProfessional.css";

// API Response interface matching the backend structure
interface ApiTicketResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  ticketCode: string;
  priority: string;
  raiserEmployeeDetails?: {
    employeeName: string;
    designation: string;
  };
  assignedDepartmentId?: string;
  assignedToEmployeeId?: string;
  assignedToName?: string;
  createdDate: string;
  lastModifiedDate: string;
  slaDeadline?: string;
  location?: string;
  requesterPhone?: string;
  requesterEmail?: string;
  category?: string;
  subcategory?: string;
  assetTag?: string;
  attachments?: Array<{
    filename: string;
    size: number;
  }>;
}

interface ApiCommentResponse {
  id: string;
  content: string;
  author?: string;
  authorName?: string;
  createdAt?: string;
  timestamp?: string;
  isInternal?: boolean;
  attachments?: Array<{
    filename: string;
    size: number;
  }>;
}

// Simplified interfaces for the professional implementation
interface TicketData {
  id: string;
  ticketCode: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  requestedBy: {
    employeeName: string;
    designation: string;
  };
  assignedTo?: {
    employeeName: string;
    designation: string;
  };
  department: string;
  category: string;
  subcategory: string;
  dateCreated: string;
  dateModified: string;
  dueDate?: string;
  contact: {
    phone: string;
    email: string;
  };
  location: string;
  assetTag?: string;
  attachments: Array<{
    filename: string;
    size: number;
  }>;
}

interface CommentData {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
  attachments?: Array<{
    filename: string;
    size: number;
  }>;
}

const TicketDetailsPageProfessional: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>(
    {}
  );
  const [tempValues, setTempValues] = useState<Record<string, string>>({});
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);

  // Load ticket data from API
  useEffect(() => {
    const loadTicketData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const ticketResponse = await getTicketById(id);

        console.log("ticketResponse ticket:", ticketResponse);

        // Get the single ticket from API response - guaranteed to have exactly one ticket
        const foundTicket: ApiTicketResponse = ticketResponse;

        if (foundTicket) {
          // Transform API response to our TicketData interface
          const transformedTicket: TicketData = {
            id: foundTicket.id,
            ticketCode: foundTicket.ticketCode || `TKT-${foundTicket.id}`,
            title: foundTicket.title,
            description: foundTicket.description,
            status: foundTicket.status,
            priority: foundTicket.priority,
            requestedBy: {
              employeeName:
                foundTicket.raiserEmployeeDetails?.employeeName ||
                "Unknown User",
              designation:
                foundTicket.raiserEmployeeDetails?.designation || "Unknown",
            },
            assignedTo: foundTicket.assignedToName
              ? {
                  employeeName: foundTicket.assignedToName,
                  designation: "IT Staff", // Default since API doesn't provide this
                }
              : undefined,
            department: foundTicket.assignedDepartmentId || "Unknown",
            category: foundTicket.category || "General",
            subcategory: foundTicket.subcategory || "Other",
            dateCreated: foundTicket.createdDate,
            dateModified: foundTicket.lastModifiedDate,
            dueDate: foundTicket.slaDeadline,
            contact: {
              phone: foundTicket.requesterPhone || "Not provided",
              email: foundTicket.requesterEmail || "Not provided",
            },
            location: foundTicket.location || "Not specified",
            assetTag: foundTicket.assetTag,
            attachments: foundTicket.attachments || [],
          };

          setTicket(transformedTicket);

          // Store ticket code in session storage for breadcrumb
          sessionStorage.setItem(
            `ticketCode_${id}`,
            transformedTicket.ticketCode
          );

          // Load comments from API
          try {
            const commentsResponse = await getTicketComments(id);
            const apiComments = commentsResponse?.data || [];

            const transformedComments: CommentData[] = apiComments.map(
              (comment: ApiCommentResponse) => ({
                id: comment.id,
                author: comment.authorName || comment.author || "Unknown",
                content: comment.content,
                timestamp: comment.createdAt || comment.timestamp,
                isInternal: comment.isInternal || false,
                attachments: comment.attachments || [],
              })
            );

            setComments(transformedComments);
          } catch (commentError) {
            console.error("Error loading comments:", commentError);
            // Fallback to system comment if comments API fails
            const systemComment: CommentData[] = [
              {
                id: "1",
                author: "System",
                content: `Ticket ${transformedTicket.ticketCode} has been created and assigned.`,
                timestamp: transformedTicket.dateCreated,
                isInternal: false,
              },
            ];
            setComments(systemComment);
          }
        } else {
          console.error("Ticket not found");
          setTicket(null);
        }
      } catch (error) {
        console.error("Error loading ticket:", error);
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    loadTicketData();
  }, [id]);

  const handleFieldEdit = (field: string) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
    setTempValues((prev) => ({
      ...prev,
      [field]: ticket ? String(getFieldValue(ticket, field)) : "",
    }));
  };

  const getFieldValue = (
    ticket: TicketData,
    field: string
  ): string | object => {
    switch (field) {
      case "title":
        return ticket.title;
      case "description":
        return ticket.description;
      case "priority":
        return ticket.priority;
      case "status":
        return ticket.status;
      case "assignedTo":
        return ticket.assignedTo || { employeeName: "", designation: "" };
      case "dueDate":
        return ticket.dueDate || "";
      case "location":
        return ticket.location;
      case "assetTag":
        return ticket.assetTag || "";
      default:
        return "";
    }
  };

  const handleFieldSave = (field: string) => {
    const value = tempValues[field];
    if (ticket && value !== undefined) {
      // In a real app, this would make an API call
      console.log(`Updating ${field} to:`, value);
      setEditableFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleFieldCancel = (field: string) => {
    setEditableFields((prev) => ({ ...prev, [field]: false }));
    setTempValues((prev) => {
      const newValues = { ...prev };
      delete newValues[field];
      return newValues;
    });
  };

  const handleFieldUpdate = (field: string, value: string) => {
    setTempValues((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FaFilePdf className="file-icon pdf" />;
      case "doc":
      case "docx":
        return <FaFileWord className="file-icon word" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel className="file-icon excel" />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint className="file-icon powerpoint" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
        return <FaFileImage className="file-icon image" />;
      case "zip":
      case "rar":
      case "7z":
        return <FaFileArchive className="file-icon archive" />;
      case "js":
      case "ts":
      case "html":
      case "css":
      case "json":
        return <FaFileCode className="file-icon code" />;
      case "txt":
      case "log":
        return <FaFileAlt className="file-icon text" />;
      default:
        return <FaFile className="file-icon default" />;
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsAddingComment(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const comment: CommentData = {
        id: Date.now().toString(),
        author: "Current User",
        content: newComment,
        timestamp: new Date().toISOString(),
        isInternal,
        attachments: commentAttachments.map((file) => ({
          filename: file.name,
          size: file.size,
        })),
      };

      setComments((prev) => [...prev, comment]);
      setNewComment("");
      setCommentAttachments([]);
      setIsInternal(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleCommentAttachment = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    setCommentAttachments((prev) => [...prev, ...files]);
  };

  const removeCommentAttachment = (index: number) => {
    setCommentAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const downloadAttachment = (filename: string) => {
    // Simulate file download
    console.log("Downloading:", filename);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "#007bff";
      case "in progress":
        return "#17a2b8";
      case "resolved":
        return "#28a745";
      case "closed":
        return "#6c757d";
      case "on hold":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  if (loading) {
    return (
      <div className="ticket-details-loading">
        <FaSpinner className="spinner" />
        <span>Loading ticket details...</span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-details-error">
        <FaExclamationTriangle />
        <span>Ticket not found</span>
      </div>
    );
  }

  return (
    <div className="ticket-details-page-professional">
      <div className="page-content">
        <div className="content-container">
          {/* Ticket Header */}
          <div className="ticket-header-card">
            <div className="ticket-title-section">
              <div className="ticket-code-and-status">
                <h1 className="ticket-title">{ticket.title}</h1>
                <div className="status-badges">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className="priority-badge"
                    style={{
                      backgroundColor: getPriorityColor(ticket.priority),
                    }}
                  >
                    {ticket.priority} Priority
                  </span>
                </div>
              </div>
              <div className="ticket-meta">
                <span className="meta-item">
                  <FaCalendarAlt />
                  Created {formatDate(ticket.dateCreated)}
                </span>
                <span className="meta-item">
                  <FaClock />
                  Modified {formatDate(ticket.dateModified)}
                </span>
                {ticket.dueDate && (
                  <span className="meta-item">
                    <FaClock />
                    Due {formatDate(ticket.dueDate)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Single Comprehensive Ticket Information Section */}
          <div className="card ticket-comprehensive-card">
            <div className="card-header">
              <h2>Ticket Information</h2>
            </div>
            <div className="card-content">
              {/* Description */}
              <div className="ticket-description">
                <h3>Description</h3>
                <div className="description-content">
                  {editableFields.description ? (
                    <div className="edit-field">
                      <textarea
                        value={tempValues.description || ""}
                        onChange={(e) =>
                          handleFieldUpdate("description", e.target.value)
                        }
                        rows={4}
                        className="edit-textarea"
                      />
                      <div className="edit-actions">
                        <button
                          onClick={() => handleFieldSave("description")}
                          className="save-btn"
                        >
                          <FaCheck /> Save
                        </button>
                        <button
                          onClick={() => handleFieldCancel("description")}
                          className="cancel-btn"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="field-with-edit">
                      <p>{ticket.description}</p>
                      <button
                        onClick={() => handleFieldEdit("description")}
                        className="edit-btn"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* All Ticket Information in One Grid */}
              <div className="comprehensive-info-grid">
                {/* Requester Information */}
                <div className="info-section">
                  <h3>Requester Information</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <label>Requested By</label>
                      <div className="info-value">
                        <FaUser />
                        <div>
                          <div className="primary-text">
                            {ticket.requestedBy.employeeName}
                          </div>
                          <div className="secondary-text">
                            {ticket.requestedBy.designation}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <label>Contact Information</label>
                      <div className="info-value">
                        <div className="contact-info">
                          <div className="contact-item">
                            <FaPhone />
                            <span>{ticket.contact.phone}</span>
                          </div>
                          <div className="contact-item">
                            <FaEnvelope />
                            <span>{ticket.contact.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <label>Department</label>
                      <div className="info-value">
                        <FaBuilding />
                        <span>{ticket.department}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <label>Location</label>
                      <div className="info-value">
                        <span>{ticket.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment & Tracking */}
                <div className="info-section">
                  <h3>Assignment & Tracking</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <label>Assigned To</label>
                      <div className="info-value">
                        {ticket.assignedTo ? (
                          <>
                            <FaUserTie />
                            <div>
                              <div className="primary-text">
                                {ticket.assignedTo.employeeName}
                              </div>
                              <div className="secondary-text">
                                {ticket.assignedTo.designation}
                              </div>
                            </div>
                          </>
                        ) : (
                          <span className="unassigned">Unassigned</span>
                        )}
                      </div>
                    </div>

                    <div className="info-item">
                      <label>Category</label>
                      <div className="info-value">
                        <span>
                          {ticket.category} → {ticket.subcategory}
                        </span>
                      </div>
                    </div>

                    <div className="info-item">
                      <label>Ticket Code</label>
                      <div className="info-value">
                        <span className="ticket-code-display">
                          {ticket.ticketCode}
                        </span>
                      </div>
                    </div>

                    {ticket.assetTag && (
                      <div className="info-item">
                        <label>Asset Tag</label>
                        <div className="info-value">
                          <span>{ticket.assetTag}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline Information */}
                <div className="info-section">
                  <h3>Timeline</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <label>Created Date</label>
                      <div className="info-value">
                        <FaCalendarAlt />
                        <span>{formatDate(ticket.dateCreated)}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <label>Last Modified</label>
                      <div className="info-value">
                        <FaClock />
                        <span>{formatDate(ticket.dateModified)}</span>
                      </div>
                    </div>

                    {ticket.dueDate && (
                      <div className="info-item">
                        <label>Due Date</label>
                        <div className="info-value">
                          <FaCalendarAlt />
                          <span>{formatDate(ticket.dueDate)}</span>
                        </div>
                      </div>
                    )}

                    <div className="info-item">
                      <label>Status</label>
                      <div className="info-value">
                        <span
                          className="status-indicator"
                          style={{
                            backgroundColor: getStatusColor(ticket.status),
                          }}
                        >
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="attachments-section">
                  <h3>Attachments</h3>
                  <div className="attachments-list">
                    {ticket.attachments.map((attachment, index) => (
                      <div key={index} className="attachment-item">
                        <div className="attachment-info">
                          {getFileIcon(attachment.filename)}
                          <div className="attachment-details">
                            <div className="attachment-name">
                              {attachment.filename}
                            </div>
                            <div className="attachment-size">
                              {formatFileSize(attachment.size)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            downloadAttachment(attachment.filename)
                          }
                          className="download-btn"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Timeline */}
              <div className="activity-section">
                <div className="activity-header">
                  <h3>Activity Timeline</h3>
                  <div className="activity-stats">
                    <span>{comments.length} Comments</span>
                  </div>
                </div>

                <div className="activity-timeline">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`timeline-item ${
                        comment.isInternal ? "internal" : "public"
                      }`}
                    >
                      <div className="timeline-avatar">
                        <FaUser />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <div className="author-info">
                            <span className="author-name">
                              {comment.author}
                            </span>
                            {comment.isInternal && (
                              <span className="internal-badge">Internal</span>
                            )}
                          </div>
                          <span className="timestamp">
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <div className="timeline-body">
                          <p>{comment.content}</p>
                          {comment.attachments &&
                            comment.attachments.length > 0 && (
                              <div className="comment-attachments">
                                {comment.attachments.map(
                                  (attachment, index) => (
                                    <div
                                      key={index}
                                      className="comment-attachment"
                                    >
                                      {getFileIcon(attachment.filename)}
                                      <span>{attachment.filename}</span>
                                      <span className="file-size">
                                        ({formatFileSize(attachment.size)})
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Comment Section */}
              <div className="comment-composer">
                <div className="composer-header">
                  <h3>Add Comment</h3>
                  <div className="composer-options">
                    <label className="internal-toggle">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                      />
                      <span>Internal Comment</span>
                    </label>
                  </div>
                </div>

                <div className="composer-content">
                  <div className="comment-input">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={
                        isInternal
                          ? "Add an internal comment..."
                          : "Add a comment..."
                      }
                      rows={4}
                    />
                  </div>

                  <div className="composer-toolbar">
                    <div className="toolbar-left">
                      <label className="attachment-button">
                        <FaPaperclip />
                        <span>Attach Files</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleCommentAttachment}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                    <div className="toolbar-right">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isAddingComment}
                        className="submit-button"
                      >
                        {isAddingComment ? "Adding..." : "Add Comment"}
                      </button>
                    </div>
                  </div>

                  {commentAttachments.length > 0 && (
                    <div className="selected-files">
                      {commentAttachments.map((file, index) => (
                        <div key={index} className="selected-file">
                          <div className="file-preview">
                            {getFileIcon(file.name)}
                            <div className="file-info">
                              <div className="file-name">{file.name}</div>
                              <div className="file-size">
                                {formatFileSize(file.size)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeCommentAttachment(index)}
                            className="remove-file"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPageProfessional;
