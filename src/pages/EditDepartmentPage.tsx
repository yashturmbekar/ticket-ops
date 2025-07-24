import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaTrash,
  FaUser,
  FaSearch,
} from "react-icons/fa";
import { Loader, ButtonLoader, Modal, Button } from "../components/common";
import { useNotifications } from "../hooks/useNotifications";
import {
  useEmployeeSearch,
  type EmployeeSearchResult,
} from "../hooks/useEmployeeSearch";
import {
  getHelpdeskDepartmentWithEmployees,
  updateHelpdeskDepartment,
  type Employee,
} from "../services/helpdeskDepartmentService";
import "../styles/departmentActions.css";

interface DepartmentFormData {
  name: string;
  isActive: boolean;
  employees: {
    employeeId: string;
    isActive: boolean;
    employeeObj?: EmployeeSearchResult;
    searchQuery?: string;
    originalId?: string; // Store the original UUID from API response
  }[];
}

export const DepartmentsEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const {
    results: employeeResults,
    loading: employeeLoading,
    search: searchEmployees,
  } = useEmployeeSearch();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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

  // Load department data for editing
  const loadDepartment = React.useCallback(async () => {
    if (!id) {
      addNotification({
        type: "error",
        title: "Invalid Department ID",
        message: "No department ID provided.",
      });
      navigate("/departments");
      return;
    }

    try {
      setInitialLoading(true);

      // Use the new API to get department with employees
      const response = await getHelpdeskDepartmentWithEmployees(id);
      console.log(response);

      if (response && response.department) {
        const { department, employees } = response;

        // Convert department data to form format
        const employeesFormData = employees?.length
          ? employees.map((emp: Employee) => ({
              employeeId: emp.employeeId.toString(),
              isActive: emp.isActive,
              originalId: emp.id, // Store the original UUID from API response
              employeeObj: {
                id: emp.employeeId, // Use employeeId for EmployeeSearchResult (number)
                employeeName: emp.employeeProfilePicNameDTO.employeeName,
                employeeId: emp.employeeId.toString(),
                email: "", // Email not provided in new API response
                designation: emp.employeeProfilePicNameDTO.designation,
                departmentName: department.name,
              } as EmployeeSearchResult,
              searchQuery: emp.employeeProfilePicNameDTO.employeeName,
            }))
          : [];

        setFormData({
          name: department.name,
          isActive: department.isActive,
          employees: employeesFormData,
        });
      } else {
        addNotification({
          type: "error",
          title: "Department Not Found",
          message: "The requested department could not be found.",
        });
        navigate("/departments");
      }
    } catch (error) {
      console.error("Error loading department:", error);
      addNotification({
        type: "error",
        title: "Failed to Load Department",
        message: "Could not load department details. Please try again.",
      });
      navigate("/departments");
    } finally {
      setInitialLoading(false);
    }
  }, [id, addNotification, navigate]);

  useEffect(() => {
    if (id) {
      loadDepartment();
    }
  }, [id, loadDepartment]);

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

    if (!id) return;

    setLoading(true);

    try {
      // Build payload matching the sample structure
      const payload = {
        department: {
          id: id,
          name: formData.name.trim(),
          isActive: formData.isActive,
        },
        employees: formData.employees
          .filter((emp) => emp.employeeObj && emp.employeeId)
          .map((emp) => ({
            // Use the original UUID id from the get API response
            id: emp.originalId ?? "",
            helpdeskDepartmentId: id,
            employeeId: parseInt(emp.employeeId),
            isActive: emp.isActive, // This will now include both true and false values
          })),
      };

      console.log(
        "Sending department update payload:",
        JSON.stringify(payload, null, 2)
      );

      await updateHelpdeskDepartment(payload);

      addNotification({
        type: "success",
        title: "✅ Department Updated Successfully",
        message: `Department "${formData.name}" has been updated successfully!`,
      });

      navigate(-1);
    } catch (error: unknown) {
      console.error("Error updating department:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      addNotification({
        type: "error",
        title: "❌ Failed to Update Department",
        message:
          errorMessage ||
          "There was an error updating the department. Please check your input and try again.",
      });
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
          originalId: undefined, // New employee, no original ID
        },
      ],
    }));

    // Clear search
    setSearchQuery("");
    setShowDropdown(false);
  };

  const removeEmployee = (index: number) => {
    const employeeName =
      formData.employees[index].employeeObj?.employeeName || "this employee";
    setEmployeeToDelete({ index, name: employeeName });
    setShowDeleteConfirmation(true);
  };

  const confirmRemoveEmployee = () => {
    if (!employeeToDelete) return;

    // Instead of removing the employee, mark them as inactive
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.map((emp, i) =>
        i === employeeToDelete.index ? { ...emp, isActive: false } : emp
      ),
    }));

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

  if (initialLoading) {
    return (
      <Loader centered text="Loading department details..." minHeight="60vh" />
    );
  }

  return (
    <div className="create-page">
      {/* Page Title */}
      <div className="create-page-header">
        <div className="create-page-title-section">
          <div className="create-page-icon">
            <FaBuilding />
          </div>
          <div className="create-page-title-text">
            <h1 className="create-page-title">Edit Department</h1>
            <p className="create-page-subtitle">
              Update department information and employee assignments
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
              Add More Employees
              <span className="create-form-hint">
                Search and add additional employees to this department
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
              Department Employees (
              {formData.employees.filter((emp) => emp.isActive).length})
              <span className="create-form-hint">
                Employees assigned to this department
              </span>
            </label>

            <div className="employee-list-section">
              {formData.employees.filter((emp) => emp.isActive).length === 0 ? (
                <div className="employee-list-empty">
                  <FaUser className="empty-icon" />
                  <p>
                    No employees assigned to this department. Search above to
                    add employees.
                  </p>
                </div>
              ) : (
                <div className="employee-list-table">
                  <div className="employee-list-header">
                    <div className="employee-header-name">Employee</div>
                    <div className="employee-header-status">Status</div>
                    <div className="employee-header-actions">Actions</div>
                  </div>
                  <div className="employee-list-body">
                    {formData.employees
                      .filter((employee) => employee.isActive) // Only show active employees
                      .map((employee) => {
                        // Find the actual index in the full array for actions
                        const actualIndex = formData.employees.findIndex(
                          (emp) => emp === employee
                        );
                        return (
                          <div key={actualIndex} className="employee-list-row">
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
                                    actualIndex,
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
                                onClick={() => removeEmployee(actualIndex)}
                                className="btn-icon btn-danger"
                                title="Remove Employee"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Update Department</span>
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
          Are you sure you want to remove{" "}
          <strong>"{employeeToDelete?.name}"</strong> from this department? This
          action will remove the employee from the department but will not
          delete their account.
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentsEditPage;
