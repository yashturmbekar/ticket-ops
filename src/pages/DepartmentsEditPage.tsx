import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBuilding, FaSave, FaTimes } from "react-icons/fa";
import {
  getAllHelpdeskDepartments,
  updateHelpdeskDepartment,
  type HelpdeskDepartmentPayload,
  type HelpdeskDepartment,
} from "../services/helpdeskDepartmentService";
import { useNotifications } from "../hooks/useNotifications";
import "../styles/ticketsModern.css";
import "../styles/createModern.css";

export const DepartmentsEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [department, setDepartment] = useState<HelpdeskDepartment | null>(null);
  const [departmentName, setDepartmentName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const loadDepartment = React.useCallback(async () => {
    try {
      setLoading(true);
      const departments = await getAllHelpdeskDepartments();
      const foundDepartment = departments.find(
        (dept: HelpdeskDepartment) => dept.id === id
      );

      if (foundDepartment) {
        setDepartment(foundDepartment);
        setDepartmentName(foundDepartment.name);
        setIsActive(foundDepartment.isActive);
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
      setLoading(false);
    }
  }, [id, addNotification, navigate]);

  useEffect(() => {
    if (id) {
      loadDepartment();
    }
  }, [id, loadDepartment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departmentName.trim()) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Department name is required.",
      });
      return;
    }

    if (!id) return;

    try {
      setSaving(true);

      const payload: HelpdeskDepartmentPayload = {
        department: {
          name: departmentName.trim(),
          isActive,
        },
        employees:
          department?.employees?.map((emp) => ({
            employeeId: emp.id,
            isActive: emp.isActive,
          })) || [],
      };

      await updateHelpdeskDepartment(id, payload);

      addNotification({
        type: "success",
        title: "Department Updated",
        message: `Department "${departmentName}" has been updated successfully.`,
      });

      navigate("/departments");
    } catch (error) {
      console.error("Error updating department:", error);
      addNotification({
        type: "error",
        title: "Update Failed",
        message: "Could not update department. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/departments");
  };

  if (loading) {
    return (
      <div className="tickets-loading">
        <div className="loading-spinner"></div>
        <p>Loading department details...</p>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="tickets-empty-state">
        <div className="empty-state-icon">
          <FaBuilding />
        </div>
        <h3>Department not found</h3>
        <p>The requested department could not be found.</p>
      </div>
    );
  }

  return (
    <div className="create-ticket-page">
      {/* Header */}
      <div className="create-page-header">
        <div className="create-page-title-section">
          <div className="create-page-icon">
            <FaBuilding />
          </div>
          <div>
            <h1 className="create-page-title">Edit Department</h1>
            <p className="create-page-subtitle">
              Update department information and settings
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="create-form-container">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-section">
            <h3 className="form-section-title">Department Information</h3>

            <div className="form-group">
              <label htmlFor="departmentName" className="form-label required">
                Department Name
              </label>
              <input
                id="departmentName"
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="form-input"
                placeholder="Enter department name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="form-checkbox-group">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="form-checkbox-text">Active Department</span>
                </label>
              </div>
              <div className="form-help-text">
                Inactive departments will not receive new ticket assignments
              </div>
            </div>
          </div>

          {/* Employee Information */}
          {department.employees && department.employees.length > 0 && (
            <div className="form-section">
              <h3 className="form-section-title">Assigned Employees</h3>
              <div className="employees-readonly-list">
                {department.employees.map((employee) => (
                  <div key={employee.id} className="employee-readonly-item">
                    <div className="employee-readonly-info">
                      <div className="employee-readonly-name">
                        {employee.employeeName}
                      </div>
                      <div className="employee-readonly-details">
                        {employee.email} • {employee.designation}
                      </div>
                    </div>
                    <span
                      className={`employee-readonly-status ${
                        employee.isActive ? "active" : "inactive"
                      }`}
                    >
                      {employee.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="form-help-text">
                Employee assignments can be managed from the departments list
                page
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={saving}
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <div className="loading-spinner-small"></div>
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
        </form>
      </div>
    </div>
  );
};

export default DepartmentsEditPage;
