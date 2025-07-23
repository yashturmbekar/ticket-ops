import React from "react";
import { usePermissions } from "../../hooks/usePermissions";
import { Permission, UserRole } from "../../types";
import { Button } from "../common/Button";
import "./PermissionExample.css";

/**
 * Example component demonstrating how to use the permission system
 * This shows various ways to implement permission-based UI elements
 */
export const PermissionExample: React.FC = () => {
  const {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    userRole,
    isLoading,
    error,
    refreshPermissions,
    isSubscriptionActive,
  } = usePermissions();

  if (isLoading) {
    return <div className="permission-loading">Loading permissions...</div>;
  }

  if (error) {
    return (
      <div className="permission-error">
        <p>Error loading permissions: {error}</p>
        <Button onClick={refreshPermissions}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="permission-example">
      <h2>Permission System Demo</h2>

      {/* User Info Section */}
      <div className="user-info">
        <h3>Current User Info</h3>
        <p>
          <strong>Role:</strong> {userRole}
        </p>
        <p>
          <strong>Subscription Status:</strong>{" "}
          {isSubscriptionActive ? "Active" : "Inactive"}
        </p>
        <p>
          <strong>Total Permissions:</strong> {permissions.length}
        </p>
      </div>

      {/* Single Permission Checks */}
      <div className="permission-section">
        <h3>Single Permission Examples</h3>

        {hasPermission(Permission.TICKET_CREATE) && (
          <Button variant="primary">Create New Ticket</Button>
        )}

        {hasPermission(Permission.TICKET_UPDATE) && (
          <Button variant="secondary">Edit Ticket</Button>
        )}

        {hasPermission(Permission.TICKET_DELETE) && (
          <Button variant="error">Delete Ticket</Button>
        )}

        {hasPermission(Permission.USER_CREATE) && (
          <Button variant="primary">Add New User</Button>
        )}
      </div>

      {/* Role-based Checks */}
      <div className="permission-section">
        <h3>Role-based Examples</h3>

        {hasRole(UserRole.ORG_ADMIN) && (
          <div className="admin-section">
            <h4>Admin Only Features</h4>
            <Button variant="primary">System Settings</Button>
            <Button variant="secondary">User Management</Button>
            <Button variant="secondary">Reports Dashboard</Button>
          </div>
        )}

        {hasRole(UserRole.ORG_ADMIN) && (
          <div className="tech-section">
            <h4>IT Staff Features</h4>
            <Button variant="primary">Assign Tickets</Button>
            <Button variant="secondary">Update Ticket Status</Button>
          </div>
        )}

        {hasRole(UserRole.EMPLOYEE) && (
          <div className="user-section">
            <h4>End User Features</h4>
            <Button variant="primary">Submit Ticket</Button>
            <Button variant="secondary">View My Tickets</Button>
          </div>
        )}

        {hasRole(UserRole.MANAGER) && (
          <div className="manager-section">
            <h4>Manager Features</h4>
            <Button variant="primary">Team Reports</Button>
            <Button variant="secondary">Approve Requests</Button>
          </div>
        )}
      </div>

      {/* Multiple Permission Checks */}
      <div className="permission-section">
        <h3>Multiple Permission Examples</h3>

        {/* User needs ANY of these permissions */}
        {hasAnyPermission([
          Permission.TICKET_VIEW,
          Permission.TICKET_CREATE,
        ]) && (
          <div className="ticket-access">
            <p>✅ You have access to the ticket system</p>
          </div>
        )}

        {/* User needs ALL of these permissions */}
        {hasAllPermissions([
          Permission.TICKET_VIEW,
          Permission.TICKET_UPDATE,
          Permission.TICKET_ASSIGN,
        ]) && (
          <div className="full-ticket-access">
            <p>✅ You have full ticket management access</p>
            <Button variant="primary">Advanced Ticket Management</Button>
          </div>
        )}

        {/* Complex permission logic */}
        {hasPermission(Permission.REPORT_VIEW) &&
          hasRole(UserRole.ORG_ADMIN) && (
            <div className="advanced-reports">
              <p>✅ You can access advanced reporting features</p>
              <Button variant="primary">Generate System Reports</Button>
            </div>
          )}
      </div>

      {/* Conditional UI Elements */}
      <div className="permission-section">
        <h3>Conditional UI Elements</h3>

        <div className="feature-grid">
          {/* Asset Management */}
          {hasPermission(Permission.ASSET_VIEW) && (
            <div className="feature-card">
              <h4>Asset Management</h4>
              {hasPermission(Permission.ASSET_CREATE) && (
                <Button size="sm">Add Asset</Button>
              )}
              {hasPermission(Permission.ASSET_UPDATE) && (
                <Button size="sm">Edit Assets</Button>
              )}
              {hasPermission(Permission.ASSET_DELETE) && (
                <Button size="sm" variant="error">
                  Delete Assets
                </Button>
              )}
            </div>
          )}

          {/* Knowledge Base */}
          {hasPermission(Permission.KNOWLEDGE_VIEW) && (
            <div className="feature-card">
              <h4>Knowledge Base</h4>
              {hasPermission(Permission.KNOWLEDGE_CREATE) && (
                <Button size="sm">Create Article</Button>
              )}
              {hasPermission(Permission.KNOWLEDGE_PUBLISH) && (
                <Button size="sm">Publish Article</Button>
              )}
            </div>
          )}

          {/* Department Management */}
          {hasPermission(Permission.DEPARTMENT_VIEW) && (
            <div className="feature-card">
              <h4>Department Management</h4>
              {hasPermission(Permission.DEPARTMENT_CREATE) && (
                <Button size="sm">Create Department</Button>
              )}
              {hasPermission(Permission.DEPARTMENT_UPDATE) && (
                <Button size="sm">Edit Department</Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Permission List */}
      <div className="permission-section">
        <h3>Your Current Permissions</h3>
        <div className="permissions-list">
          {permissions.length > 0 ? (
            <ul>
              {permissions.map((permission) => (
                <li key={permission}>{permission}</li>
              ))}
            </ul>
          ) : (
            <p>No permissions assigned</p>
          )}
        </div>

        <Button onClick={refreshPermissions} variant="secondary">
          Refresh Permissions
        </Button>
      </div>

      {/* Subscription Status */}
      {!isSubscriptionActive && (
        <div className="subscription-warning">
          <h3>⚠️ Subscription Required</h3>
          <p>Some features may be limited due to inactive subscription.</p>
          <Button variant="primary">Upgrade Subscription</Button>
        </div>
      )}
    </div>
  );
};
