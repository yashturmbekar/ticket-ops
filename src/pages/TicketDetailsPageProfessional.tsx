import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getTicketById, addComment, updateComment, uploadAttachment } from "../services/ticketService";
import { NotificationContext } from "../contexts/NotificationContext";
import { useAuth } from "../hooks/useAuth";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaBuilding,
  FaUserTie,
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
  FaTicketAlt,
} from "react-icons/fa";
import { Loader, ButtonLoader } from "../components/common";
import "../styles/ticketDetailsProfessional.css";
import "../styles/createModern.css";

// API Response interface matching the backend structure
interface ApiTicketResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  ticketCode: string;
  priority: string;
  raisedByEmployeeDetails?: {
    employeeName: string;
    id: number;
    profilePic?: string;
    profilePicContentType?: string;
    designation: string;
  };
  assignedDepartmentId?: string;
  helpdeskDepartmentDetails?: {
    id: string;
    name: string;
    isActive: boolean;
  };
  assignedToEmployeeId?: string;
  assignedToEmployeeDetails?: {
    employeeName: string;
    id: number;
    designation: string;
  };
  createdDate: string;
  lastModifiedDate: string;
  slaDeadline?: string;
  requesterEmail?: string;
  category?: string;
  subcategory?: string;
  assetTag?: string;
  attachments?: Array<{
    filename: string;
    size: number;
  }>;
  comments?: Array<{
    id: string;
    ticketId: string;
    comment: string;
    commenterEmployeeId: number;
    isDeleted: boolean;
    createdDate: string;
    lastModifiedDate: string;
    commenterEmployeeDetails?: {
      employeeName: string;
      id: number;
      profilePic?: string;
      profilePicContentType?: string;
      designation: string;
    };
    attachments?: Array<{
      filename: string;
      size: number;
    }>;
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
    id?: number;
    profilePic?: string;
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
  commenterEmployeeId?: number;
  attachments?: Array<{
    filename: string;
    size: number;
  }>;
}

const TicketDetailsPageProfessional: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const notificationContext = useContext(NotificationContext);
  const { user } = useAuth();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);

  // Function to transform API comments to CommentData format
  const transformComments = (apiComments: ApiTicketResponse['comments']): CommentData[] => {
    if (!apiComments || apiComments.length === 0) {
      return [];
    }

    return apiComments
      .map((comment) => ({
        id: comment.id,
        author: comment.commenterEmployeeDetails?.employeeName || "Unknown",
        content: comment.comment,
        timestamp: comment.createdDate,
        isInternal: false,
        commenterEmployeeId: comment.commenterEmployeeId,
        attachments: comment.attachments || [],
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by newest first
  };

  // Function to check if current user can edit a comment
  const canEditComment = (comment: CommentData): boolean => {
    if (comment.author === "System") return false;
    if (!user?.id) return false;
    return comment.commenterEmployeeId === parseInt(user.id);
  };

  // Function to start editing a comment
  const startEditComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentContent);
  };

  // Function to cancel editing
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  // Function to update a comment
  const handleUpdateComment = async () => {
    if (!editingCommentId || !editingCommentText.trim() || !id) return;

    setIsUpdatingComment(true);
    try {
      await updateComment(id, editingCommentId, editingCommentText.trim(), user?.id ? parseInt(user.id) : undefined);
      
      // Refresh ticket data to get updated comments
      const updatedTicketResponse = await getTicketById(id);
      const updatedTicket: ApiTicketResponse = updatedTicketResponse;
      
      if (updatedTicket) {
        const updatedComments = transformComments(updatedTicket.comments);
        setComments(updatedComments);
      }

      // Clear editing state
      setEditingCommentId(null);
      setEditingCommentText("");

      // Show success notification
      if (notificationContext) {
        notificationContext.success("Comment Updated", "Your comment has been updated successfully.");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      
      // Show error notification
      if (notificationContext) {
        notificationContext.error("Error Updating Comment", "Failed to update comment. Please try again.");
      }
    } finally {
      setIsUpdatingComment(false);
    }
  };

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
                foundTicket.raisedByEmployeeDetails?.employeeName ||
                "Unknown User",
              designation:
                foundTicket.raisedByEmployeeDetails?.designation || "Unknown",
              id: foundTicket.raisedByEmployeeDetails?.id,
              profilePic: foundTicket.raisedByEmployeeDetails?.profilePic,
            },
            assignedTo: foundTicket.assignedToEmployeeDetails
              ? {
                  employeeName:
                    foundTicket.assignedToEmployeeDetails.employeeName,
                  designation:
                    foundTicket.assignedToEmployeeDetails.designation,
                }
              : undefined,
            department:
              foundTicket.helpdeskDepartmentDetails?.name ||
              "Unknown Department",
            category: foundTicket.category || "General",
            subcategory: foundTicket.subcategory || "Other",
            dateCreated: foundTicket.createdDate,
            dateModified: foundTicket.lastModifiedDate,
            dueDate: foundTicket.slaDeadline,
            assetTag: foundTicket.assetTag,
            attachments: foundTicket.attachments || [],
          };

          setTicket(transformedTicket);

          // Store ticket code in session storage for breadcrumb
          sessionStorage.setItem(
            `ticketCode_${id}`,
            transformedTicket.ticketCode
          );

          // Transform and set comments from ticket response
          
          // If no comments exist, add a system comment

          const transformedComments = transformComments(foundTicket.comments);
          
          // If no comments exist, add a system comment
          
          setComments(transformedComments);

          
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

  const getFileIcon = (filename: string, size?: number) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const iconSize = size || 16;
    switch (ext) {
      case "pdf":
        return <FaFilePdf className="file-icon pdf" size={iconSize} />;
      case "doc":
      case "docx":
        return <FaFileWord className="file-icon word" size={iconSize} />;
      case "xls":
      case "xlsx":
        return <FaFileExcel className="file-icon excel" size={iconSize} />;
      case "ppt":
      case "pptx":
        return (
          <FaFilePowerpoint className="file-icon powerpoint" size={iconSize} />
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
        return <FaFileImage className="file-icon image" size={iconSize} />;
      case "zip":
      case "rar":
      case "7z":
        return <FaFileArchive className="file-icon archive" size={iconSize} />;
      case "js":
      case "ts":
      case "html":
      case "css":
      case "json":
        return <FaFileCode className="file-icon code" size={iconSize} />;
      case "txt":
      case "log":
        return <FaFileAlt className="file-icon text" size={iconSize} />;
      default:
        return <FaFile className="file-icon default" size={iconSize} />;
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;

    setIsAddingComment(true);
    try {
      // Upload attachments first if any
      const uploadedAttachments: Array<{ filename: string; size: number }> = [];
      
      if (commentAttachments.length > 0) {
        for (const file of commentAttachments) {
          try {
            const uploadResponse = await uploadAttachment(id, file);
            console.log("File uploaded successfully:", uploadResponse);
            uploadedAttachments.push({
              filename: file.name,
              size: file.size,
            });
          } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
            if (notificationContext) {
              notificationContext.error(
                "File Upload Error",
                `Failed to upload ${file.name}. Please try again.`
              );
            }
          }
        }
      }

      // Call the actual API to add comment
      const response = await addComment(id, newComment.trim());
      
      console.log("Comment added successfully:", response);

      // Refresh ticket data to get updated comments
      const updatedTicketResponse = await getTicketById(id);
      const updatedTicket: ApiTicketResponse = updatedTicketResponse;
      
      if (updatedTicket) {
        const updatedComments = transformComments(updatedTicket.comments);
        setComments(updatedComments);
      }
      
      // Clear the form
      setNewComment("");
      setCommentAttachments([]);

      // Show success notification
      if (notificationContext) {
        const message = uploadedAttachments.length > 0 
          ? `Comment added with ${uploadedAttachments.length} attachment(s).`
          : "Your comment has been added successfully.";
        notificationContext.success("Comment Added", message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      
      // Show error notification
      if (notificationContext) {
        notificationContext.error(
          "Error Adding Comment",
          "Failed to add comment. Please try again."
        );
      }
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

  const getAttachmentPreview = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
      extension || ""
    );

    if (isImage) {
      return (
        <div className="image-preview">
          <FaFileImage size={48} />
          <span className="preview-label">Image</span>
        </div>
      );
    }

    return (
      <div className="file-preview">
        {getFileIcon(filename, 48)}
        <span className="preview-label">
          {extension?.toUpperCase() || "File"}
        </span>
      </div>
    );
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
      <Loader centered text="Loading ticket details..." minHeight="60vh" />
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
      {/* Page Header */}
      <div className="create-page-header">
        <div className="create-page-title-section">
          <div className="create-page-icon">
            <FaTicketAlt />
          </div>
          <div className="create-page-title-text">
            <h1 className="create-page-title">Ticket Details</h1>
            <p className="create-page-subtitle">
              View and manage ticket information
            </p>
          </div>
        </div>
        <div className="create-page-actions"></div>
      </div>

      <div className="page-content">
        <div className="content-container">
          {/* Single Comprehensive Ticket Information Section */}
          <div className="card ticket-comprehensive-card">
            <div className="card-header">
              <div className="header-content">
                <h2>Ticket Information</h2>
                <div className="header-badges">
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
            </div>
            <div className="card-content">
              {/* Simple Ticket Information Display */}
              <div className="simple-ticket-info">
                <div className="ticket-code-simple">{ticket.ticketCode}</div>

                <div className="ticket-field title-field">
                  <span className="field-label">Title</span>
                  <span className="field-value">{ticket.title}</span>
                </div>

                <div className="ticket-field">
                  <span className="field-label">Description</span>
                  <span className="field-value">{ticket.description}</span>
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
                        {ticket.requestedBy.profilePic ? (
                          <div className="profile-pic-container">
                            <img
                              src={`data:${ticket.requestedBy.profilePic}`}
                              alt={ticket.requestedBy.employeeName}
                              className="profile-pic"
                            />
                          </div>
                        ) : (
                          <FaUser />
                        )}
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
                  </div>
                </div>

                {/* Assignment & Status */}
                <div className="info-section">
                  <h3>Assignment & Status</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <label>Assigned Department</label>
                      <div className="info-value">
                        <FaBuilding />
                        <span>{ticket.department}</span>
                      </div>
                    </div>
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
                      <label>Status</label>
                      <div className="info-value">
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(ticket.status),
                          }}
                        >
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    <div className="info-item">
                      <label>Priority</label>
                      <div className="info-value">
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
                      <label>Created</label>
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
                  </div>
                </div>
              </div>

              {/* Attachments with Preview */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="attachments-section card-section">
                  <h3>Attachments ({ticket.attachments.length})</h3>
                  <div className="attachments-grid">
                    {ticket.attachments.map((attachment, index) => (
                      <div key={index} className="attachment-card">
                        <div className="attachment-preview">
                          {getAttachmentPreview(attachment.filename)}
                        </div>
                        <div className="attachment-info">
                          <div
                            className="attachment-name"
                            title={attachment.filename}
                          >
                            {attachment.filename}
                          </div>
                          <div className="attachment-size">
                            {formatFileSize(attachment.size)}
                          </div>
                          <button
                            onClick={() =>
                              downloadAttachment(attachment.filename)
                            }
                            className="download-btn"
                          >
                            <FaDownload />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Timeline */}
              <div className="activity-section card-section">
                <div className="activity-header">
                  <h3>Activity Timeline</h3>
                  <div className="activity-stats">
                    <span>{comments.length} Comments</span>
                  </div>
                </div>

                <div className="activity-timeline">
                  {comments.map((comment) => (
                    <div key={comment.id} className="timeline-item">
                      <div className="timeline-avatar">
                        <FaUser />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <div className="author-info">
                            <span className="author-name">
                              {comment.author}
                            </span>
                          </div>
                          <div className="timeline-actions">
                            <span className="timestamp">
                              {formatDate(comment.timestamp)}
                            </span>
                            {canEditComment(comment) && (
                              <div className="comment-actions">
                                <button
                                  className="edit-comment-btn"
                                  onClick={() => startEditComment(comment.id, comment.content)}
                                  title="Edit comment"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="timeline-body">
                          {editingCommentId === comment.id ? (
                            <div className="edit-comment-form">
                              <textarea
                                value={editingCommentText}
                                onChange={(e) => setEditingCommentText(e.target.value)}
                                rows={3}
                                className="edit-comment-input"
                              />
                              <div className="edit-comment-actions">
                                <button
                                  onClick={handleUpdateComment}
                                  disabled={!editingCommentText.trim() || isUpdatingComment}
                                  className="save-comment-btn"
                                >
                                  {isUpdatingComment ? (
                                    <>
                                      <ButtonLoader variant="white" />
                                      <span>Saving...</span>
                                    </>
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                                <button
                                  onClick={cancelEditComment}
                                  disabled={isUpdatingComment}
                                  className="cancel-comment-btn"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p>{comment.content}</p>
                          )}
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
              <div className="comment-composer card-section">
                <div className="composer-header">
                  <h3>Add Comment</h3>
                </div>

                <div className="composer-content">
                  <div className="comment-input">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                      placeholder="Add a comment..."
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
                        {isAddingComment ? (
                          <>
                            <ButtonLoader variant="white" />
                            <span>Adding...</span>
                          </>
                        ) : (
                          "Add Comment"
                        )}
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
