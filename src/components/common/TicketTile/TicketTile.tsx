import React, { useState } from "react";
import {
  FaUser,
  FaBuilding,
  FaComments,
  FaClock,
  FaCheckCircle,
  FaPlayCircle,
  FaTimesCircle,
  FaPauseCircle,
  FaExclamationCircle,
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
  const [showTitleTooltip, setShowTitleTooltip] = useState(false);
  const [showDescTooltip, setShowDescTooltip] = useState(false);

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

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, "");
    switch (normalizedStatus) {
      case "open":
      case "raised":
        return <FaExclamationCircle />;
      case "inprogress":
        return <FaPlayCircle />;
      case "resolved":
        return <FaCheckCircle />;
      case "closed":
        return <FaTimesCircle />;
      case "onhold":
      case "pendingapproval":
        return <FaPauseCircle />;
      default:
        return <FaExclamationCircle />;
    }
  };

  const formatStatusText = (status: string): string => {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
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
        text: `${Math.round(diffHours)}h`,
      };
    } else if (diffHours < 48) {
      return {
        status: "warning",
        color: "#ffc107",
        text: `${Math.round(diffHours / 24)}d`,
      };
    }

    return { status: "normal", color: "#28a745", text: "OK" };
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

      {/* Title and Description - Priority Section */}
      <div className="tile-content-priority">
        <div
          className="title-container"
          onMouseEnter={() => setShowTitleTooltip(true)}
          onMouseLeave={() => setShowTitleTooltip(false)}
        >
          <h3 className="tile-title">{ticket.title}</h3>
          {showTitleTooltip && (
            <div className="tooltip title-tooltip">{ticket.title}</div>
          )}
        </div>
        <div
          className="description-container"
          onMouseEnter={() => setShowDescTooltip(true)}
          onMouseLeave={() => setShowDescTooltip(false)}
        >
          <p className="tile-description">{ticket.description}</p>
          {showDescTooltip && (
            <div className="tooltip description-tooltip">
              {ticket.description}
            </div>
          )}
        </div>
      </div>

      {/* Compact Assignment Info */}
      <div className="assignment-info-compact">
        <div className="assignee-info-compact">
          <div className="assignee-avatar-small">
            <FaUser />
          </div>
          <span className="assignee-name-small">{assigneeName}</span>
        </div>
        <div className="department-info-compact">
          <FaBuilding />
          <span className="department-name-small">{departmentName}</span>
        </div>
      </div>

      {/* Status and Metadata */}
      <div className="tile-metadata">
        <div className="status-info">
          <div
            className="status-badge"
            style={{ backgroundColor: statusColor }}
          >
            {getStatusIcon(ticket.status)}
            <span className="status-text">
              {formatStatusText(ticket.status)}
            </span>
          </div>
        </div>
        <div className="time-info">
          <FaClock />
          <span>{formatTimeAgo(ticket.createdAt)}</span>
        </div>
      </div>

      {/* Counts and SLA */}
      <div className="tile-footer">
        <div className="counts">
          <div className="count-item">
            <FaComments />
            <span>{ticket.commentCount || 0}</span>
          </div>
          {/* <div className="count-item">
            <FaPaperclip />
            <span>{ticket.attachmentCount || 0}</span>
          </div> */}
        </div>

        {slaStatus && (
          <div className="sla-indicator">
            <div
              className="sla-dot"
              style={{ backgroundColor: slaStatus.color }}
            />
            <span className="sla-text" style={{ color: slaStatus.color }}>
              {slaStatus.text}
            </span>
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
