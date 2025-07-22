import React from "react";
import { Link } from "react-router-dom";
import { FaBuilding, FaPlus } from "react-icons/fa";
import "../styles/ticketsModern.css";

export const DepartmentsPage: React.FC = () => {
  return (
    <div className="tickets-page">
      {/* Page Title */}
      <div className="tickets-page-header">
        <div className="tickets-page-title-section">
          <h1 className="tickets-page-title">Departments</h1>
          <p className="tickets-page-subtitle">
            Manage helpdesk departments and their employees
          </p>
        </div>

        {/* Action Button */}
        <div className="tickets-page-actions">
          <Link to="/departments/create" className="btn btn-primary">
            <FaPlus />
            <span>Create Department</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="tickets-toolbar">
        <div
          style={{
            padding: "var(--spacing-8)",
            textAlign: "center",
            background: "var(--color-background-secondary)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--border-radius-lg)",
            width: "100%",
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
            <span>Create Ticket</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
