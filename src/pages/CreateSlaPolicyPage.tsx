import React from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaLayerGroup,
  FaShieldAlt,
  FaStopwatch,
  FaStopwatch as FaStopwatchAlt,
  FaUsers
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { FormField, Input, Select } from "../components/common/Form";
import { Loader } from "../components/common/Loader";
import { useSlaManagement } from "../hooks/useSlaManagement";
import "./CreateSlaPolicyPage.css";

const CreateSlaPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    formData,
    loading,
    departmentsLoading,
    handleDepartmentChange,
    handlePriorityTimeChange,
    handleSubmit,
    handleReset,
    formatTimeMinutes,
    departmentOptions,
    priorities,
  } = useSlaManagement();

  // Handle cancel - reset form and navigate back
  const handleCancel = () => {
    handleReset();
    navigate("/sla-rules");
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success && !loading) {
      navigate("/sla-rules");
    }
  };

  // Priority icons mapping
  const getPriorityIcon = (priority: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      LOW: <FaCheckCircle />,
      MEDIUM: <FaHourglassHalf />,
      HIGH: <FaExclamationTriangle />,
      CRITICAL: <FaStopwatchAlt />,
      URGENT: <FaClock />
    };
    return iconMap[priority] || <FaClock />;
  };

  // Priority description mapping
  const getPriorityDescription = (priority: string) => {
    const descriptionMap: Record<string, string> = {
      LOW: "Non-urgent issues that can be addressed during normal business hours",
      MEDIUM: "Standard issues requiring attention within business hours",
      HIGH: "Important issues requiring immediate attention",
      CRITICAL: "Urgent issues affecting business operations",
      URGENT: "Emergency issues requiring immediate resolution"
    };
    return descriptionMap[priority] || "Priority level configuration";
  };

  // Priority colors mapping
  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      LOW: "#28a745",
      MEDIUM: "#ffc107", 
      HIGH: "#fd7e14",
      CRITICAL: "#dc3545",
      URGENT: "#6f42c1"
    };
    return colorMap[priority] || "#6c757d";
  };

  return (
    <div className="create-sla-page">
      {/* Page Header */}
      <div className="create-sla-header">
        <div className="create-sla-title-section">
          <div className="title-with-badge">
            <div className="title-icon">
              <FaShieldAlt />
            </div>
            <h1 className="create-sla-title">Create SLA Policy</h1>
          </div>
          <p className="create-sla-subtitle">Configure Service Level Agreement for helpdesk departments</p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="create-sla-form">
        {/* Department Selection */}
        <div className="form-section sla-form-adjustments">
          <div className="section-header">
            <div className="section-icon">
              <FaBuilding />
            </div>
            <div className="section-content">
              <h4 className="section-title">
                Helpdesk Department
              </h4>
              <p className="section-description">Select the department for SLA configuration</p>
            </div>
          </div>
          
          <div className="form-field-wrapper">
            <FormField label="Department" required>
              <div className="select-with-icon">
                <FaUsers className="select-icon" />
                <Select
                  value={formData.helpdeskDepartmentId}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  options={[
                    { value: "", label: "Select Department" },
                    ...departmentOptions,
                  ]}
                  disabled={departmentsLoading}
                  placeholder={
                    departmentsLoading
                      ? "Loading departments..."
                      : "Choose a department"
                  }
                />
              </div>
            </FormField>
          </div>
        </div>

        {/* Priority Settings */}
        {formData.helpdeskDepartmentId && (
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <FaLayerGroup />
              </div>
              <div className="section-content">
                <h4 className="section-title">
                  Priority SLA Settings
                </h4>
                <p className="section-description">
                  Configure response and resolution times for each priority level
                </p>
              </div>
            </div>

            <div className="priority-grid">
              {priorities.map((priority) => {
                const prioritySla = formData.prioritySlaSettings.find(
                  (p) => p.priority === priority
                );
                if (!prioritySla) return null;

                return (
                  <div key={priority} className="priority-card">
                    <div className="priority-header">
                      <div 
                        className="priority-icon"
                        style={{ backgroundColor: `${getPriorityColor(priority)}20` }}
                      >
                        <div 
                          className="priority-icon-inner"
                          style={{ color: getPriorityColor(priority) }}
                        >
                          {getPriorityIcon(priority)}
                        </div>
                      </div>
                      <div className="priority-info">
                        <h5
                          className="priority-title"
                          style={{ color: getPriorityColor(priority) }}
                        >
                          {priority}
                        </h5>
                        <p className="priority-description">
                          {getPriorityDescription(priority)}
                        </p>
                      </div>
                    </div>

                    <div className="priority-fields">
                      <div className="field-group">
                        <FormField label="Response Time" required>
                          <div className="input-with-icon">
                            <FaClock className="input-icon" />
                            <Input
                              type="number"
                              value={prioritySla.responseTimeMinutes}
                              onChange={(e) =>
                                handlePriorityTimeChange(
                                  priority,
                                  "responseTimeMinutes",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="e.g., 30"
                              min="1"
                            />
                          </div>
                          {prioritySla.responseTimeMinutes > 0 && (
                            <div className="form-field-hint">
                              <FaCalendarAlt className="hint-icon" />
                              {formatTimeMinutes(prioritySla.responseTimeMinutes)}
                            </div>
                          )}
                        </FormField>
                      </div>

                      <div className="field-group">
                        <FormField label="Resolution Time" required>
                          <div className="input-with-icon">
                            <FaStopwatch className="input-icon" />
                            <Input
                              type="number"
                              value={prioritySla.resolutionTimeMinutes}
                              onChange={(e) =>
                                handlePriorityTimeChange(
                                  priority,
                                  "resolutionTimeMinutes",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="e.g., 1440"
                              min="1"
                            />
                          </div>
                          {prioritySla.resolutionTimeMinutes > 0 && (
                            <div className="form-field-hint">
                              <FaCalendarAlt className="hint-icon" />
                              {formatTimeMinutes(prioritySla.resolutionTimeMinutes)}
                            </div>
                          )}
                        </FormField>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="create-sla-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
            className="cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || departmentsLoading || !formData.helpdeskDepartmentId}
            className="submit-btn"
          >
            {loading ? (
              <>
                <Loader size="small" variant="white" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>Create SLA Policy</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSlaPolicyPage; 