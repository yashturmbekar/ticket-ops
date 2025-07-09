import React, { useState } from "react";

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
    { id: "general", title: "General", icon: "⚙️" },
    { id: "notifications", title: "Notifications", icon: "🔔" },
    { id: "security", title: "Security", icon: "🔒" },
    { id: "backup", title: "Backup", icon: "💾" },
    { id: "sla", title: "SLA", icon: "⏱️" },
    { id: "integrations", title: "Integrations", icon: "🔗" },
  ];

  const handleInputChange = (key: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Settings saved:", formData);
  };

  const renderGeneralSettings = () => (
    <div className="compact-settings-section">
      <h3>General Settings</h3>
      <div className="compact-form-grid">
        <div className="compact-form-group">
          <label>Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            className="compact-input"
          />
        </div>
        <div className="compact-form-group">
          <label>Support Email</label>
          <input
            type="email"
            value={formData.supportEmail}
            onChange={(e) => handleInputChange("supportEmail", e.target.value)}
            className="compact-input"
          />
        </div>
        <div className="compact-form-group">
          <label>Default Priority</label>
          <select
            value={formData.defaultPriority}
            onChange={(e) =>
              handleInputChange("defaultPriority", e.target.value)
            }
            className="compact-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="compact-form-group">
          <label className="compact-checkbox-label">
            <input
              type="checkbox"
              checked={formData.autoAssignment}
              onChange={(e) =>
                handleInputChange("autoAssignment", e.target.checked)
              }
            />
            Enable Auto-Assignment
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="compact-settings-section">
      <h3>Notification Settings</h3>
      <div className="compact-form-grid">
        <div className="compact-form-group">
          <label className="compact-checkbox-label">
            <input
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={(e) =>
                handleInputChange("emailNotifications", e.target.checked)
              }
            />
            Email Notifications
          </label>
        </div>
        <div className="compact-form-group">
          <label className="compact-checkbox-label">
            <input
              type="checkbox"
              checked={formData.slackIntegration}
              onChange={(e) =>
                handleInputChange("slackIntegration", e.target.checked)
              }
            />
            Slack Integration
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="compact-settings-section">
      <h3>Security Settings</h3>
      <div className="compact-form-grid">
        <div className="compact-form-group">
          <label className="compact-checkbox-label">
            <input
              type="checkbox"
              checked={formData.twoFactorAuth}
              onChange={(e) =>
                handleInputChange("twoFactorAuth", e.target.checked)
              }
            />
            Two-Factor Authentication
          </label>
        </div>
        <div className="compact-form-group">
          <label>Password Policy</label>
          <select
            value={formData.passwordPolicy}
            onChange={(e) =>
              handleInputChange("passwordPolicy", e.target.value)
            }
            className="compact-select"
          >
            <option value="weak">Weak</option>
            <option value="medium">Medium</option>
            <option value="strong">Strong</option>
          </select>
        </div>
        <div className="compact-form-group">
          <label>Session Timeout (minutes)</label>
          <input
            type="number"
            value={formData.sessionTimeout}
            onChange={(e) =>
              handleInputChange("sessionTimeout", e.target.value)
            }
            className="compact-input"
          />
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="compact-settings-section">
      <h3>Backup Settings</h3>
      <div className="compact-form-grid">
        <div className="compact-form-group">
          <label className="compact-checkbox-label">
            <input
              type="checkbox"
              checked={formData.backupEnabled}
              onChange={(e) =>
                handleInputChange("backupEnabled", e.target.checked)
              }
            />
            Enable Backups
          </label>
        </div>
        <div className="compact-form-group">
          <label>Backup Frequency</label>
          <select
            value={formData.backupFrequency}
            onChange={(e) =>
              handleInputChange("backupFrequency", e.target.value)
            }
            className="compact-select"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="compact-form-group">
          <label>Retention Period (days)</label>
          <input
            type="number"
            value={formData.retentionPeriod}
            onChange={(e) =>
              handleInputChange("retentionPeriod", e.target.value)
            }
            className="compact-input"
          />
        </div>
      </div>
    </div>
  );

  const renderSLASettings = () => (
    <div className="compact-settings-section">
      <h3>SLA Settings</h3>
      <div className="compact-form-grid">
        <div className="compact-form-group">
          <label>Response Time (hours)</label>
          <input
            type="number"
            value={formData.slaResponseTime}
            onChange={(e) =>
              handleInputChange("slaResponseTime", e.target.value)
            }
            className="compact-input"
          />
        </div>
        <div className="compact-form-group">
          <label>Resolution Time (hours)</label>
          <input
            type="number"
            value={formData.slaResolutionTime}
            onChange={(e) =>
              handleInputChange("slaResolutionTime", e.target.value)
            }
            className="compact-input"
          />
        </div>
        <div className="compact-form-group">
          <label>Business Hours</label>
          <input
            type="text"
            value={formData.businessHours}
            onChange={(e) => handleInputChange("businessHours", e.target.value)}
            className="compact-input"
            placeholder="e.g., 9-17"
          />
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="compact-settings-section">
      <h3>Integration Settings</h3>
      <div className="compact-integrations">
        <div className="compact-integration-item">
          <div className="compact-integration-info">
            <h4>Slack</h4>
            <p>Send notifications to Slack channels</p>
          </div>
          <div className="compact-integration-status">
            <span
              className="compact-status-badge"
              style={{
                color: formData.slackIntegration ? "#10b981" : "#6b7280",
              }}
            >
              {formData.slackIntegration ? "Connected" : "Not Connected"}
            </span>
            <button className="compact-btn compact-btn-sm compact-btn-secondary">
              {formData.slackIntegration ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
        <div className="compact-integration-item">
          <div className="compact-integration-info">
            <h4>Microsoft Teams</h4>
            <p>Send notifications to Teams channels</p>
          </div>
          <div className="compact-integration-status">
            <span className="compact-status-badge" style={{ color: "#6b7280" }}>
              Not Connected
            </span>
            <button className="compact-btn compact-btn-sm compact-btn-secondary">
              Connect
            </button>
          </div>
        </div>
        <div className="compact-integration-item">
          <div className="compact-integration-info">
            <h4>LDAP/Active Directory</h4>
            <p>Sync users from Active Directory</p>
          </div>
          <div className="compact-integration-status">
            <span className="compact-status-badge" style={{ color: "#6b7280" }}>
              Not Connected
            </span>
            <button className="compact-btn compact-btn-sm compact-btn-secondary">
              Connect
            </button>
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
    <div className="compact-page">
      {/* Header */}
      <div className="compact-header">
        <h1>System Settings</h1>
        <div className="compact-actions">
          <button className="compact-btn compact-btn-secondary">Reset</button>
          <button
            className="compact-btn compact-btn-primary"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="compact-settings-layout">
        {/* Sidebar */}
        <div className="compact-settings-sidebar">
          <div className="compact-settings-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`compact-settings-nav-item ${
                  activeSection === section.id ? "active" : ""
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="compact-settings-nav-icon">
                  {section.icon}
                </span>
                <span className="compact-settings-nav-text">
                  {section.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="compact-settings-content">
          <div className="compact-card">{renderActiveSection()}</div>
        </div>
      </div>
    </div>
  );
};

export { SettingsPage };
export default SettingsPage;
