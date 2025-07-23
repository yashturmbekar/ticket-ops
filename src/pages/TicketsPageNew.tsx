import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTicketAlt,
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaBan,
} from "react-icons/fa";
import { Loader, TicketTile } from "../components/common";
import type { Ticket, TicketStatus, Priority } from "../types";

// Extended ticket type for displaying API data
type DisplayTicket = Ticket & {
  ticketCode?: string;
  assignedToDetails?: {
    employeeName: string;
    designation: string;
  };
};
import { searchMyTickets } from "../services/ticketService";
import { searchHelpdeskDepartments } from "../services/helpdeskDepartmentService";
import type { HelpdeskDepartment } from "../services/helpdeskDepartmentService";
import { useNotifications } from "../hooks/useNotifications";
import { transformApiTicketsToTickets } from "../utils/apiTransforms";
import "../styles/ticketsModern.css";

interface TicketsFilter {
  status: string;
  priority: string;
  department: string;
  assignee: string;
  search: string;
}

interface DepartmentSearchItem {
  department: HelpdeskDepartment;
  employees: unknown[];
}

export const TicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [departments, setDepartments] = useState<HelpdeskDepartment[]>([]);
  const [loading, setLoading] = useState(true); // Initial page load
  const [searchLoading, setSearchLoading] = useState(false); // Search/filter operations
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"tiles" | "list">("tiles");

  const [filters, setFilters] = useState<TicketsFilter>({
    status: "",
    priority: "",
    department: "",
    assignee: "",
    search: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Use search endpoint with empty criteria to get all active departments
        const response = await searchHelpdeskDepartments({}, 0, 50, "id,desc");

        console.log("Department API Response:", response);
        console.log("Response data:", response.data);

        // Extract departments from the response structure
        const departmentItems = response.data?.items || response.items || [];
        console.log("Department items:", departmentItems);

        const departmentList = departmentItems
          .map((item: DepartmentSearchItem) => item.department)
          .filter((dept: HelpdeskDepartment) => dept && dept.isActive);

        console.log("Filtered department list:", departmentList);
        setDepartments(departmentList);
      } catch (error) {
        console.error("Error loading departments:", error);
        addNotification({
          type: "error",
          title: "Failed to Load Departments",
          message: "Failed to load departments for filtering",
        });
      }
    };

    fetchDepartments();
  }, [addNotification]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Use searchLoading for subsequent searches, loading only for initial load
        if (loading) {
          // This is the initial load
        } else {
          setSearchLoading(true);
        }

        // Prepare search criteria for real API
        const searchCriteria: Record<string, unknown> = {};

        // Add filters to search criteria - use correct field names from API interface
        if (filters.status) {
          searchCriteria.status = filters.status;
        }
        if (filters.priority) {
          searchCriteria.priority = filters.priority.toUpperCase();
        }
        if (filters.department) {
          // Find department ID by name
          const selectedDept = departments.find(
            (dept) => dept.name === filters.department
          );
          if (selectedDept) {
            searchCriteria.assignedDepartmentId = selectedDept.id;
          }
        }
        if (filters.assignee) {
          searchCriteria.assignedTo = filters.assignee;
        }
        if (debouncedSearch.trim()) {
          // Try simple title search first
          searchCriteria.title = debouncedSearch.trim();
        }

        console.log("Search criteria:", searchCriteria);

        // Call the actual API
        const response = await searchMyTickets(
          searchCriteria,
          0,
          50,
          "createdDate,desc"
        );

        console.log("API Response:", response);

        // Extract tickets from response - API returns 'items' array
        const apiTickets = response.data?.items || response.items || [];

        // Transform API response to internal format
        const transformedTickets = transformApiTicketsToTickets(apiTickets);
        setTickets(transformedTickets);
      } catch (error: unknown) {
        console.error("Error loading tickets:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        addNotification({
          type: "error",
          title: "Failed to Load Tickets",
          message: `Failed to load tickets: ${errorMessage}`,
        });
      } finally {
        if (loading) {
          setLoading(false); // Only set main loading to false after initial load
        }
        setSearchLoading(false);
      }
    };

    fetchTickets();
  }, [
    filters.status,
    filters.priority,
    filters.department,
    filters.assignee,
    debouncedSearch,
    departments,
    addNotification,
    loading,
  ]);

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "RAISED":
        return <FaExclamationTriangle />;
      case "IN_PROGRESS":
        return <FaSpinner />;
      case "PENDING_APPROVAL":
        return <FaClock />;
      case "RESOLVED":
        return <FaCheckCircle />;
      case "APPROVED":
        return <FaCheckCircle />;
      case "REJECTED":
        return <FaBan />;
      default:
        return <FaTicketAlt />;
    }
  };

  const getPriorityClass = (priority: Priority): string => {
    return priority.toLowerCase();
  };

  const getStatusClass = (status: TicketStatus): string => {
    return status;
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getSLAStatus = (deadline: Date): { status: string; text: string } => {
    const now = new Date();
    const hoursUntilDeadline =
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDeadline < 0) {
      return { status: "critical", text: "Overdue" };
    } else if (hoursUntilDeadline < 2) {
      return { status: "warning", text: "Due soon" };
    } else {
      return { status: "good", text: "On track" };
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === tickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map((ticket) => ticket.id));
    }
  };

  // Since we're filtering on the backend via API, no need for client-side filtering
  const filteredTickets = tickets;

  if (loading) {
    return <Loader centered text="Loading tickets..." minHeight="60vh" />;
  }

  return (
    <div className="tickets-page">
      {/* Page Title */}
      <div className="tickets-page-header">
        <div className="tickets-page-title-section">
          <h1 className="tickets-page-title">Support Tickets</h1>
          <p className="tickets-page-subtitle">
            Manage and track all support requests and incidents
          </p>
        </div>
        <div className="tickets-page-actions">
          <Link to="/tickets/create" className="btn btn-primary">
            <FaPlus />
            <span>Create Ticket</span>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="tickets-toolbar">
        <div className="tickets-search">
          <div className="search-input-container">
            <FaSearch />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="search-input"
            />
          </div>
        </div>

        <div className="tickets-filters">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="RAISED">Raised</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="RESOLVED">Resolved</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priority: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={filters.department}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, department: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="tickets-view-toggle">
          <button
            className={`view-toggle-btn ${
              viewMode === "tiles" ? "active" : ""
            }`}
            onClick={() => setViewMode("tiles")}
          >
            Tiles
          </button>
          <button
            className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="tickets-results-info">
        <div className="results-count">
          Showing {filteredTickets.length} of {tickets.length} tickets
          {searchLoading && (
            <span className="search-indicator"> (searching...)</span>
          )}
        </div>

        {selectedTickets.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedTickets.length} selected</span>
            <button className="btn btn-sm btn-secondary">Assign</button>
            <button className="btn btn-sm btn-secondary">Update Status</button>
            <button className="btn btn-sm btn-secondary">Export</button>
          </div>
        )}
      </div>

      {/* Tickets Grid/List */}
      <div className={`tickets-container ${viewMode}`}>
        {viewMode === "tiles" ? (
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => {
              return (
                <TicketTile
                  key={ticket.id}
                  ticket={{
                    id: ticket.id,
                    ticketCode: (ticket as DisplayTicket).ticketCode,
                    title: ticket.title,
                    description: ticket.description,
                    status: ticket.status,
                    priority: ticket.priority,
                    assignedTo: ticket.assignedTo,
                    assignedToDetails: (ticket as DisplayTicket)
                      .assignedToDetails,
                    department: ticket.assignedDepartmentName,
                    createdAt: ticket.createdAt.toISOString(),
                    slaDeadline: ticket.slaDeadline?.toISOString(),
                    commentCount: ticket.comments?.length || 0,
                    attachmentCount: ticket.attachments?.length || 0,
                    tags: ticket.tags,
                  }}
                  isSelected={selectedTickets.includes(ticket.id)}
                  showCheckbox={true}
                  onClick={handleTicketClick}
                  onSelect={handleSelectTicket}
                />
              );
            })}
          </div>
        ) : (
          <div className="tickets-list">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedTickets.length === tickets.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Created</th>
                  <th>SLA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => {
                  const slaStatus = getSLAStatus(ticket.slaDeadline);

                  return (
                    <tr key={ticket.id} className="tickets-table-row">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedTickets.includes(ticket.id)}
                          onChange={() => handleSelectTicket(ticket.id)}
                        />
                      </td>
                      <td className="ticket-id-cell">
                        {(ticket as DisplayTicket).ticketCode ||
                          ticket.id.slice(0, 8)}
                      </td>
                      <td className="ticket-title-cell">
                        <div>
                          <h4>{ticket.title}</h4>
                          <p>{ticket.description.substring(0, 80)}...</p>
                        </div>
                      </td>
                      <td>
                        <div
                          className={`table-status ${getStatusClass(
                            ticket.status
                          )}`}
                        >
                          {getStatusIcon(ticket.status)}
                          <span>{ticket.status.replace("_", " ")}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`table-priority ${getPriorityClass(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <div className="table-assignee">
                          <div className="assignee-avatar">
                            {getInitials(ticket.assignedTo || "Unassigned")}
                          </div>
                          <span>{ticket.assignedTo || "Unassigned"}</span>
                        </div>
                      </td>
                      <td>{formatTimeAgo(ticket.createdAt)}</td>
                      <td>
                        <div className={`table-sla ${slaStatus.status}`}>
                          <div className="sla-dot"></div>
                          <span>{slaStatus.text}</span>
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTicketClick(ticket.id);
                            }}
                          >
                            <FaEye />
                          </button>
                          <button className="action-btn">
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && !loading && (
        <div className="tickets-empty-state">
          <div className="empty-state-icon">
            <FaTicketAlt />
          </div>
          <h3>No tickets found</h3>
          <p>Try adjusting your search criteria or create a new ticket.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/tickets/create")}
          >
            <FaPlus />
            <span>Create First Ticket</span>
          </button>
        </div>
      )}
    </div>
  );
};
