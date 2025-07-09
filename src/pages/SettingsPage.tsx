import React, { useState } from "react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { FormField, Input, Select } from "../components/common/Form";
import {
  FaCog,
  FaBell,
  FaLock,
  FaDatabase,
  FaClock,
  FaPlug,
  FaSave,
  FaUndo,
} from "react-icons/fa";
import "../styles/settings.css";

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("general");
  const [formData, setFormData] = useState({
    companyName: "Acme Corporation",
    supportEmail: "support@acme.com",
    defaultPriority: "medium",
    autoAssignment: true,
    emailNotifications: true,
    slackIntegration: false,
    backupEnabled: true,
    backupFrequency: "daily",
    retentionPeriod: "90",
    twoFactorAuth: false,
    passwordPolicy: "medium",
    sessionTimeout: "30",
    slaResponseTime: "4",
    slaResolutionTime: "24",
    businessHours: "9-17",
  });

  const sections = [
    { id: "general", title: "General", icon: <FaCog /> },
    { id: "notifications", title: "Notifications", icon: <FaBell /> },
    { id: "security", title: "Security", icon: <FaLock /> },
    { id: "backup", title: "Backup", icon: <FaDatabase /> },
    { id: "sla", title: "SLA", icon: <FaClock /> },
    { id: "integrations", title: "Integrations", icon: <FaPlug /> },
  ];

  const handleInputChange = (key: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Settings saved:", formData);
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3 className="settings-section-title">General Settings</h3>
        <p className="settings-section-description">
          Configure basic system settings and preferences
        </p>
      </div>
      <div className="settings-form">
        <FormField label="Company Name" required>
          <Input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            placeholder="Enter company name"
          />
        </FormField>
        <FormField label="Support Email" required>
          <Input
            type="email"
            value={formData.supportEmail}
            onChange={(e) => handleInputChange("supportEmail", e.target.value)}
            placeholder="support@company.com"
          />
        </FormField>
        <FormField label="Default Priority">
          <Select
            value={formData.defaultPriority}
            onChange={(e) =>
              handleInputChange("defaultPriority", e.target.value)
            }
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
          />
        </FormField>
        <FormField label="Auto-Assignment">
          <div className="settings-toggle">
            <input
              type="checkbox"
              id="autoAssignment"
              checked={formData.autoAssignment}
              onChange={(e) =>
                handleInputChange("autoAssignment", e.target.checked)
              }
            />
            <label htmlFor="autoAssignment">
              Enable automatic ticket assignment
            </label>
          </div>
        </FormField>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3 className="settings-section-title">Notification Settings</h3>
        <p className="settings-section-description">
          Configure how and when notifications are sent
        </p>
      </div>
      <div className="settings-form">
        <FormField label="Email Notifications">
          <div className="settings-toggle">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={formData.emailNotifications}
              onChange={(e) =>
                handleInputChange("emailNotifications", e.target.checked)
              }
            />
            <label htmlFor="emailNotifications">
              Send email notifications for ticket updates
            </label>
          </div>
        </FormField>
        <FormField label="Slack Integration">
          <div className="settings-toggle">
            <input
              type="checkbox"
              id="slackIntegration"
              checked={formData.slackIntegration}
              onChange={(e) =>
                handleInputChange("slackIntegration", e.target.checked)
              }
            />
            <label htmlFor="slackIntegration">Enable Slack notifications</label>
          </div>
        </FormField>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3 className="settings-section-title">Security Settings</h3>
        <p className="settings-section-description">
          Manage security policies and authentication settings
        </p>
      </div>
      <div className="settings-form">
        <FormField label="Two-Factor Authentication">
          <div className="settings-toggle">
            <input
              type="checkbox"
              id="twoFactorAuth"
              checked={formData.twoFactorAuth}
              onChange={(e) =>
                handleInputChange("twoFactorAuth", e.target.checked)
              }
            />
            <label htmlFor="twoFactorAuth">Require 2FA for all users</label>
          </div>
        </FormField>
        <FormField label="Password Policy">
          <Select
            value={formData.passwordPolicy}
            onChange={(e) =>
              handleInputChange("passwordPolicy", e.target.value)
            }
            options={[
              { value: "weak", label: "Weak" },
              { value: "medium", label: "Medium" },
              { value: "strong", label: "Strong" },
            ]}
          />
        </FormField>
        <FormField
          label="Session Timeout"
          helpText="Session timeout in minutes"
        >
          <Input
            type="number"
            value={formData.sessionTimeout}
            onChange={(e) =>
              handleInputChange("sessionTimeout", e.target.value)
            }
            placeholder="30"
            min="5"
            max="480"
          />
        </FormField>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3 className="settings-section-title">Backup Settings</h3>
        <p className="settings-section-description">
          Configure automated backups and data retention
        </p>
      </div>
      <div className="settings-form">
        <FormField label="Enable Backups">
          <div className="settings-toggle">
            <input
              type="checkbox"
              id="backupEnabled"
              checked={formData.backupEnabled}
              onChange={(e) =>
                handleInputChange("backupEnabled", e.target.checked)
              }
            />
            <label htmlFor="backupEnabled">
              Enable automatic system backups
            </label>
          </div>
        </FormField>
        <FormField label="Backup Frequency">
          <Select
            value={formData.backupFrequency}
            onChange={(e) =>
              handleInputChange("backupFrequency", e.target.value)
            }
            options={[
              { value: "hourly", label: "Hourly" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
            ]}
          />
        </FormField>
        <FormField
          label="Retention Period"
          helpText="Number of days to keep backups"
        >
          <Input
            type="number"
            value={formData.retentionPeriod}
            onChange={(e) =>
              handleInputChange("retentionPeriod", e.target.value)
            }
            placeholder="90"
            min="1"
            max="365"
          />
        </FormField>
      </div>
    </div>
  );

  const renderSLASettings = () => (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3 className="settings-section-title">SLA Settings</h3>
        <p className="settings-section-description">
          Configure service level agreements and response times
        </p>
      </div>
      <div className="settings-form">
        <FormField
          label="Response Time"
          helpText="Target response time in hours"
        >
          <Input
            type="number"
            value={formData.slaResponseTime}
            onChange={(e) =>
              handleInputChange("slaResponseTime", e.target.value)
            }
            placeholder="4"
            min="1"
            max="72"
          />
        </FormField>
        <FormField
          label="Resolution Time"
          helpText="Target resolution time in hours"
        >
          <Input
            type="number"
            value={formData.slaResolutionTime}
            onChange={(e) =>
              handleInputChange("slaResolutionTime", e.target.value)
            }
            placeholder="24"
            min="1"
            max="168"
          />
        </FormField>
        <FormField
          label="Business Hours"
          helpText="e.g., 9-17 for 9 AM to 5 PM"
        >
          <Input
            type="text"
            value={formData.businessHours}
            onChange={(e) => handleInputChange("businessHours", e.target.value)}
            placeholder="9-17"
          />
        </FormField>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3 className="settings-section-title">Integration Settings</h3>
        <p className="settings-section-description">
          Connect with external services and tools
        </p>
      </div>
      <div className="settings-integrations">
        <div className="settings-integration-item">
          <div className="settings-integration-info">
            <h4>Slack</h4>
            <p>Send notifications to Slack channels</p>
          </div>
          <div className="settings-integration-actions">
            <span
              className={`settings-status-badge ${
                formData.slackIntegration ? "connected" : "disconnected"
              }`}
            >
              {formData.slackIntegration ? "Connected" : "Not Connected"}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                handleInputChange(
                  "slackIntegration",
                  !formData.slackIntegration
                )
              }
            >
              {formData.slackIntegration ? "Disconnect" : "Connect"}
            </Button>
          </div>
        </div>
        <div className="settings-integration-item">
          <div className="settings-integration-info">
            <h4>Microsoft Teams</h4>
            <p>Send notifications to Teams channels</p>
          </div>
          <div className="settings-integration-actions">
            <span className="settings-status-badge disconnected">
              Not Connected
            </span>
            <Button variant="secondary" size="sm">
              Connect
            </Button>
          </div>
        </div>
        <div className="settings-integration-item">
          <div className="settings-integration-info">
            <h4>LDAP/Active Directory</h4>
            <p>Sync users from Active Directory</p>
          </div>
          <div className="settings-integration-actions">
            <span className="settings-status-badge disconnected">
              Not Connected
            </span>
            <Button variant="secondary" size="sm">
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "backup":
        return renderBackupSettings();
      case "sla":
        return renderSLASettings();
      case "integrations":
        return renderIntegrationSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-title">System Settings</h1>
        <div className="settings-actions">
          <Button variant="secondary" icon={<FaUndo />}>
            Reset
          </Button>
          <Button variant="primary" icon={<FaSave />} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="settings-container">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`settings-nav-button ${
                  activeSection === section.id ? "active" : ""
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="settings-nav-icon">{section.icon}</span>
                <span className="settings-nav-text">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          <Card variant="elevated" padding="lg">
            {renderActiveSection()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export { SettingsPage };
export default SettingsPage;
