import React from "react";
import { Link } from "react-router-dom";
import { FaBuilding, FaPlus } from "react-icons/fa";
import "../styles/createModern.css";

export const DepartmentsPage: React.FC = () => {
  return (
    <div className="create-page">
      {/* Page Title */}
      <div className="create-page-header">
        <div className="create-page-title-section">
          <div className="create-page-icon">
            <FaBuilding />
          </div>
          <div className="create-page-title-text">
            <h1 className="create-page-title">Departments</h1>
            <p className="create-page-subtitle">
              Manage helpdesk departments and their employees
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="create-page-actions">
          <Link to="/departments/create" className="btn btn-primary">
            <FaPlus />
            <span>Create Department</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="create-form-simple">
        <div className="create-form-grid-simple">
          <div className="create-form-group">
            <div
              style={{
                padding: "var(--spacing-8)",
                textAlign: "center",
                background: "var(--color-background-secondary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--border-radius-lg)",
              }}
            >
              <FaBuilding
                style={{
                  fontSize: "48px",
                  color: "var(--color-primary)",
                  marginBottom: "var(--spacing-4)",
                }}
              />
              <h3
                style={{
                  margin: "0 0 var(--spacing-2) 0",
                  color: "var(--color-text-primary)",
                }}
              >
                Department Management
              </h3>
              <p
                style={{
                  margin: "0 0 var(--spacing-4) 0",
                  color: "var(--color-text-secondary)",
                }}
              >
                Create and manage helpdesk departments with assigned employees
              </p>
              <Link to="/departments/create" className="btn btn-primary">
                <FaPlus />
                <span>Create Your First Department</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
