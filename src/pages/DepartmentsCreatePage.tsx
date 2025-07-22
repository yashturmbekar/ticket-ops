import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { useNotifications } from "../hooks/useNotifications";
import { createHelpdeskDepartment } from "../services/helpdeskDepartmentService";
import "../styles/createModern.css";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface DepartmentFormData {
  name: string;
  isActive: boolean;
  employees: {
    employeeId: string;
    isActive: boolean;
    employeeObj?: Employee;
  }[];
}

export const DepartmentsCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    isActive: true,
    employees: [{ employeeId: "", isActive: true, employeeObj: undefined }],
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
      (emp) =>
        !emp.employeeId ||
        isNaN(Number(emp.employeeId)) ||
        Number(emp.employeeId) <= 0
    );

    if (hasInvalidEmployees) {
      newErrors.employees = "All employees must have a valid Employee ID";
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
        { employeeId: "", isActive: true, employeeObj: undefined },
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
    value: string | boolean | Employee | undefined
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
                    <div className="employee-id-field">
                      <input
                        type="text"
                        className="create-form-input"
                        value={employee.employeeId}
                        onChange={(e) => {
                          updateEmployee(index, "employeeId", e.target.value);
                        }}
                        placeholder="Employee ID"
                      />
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
