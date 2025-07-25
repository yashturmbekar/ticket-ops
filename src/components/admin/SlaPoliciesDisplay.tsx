import React from "react";
import {
  FaBuilding,
  FaEdit,
  FaShieldAlt
} from "react-icons/fa";
import { useSlaPoliciesDisplay } from "../../hooks/useSlaPoliciesDisplay";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Modal } from "../common/Modal";
import "./SlaPoliciesDisplay.css";

interface SlaPoliciesDisplayProps {
  filters: {
    search: string;
    status: string;
  };
}

export const SlaPoliciesDisplay: React.FC<SlaPoliciesDisplayProps> = ({ 
  filters 
}) => {
  const {
    slaPolicies,
    loading,
    refreshing,
    editingPolicy,
    handleEditPolicy,
    handleCloseEdit,
    formatTimeMinutes,
    getPriorityColor,
    getPriorityLabel,
  } = useSlaPoliciesDisplay();

  if (loading) {
    return (
      <div className="sla-loading">
        <div className="loading-spinner"></div>
        <p>Loading SLA policies...</p>
      </div>
    );
  }

  // Client-side filtering
  const filteredPolicies = slaPolicies.filter(policy => {
    const matchesSearch = !filters.search || 
      policy.helpdeskDepartmentName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || 
      policy.ticketPrioritySlaRulesDTOS.some(rule => 
        filters.status === 'active' ? rule.isActive : !rule.isActive
      );
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="sla-policies-container">
      {/* Results Info */}
      <div className="sla-results-info">
        <div className="results-count">
          Showing {filteredPolicies.length} of {slaPolicies.length} departments
          {refreshing && (
            <span className="search-indicator"> (refreshing...)</span>
          )}
        </div>
      </div>

      {/* SLA Grid */}
      <div className="sla-grid">
        {filteredPolicies.length === 0 ? (
          <div className="sla-empty-state">
            <div className="empty-state-icon">
              <FaShieldAlt />
            </div>
            <h3>No SLA policies found</h3>
            <p>Try adjusting your search criteria or create a new policy.</p>
          </div>
        ) : (
          filteredPolicies.map((policy) => (
            <Card key={policy.helpdeskDepartmentId} className="sla-tile">
              <div className="sla-tile-header">
                <div className="sla-department-info">
                  <FaBuilding className="department-icon" />
                  <h3 className="department-name">{policy.helpdeskDepartmentName}</h3>
                </div>
                <div className="sla-tile-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPolicy(policy)}
                    className="edit-btn"
                    title="Edit SLA Policies"
                  >
                    <FaEdit />
                  </Button>
                </div>
              </div>

              <div className="sla-tile-content">
                {policy.ticketPrioritySlaRulesDTOS.length === 0 ? (
                  <div className="no-sla-rules">
                    <p>No SLA rules configured</p>
                  </div>
                ) : (
                  <div className="priority-rules">
                    {policy.ticketPrioritySlaRulesDTOS.map((rule) => (
                      <div
                        key={rule.priority}
                        className={`priority-rule ${!rule.isActive ? 'inactive' : ''}`}
                        style={{
                          borderLeftColor: getPriorityColor(rule.priority),
                        }}
                      >
                        <div className="priority-header">
                          <span
                            className="priority-badge"
                            style={{ backgroundColor: getPriorityColor(rule.priority) }}
                          >
                            {getPriorityLabel(rule.priority)}
                          </span>
                          <span className={`status-badge ${rule.isActive ? 'active' : 'inactive'}`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="sla-times">
                          <div className="time-item">
                            <span className="time-label">Response:</span>
                            <span className="time-value">
                              {formatTimeMinutes(rule.responseTimeMinutes)}
                            </span>
                          </div>
                          <div className="time-item">
                            <span className="time-label">Resolution:</span>
                            <span className="time-value">
                              {formatTimeMinutes(rule.resolutionTimeMinutes)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingPolicy && (
        <Modal
          isOpen={!!editingPolicy}
          onClose={handleCloseEdit}
          title={`Edit SLA Policies - ${editingPolicy.helpdeskDepartmentName}`}
          size="large"
        >
          <div className="edit-sla-modal">
            <p className="edit-description">
              Edit SLA policies for {editingPolicy.helpdeskDepartmentName}. 
              Changes will be applied to all priority levels.
            </p>
            
            <div className="edit-priority-rules">
              {editingPolicy.ticketPrioritySlaRulesDTOS.map((rule) => (
                <div
                  key={rule.priority}
                  className="edit-priority-rule"
                  style={{
                    borderLeftColor: getPriorityColor(rule.priority),
                  }}
                >
                  <div className="edit-priority-header">
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(rule.priority) }}
                    >
                      {getPriorityLabel(rule.priority)}
                    </span>
                  </div>

                  <div className="edit-sla-times">
                    <div className="edit-time-item">
                      <label>Response Time (minutes):</label>
                      <input
                        type="number"
                        value={rule.responseTimeMinutes}
                        min="1"
                        className="time-input"
                      />
                    </div>
                    <div className="edit-time-item">
                      <label>Resolution Time (minutes):</label>
                      <input
                        type="number"
                        value={rule.resolutionTimeMinutes}
                        min="1"
                        className="time-input"
                      />
                    </div>
                    <div className="edit-time-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={rule.isActive}
                          className="active-checkbox"
                        />
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="edit-actions">
              <Button variant="secondary" onClick={handleCloseEdit}>
                Cancel
              </Button>
              <Button variant="primary">
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SlaPoliciesDisplay; 