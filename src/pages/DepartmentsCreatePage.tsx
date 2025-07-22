import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaPlus,
  FaTrash,
  FaUser,
  FaSearch,
} from "react-icons/fa";
import { useNotifications } from "../hooks/useNotifications";
import {
  useEmployeeSearch,
  type EmployeeSearchResult,
} from "../hooks/useEmployeeSearch";
import { createHelpdeskDepartment } from "../services/helpdeskDepartmentService";
import "../styles/createSimple.css";

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
  const [showDropdowns, setShowDropdowns] = useState<{
    [key: number]: boolean;
  }>({});

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    isActive: true,
    employees: [
      {
        employeeId: "",
        isActive: true,
        employeeObj: undefined,
        searchQuery: "",
      },
    ],
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
        title: "Department Created Successfully",
        message: `Department "${formData.name}" has been created.`,
      });

      navigate("/departments");
    } catch (error) {
      console.error("Failed to create department:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      addNotification({
        type: "error",
        title: "Failed to Create Department",
        message:
          errorMessage ||
          "There was an error creating the department. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const addEmployee = () => {
    setFormData((prev) => ({
      ...prev,
      employees: [
        ...prev.employees,
        {
          employeeId: "",
          isActive: true,
          employeeObj: undefined,
          searchQuery: "",
        },
      ],
    }));
  };

  const removeEmployee = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.filter((_, i) => i !== index),
    }));
  };

  const updateEmployee = (
    index: number,
    field: keyof DepartmentFormData["employees"][0],
    value: string | boolean | EmployeeSearchResult | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.map((emp, i) =>
        i === index ? { ...emp, [field]: value } : emp
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

          {/* Employees */}
          <div className="create-form-group">
            <label className="create-form-label">
              Department Employees
              <span className="create-form-hint">
                Assign employees to this department
              </span>
            </label>

            <div className="employee-list">
              {formData.employees.map((employee, index) => (
                <div key={index} className="employee-item">
                  <div className="employee-input-group">
                    <div className="employee-search-field">
                      <div className="employee-search-container">
                        <FaSearch className="search-icon" />
                        <input
                          type="text"
                          className="create-form-input"
                          value={employee.searchQuery || ""}
                          onChange={(e) => {
                            const query = e.target.value;
                            updateEmployee(index, "searchQuery", query);
                            if (query) {
                              searchEmployees(query);
                              setShowDropdowns((prev) => ({
                                ...prev,
                                [index]: true,
                              }));
                            } else {
                              setShowDropdowns((prev) => ({
                                ...prev,
                                [index]: false,
                              }));
                            }
                          }}
                          placeholder="Search employee by name..."
                          autoComplete="off"
                        />

                        {/* Search Results Dropdown */}
                        {showDropdowns[index] && employeeResults.length > 0 && (
                          <div className="employee-search-dropdown">
                            {employeeResults.map((result) => (
                              <div
                                key={result.id}
                                className="employee-search-item"
                                onClick={() => {
                                  updateEmployee(index, "employeeObj", result);
                                  updateEmployee(
                                    index,
                                    "employeeId",
                                    result.id.toString()
                                  );
                                  updateEmployee(
                                    index,
                                    "searchQuery",
                                    result.employeeName
                                  );
                                  setShowDropdowns((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }));
                                }}
                              >
                                <div className="employee-search-info">
                                  <FaUser className="employee-icon" />
                                  <div className="employee-details">
                                    <div className="employee-name">
                                      {result.employeeName}
                                    </div>
                                    <div className="employee-meta">
                                      {result.departmentName} •{" "}
                                      {result.designation}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {employeeLoading && (
                              <div className="employee-search-loading">
                                <div className="create-spinner"></div>
                                <span>Searching...</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Selected Employee Display */}
                      {employee.employeeObj && (
                        <div className="selected-employee">
                          <FaUser className="employee-icon" />
                          <div className="employee-details">
                            <div className="employee-name">
                              {employee.employeeObj.employeeName}
                            </div>
                            <div className="employee-meta">
                              {employee.employeeObj.departmentName} •{" "}
                              {employee.employeeObj.designation}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="clear-employee"
                            onClick={() => {
                              updateEmployee(index, "employeeObj", undefined);
                              updateEmployee(index, "employeeId", "");
                              updateEmployee(index, "searchQuery", "");
                            }}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="employee-status-field">
                      <select
                        className="create-form-select"
                        value={employee.isActive ? "true" : "false"}
                        onChange={(e) =>
                          updateEmployee(
                            index,
                            "isActive",
                            e.target.value === "true"
                          )
                        }
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeEmployee(index)}
                      className="btn-icon btn-danger"
                      disabled={formData.employees.length === 1}
                      title="Remove Employee"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addEmployee}
                className="btn btn-outline"
              >
                <FaPlus />
                <span>Add Employee</span>
              </button>
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
                  <div className="create-spinner"></div>
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
    </div>
  );
};

export default DepartmentsCreatePage;
