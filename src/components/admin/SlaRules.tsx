import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaShieldAlt
} from "react-icons/fa";
import { Button } from "../common/Button";
import { SlaPoliciesDisplay } from "./SlaPoliciesDisplay";
import "./SlaRules.css";

export const SlaRules: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });

  // Handle create SLA policy navigation
  const handleCreateSlaPolicy = () => {
    navigate("/sla-rules/create");
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
            onClick={handleCreateSlaPolicy}
            className="create-sla-btn"
          >
            <span>Create Policy</span>
          </Button>
        </div>
      </div>

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
