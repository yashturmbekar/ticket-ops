/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  getTicketById,
  addComment,
  updateComment,
  uploadAttachment,
  updateTicket,
} from "../services/ticketService";
import { getAllHelpdeskDepartments } from "../services/helpdeskDepartmentService";
import { useEmployeeSearch } from "../hooks/useEmployeeSearch";
import { NotificationContext } from "../contexts/NotificationContext";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";
import { PRIORITY_LABELS } from "../constants/priorities";
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
  FaEdit,
  FaComments,
  FaTag,
  FaHistory,
  FaChevronLeft,
} from "react-icons/fa";
import { Loader, ButtonLoader } from "../components/common";
import "../styles/enhancedTicketDetails.css";

// API Response interface matching the backend structure
interface ApiTicketResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  ticketCode: string;
  priority: string;
  responseDueAt: string;
  resolutionDueAt: string;
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
    fileType?: string;
    fileData?: string;
    fileSize?: number;
    fileName?: string;
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
      fileType?: string;
      fileData?: string;
      fileSize?: number;
      fileName?: string;
    }>;
  }>;
}

// Simplified interfaces for the enhanced implementation
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
    fileType: string;
    fileData: string;
    fileSize: number;
    fileName: string;
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
    fileType?: string;
    fileData?: string;
    fileSize?: number;
    fileName?: string;
  }>;
}

interface CategoryOption {
  id: string;
  name: string;
  isActive: boolean;
}

const EnhancedTicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const notificationContext = useContext(NotificationContext);
  const { user } = useAuth();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [currentApiTicket, setCurrentApiTicket] = useState<ApiTicketResponse | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentAttachments, setCommentAttachments] = useState<File[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  // Editing states for role-based access
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  // Data for dropdowns
  const [departments, setDepartments] = useState<CategoryOption[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState("");
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  // Employee search hook
  const {
    results: employeeResults,
    loading: employeeLoading,
    search: searchEmployees,
  } = useEmployeeSearch();

  // Helper function to create ticket update payload
  const createTicketUpdatePayload = (
    currentApiTicket: ApiTicketResponse,
    updates: Partial<{
      assignedDepartmentId: string;
      assignedToEmployeeId: string | number | null;
      priority: string;
      status: string;
    }>
  ) => {
    const updatePayload: any = {
      id: currentApiTicket.id,
      title: currentApiTicket.title,
      description: currentApiTicket.description,
      status: updates.status || currentApiTicket.status,
      priority: updates.priority || currentApiTicket.priority,
      raisedByEmployeeId: currentApiTicket.raisedByEmployeeDetails?.id,
      assignedDepartmentId:
        updates.assignedDepartmentId || currentApiTicket.assignedDepartmentId,
      assignedToEmployeeId:
        updates.assignedToEmployeeId !== undefined
          ? updates.assignedToEmployeeId
          : currentApiTicket.assignedToEmployeeId,
      isActive: true,
      responseDueAt: currentApiTicket.responseDueAt,
      resolutionDueAt: currentApiTicket.resolutionDueAt,
    };

    Object.keys(updatePayload).forEach((key) => {
      if (updatePayload[key] === undefined || updatePayload[key] === null) {
        delete updatePayload[key];
      }
    });

    return updatePayload;
  };

  // Permission checking functions
  const canEditTicket = (): boolean => {
    if (!user || !ticket) return false;

    if (
      user.role === UserRole.ORG_ADMIN ||
      user.role === UserRole.HELPDESK_ADMIN
    ) {
      return true;
    }

    if (user.role === UserRole.MANAGER) {
      const userFullName = `${user.firstName} ${user.lastName}`;
      return ticket.assignedTo?.employeeName === userFullName;
    }

    return false;
  };

  // Update handlers (keeping same logic as original)
  const handleDepartmentChange = async (departmentId: string) => {
    if (!ticket || !id || !departmentId || !currentApiTicket) return;

    setIsSavingChanges(true);
    setSelectedDepartmentId(departmentId);

    try {
      const updatePayload = createTicketUpdatePayload(currentApiTicket, {
        assignedDepartmentId: departmentId,
      });

      await updateTicket(updatePayload);
      const updatedTicketResponse = await getTicketById(id);
      const updatedTicket: ApiTicketResponse = updatedTicketResponse;

      if (updatedTicket) {
        const transformedTicket = transformTicketData(updatedTicket);
        setTicket(transformedTicket);
        setCurrentApiTicket(updatedTicket);
        updateEditValues(updatedTicket);

        if (notificationContext) {
          notificationContext.success(
            "Department Updated",
            "Ticket department has been successfully updated."
          );
        }
      }
    } catch (error) {
      console.error("Error updating department:", error);
      if (notificationContext) {
        notificationContext.error(
          "Update Failed",
          "Failed to update ticket department. Please try again."
        );
      }
    } finally {
      setIsSavingChanges(false);
    }
  };

  const handleAssigneeChange = async (employee: any) => {
    if (!ticket || !id || !currentApiTicket) return;

    setIsSavingChanges(true);
    setAssigneeSearchQuery(employee.employeeName);
    setShowAssigneeDropdown(false);

    try {
      const wasUnassigned = !currentApiTicket.assignedToEmployeeId;
      const updateData: any = {
        assignedToEmployeeId: employee.id,
      };

      if (wasUnassigned) {
        updateData.status = "PENDING_APPROVAL";
      }

      const updatePayload = createTicketUpdatePayload(currentApiTicket, updateData);
      await updateTicket(updatePayload);

      const updatedTicketResponse = await getTicketById(id);
      const updatedTicket: ApiTicketResponse = updatedTicketResponse;

      if (updatedTicket) {
        const transformedTicket = transformTicketData(updatedTicket);
        setTicket(transformedTicket);
        setCurrentApiTicket(updatedTicket);
        updateEditValues(updatedTicket);

        if (notificationContext) {
          const statusMessage = wasUnassigned
            ? ` Status has been changed to Pending-Approval.`
            : "";
          notificationContext.success(
            "Assignee Updated",
            `Ticket has been assigned to ${employee.employeeName}.${statusMessage}`
          );
        }
      }
    } catch (error) {
      console.error("Error updating assignee:", error);
      if (notificationContext) {
        notificationContext.error(
          "Update Failed",
          "Failed to update ticket assignee. Please try again."
        );
      }
    } finally {
      setIsSavingChanges(false);
    }
  };

  const handleClearAssignee = () => {
    setAssigneeSearchQuery("");
    setShowAssigneeDropdown(true);

    if (ticket) {
      setTicket({
        ...ticket,
        assignedTo: undefined,
      });
    }
  };

  const handlePriorityChange = async (priority: string) => {
    if (!ticket || !id || !priority || !currentApiTicket) return;

    setIsSavingChanges(true);
    setSelectedPriority(priority);

    try {
      const updatePayload = createTicketUpdatePayload(currentApiTicket, {
        priority,
      });

      await updateTicket(updatePayload);
      const updatedTicketResponse = await getTicketById(id);
      const updatedTicket: ApiTicketResponse = updatedTicketResponse;

      if (updatedTicket) {
        const transformedTicket = transformTicketData(updatedTicket);
        setTicket(transformedTicket);
        setCurrentApiTicket(updatedTicket);
        updateEditValues(updatedTicket);

        if (notificationContext) {
          notificationContext.success(
            "Priority Updated",
            `Ticket priority has been changed to ${priority}.`
          );
        }
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      if (notificationContext) {
        notificationContext.error(
          "Update Failed",
          "Failed to update ticket priority. Please try again."
        );
      }
    } finally {
      setIsSavingChanges(false);
    }
  };

  // Helper functions
  const transformTicketData = (apiTicket: ApiTicketResponse): TicketData => {
    const mappedAttachments = apiTicket?.attachments?.map(
      (att: {
        filename: string;
        size: number;
        fileType?: string;
        fileData?: string;
        fileSize?: number;
        fileName?: string;
      }) => ({
        fileType:
          att.fileType ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        fileData: att.fileData || "",
        fileSize: att.fileSize || att.size,
        fileName: att.fileName || att.filename,
        filename: att.filename,
        size: att.size,
      })
    );

    return {
      id: apiTicket.id,
      ticketCode: apiTicket.ticketCode || `TKT-${apiTicket.id}`,
      title: apiTicket.title,
      description: apiTicket.description,
      status: apiTicket.status,
      priority: apiTicket.priority,
      requestedBy: {
        employeeName:
          apiTicket.raisedByEmployeeDetails?.employeeName || "Unknown User",
        designation:
          apiTicket.raisedByEmployeeDetails?.designation || "Unknown",
        id: apiTicket.raisedByEmployeeDetails?.id,
        profilePic: apiTicket.raisedByEmployeeDetails?.profilePic,
      },
      assignedTo: apiTicket.assignedToEmployeeDetails
        ? {
            employeeName: apiTicket.assignedToEmployeeDetails.employeeName,
            designation: apiTicket.assignedToEmployeeDetails.designation,
          }
        : undefined,
      department:
        apiTicket.helpdeskDepartmentDetails?.name || "Unknown Department",
      category: apiTicket.category || "General",
      subcategory: apiTicket.subcategory || "Other",
      dateCreated: apiTicket.createdDate,
      dateModified: apiTicket.lastModifiedDate,
      dueDate: apiTicket.slaDeadline,
      assetTag: apiTicket.assetTag,
      attachments: mappedAttachments || [],
    };
  };

  const updateEditValues = (apiTicket: ApiTicketResponse) => {
    setSelectedDepartmentId(apiTicket.assignedDepartmentId || "");
    setSelectedPriority(apiTicket.priority || "");
    if (apiTicket.assignedToEmployeeDetails) {
      setAssigneeSearchQuery(apiTicket.assignedToEmployeeDetails.employeeName);
    } else {
      setAssigneeSearchQuery("");
    }
  };

  // Load departments when component mounts
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await getAllHelpdeskDepartments();
        setDepartments(response || []);
      } catch (error) {
        console.error("Failed to load departments:", error);
      }
    };

    loadDepartments();
  }, []);

  // Handle employee search
  useEffect(() => {
    if (assigneeSearchQuery.length > 0) {
      searchEmployees(assigneeSearchQuery);
    }
  }, [assigneeSearchQuery, searchEmployees]);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".assignee-search-container")) {
        setShowAssigneeDropdown(false);
      }
    };

    if (showAssigneeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAssigneeDropdown]);

  // Function to transform API comments to CommentData format
  const transformComments = (
    apiComments: ApiTicketResponse["comments"]
  ): CommentData[] => {
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
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  };

  // Function to check if current user can edit a comment
  const canEditComment = (comment: CommentData): boolean => {
    if (comment.author === "System") return false;
    if (!user?.id) return false;
    return comment.commenterEmployeeId === parseInt(user.id);
  };

  // Comment editing functions
  const startEditComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentContent);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editingCommentText.trim() || !id) return;

    setIsUpdatingComment(true);
    try {
      await updateComment(
        id,
        editingCommentId,
        editingCommentText.trim(),
        user?.id ? parseInt(user.id) : undefined
      );

      const updatedTicketResponse = await getTicketById(id);
      const updatedTicket: ApiTicketResponse = updatedTicketResponse;

      if (updatedTicket) {
        const updatedComments = transformComments(updatedTicket.comments);
        setComments(updatedComments);
      }

      setEditingCommentId(null);
      setEditingCommentText("");

      if (notificationContext) {
        notificationContext.success(
          "Comment Updated",
          "Your comment has been updated successfully."
        );
      }
    } catch (error) {
      console.error("Error updating comment:", error);

      if (notificationContext) {
        notificationContext.error(
          "Error Updating Comment",
          "Failed to update comment. Please try again."
        );
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
        const foundTicket: ApiTicketResponse = ticketResponse;
        
        if (foundTicket) {
          const transformedTicket = transformTicketData(foundTicket);
          setTicket(transformedTicket);
          setCurrentApiTicket(foundTicket);
          updateEditValues(foundTicket);

          sessionStorage.setItem(
            `ticketCode_${id}`,
            transformedTicket.ticketCode
          );

          const transformedComments = transformComments(foundTicket.comments);
          setComments(transformedComments);
        } else {
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

  // Handle keyboard events for image modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedImage) {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Utility functions
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
    const ext = filename?.split(".").pop()?.toLowerCase();
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
        return <FaFilePowerpoint className="file-icon powerpoint" size={iconSize} />;
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

  // Comment handling functions
  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;

    setIsAddingComment(true);
    try {
      const response = await addComment(id, newComment.trim());
      const newCommentId = response?.id;
      
      if (!newCommentId) {
        throw new Error("Comment ID not returned from addComment API");
      }

      const uploadedAttachments: Array<{ filename: string; size: number }> = [];

      if (commentAttachments.length > 0) {
        for (const file of commentAttachments) {
          try {
            await uploadAttachment(file, newCommentId);
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

      const updatedTicketResponse = await getTicketById(id);
      const updatedTicket: ApiTicketResponse = updatedTicketResponse;

      if (updatedTicket) {
        const updatedComments = transformComments(updatedTicket.comments);
        setComments(updatedComments);
      }

      setNewComment("");
      setCommentAttachments([]);

      if (notificationContext) {
        const message =
          uploadedAttachments.length > 0
            ? `Comment added with ${uploadedAttachments.length} attachment(s).`
            : "Your comment has been added successfully.";
        notificationContext.success("Comment Added", message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
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

  const handleCommentAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const validFiles: File[] = [];
      let totalSize = 0;

      for (const file of newFiles) {
        if (file.size > 10 * 1024 * 1024) {
          if (notificationContext) {
            notificationContext.error(
              "File Size Exceeded",
              `File "${file.name}" exceeds 10MB limit. Please choose a smaller file.`
            );
          }
          continue;
        }
        totalSize += file.size;
        if (totalSize > 30 * 1024 * 1024) {
          if (notificationContext) {
            notificationContext.error(
              "Total File Size Exceeded",
              "The total size of attachments for this comment exceeds 30MB. Please reduce the size of some files or remove them."
            );
          }
          break;
        }
        if (validFiles.length >= 3) {
          if (notificationContext) {
            notificationContext.error(
              "Too Many Attachments",
              "You can only attach a maximum of 3 files per comment."
            );
          }
          break;
        }
        validFiles.push(file);
      }

      setCommentAttachments((prev) => [...prev, ...validFiles]);
    }
    event.target.value = "";
  };

  const removeCommentAttachment = (index: number) => {
    setCommentAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  function downloadAttachment(fileName: string, fileData: string, fileType: string) {
    const link = document.createElement("a");
    link.href = `data:${fileType};base64,${fileData}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getAttachmentPreview(fileName: string, fileData: string, fileType: string) {
    if (fileType.startsWith("image/")) {
      return (
        <img
          src={`data:${fileType};base64,${fileData}`}
          alt={fileName}
          className="attachment-preview-image"
          onClick={() =>
            setSelectedImage({
              src: `data:${fileType};base64,${fileData}`,
              alt: fileName,
            })
          }
        />
      );
    }
    return getFileIcon(fileName, 40);
  }

  // Comment attachment previews
  const [commentAttachmentPreviews, setCommentAttachmentPreviews] = React.useState<string[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    const loadPreviews = async () => {
      const newPreviews: string[] = [];
      await Promise.all(
        commentAttachments.map((file, i) => {
          return new Promise<void>((resolve) => {
            if (file.type.startsWith("image/")) {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (isMounted) newPreviews[i] = e.target?.result as string;
                resolve();
              };
              reader.readAsDataURL(file);
            } else {
              newPreviews[i] = "";
              resolve();
            }
          });
        })
      );
      if (isMounted) setCommentAttachmentPreviews(newPreviews);
    };
    loadPreviews();
    return () => { isMounted = false; };
  }, [commentAttachments]);

  if (loading) {
    return (
      <Loader centered text="Loading ticket details..." minHeight="60vh" />
    );
  }

  if (!ticket) {
    return (
      <div className="enhanced-ticket-error">
        <FaExclamationTriangle />
        <span>Ticket not found</span>
      </div>
    );
  }

  return (
    <div className="enhanced-ticket-details-page">
      {/* Enhanced Header */}
      <div className="enhanced-page-header">
        <div className="header-left">
          <button className="back-button" onClick={() => window.history.back()}>
            <FaChevronLeft />
            <span>Back</span>
          </button>
          <div className="page-title-section">
            <div className="page-icon">
              <FaTicketAlt />
            </div>
            <div>
              <h1 className="page-title">Ticket Details</h1>
              <div className="page-breadcrumb">
                <span>IT Support</span>
                <span className="breadcrumb-separator">•</span>
                <span>Tickets</span>
                <span className="breadcrumb-separator">•</span>
                <span className="current-page">{ticket.ticketCode}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <div className="ticket-status-badges">
            <span className={`status-badge status-${ticket.status.toLowerCase().replace('_', '-')}`}>
              {ticket.status.replace('_', ' ')}
            </span>
            <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
              {ticket.priority} Priority
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="enhanced-page-content">
        <div className="content-grid">
          
          {/* Left Column - Main Information */}
          <div className="main-column">
            
            {/* Ticket Overview Card */}
            <div className="enhanced-card ticket-overview-card">
              <div className="card-header">
                <div className="header-title">
                  <FaTicketAlt className="header-icon" />
                  <h2>Ticket Overview</h2>
                </div>
              </div>
              <div className="card-content">
                <div className="ticket-main-info">
                  <div className="ticket-code-display">
                    {ticket.ticketCode}
                  </div>
                  <h1 className="ticket-title">{ticket.title}</h1>
                  <div className="ticket-description">
                    <p>{ticket.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requester Information Card */}
            <div className="enhanced-card requester-card">
              <div className="card-header">
                <div className="header-title">
                  <FaUser className="header-icon" />
                  <h2>Requester Information</h2>
                </div>
              </div>
              <div className="card-content">
                <div className="requester-profile">
                  <div className="profile-avatar">
                    {ticket.requestedBy.profilePic ? (
                      <img
                        src={`data:${ticket.requestedBy.profilePic};base64,${ticket.requestedBy.profilePic}`}
                        alt={ticket.requestedBy.employeeName}
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {ticket.requestedBy.employeeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="profile-info">
                    <h3 className="profile-name">{ticket.requestedBy.employeeName}</h3>
                    <p className="profile-designation">{ticket.requestedBy.designation}</p>
                    <div className="profile-meta">
                      <div className="meta-item">
                        <FaCalendarAlt className="meta-icon" />
                        <span>Created: {formatDate(ticket.dateCreated)}</span>
                      </div>
                      <div className="meta-item">
                        <FaClock className="meta-icon" />
                        <span>Updated: {formatDate(ticket.dateModified)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments Card */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="enhanced-card attachments-card">
                <div className="card-header">
                  <div className="header-title">
                    <FaPaperclip className="header-icon" />
                    <h2>Attachments ({ticket.attachments.length})</h2>
                  </div>
                </div>
                <div className="card-content">
                  <div className="attachments-grid">
                    {ticket.attachments.map((attachment, index) => (
                      <div key={index} className="attachment-item">
                        <div className="attachment-preview">
                          {getAttachmentPreview(
                            attachment.fileName,
                            attachment.fileData,
                            attachment.fileType
                          )}
                        </div>
                        <div className="attachment-info">
                          <div className="attachment-name" title={attachment.fileName}>
                            {attachment.fileName}
                          </div>
                          <div className="attachment-size">
                            {formatFileSize(attachment.fileSize)}
                          </div>
                          <button
                            onClick={() =>
                              downloadAttachment(
                                attachment.fileName,
                                attachment.fileData,
                                attachment.fileType
                              )
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
              </div>
            )}

            {/* Activity Timeline Card */}
            <div className="enhanced-card activity-card">
              <div className="card-header">
                <div className="header-title">
                  <FaComments className="header-icon" />
                  <h2>Activity Timeline</h2>
                </div>
                <div className="activity-stats">
                  <span className="comment-count">{comments.length} Comments</span>
                </div>
              </div>
              <div className="card-content">
                <div className="timeline">
                  {comments.length === 0 ? (
                    <div className="empty-timeline">
                      <FaComments className="empty-icon" />
                      <h3>No comments yet</h3>
                      <p>Be the first to add a comment to this ticket!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="timeline-item">
                        <div className="timeline-avatar">
                          <FaUser />
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <div className="comment-author">
                              <span className="author-name">{comment.author}</span>
                              <span className="comment-time">
                                {formatDate(comment.timestamp)}
                              </span>
                            </div>
                            {canEditComment(comment) && (
                              <button
                                className="edit-comment-btn"
                                onClick={() => startEditComment(comment.id, comment.content)}
                                title="Edit comment"
                              >
                                <FaEdit />
                              </button>
                            )}
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
                                <div className="edit-actions">
                                  <button
                                    onClick={handleUpdateComment}
                                    disabled={!editingCommentText.trim() || isUpdatingComment}
                                    className="save-btn"
                                  >
                                    {isUpdatingComment ? (
                                      <>
                                        <ButtonLoader variant="white" />
                                        Save
                                      </>
                                    ) : (
                                      "Save"
                                    )}
                                  </button>
                                  <button
                                    onClick={cancelEditComment}
                                    disabled={isUpdatingComment}
                                    className="cancel-btn"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="comment-content">{comment.content}</p>
                            )}
                            
                            {/* Comment Attachments */}
                            {comment.attachments && comment.attachments.length > 0 && (
                              <div className="comment-attachments">
                                {comment.attachments.map((attachment: any, index) => {
                                  const fileName = "fileName" in attachment ? attachment.fileName : attachment.filename;
                                  const fileType = "fileType" in attachment ? attachment.fileType : "";
                                  const fileSize = "fileSize" in attachment ? attachment.fileSize : attachment.size || 0;
                                  const fileData = "fileData" in attachment ? attachment.fileData : "";
                                  const ext = fileName?.split(".").pop()?.toLowerCase();
                                  const isImage = (fileType && fileType.startsWith("image/")) || 
                                    ["jpg", "jpeg", "png", "gif", "bmp"].includes(ext || "");
                                  
                                  return (
                                    <div key={index} className="comment-attachment-item">
                                      {isImage && fileData && fileType ? (
                                        <img
                                          src={`data:${fileType};base64,${fileData}`}
                                          alt={fileName}
                                          className="attachment-image"
                                          onClick={() =>
                                            setSelectedImage({
                                              src: `data:${fileType};base64,${fileData}`,
                                              alt: fileName,
                                            })
                                          }
                                        />
                                      ) : (
                                        getFileIcon(fileName, 24)
                                      )}
                                      <div className="attachment-details">
                                        <span className="attachment-name">{fileName}</span>
                                        <span className="attachment-size">({formatFileSize(fileSize)})</span>
                                      </div>
                                      <button
                                        className="download-attachment-btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (fileData && fileType) {
                                            downloadAttachment(fileName, fileData, fileType);
                                          }
                                        }}
                                        disabled={!fileData || !fileType}
                                      >
                                        <FaDownload />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Add Comment Card */}
            <div className="enhanced-card comment-composer-card">
              <div className="card-header">
                <div className="header-title">
                  <FaEdit className="header-icon" />
                  <h2>Add Comment</h2>
                </div>
              </div>
              <div className="card-content">
                <div className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                    placeholder="Add a comment... (Ctrl+Enter to submit)"
                    rows={4}
                    className="comment-textarea"
                  />
                  
                  <div className="comment-toolbar">
                    <div className="toolbar-left">
                      <label className="attachment-btn">
                        <FaPaperclip />
                        Attach Files
                        <input
                          type="file"
                          multiple
                          onChange={handleCommentAttachment}
                          className="file-input-hidden"
                        />
                      </label>
                    </div>
                    <div className="toolbar-right">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isAddingComment}
                        className="submit-comment-btn"
                      >
                        {isAddingComment ? (
                          <>
                            <ButtonLoader variant="white" />
                            Adding...
                          </>
                        ) : (
                          "Add Comment"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Selected Files Preview */}
                  {commentAttachments.length > 0 && (
                    <div className="selected-files">
                      {commentAttachments.map((file, index) => {
                        const isImage = file.type.startsWith("image/");
                        const imagePreview = commentAttachmentPreviews[index];
                        return (
                          <div key={index} className="selected-file">
                            <div className="file-preview">
                              {isImage && imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt={file.name}
                                  className="preview-image"
                                  onClick={() =>
                                    setSelectedImage({
                                      src: imagePreview,
                                      alt: file.name,
                                    })
                                  }
                                />
                              ) : (
                                getFileIcon(file.name)
                              )}
                              <div className="file-info">
                                <div className="file-name">{file.name}</div>
                                <div className="file-size">{formatFileSize(file.size)}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeCommentAttachment(index)}
                              className="remove-file-btn"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Assignment & Info */}
          <div className="sidebar-column">
            
            {/* Assignment Card */}
            <div className="enhanced-card assignment-card">
              <div className="card-header">
                <div className="header-title">
                  <FaUserTie className="header-icon" />
                  <h2>Assignment & Status</h2>
                </div>
              </div>
              <div className="card-content">
                <div className="assignment-fields">
                  
                  {/* Department */}
                  <div className="field-group">
                    <label className="field-label">
                      <FaBuilding className="label-icon" />
                      Department
                    </label>
                    <div className="field-content">
                      {canEditTicket() ? (
                        <div className="field-with-loader">
                          <select
                            value={selectedDepartmentId}
                            onChange={(e) => handleDepartmentChange(e.target.value)}
                            className="enhanced-select"
                            disabled={isSavingChanges}
                          >
                            <option value="">Select Department...</option>
                            {departments
                              .filter((dept) => dept.isActive)
                              .map((department) => (
                                <option key={department.id} value={department.id}>
                                  {department.name}
                                </option>
                              ))}
                          </select>
                          {isSavingChanges && (
                            <div className="field-loader">
                              <ButtonLoader variant="primary" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="field-display">
                          <FaBuilding className="display-icon" />
                          <span>{ticket.department}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="field-group">
                    <label className="field-label">
                      <FaUserTie className="label-icon" />
                      Assigned To
                    </label>
                    <div className="field-content">
                      {canEditTicket() ? (
                        <div className="field-with-loader">
                          <div className="assignee-search">
                            {ticket.assignedTo && !showAssigneeDropdown ? (
                              <div
                                className="assigned-display"
                                onClick={() => setShowAssigneeDropdown(true)}
                              >
                                <span className="assigned-name">
                                  {ticket.assignedTo.employeeName}
                                </span>
                                <button
                                  type="button"
                                  className="clear-assignee-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClearAssignee();
                                  }}
                                  title="Clear assignee"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ) : (
                              <div className="assignee-search-container">
                                <input
                                  type="text"
                                  value={assigneeSearchQuery}
                                  onChange={(e) => {
                                    setAssigneeSearchQuery(e.target.value);
                                    setShowAssigneeDropdown(true);
                                  }}
                                  onFocus={() => setShowAssigneeDropdown(true)}
                                  placeholder="Search and select employee..."
                                  className="enhanced-input"
                                  disabled={isSavingChanges}
                                />
                                {showAssigneeDropdown && assigneeSearchQuery && (
                                  <div className="search-dropdown">
                                    {employeeLoading && (
                                      <div className="dropdown-item loading">
                                        <ButtonLoader variant="primary" />
                                        <span>Searching employees...</span>
                                      </div>
                                    )}
                                    {!employeeLoading && employeeResults.length === 0 && (
                                      <div className="dropdown-item no-results">
                                        <span>No employees found</span>
                                      </div>
                                    )}
                                    {!employeeLoading &&
                                      employeeResults.map((employee) => (
                                        <div
                                          key={employee.id}
                                          className="dropdown-item employee-item"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleAssigneeChange(employee);
                                          }}
                                        >
                                          <div className="employee-info">
                                            <div className="employee-name">
                                              {employee.employeeName}
                                            </div>
                                            <div className="employee-meta">
                                              {employee.designation} • {employee.departmentName}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          {isSavingChanges && (
                            <div className="field-loader">
                              <ButtonLoader variant="primary" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="field-display">
                          {ticket.assignedTo ? (
                            <>
                              <FaUserTie className="display-icon" />
                              <div className="assignee-info">
                                <div className="assignee-name">{ticket.assignedTo.employeeName}</div>
                                <div className="assignee-designation">{ticket.assignedTo.designation}</div>
                              </div>
                            </>
                          ) : (
                            <>
                              <FaUserTie className="display-icon unassigned" />
                              <span className="unassigned-text">Unassigned</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="field-group">
                    <label className="field-label">
                      <FaExclamationTriangle className="label-icon" />
                      Priority
                    </label>
                    <div className="field-content">
                      {canEditTicket() ? (
                        <div className="field-with-loader">
                          <select
                            value={selectedPriority}
                            onChange={(e) => handlePriorityChange(e.target.value)}
                            className="enhanced-select"
                            disabled={isSavingChanges}
                          >
                            <option value="">Select Priority...</option>
                            {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ))}
                          </select>
                          {isSavingChanges && (
                            <div className="field-loader">
                              <ButtonLoader variant="primary" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="field-display">
                          <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                            {ticket.priority} Priority
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="field-group">
                    <label className="field-label">
                      <FaClock className="label-icon" />
                      Status
                    </label>
                    <div className="field-content">
                      <div className="field-display">
                        <span className={`status-badge status-${ticket.status.toLowerCase().replace('_', '-')}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Asset Tag */}
                  {ticket.assetTag && (
                    <div className="field-group">
                      <label className="field-label">
                        <FaTag className="label-icon" />
                        Asset Tag
                      </label>
                      <div className="field-content">
                        <div className="field-display">
                          <span>{ticket.assetTag}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Timeline Info Card */}
            <div className="enhanced-card timeline-info-card">
              <div className="card-header">
                <div className="header-title">
                  <FaHistory className="header-icon" />
                  <h2>Timeline</h2>
                </div>
              </div>
              <div className="card-content">
                <div className="timeline-info">
                  <div className="info-item">
                    <FaCalendarAlt className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Created</span>
                      <span className="info-value">{formatDate(ticket.dateCreated)}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaClock className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Last Modified</span>
                      <span className="info-value">{formatDate(ticket.dateModified)}</span>
                    </div>
                  </div>
                  {ticket.dueDate && (
                    <div className="info-item">
                      <FaExclamationTriangle className="info-icon" />
                      <div className="info-content">
                        <span className="info-label">Due Date</span>
                        <span className="info-value">{formatDate(ticket.dueDate)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="enhanced-image-modal" onClick={() => setSelectedImage(null)}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes />
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <div className="image-modal-title">{selectedImage.alt}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTicketDetailsPage;
