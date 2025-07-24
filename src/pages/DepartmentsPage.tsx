import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaSearch,
} from "react-icons/fa";
import { Loader, Modal, Button } from "../components/common";
import {
  searchHelpdeskDepartments,
  deleteHelpdeskDepartment,
  type HelpdeskDepartment,
  type Employee,
} from "../services/helpdeskDepartmentService";
import { useNotifications } from "../hooks/useNotifications";
import "../styles/departments.css";

interface DepartmentWithEmployees extends HelpdeskDepartment {
  employees: Employee[];
}

interface DepartmentSearchItem {
  department: HelpdeskDepartment;
  employees: Employee[];
}

export const DepartmentsPage: React.FC = () => {
  // Removed unused filters state

  const { addNotification } = useNotifications();
  const [allDepartments, setAllDepartments] = useState<DepartmentWithEmployees[]>([]);
  const [departments, setDepartments] = useState<DepartmentWithEmployees[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  // Confirmation modal state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Load all departments once
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await searchHelpdeskDepartments({}, 0, 1000, "id,desc");
        const responseData = response.data || response;
        const departmentItems = responseData.items || [];
        const departmentsList: DepartmentWithEmployees[] = departmentItems.map(
          (item: DepartmentSearchItem) => ({
            ...item.department,
            employees: item.employees || [],
          })
        );
        setAllDepartments(departmentsList);
        setDepartments(departmentsList);
      } catch (error) {
        addNotification({
          type: "error",
          title: "Failed to Load Departments",
          message: "Could not load departments. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, [addNotification]);

  // Client-side filter
  useEffect(() => {
    if (!searchQuery) {
      setDepartments(allDepartments);
    } else {
      const q = searchQuery.toLowerCase();
      setDepartments(
        allDepartments.filter((dept) =>
          dept.name.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, allDepartments]);


  const handleDeleteDepartment = (id: string, name: string) => {
    setDepartmentToDelete({ id, name });
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteDepartment = async () => {
    if (!departmentToDelete) return;

    try {
      await deleteHelpdeskDepartment(departmentToDelete.id);
      addNotification({
        type: "success",
        title: "✅ Department Deleted",
        message: `Department "${departmentToDelete.name}" has been deleted successfully.`,
      });
      setAllDepartments((prev) =>
        prev.filter((dept) => dept.id !== departmentToDelete.id)
      );
    } catch (error) {
      console.error("Error deleting department:", error);
      addNotification({
        type: "error",
        title: "❌ Delete Failed",
        message: "Could not delete department. Please try again.",
      });
    } finally {
      setShowDeleteConfirmation(false);
      setDepartmentToDelete(null);
    }
  };

  const cancelDeleteDepartment = () => {
    setShowDeleteConfirmation(false);
    setDepartmentToDelete(null);
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
            Manage helpdesk departments and their assigned employees
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
          Showing {departments.length} department{departments.length !== 1 ? "s" : ""}
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
                  <th>Assigned Employees</th>
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
                          className={`status-badge ${department.isActive ? "active" : "inactive"
                            }`}
                        >
                          {department.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="employees-info">
                          {department.employees &&
                            department.employees.length > 0 ? (
                            <div className="employee-names-list">
                              {(expandedDepartments.has(department.id)
                                ? department.employees
                                : department.employees.slice(0, 3)
                              ).map((employee) => (
                                <div
                                  key={employee.id}
                                  className="employee-name-item"
                                >
                                  {employee.employeeProfilePicNameDTO
                                    ?.employeeName || "N/A"}
                                </div>
                              ))}
                              {department.employees.length > 3 && (
                                <button
                                  className="expand-btn"
                                  onClick={() =>
                                    toggleDepartmentExpansion(department.id)
                                  }
                                >
                                  {expandedDepartments.has(department.id)
                                    ? "Show Less"
                                    : `+${department.employees.length - 3
                                    } more`}
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="no-employees">
                              <FaUsers className="employees-icon" />
                              <span>No employees assigned</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="date-text">
                          {formatDate(department.createdDate)}
                        </span>
                      </td>
                      <td>
                        <span className="date-text">
                          {formatDate(department.lastModifiedDate)}
                        </span>
                      </td>
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
                              <h4>Assigned Employees</h4>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={cancelDeleteDepartment}
        title="Confirm Department Deletion"
        size="small"
        className="modal-confirm"
        footer={
          <div className="modal-footer">
            <Button
              variant="secondary"
              onClick={cancelDeleteDepartment}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={confirmDeleteDepartment}
              disabled={loading}
              className="btn-delete-confirm"
            >
              Delete Department
            </Button>
          </div>
        }
      >
        <div className="modal-confirm-icon error">
          <FaTrash />
        </div>
        <div className="modal-confirm-title">
          Delete Department
        </div>
        <div className="modal-confirm-message">
          Are you sure you want to delete <strong>"{departmentToDelete?.name}"</strong>?
          This action will permanently delete the department and cannot be undone.
          All associated employee assignments will be removed.
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;
