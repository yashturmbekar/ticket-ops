import React from "react";
import {
  FaUser,
  FaBuilding,
  FaComments,
  FaPaperclip,
  FaClock,
  FaExclamationTriangle,
  FaCircle,
} from "react-icons/fa";
import "./TicketTile.css";

export interface TicketTileData {
  id: string;
  ticketCode?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: string;
  assignedToDetails?: {
    employeeName: string;
    designation: string;
  };
  department?: string;
  helpdeskDepartmentDetails?: {
    name: string;
  };
  createdAt: string;
  slaDeadline?: string;
  commentCount?: number;
  attachmentCount?: number;
  tags?: string[];
}

export interface TicketTileProps {
  ticket: TicketTileData;
  isSelected?: boolean;
  showCheckbox?: boolean;
  onClick?: (ticketId: string) => void;
  onSelect?: (ticketId: string) => void;
  compact?: boolean;
}

export const TicketTile: React.FC<TicketTileProps> = ({
  ticket,
  isSelected = false,
  showCheckbox = false,
  onClick,
  onSelect,
  compact = false,
}) => {
  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "#dc2626"; // Enhanced red
      case "high":
        return "#ea580c"; // Enhanced orange
      case "medium":
        return "#d97706"; // Enhanced amber
      case "low":
        return "#16a34a"; // Enhanced green
      default:
        return "#64748b"; // Enhanced gray
    }
  };

  const getStatusColor = (status: string): string => {
    const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, "");
    switch (normalizedStatus) {
      case "open":
      case "raised":
        return "#3b82f6"; // Blue
      case "inprogress":
        return "#8b5cf6"; // Purple
      case "resolved":
        return "#10b981"; // Emerald
      case "closed":
        return "#6b7280"; // Gray
      case "onhold":
      case "pendingapproval":
        return "#f59e0b"; // Amber
      default:
        return "#6b7280"; // Gray
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return "Just now";
    }
  };

  const getSLAStatus = (slaDeadline?: string) => {
    if (!slaDeadline) return null;

    const deadline = new Date(slaDeadline);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMs < 0) {
      return { status: "overdue", color: "#dc3545", text: "Overdue" };
    } else if (diffHours < 24) {
      return {
        status: "critical",
        color: "#fd7e14",
        text: `${Math.round(diffHours)}h left`,
      };
    } else if (diffHours < 48) {
      return {
        status: "warning",
        color: "#ffc107",
        text: `${Math.round(diffHours / 24)}d left`,
      };
    }

    return { status: "normal", color: "#28a745", text: "On track" };
  };

  const slaStatus = getSLAStatus(ticket.slaDeadline);
  const priorityColor = getPriorityColor(ticket.priority);
  const statusColor = getStatusColor(ticket.status);
  const assigneeName =
    ticket.assignedToDetails?.employeeName || ticket.assignedTo || "Unassigned";
  const departmentName =
    ticket.helpdeskDepartmentDetails?.name || ticket.department || "Unknown";

  const handleTileClick = () => {
    if (onClick) {
      onClick(ticket.id);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(ticket.id);
    }
  };

  return (
    <div
      className={`professional-ticket-tile ${isSelected ? "selected" : ""} ${
        compact ? "compact" : ""
      }`}
      onClick={handleTileClick}
      style={
        {
          "--priority-color": priorityColor,
          "--status-color": statusColor,
        } as React.CSSProperties
      }
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTileClick();
        }
      }}
    >
      {/* Priority Bar */}
      <div
        className="priority-bar"
        style={{ backgroundColor: priorityColor }}
      />

      {/* Header */}
      <div className="tile-header">
        <div className="header-left">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="tile-checkbox"
            />
          )}
          <span className="ticket-code">
            {ticket.ticketCode || `TKT-${ticket.id.slice(0, 8)}`}
          </span>
        </div>
        <div className="header-right">
          <span
            className="priority-badge"
            style={{ backgroundColor: priorityColor }}
          >
            {ticket.priority}
          </span>
        </div>
      </div>

      {/* Title and Description */}
      <div className="tile-content">
        <h3 className="tile-title">{ticket.title}</h3>
        <p className="tile-description">{ticket.description}</p>
      </div>

      {/* Assignment Info */}
      <div className="assignment-info">
        <div className="assignee-info">
          <div className="assignee-avatar">
            <FaUser />
          </div>
          <div className="assignee-details">
            <span className="assignee-name">{assigneeName}</span>
            {ticket.assignedToDetails?.designation && (
              <span className="assignee-designation">
                {ticket.assignedToDetails.designation}
              </span>
            )}
          </div>
        </div>
        <div className="department-info">
          <FaBuilding />
          <span className="department-name">{departmentName}</span>
        </div>
      </div>

      {/* Status and Metadata */}
      <div className="tile-metadata">
        <div className="status-info">
          <FaCircle
            className="status-indicator"
            style={{ color: statusColor }}
          />
          <span className="status-text">{ticket.status}</span>
        </div>
        <div className="time-info">
          <FaClock />
          <span>{formatTimeAgo(ticket.createdAt)}</span>
        </div>
      </div>

      {/* Counts and SLA */}
      <div className="tile-footer">
        <div className="counts">
          {(ticket.commentCount || 0) > 0 && (
            <div className="count-item">
              <FaComments />
              <span>{ticket.commentCount}</span>
            </div>
          )}
          {(ticket.attachmentCount || 0) > 0 && (
            <div className="count-item">
              <FaPaperclip />
              <span>{ticket.attachmentCount}</span>
            </div>
          )}
        </div>

        {slaStatus && (
          <div className="sla-status">
            <FaExclamationTriangle style={{ color: slaStatus.color }} />
            <span style={{ color: slaStatus.color }}>{slaStatus.text}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {ticket.tags && ticket.tags.length > 0 && (
        <div className="tile-tags">
          {ticket.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="tile-tag">
              {tag}
            </span>
          ))}
          {ticket.tags.length > 2 && (
            <span className="tile-tag-more">+{ticket.tags.length - 2}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketTile;
