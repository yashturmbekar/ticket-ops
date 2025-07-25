import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTicketAlt,
  FaPlus,
  FaSearch,
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
import {
  searchTickets,
  searchMyTickets,
  searchAssignedTickets,
} from "../services/ticketService";
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
  const [viewMode, setViewMode] = useState<"tiles" | "list">("tiles");

  // Set default active tab - always "my-tickets" as the first tab for all roles
  const getDefaultTab = () => {
    return "my-tickets";
  };

  const [activeTab, setActiveTab] = useState<string>(getDefaultTab());

  // Define available tabs based on user role
  const getAvailableTabs = (userRole: UserRole) => {
    switch (userRole) {
      case "ORG-ADMIN":
      case "HELPDESK-ADMIN":
        return [
          { id: "my-tickets", label: "My Tickets", icon: <FaUser /> },
          {
            id: "all-tickets",
            label: "All Organization Tickets",
            icon: <FaTicketAlt />,
          },
        ];
      case "MANAGER":
        return [
          { id: "my-tickets", label: "My Tickets", icon: <FaUser /> },
          {
            id: "assigned-tickets",
            label: "Assigned to Me",
            icon: <FaUsers />,
          },
        ];
      case "HELPDESK-DEPARTMENT":
        return [
          { id: "my-tickets", label: "My Tickets", icon: <FaUser /> },
          {
            id: "assigned-tickets",
            label: "Assigned to Me",
            icon: <FaUsers />,
          },
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
  const [originalTabCounts, setOriginalTabCounts] = useState<
    Record<string, number>
  >({});

  // Refs to prevent duplicate API calls
  const departmentsFetching = useRef(false);
  const ticketsFetching = useRef(false);
  const lastTicketSearchParams = useRef<string>("");
  const ticketsFetchTimeout = useRef<number | null>(null);
  const tabCountsLoaded = useRef<Set<string>>(new Set());

  // Update active tab when user role changes
  useEffect(() => {
    const defaultTab = getDefaultTab();
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
              // For assigned tickets, use the dedicated endpoint - no additional criteria needed
              break;
            case "all-tickets":
              // No filter for all tickets
              break;
          }

          // Use appropriate search function based on tab type with minimal results
          let response;
          if (tab.id === "all-tickets") {
            response = await searchTickets(
              searchCriteria,
              0,
              1,
              "createdDate,desc"
            );
          } else if (tab.id === "assigned-tickets") {
            response = await searchAssignedTickets(
              searchCriteria,
              0,
              1,
              "createdDate,desc"
            );
          } else {
            response = await searchMyTickets(
              searchCriteria,
              0,
              1,
              "createdDate,desc"
            );
          }

          const count = response.meta?.filteredItemCount || 0;

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

          // Store original unfiltered counts
          setOriginalTabCounts((prev) => ({
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
            // For assigned tickets, use the dedicated endpoint that automatically filters by assignedTo
            // No additional filter needed - searchAssignedTickets handles this
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
        let response;
        if (activeTab === "all-tickets") {
          response = await searchTickets(
            searchCriteria,
            0,
            50,
            "createdDate,desc"
          );
        } else if (activeTab === "assigned-tickets") {
          response = await searchAssignedTickets(
            searchCriteria,
            0,
            50,
            "createdDate,desc"
          );
        } else {
          response = await searchMyTickets(
            searchCriteria,
            0,
            50,
            "createdDate,desc"
          );
        }

        // Extract tickets from response - API returns 'items' array
        const apiTickets = response.data?.items || response.items || [];

        // Extract total count from response.meta.filteredItemCount
        const totalCount = response.meta?.filteredItemCount || 0;

        // For accurate display, use the total count from API response which represents filtered results
        const hasActiveFilters =
          filters.status ||
          filters.priority ||
          filters.department ||
          filters.assignee ||
          debouncedSearch.trim();
        // Always use totalCount as it represents the total count of filtered results from the API
        const displayCount = totalCount;
        setTotalTicketCount(displayCount);

        console.log(
          `Main fetch count for ${activeTab}:`,
          totalCount,
          "Display count:",
          displayCount,
          "Has filters:",
          hasActiveFilters,
          "with criteria:",
          searchCriteria
        );

        // Store count for the current tab
        setTabCounts((prev) => ({
          ...prev,
          [activeTab]: displayCount,
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

  // Check if filters are currently active
  const hasActiveFilters =
    filters.status ||
    filters.priority ||
    filters.department ||
    filters.assignee ||
    debouncedSearch.trim();

  // Function to get the display count for tab badges
  const getTabDisplayCount = (tabId: string) => {
    // For the active tab with filters applied, show the current filtered count
    if (tabId === activeTab && hasActiveFilters) {
      return totalTicketCount;
    }
    // For the active tab without filters, show the current tabCount (which might be updated)
    if (tabId === activeTab && !hasActiveFilters) {
      return tabCounts[tabId];
    }
    // For inactive tabs, always show the original unfiltered count
    return originalTabCounts[tabId] || tabCounts[tabId];
  };

  // Since we're filtering on the backend via API, no need for client-side filtering
  const filteredTickets = tickets;

  if (loading) {
    return (
      <Loader
        centered
        text="Loading tickets..."
        minHeight="60vh"
        useTicketAnimation={true}
        ticketMessage="Searching and organizing your tickets..."
      />
    );
  }

  return (
    <div className="tickets-page">
      {/* Page Title */}
      <div className="tickets-page-header">
        <div className="tickets-page-title-section">
          <div className="title-with-badge">
            <h1 className="tickets-page-title">{pageInfo.title}</h1>
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
                {getTabDisplayCount(tab.id) !== undefined &&
                  getTabDisplayCount(tab.id) > 0 && (
                    <span className="tab-count">
                      {getTabDisplayCount(tab.id)}
                    </span>
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
      </div>

      {/* Tickets Grid/List */}
      <div className={`tickets-container ${viewMode}`}>
        {viewMode === "tiles" ? (
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => {
              // Type cast to access extended properties from API transform
              const extendedTicket = ticket as DisplayTicket & {
                raiserEmployeeDetails?: {
                  employeeName: string;
                  designation: string;
                };
              };
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
                    createdBy: ticket.createdBy,
                    raiserEmployeeDetails:
                      extendedTicket.raiserEmployeeDetails || {
                        employeeName: ticket.createdBy || "Unknown",
                        designation: "Employee",
                      },
                    department: ticket.assignedDepartmentName,
                    helpdeskDepartmentDetails: {
                      name: ticket.assignedDepartmentName || "Unknown",
                    },
                    createdAt: ticket.createdAt.toISOString(),
                    slaDeadline: ticket.slaDeadline?.toISOString(),
                    commentCount: ticket.totalCommentsCount,
                    attachmentCount: ticket.attachments?.length || 0,
                    tags: ticket.tags,
                  }}
                  showCheckbox={false}
                  onClick={handleTicketClick}
                />
              );
            })}
          </div>
        ) : (
          <div className="tickets-list">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Created</th>
                  <th>SLA</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => {
                  const slaStatus = getSLAStatus(ticket.slaDeadline);

                  return (
                    <tr
                      key={ticket.id}
                      className="tickets-table-row"
                      onClick={() => handleTicketClick(ticket.id)}
                      style={{ cursor: "pointer" }}
                    >
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
