import React, { useState, useEffect, useMemo, useRef } from "react";
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
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { Loader, TicketTile } from "../components/common";
import type { Ticket, TicketStatus, Priority, UserRole } from "../types";
import { useAuth } from "../hooks/useAuth";

// Extended ticket type for displaying API data
type DisplayTicket = Ticket & {
  ticketCode?: string;
  assignedToDetails?: {
    employeeName: string;
    designation: string;
  };
};
import { searchTickets, searchMyTickets } from "../services/ticketService";
import { searchHelpdeskDepartments } from "../services/helpdeskDepartmentService";
import type { HelpdeskDepartment } from "../services/helpdeskDepartmentService";
import { useNotifications } from "../hooks/useNotifications";
import { transformApiTicketsToTickets } from "../utils/apiTransforms";
import "../styles/ticketsDashboard.css";

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
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [departments, setDepartments] = useState<HelpdeskDepartment[]>([]);
  const [loading, setLoading] = useState(true); // Initial page load
  const [searchLoading, setSearchLoading] = useState(false); // Search/filter operations
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"tiles" | "list">("tiles");

  // Set default active tab based on user role
  const getDefaultTab = (userRole: UserRole) => {
    switch (userRole) {
      case "ORG-ADMIN":
      case "HELPDESK-ADMIN":
        return "all-tickets";
      case "MANAGER":
      case "HELPDESK-DEPARTMENT":
        return "assigned-tickets";
      default: // EMPLOYEE
        return "my-tickets";
    }
  };

  const [activeTab, setActiveTab] = useState<string>(
    getDefaultTab(user?.role || "EMPLOYEE")
  );

  // Define available tabs based on user role
  const getAvailableTabs = (userRole: UserRole) => {
    switch (userRole) {
      case "ORG-ADMIN":
      case "HELPDESK-ADMIN":
        return [
          {
            id: "all-tickets",
            label: "All Organization Tickets",
            icon: <FaTicketAlt />,
          },
          { id: "my-tickets", label: "My Tickets", icon: <FaUser /> },
        ];
      case "MANAGER":
        return [
          {
            id: "assigned-tickets",
            label: "Assigned to Me",
            icon: <FaUsers />,
          },
          { id: "my-tickets", label: "My Tickets", icon: <FaUser /> },
        ];
      case "HELPDESK-DEPARTMENT":
        return [
          {
            id: "assigned-tickets",
            label: "Assigned to Me",
            icon: <FaUsers />,
          },
          { id: "my-tickets", label: "My Tickets", icon: <FaUser /> },
        ];
      default: // EMPLOYEE
        return [{ id: "my-tickets", label: "My Tickets", icon: <FaUser /> }];
    }
  };

  const availableTabs = useMemo(
    () => getAvailableTabs(user?.role || "EMPLOYEE"),
    [user?.role]
  );

  const [filters, setFilters] = useState<TicketsFilter>({
    status: "",
    priority: "",
    department: "",
    assignee: "",
    search: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [departmentsLoaded, setDepartmentsLoaded] = useState(false);
  const [totalTicketCount, setTotalTicketCount] = useState(0);
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});

  // Refs to prevent duplicate API calls
  const departmentsFetching = useRef(false);
  const ticketsFetching = useRef(false);
  const lastTicketSearchParams = useRef<string>("");
  const ticketsFetchTimeout = useRef<number | null>(null);
  const tabCountsLoaded = useRef<Set<string>>(new Set());

  // Update active tab when user role changes
  useEffect(() => {
    const defaultTab = getDefaultTab(user?.role || "EMPLOYEE");
    setActiveTab(defaultTab);
  }, [user?.role]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch departments on component mount - only once
  useEffect(() => {
    const fetchDepartments = async () => {
      // Prevent duplicate calls
      if (departmentsFetching.current || departmentsLoaded) {
        return;
      }

      departmentsFetching.current = true;

      try {
        console.log("Fetching departments (one time only)");
        // Use search endpoint with empty criteria to get all active departments
        const response = await searchHelpdeskDepartments({}, 0, 50, "id,desc");

        // Extract departments from the response structure
        const departmentItems = response.data?.items || response.items || [];
        const departmentList = departmentItems
          .map((item: DepartmentSearchItem) => item.department)
          .filter((dept: HelpdeskDepartment) => dept && dept.isActive);

        setDepartments(departmentList);
        setDepartmentsLoaded(true);
        console.log(
          "Departments loaded successfully:",
          departmentList.length,
          "departments"
        );
      } catch (error) {
        console.error("Error loading departments:", error);
        addNotification({
          type: "error",
          title: "Failed to Load Departments",
          message: "Failed to load departments for filtering",
        });
      } finally {
        departmentsFetching.current = false;
      }
    };

    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Preload counts for all tabs
  useEffect(() => {
    const preloadTabCounts = async () => {
      if (!user || availableTabs.length === 0) return;

      try {
        for (const tab of availableTabs) {
          // Skip if we already have count for this tab
          if (tabCountsLoaded.current.has(tab.id)) continue;

          // Use base criteria without any filters for accurate total counts
          const searchCriteria: Record<string, unknown> = {};

          switch (tab.id) {
            case "my-tickets":
              searchCriteria.submittedBy = user?.email || user?.username;
              break;
            case "assigned-tickets":
              searchCriteria.assignedTo = user?.email || user?.username;
              break;
            case "all-tickets":
              // No filter for all tickets
              break;
          }

          // Use appropriate search function based on tab type with minimal results
          const response =
            tab.id === "all-tickets"
              ? await searchTickets(searchCriteria, 0, 1, "createdDate,desc")
              : await searchMyTickets(searchCriteria, 0, 1, "createdDate,desc");

          const count =
            response.meta?.totalItems || response.data?.meta?.totalItems || 0;

          console.log(
            `Preloaded count for ${tab.id}:`,
            count,
            "with criteria:",
            searchCriteria
          );

          setTabCounts((prev) => ({
            ...prev,
            [tab.id]: count,
          }));

          // Mark this tab as loaded
          tabCountsLoaded.current.add(tab.id);
        }
      } catch (error) {
        console.error("Error preloading tab counts:", error);
      }
    };

    preloadTabCounts();
  }, [user, availableTabs]);

  useEffect(() => {
    // Clear any existing timeout
    if (ticketsFetchTimeout.current) {
      clearTimeout(ticketsFetchTimeout.current);
    }

    const fetchTickets = async () => {
      // Prevent concurrent calls
      if (ticketsFetching.current) {
        return;
      }

      ticketsFetching.current = true;

      try {
        // Use searchLoading for subsequent searches, loading only for initial load
        if (loading) {
          console.log("Initial tickets load");
        } else {
          setSearchLoading(true);
          console.log("Filtering/searching tickets");
        }

        // Prepare search criteria for real API
        const searchCriteria: Record<string, unknown> = {};

        // Add tab-specific criteria based on user role and active tab
        switch (activeTab) {
          case "my-tickets":
            // Filter to show only tickets created by the current user
            searchCriteria.submittedBy = user?.email || user?.username;
            break;
          case "assigned-tickets":
            // Filter to show only tickets assigned to the current user
            searchCriteria.assignedTo = user?.email || user?.username;
            break;
          case "all-tickets":
            // Show all tickets in the organization - only for ORG_ADMIN and HELPDESK_ADMIN
            // No additional filter needed - will show all organization tickets
            break;
        }

        // Add filters to search criteria - use correct field names from API interface
        if (filters.status) {
          searchCriteria.status = filters.status;
        }
        if (filters.priority) {
          searchCriteria.priority = filters.priority.toUpperCase();
        }
        if (filters.department && departments.length > 0) {
          // Find department ID by name - use current departments state
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

        console.log("Tickets search criteria:", searchCriteria);

        // Create a unique string to track if parameters have changed
        const searchParamsKey = JSON.stringify({
          activeTab,
          criteria: searchCriteria,
          loading,
        });

        // Skip API call if same parameters as last call
        if (lastTicketSearchParams.current === searchParamsKey) {
          console.log("Skipping duplicate tickets API call - same parameters");
          return;
        }

        lastTicketSearchParams.current = searchParamsKey;

        // Call the appropriate API based on the active tab
        const response =
          activeTab === "all-tickets"
            ? await searchTickets(searchCriteria, 0, 50, "createdDate,desc")
            : await searchMyTickets(searchCriteria, 0, 50, "createdDate,desc");

        // Extract tickets from response - API returns 'items' array
        const apiTickets = response.data?.items || response.items || [];

        // Extract total count from response.meta.totalItems
        const totalCount =
          response.meta?.totalItems || response.data?.meta?.totalItems || 0;
        setTotalTicketCount(totalCount);

        console.log(
          `Main fetch count for ${activeTab}:`,
          totalCount,
          "with criteria:",
          searchCriteria
        );

        // Store count for the current tab
        setTabCounts((prev) => ({
          ...prev,
          [activeTab]: totalCount,
        }));

        // Transform API response to internal format
        const transformedTickets = transformApiTicketsToTickets(apiTickets);
        setTickets(transformedTickets);
        console.log(
          "Tickets loaded:",
          transformedTickets.length,
          "Total count:",
          totalCount
        );
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
        ticketsFetching.current = false;
      }
    };

    // Only fetch if user is available, with debouncing for non-initial loads
    if (user && activeTab) {
      if (loading) {
        // Immediate load for initial render
        fetchTickets();
      } else {
        // Debounce for subsequent calls
        ticketsFetchTimeout.current = setTimeout(() => {
          fetchTickets();
        }, 100); // 100ms debounce
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (ticketsFetchTimeout.current) {
        clearTimeout(ticketsFetchTimeout.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    filters.status,
    filters.priority,
    filters.department,
    filters.assignee,
    debouncedSearch,
    user,
    departments,
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

  // Get page title and subtitle based on active tab
  const getPageTitleInfo = (tab: string) => {
    switch (tab) {
      case "all-tickets":
        return {
          title: "All Organization Tickets",
          subtitle:
            "Manage and track all support requests across the organization",
        };
      case "assigned-tickets":
        return {
          title: "Assigned Tickets",
          subtitle: "Support tickets assigned to you for resolution",
        };
      case "my-tickets":
      default:
        return {
          title: "My Tickets",
          subtitle: "Support tickets you have submitted",
        };
    }
  };

  // Get role-specific information
  const getRoleInfo = (userRole: UserRole) => {
    switch (userRole) {
      case "ORG-ADMIN":
        return {
          badge: "Organization Admin",
          description: "Full access to all tickets across the organization",
          color: "admin",
        };
      case "HELPDESK-ADMIN":
        return {
          badge: "Helpdesk Admin",
          description: "Administrative access to all organizational tickets",
          color: "admin",
        };
      case "MANAGER":
        return {
          badge: "Manager",
          description: "Access to assigned tickets and tickets you created",
          color: "manager",
        };
      case "HELPDESK-DEPARTMENT":
        return {
          badge: "Helpdesk Agent",
          description: "Access to assigned tickets and tickets you created",
          color: "agent",
        };
      default:
        return {
          badge: "Employee",
          description: "Access to tickets you have created",
          color: "employee",
        };
    }
  };

  const roleInfo = getRoleInfo(user?.role || "EMPLOYEE");
  const pageInfo = getPageTitleInfo(activeTab);

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
          <div className="title-with-badge">
            <h1 className="tickets-page-title">{pageInfo.title}</h1>
            <span className={`role-badge ${roleInfo.color}`}>
              {roleInfo.badge}
            </span>
          </div>
          <p className="tickets-page-subtitle">{pageInfo.subtitle}</p>
          <p className="role-description">{roleInfo.description}</p>
        </div>
        <div className="tickets-page-actions">
          <Link to="/tickets/create" className="btn btn-primary">
            <FaPlus />
            <span>Create Ticket</span>
          </Link>
        </div>
      </div>

      {/* Role-based Tabs */}
      {availableTabs.length > 1 && (
        <div className="tickets-tabs">
          <div className="tabs-buttons">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tabCounts[tab.id] !== undefined && tabCounts[tab.id] > 0 && (
                  <span className="tab-count">{tabCounts[tab.id]}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

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
          Showing {filteredTickets.length} of {totalTicketCount} tickets
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
                    commentCount: ticket.totalCommentsCount,
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
