import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaTrash,
  FaUser,
  FaSearch,
} from "react-icons/fa";
import { ButtonLoader, Modal, Button } from "../components/common";
import { useNotifications } from "../hooks/useNotifications";
import {
  useEmployeeSearch,
  type EmployeeSearchResult,
} from "../hooks/useEmployeeSearch";
import { createHelpdeskDepartment } from "../services/helpdeskDepartmentService";
import "../styles/departmentActions.css";

interface DepartmentFormData {
  name: string;
  isActive: boolean;
  employees: {
    employeeId: string;
    isActive: boolean;
    employeeObj?: EmployeeSearchResult;
    searchQuery?: string;
  }[];
}

export const DepartmentsCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const {
    results: employeeResults,
    loading: employeeLoading,
    search: searchEmployees,
  } = useEmployeeSearch();
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Confirmation modal state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    index: number;
    name: string;
  } | null>(null);

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    isActive: true,
    employees: [],
  });

  const [errors, setErrors] = useState<{
    name?: string;
    employees?: string;
    general?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    }

    // Validate employees
    const hasInvalidEmployees = formData.employees.some(
      (emp) => !emp.employeeObj || !emp.employeeId
    );

    if (hasInvalidEmployees) {
      newErrors.employees =
        "All employees must be selected from search results";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addNotification({
        type: "warning",
        title: "⚠️ Form Validation Failed",
        message:
          "Please provide a department name and ensure all employee selections are valid.",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        department: {
          name: formData.name.trim(),
          isActive: formData.isActive,
        },
        employees: formData.employees.map((emp) => ({
          employeeId: Number(emp.employeeId),
          isActive: emp.isActive,
        })),
      };

      await createHelpdeskDepartment(payload);

      addNotification({
        type: "success",
        title: "🏢 Department Created Successfully!",
        message: `Department "${formData.name}" has been created with ${
          formData.employees.filter((emp) => emp.employeeId).length
        } employee(s) assigned.`,
      });

      navigate("/departments");
    } catch (error: unknown) {
      console.error("Failed to create department:", error);

      // Check for duplicate name error from backend
      const errorResponse = error as {
        response?: {
          data?: { errorKey?: string; title?: string; message?: string };
        };
      };

      if (
        errorResponse?.response?.data?.errorKey === "duplicate_name" ||
        errorResponse?.response?.data?.title?.includes(
          "Department with the same name already exists"
        )
      ) {
        addNotification({
          type: "warning",
          title: "⚠️ Department Name Already Exists",
          message: `A department with the name "${formData.name}" already exists. Please choose a different name.`,
        });
      } else {
        const errorMessage =
          errorResponse?.response?.data?.message ||
          (error instanceof Error ? error.message : "Unknown error occurred");
        addNotification({
          type: "error",
          title: "❌ Failed to Create Department",
          message:
            errorMessage ||
            "There was an error creating the department. Please check your input and try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      searchEmployees(query);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleEmployeeSelect = (employee: EmployeeSearchResult) => {
    // Check if employee is already added
    const isAlreadyAdded = formData.employees.some(
      (emp) => emp.employeeId === employee.id.toString()
    );

    if (isAlreadyAdded) {
      addNotification({
        type: "warning",
        title: "⚠️ Employee Already Added",
        message: `${employee.employeeName} is already added to this department.`,
      });
      return;
    }

    // Add employee to the list
    setFormData((prev) => ({
      ...prev,
      employees: [
        ...prev.employees,
        {
          employeeId: employee.id.toString(),
          isActive: true,
          employeeObj: employee,
          searchQuery: employee.employeeName,
        },
      ],
    }));

    // Clear search
    setSearchQuery("");
    setShowDropdown(false);
  };

  const removeEmployee = (index: number) => {
    const employeeName = formData.employees[index].employeeObj?.employeeName || "this employee";
    setEmployeeToDelete({ index, name: employeeName });
    setShowDeleteConfirmation(true);
  };

  const confirmRemoveEmployee = () => {
    if (!employeeToDelete) return;
    
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.filter((_, i) => i !== employeeToDelete.index),
    }));
    
    addNotification({
      type: "success",
      title: "✅ Employee Removed",
      message: `Employee "${employeeToDelete.name}" has been removed from the department.`,
    });
    
    setShowDeleteConfirmation(false);
    setEmployeeToDelete(null);
  };

  const cancelRemoveEmployee = () => {
    setShowDeleteConfirmation(false);
    setEmployeeToDelete(null);
  };

  const updateEmployeeStatus = (index: number, isActive: boolean) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.map((emp, i) =>
        i === index ? { ...emp, isActive } : emp
      ),
    }));
  };

  return (
    <div className="create-page">
      {/* Page Title */}
      <div className="create-page-header">
        <div className="create-page-title-section">
          <div className="create-page-icon">
            <FaBuilding />
          </div>
          <div className="create-page-title-text">
            <h1 className="create-page-title">Create New Department</h1>
            <p className="create-page-subtitle">
              Set up a new helpdesk department with assigned employees
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-form-simple">
        <div className="create-form-grid-simple">
          {/* Department Name */}
          <div className="create-form-group">
            <label className="create-form-label">
              Department Name *
              <span className="create-form-hint">
                Name of the helpdesk department
              </span>
            </label>
            <input
              type="text"
              className={`create-form-input ${errors.name ? "error" : ""}`}
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., IT Support, HR, Finance"
              maxLength={100}
            />
            {errors.name && (
              <div className="create-form-error">
                <FaExclamationTriangle />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Department Status */}
          <div className="create-form-group">
            <label className="create-form-label">
              Status
              <span className="create-form-hint">
                Whether this department is active and accepting tickets
              </span>
            </label>
            <select
              className="create-form-select"
              value={formData.isActive ? "true" : "false"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.value === "true",
                }))
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Employee Search Section */}
          <div className="create-form-group">
            <label className="create-form-label">
              Add Employees
              <span className="create-form-hint">
                Search and add employees to this department
              </span>
            </label>

            <div className="employee-search-section">
              <div className="employee-search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="create-form-input"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search employee by name..."
                  autoComplete="off"
                />

                {/* Search Results Dropdown */}
                {showDropdown && employeeResults.length > 0 && (
                  <div className="employee-search-dropdown">
                    {employeeResults.map((result) => (
                      <div
                        key={result.id}
                        className="employee-search-item"
                        onClick={() => handleEmployeeSelect(result)}
                      >
                        <div className="employee-search-info">
                          <FaUser className="employee-icon" />
                          <div className="employee-details">
                            <div className="employee-name">
                              {result.employeeName}
                            </div>
                            <div className="employee-meta">
                              {result.departmentName} • {result.designation}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {employeeLoading && (
                      <div className="employee-search-loading">
                        <ButtonLoader variant="primary" />
                        <span>Searching...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Employee List Section */}
          <div className="create-form-group">
            <label className="create-form-label">
              Department Employees ({formData.employees.length})
              <span className="create-form-hint">
                Employees assigned to this department
              </span>
            </label>

            <div className="employee-list-section">
              {formData.employees.length === 0 ? (
                <div className="employee-list-empty">
                  <FaUser className="empty-icon" />
                  <p>No employees added yet. Search above to add employees.</p>
                </div>
              ) : (
                <div className="employee-list-table">
                  <div className="employee-list-header">
                    <div className="employee-header-name">Employee</div>
                    <div className="employee-header-status">Status</div>
                    <div className="employee-header-actions">Actions</div>
                  </div>
                  <div className="employee-list-body">
                    {formData.employees.map((employee, index) => (
                      <div key={index} className="employee-list-row">
                        <div className="employee-info">
                          <FaUser className="employee-icon" />
                          <div className="employee-details">
                            <div className="employee-name">
                              {employee.employeeObj?.employeeName}
                            </div>
                            <div className="employee-meta">
                              {employee.employeeObj?.departmentName} •{" "}
                              {employee.employeeObj?.designation}
                            </div>
                          </div>
                        </div>
                        <div className="employee-status">
                          <select
                            className="create-form-select"
                            value={employee.isActive ? "true" : "false"}
                            onChange={(e) =>
                              updateEmployeeStatus(
                                index,
                                e.target.value === "true"
                              )
                            }
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </div>
                        <div className="employee-actions">
                          <button
                            type="button"
                            onClick={() => removeEmployee(index)}
                            className="btn-icon btn-danger"
                            title="Remove Employee"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {errors.employees && (
              <div className="create-form-error">
                <FaExclamationTriangle />
                <span>{errors.employees}</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="create-form-actions">
          <div className="create-form-buttons">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              <FaTimes />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ButtonLoader variant="white" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Create Department</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={cancelRemoveEmployee}
        title="Confirm Employee Removal"
        size="small"
        className="modal-confirm"
        footer={
          <div className="modal-footer">
            <Button
              variant="secondary"
              onClick={cancelRemoveEmployee}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={confirmRemoveEmployee}
              disabled={loading}
              className="btn-delete-confirm"
            >
              Remove Employee
            </Button>
          </div>
        }
      >
        <div className="modal-confirm-icon warning">
          <FaExclamationTriangle />
        </div>
        <div className="modal-confirm-title">
          Remove Employee from Department
        </div>
        <div className="modal-confirm-message">
          Are you sure you want to remove <strong>"{employeeToDelete?.name}"</strong> from this department? 
          This action will remove the employee from the department but will not delete their account.
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentsCreatePage;
