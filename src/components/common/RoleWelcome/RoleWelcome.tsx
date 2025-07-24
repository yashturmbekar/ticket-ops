import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigation } from "../../../hooks/useNavigation";
import { UserRole } from "../../../types";
import "./RoleWelcome.css";

interface RoleWelcomeProps {
  showQuickActions?: boolean;
  showFeatures?: boolean;
}

const RoleWelcome: React.FC<RoleWelcomeProps> = ({
  showQuickActions = true,
  showFeatures = true,
}) => {
  const { user } = useAuth();
  const { quickActions, roleFeatures, isLoading } = useNavigation();

  if (isLoading) {
    return <div className="role-welcome-loading">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const getRoleDisplayName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      [UserRole.EMPLOYEE]: "Employee",
      [UserRole.MANAGER]: "Manager",
      [UserRole.HR]: "HR Specialist",
      [UserRole.CXO]: "Executive",
      [UserRole.ORG_ADMIN]: "Organization Administrator",
      [UserRole.HELPDESK_DEPARTMENT]: "Helpdesk Department",
      [UserRole.HELPDESK_ADMIN]: "Helpdesk Administrator",
    };
    return roleNames[role] || "User";
  };

  const getRoleWelcomeMessage = (role: UserRole): string => {
    const messages: Record<UserRole, string> = {
      [UserRole.EMPLOYEE]:
        "Welcome to your workplace portal. Create tickets, access resources, and stay connected.",
      [UserRole.MANAGER]:
        "Welcome to your management dashboard. Monitor your team, track performance, and drive results.",
      [UserRole.HR]:
        "Welcome to the HR portal. Manage employees, handle payroll, and support organizational growth.",
      [UserRole.CXO]:
        "Welcome to your executive dashboard. Access strategic insights and company-wide analytics.",
      [UserRole.ORG_ADMIN]:
        "Welcome to organization management. Configure settings, manage departments, and oversee operations.",
      [UserRole.HELPDESK_DEPARTMENT]:
        "Welcome to the helpdesk portal. Manage tickets, assist users, and maintain service quality.",
      [UserRole.HELPDESK_ADMIN]:
        "Welcome to helpdesk administration. Full system access to manage tickets, departments, and configurations.",
    };
    return messages[role] || "Welcome to the platform.";
  };

  return (
    <div className="role-welcome">
      <div className="role-welcome-header">
        <h2>
          Hello,{" "}
          {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}!
        </h2>
        <p className="role-title">{getRoleDisplayName(user.role)}</p>
        <p className="welcome-message">{getRoleWelcomeMessage(user.role)}</p>
      </div>

      {showQuickActions && quickActions.length > 0 && (
        <div className="role-welcome-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className="quick-action-card">
                {action.icon && (
                  <span className="material-icons action-icon">
                    {action.icon}
                  </span>
                )}
                <span className="action-label">{action.label}</span>
                <a href={action.path} className="action-link">
                  Go →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {showFeatures && roleFeatures.length > 0 && (
        <div className="role-welcome-section">
          <h3>Your Permissions & Features</h3>
          <div className="features-list">
            {roleFeatures.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="material-icons feature-icon">
                  check_circle
                </span>
                <span className="feature-text">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleWelcome;
