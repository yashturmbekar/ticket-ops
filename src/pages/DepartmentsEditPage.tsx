import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Loader, ButtonLoader } from "../components/common";
import { useNotifications } from "../hooks/useNotifications";
import {
  useEmployeeSearch,
  type EmployeeSearchResult,
} from "../hooks/useEmployeeSearch";
import {
  getAllHelpdeskDepartments,
  updateHelpdeskDepartment,
  type HelpdeskDepartmentPayload,
  type HelpdeskDepartment,
  type Employee,
} from "../services/helpdeskDepartmentService";
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

  // Load department data for editing
  const loadDepartment = React.useCallback(async () => {
    try {
      setInitialLoading(true);
      const departments = await getAllHelpdeskDepartments();
      const foundDepartment = departments.find(
        (dept: HelpdeskDepartment) => dept.id === id
      );

      if (foundDepartment) {
        // Convert department data to form format
        const employeesFormData = foundDepartment.employees?.length
          ? foundDepartment.employees.map((emp: Employee) => ({
              employeeId: emp.id.toString(),
              isActive: emp.isActive,
              employeeObj: {
                id: emp.id,
                employeeName: emp.employeeName,
                employeeId: emp.id.toString(), // Add missing employeeId property
                email: emp.email,
                designation: emp.designation,
                departmentName: foundDepartment.name, // Use current department name
              } as EmployeeSearchResult,
              searchQuery: emp.employeeName,
            }))
          : [
              {
                employeeId: "",
                isActive: true,
                employeeObj: undefined,
                searchQuery: "",
              },
            ];

        setFormData({
          name: foundDepartment.name,
          isActive: foundDepartment.isActive,
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
      const payload: HelpdeskDepartmentPayload = {
        department: {
          name: formData.name.trim(),
          isActive: formData.isActive,
        },
        employees: formData.employees
          .filter((emp) => emp.employeeObj && emp.employeeId)
          .map((emp) => ({
            employeeId: parseInt(emp.employeeId),
            isActive: emp.isActive,
          })),
      };

      await updateHelpdeskDepartment(id, payload);

      addNotification({
        type: "success",
        title: "✅ Department Updated Successfully",
        message: `Department "${formData.name}" has been updated successfully!`,
      });

      navigate("/departments");
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
                                <ButtonLoader variant="primary" />
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
    </div>
  );
};

export default DepartmentsEditPage;
