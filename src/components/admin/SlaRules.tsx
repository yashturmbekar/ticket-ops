import React from "react";
import { FaClock, FaSave, FaTimes } from "react-icons/fa";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { FormField, Input, Select } from "../common/Form";
import { useSlaManagement } from "../../hooks/useSlaManagement";
import "./SlaRules.css";

export const SlaRules: React.FC = () => {
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

  return (
    <Card className="sla-rules-card">
      <div className="sla-rules-header">
        <div className="sla-rules-title">
          <FaClock className="sla-rules-icon" />
          <h2>SLA Rules</h2>
        </div>
        <p className="sla-rules-description">
          Configure Service Level Agreement policies for helpdesk departments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="sla-rules-form">
        <div className="form-grid">
          <FormField label="Helpdesk Department" required>
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
                  : "Select Department"
              }
            />
          </FormField>
        </div>

        {formData.helpdeskDepartmentId && (
          <div className="priority-settings-section">
            <h3 className="priority-settings-title">Priority SLA Settings</h3>
            <p className="priority-settings-description">
              Configure response and resolution times for each priority level
            </p>

            <div className="priority-grid">
              {priorities.map((priority) => {
                const prioritySla = formData.prioritySlaSettings.find(
                  (p) => p.priority === priority
                );
                if (!prioritySla) return null;

                return (
                  <div key={priority} className="priority-card">
                    <div className="priority-header">
                      <h4
                        className={`priority-title priority-${priority.toLowerCase()}`}
                      >
                        {priority}
                      </h4>
                    </div>

                    <div className="priority-fields">
                      <FormField label="Response Time (Minutes)" required>
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
                        {prioritySla.responseTimeMinutes > 0 && (
                          <div className="form-field-hint">
                            {formatTimeMinutes(prioritySla.responseTimeMinutes)}
                          </div>
                        )}
                      </FormField>

                      <FormField label="Resolution Time (Minutes)" required>
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
                        {prioritySla.resolutionTimeMinutes > 0 && (
                          <div className="form-field-hint">
                            {formatTimeMinutes(
                              prioritySla.resolutionTimeMinutes
                            )}
                          </div>
                        )}
                      </FormField>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={loading}
            className="reset-btn"
          >
            <FaTimes className="btn-icon" />
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || departmentsLoading}
            className="submit-btn"
          >
            <FaSave className="btn-icon" />
            {loading ? "Creating..." : "Create SLA Policies"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SlaRules;
