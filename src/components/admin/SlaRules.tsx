import React, { useState } from "react";
import { 
  FaPlus, 
  FaSearch, 
  FaSave, 
  FaTimes,
  FaShieldAlt,
  FaClock,
  FaBuilding,
  FaFileContract,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglassHalf,
  FaStopwatch,
  FaCalendarAlt,
  FaLayerGroup,
  FaUsers
} from "react-icons/fa";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { FormField, Input, Select } from "../common/Form";
import { Loader } from "../common/Loader";
import { useSlaManagement } from "../../hooks/useSlaManagement";
import { SlaPoliciesDisplay } from "./SlaPoliciesDisplay";
import "./SlaRules.css";

export const SlaRules: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  
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

  // Handle cancel - reset form and close modal
  const handleCancel = () => {
    handleReset();
    setShowCreateModal(false);
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
    if (!loading) {
      setShowCreateModal(false);
    }
  };

  // Priority icons mapping
  const getPriorityIcon = (priority: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      LOW: <FaCheckCircle />,
      MEDIUM: <FaHourglassHalf />,
      HIGH: <FaExclamationTriangle />,
      CRITICAL: <FaStopwatch />,
      URGENT: <FaClock />
    };
    return iconMap[priority] || <FaClock />;
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
    <div className="sla-page">
      {/* Page Header */}
      <div className="sla-page-header">
        <div className="sla-page-title-section">
          <div className="title-with-badge">
            <div className="title-icon">
              <FaShieldAlt />
            </div>
            <h1 className="sla-page-title">SLA Policies</h1>
          </div>
          <p className="sla-page-subtitle">Manage and configure Service Level Agreement policies</p>
          <p className="role-description">Configure response and resolution times for all departments</p>
        </div>
        <div className="sla-page-actions">
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="create-sla-btn"
          >
            <FaPlus />
            <span>Create Policy</span>
          </Button>
        </div>
      </div>

      {/* Create SLA Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCancel}
        title="Create New SLA Policy"
        size="xl"
        className="sla-create-modal"
      >
        <div className="modal-content-wrapper">
          {/* Modal Header Banner */}
          <div className="modal-header-banner">
            <div className="banner-content">
              <div className="banner-icon">
                <FaFileContract />
              </div>
              <div className="banner-text">
                <h3>Configure Service Level Agreement</h3>
                <p>Set up response and resolution times for helpdesk departments</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="sla-modal-form">
            {/* Department Selection */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <FaBuilding />
                </div>
                <div className="section-content">
                  <h4 className="section-title">Helpdesk Department</h4>
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
                    <h4 className="section-title">Priority SLA Settings</h4>
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
                            <div className="priority-badge" style={{ backgroundColor: getPriorityColor(priority) }}>
                              {priority}
                            </div>
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
            <div className="modal-form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
                className="cancel-btn"
              >
                <FaTimes className="btn-icon" />
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
                    <FaSave className="btn-icon" />
                    <span>Create SLA Policy</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Filters and Search */}
      <div className="sla-toolbar">
        <div className="sla-search">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search departments..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="search-input"
            />
          </div>
        </div>

        <div className="sla-filters">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* SLA Policies Display */}
      <SlaPoliciesDisplay filters={filters} />
    </div>
  );
};

export default SlaRules;
