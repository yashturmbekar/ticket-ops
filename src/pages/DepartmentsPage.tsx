import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaSearch,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Loader } from "../components/common";
import {
  searchHelpdeskDepartments,
  deleteHelpdeskDepartment,
  type HelpdeskDepartment,
  type Employee,
} from "../services/helpdeskDepartmentService";
import { useNotifications } from "../hooks/useNotifications";
import "../styles/ticketsModern.css";
import "../styles/departments.css";

interface DepartmentWithEmployees extends HelpdeskDepartment {
  employees: Employee[];
}

interface DepartmentSearchItem {
  department: HelpdeskDepartment;
  employees: Employee[];
}

export const DepartmentsPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const [departments, setDepartments] = useState<DepartmentWithEmployees[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(
    new Set()
  );

  // Load departments
  const loadDepartments = React.useCallback(async () => {
    try {
      setLoading(true);

      // Prepare search criteria for real API
      const searchCriteria: Record<string, unknown> = {};

      // Add search query if provided
      if (searchQuery) {
        searchCriteria.search = searchQuery;
      }

      // Call the new search API
      const response = await searchHelpdeskDepartments(
        searchCriteria,
        0,
        50,
        "id,desc"
      );

      // Extract departments from response - API returns 'items' array
      const responseData = response.data || response;
      const departmentItems = responseData.items || [];

      // Transform the data to include employees in department objects
      const departmentsList: DepartmentWithEmployees[] = departmentItems.map(
        (item: DepartmentSearchItem) => ({
          ...item.department,
          employees: item.employees || [],
        })
      );

      console.log("Departments response:", response);
      console.log("Transformed departments:", departmentsList);
      setDepartments(departmentsList);
    } catch (error) {
      console.error("Error loading departments:", error);
      addNotification({
        type: "error",
        title: "Failed to Load Departments",
        message: "Could not load departments. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, addNotification]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const handleDeleteDepartment = async (id: string, name: string) => {
    if (
      !window.confirm(`Are you sure you want to delete "${name}" department?`)
    ) {
      return;
    }

    try {
      await deleteHelpdeskDepartment(id);
      addNotification({
        type: "success",
        title: "Department Deleted",
        message: `Department "${name}" has been deleted successfully.`,
      });
      loadDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      addNotification({
        type: "error",
        title: "Delete Failed",
        message: "Could not delete department. Please try again.",
      });
    }
  };

  const toggleDepartmentExpansion = (departmentId: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <Loader centered text="Loading departments..." minHeight="60vh" />;
  }

  return (
    <div className="tickets-page">
      {/* Page Title */}
      <div className="tickets-page-header">
        <div className="tickets-page-title-section">
          <h1 className="tickets-page-title">Departments</h1>
          <p className="tickets-page-subtitle">
            Manage helpdesk departments and their employees
          </p>
        </div>

        {/* Action Button */}
        <div className="tickets-page-actions">
          <Link to="/departments/create" className="btn btn-primary">
            <FaPlus />
            <span>Create Department</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="tickets-toolbar">
        <div className="tickets-search">
          <div className="search-input-container">
            <FaSearch />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="tickets-results-info">
        <div className="results-count">
          Showing {departments.length} department
          {departments.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Departments List */}
      <div className="departments-list">
        {departments.length === 0 ? (
          <div className="tickets-empty-state">
            <div className="empty-state-icon">
              <FaBuilding />
            </div>
            <h3>No departments found</h3>
            <p>
              {searchQuery
                ? "Try adjusting your search criteria or create a new department."
                : "Get started by creating your first department."}
            </p>
            <Link to="/departments/create" className="btn btn-primary">
              <FaPlus />
              <span>Create Department</span>
            </Link>
          </div>
        ) : (
          <div className="departments-table-container">
            <table className="departments-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Department Name</th>
                  <th>Status</th>
                  <th>Employees</th>
                  <th>Created Date</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department, index) => (
                  <React.Fragment key={department.id}>
                    <tr className="departments-table-row">
                      <td>{index + 1}</td>
                      <td>
                        <div className="department-name-cell">
                          <FaBuilding className="department-icon" />
                          <span className="department-name">
                            {department.name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            department.isActive ? "active" : "inactive"
                          }`}
                        >
                          {department.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="employees-info">
                          <FaUsers className="employees-icon" />
                          <span>
                            {department.employees?.length || 0} employee
                            {(department.employees?.length || 0) !== 1
                              ? "s"
                              : ""}
                          </span>
                          {(department.employees?.length || 0) > 0 && (
                            <button
                              className="expand-btn"
                              onClick={() =>
                                toggleDepartmentExpansion(department.id)
                              }
                            >
                              {expandedDepartments.has(department.id) ? (
                                <FaEyeSlash />
                              ) : (
                                <FaEye />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td>{formatDate(department.createdDate)}</td>
                      <td>{formatDate(department.lastModifiedDate)}</td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/departments/edit/${department.id}`}
                            className="action-btn edit-btn"
                            title="Edit Department"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            className="action-btn delete-btn"
                            onClick={() =>
                              handleDeleteDepartment(
                                department.id,
                                department.name
                              )
                            }
                            title="Delete Department"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Employee Details
                    {expandedDepartments.has(department.id) &&
                      department.employees &&
                      department.employees.length > 0 && (
                        <tr className="employees-expansion-row">
                          <td colSpan={7}>
                            <div className="employees-expansion">
                              <h4>Department Employees</h4>
                              <div className="employees-grid">
                                {department.employees.map((employee) => (
                                  <div
                                    key={employee.id}
                                    className="employee-card"
                                  >
                                    <div className="employee-info">
                                      <div className="employee-name">
                                        {employee.employeeProfilePicNameDTO?.employeeName || 'N/A'}
                                      </div>
                                      <div className="employee-email">
                                        {employee.employeeProfilePicNameDTO?.email || 'N/A'}
                                      </div>
                                      <div className="employee-designation">
                                        {employee.employeeProfilePicNameDTO?.designation || 'N/A'}
                                      </div>
                                      <span
                                        className={`employee-status ${
                                          employee.isActive
                                            ? "active"
                                            : "inactive"
                                        }`}
                                      >
                                        {employee.isActive
                                          ? "Active"
                                          : "Inactive"}
                                      </span>
                                    </div>
                                    <div className="employee-actions">
                                      <button
                                        className="employee-action-btn remove-btn"
                                        onClick={() =>
                                          handleRemoveEmployee(
                                            department.id,
                                            employee.id,
                                            employee.employeeName
                                          )
                                        }
                                        title="Remove from Department"
                                      >
                                        <FaUserTimes />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )} */}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
