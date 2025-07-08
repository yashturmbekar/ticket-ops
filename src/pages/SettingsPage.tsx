import React, { useState } from "react";
import { PageLayout } from "../components/common/PageLayout";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useTheme } from "../hooks/useTheme";
import "../styles/settings.css";

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
  description: string;
}

const SettingsPage: React.FC = () => {
  const { themeName, toggleTheme } = useTheme();
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
    ipWhitelist: "",
    slaResponseTime: "4",
    slaResolutionTime: "24",
    businessHours: "9-17",
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    customFields: [],
    ticketStatuses: ["open", "in-progress", "resolved", "closed"],
    userRoles: ["admin", "technician", "user"],
  });

  const sections: SettingsSection[] = [
    {
      id: "general",
      title: "General Settings",
      icon: "⚙️",
      description: "Basic system configuration and preferences",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "🔔",
      description: "Email and notification preferences",
    },
    {
      id: "security",
      title: "Security",
      icon: "🔒",
      description: "Security policies and authentication settings",
    },
    {
      id: "backup",
      title: "Backup & Recovery",
      icon: "💾",
      description: "Data backup and recovery configuration",
    },
    {
      id: "sla",
      title: "SLA Settings",
      icon: "⏱️",
      description: "Service level agreement configuration",
    },
    {
      id: "customization",
      title: "Customization",
      icon: "🎨",
      description: "Custom fields, statuses, and workflows",
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: "🔗",
      description: "Third-party service integrations",
    },
    {
      id: "advanced",
      title: "Advanced",
      icon: "🔧",
      description: "Advanced system settings and maintenance",
    },
  ];

  const handleInputChange = (
    field: string,
    value: string | boolean | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving settings:", formData);
    // Here you would typically send the data to your API
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h2>General Settings</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            id="companyName"
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="supportEmail">Support Email</label>
          <input
            id="supportEmail"
            type="email"
            value={formData.supportEmail}
            onChange={(e) => handleInputChange("supportEmail", e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="defaultPriority">Default Ticket Priority</label>
          <select
            id="defaultPriority"
            value={formData.defaultPriority}
            onChange={(e) =>
              handleInputChange("defaultPriority", e.target.value)
            }
            className="form-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.autoAssignment}
              onChange={(e) =>
                handleInputChange("autoAssignment", e.target.checked)
              }
              className="form-checkbox"
            />
            Enable Auto-Assignment
          </label>
          <span className="form-help">
            Automatically assign tickets to available technicians
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="theme">Theme</label>
          <div className="theme-selector">
            <button
              className={`theme-option ${
                themeName === "light" ? "active" : ""
              }`}
              onClick={() => themeName === "dark" && toggleTheme()}
            >
              ☀️ Light
            </button>
            <button
              className={`theme-option ${themeName === "dark" ? "active" : ""}`}
              onClick={() => themeName === "light" && toggleTheme()}
            >
              🌙 Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h2>Notification Settings</h2>
      <div className="form-grid">
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={(e) =>
                handleInputChange("emailNotifications", e.target.checked)
              }
              className="form-checkbox"
            />
            Email Notifications
          </label>
          <span className="form-help">
            Send email notifications for ticket updates
          </span>
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.slackIntegration}
              onChange={(e) =>
                handleInputChange("slackIntegration", e.target.checked)
              }
              className="form-checkbox"
            />
            Slack Integration
          </label>
          <span className="form-help">
            Send notifications to Slack channels
          </span>
        </div>
        <div className="notification-types">
          <h3>Notification Types</h3>
          <div className="notification-grid">
            {[
              { id: "new-ticket", label: "New Ticket Created" },
              { id: "ticket-assigned", label: "Ticket Assigned" },
              { id: "ticket-updated", label: "Ticket Updated" },
              { id: "ticket-resolved", label: "Ticket Resolved" },
              { id: "sla-warning", label: "SLA Warning" },
              { id: "overdue-ticket", label: "Overdue Ticket" },
            ].map((notification) => (
              <label key={notification.id} className="checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  defaultChecked
                />
                {notification.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h2>Security Settings</h2>
      <div className="form-grid">
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.twoFactorAuth}
              onChange={(e) =>
                handleInputChange("twoFactorAuth", e.target.checked)
              }
              className="form-checkbox"
            />
            Two-Factor Authentication
          </label>
          <span className="form-help">Require 2FA for all admin users</span>
        </div>
        <div className="form-group">
          <label htmlFor="passwordPolicy">Password Policy</label>
          <select
            id="passwordPolicy"
            value={formData.passwordPolicy}
            onChange={(e) =>
              handleInputChange("passwordPolicy", e.target.value)
            }
            className="form-select"
          >
            <option value="weak">Weak (6+ characters)</option>
            <option value="medium">Medium (8+ characters, mixed case)</option>
            <option value="strong">
              Strong (12+ characters, mixed case, numbers, symbols)
            </option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
          <input
            id="sessionTimeout"
            type="number"
            value={formData.sessionTimeout}
            onChange={(e) =>
              handleInputChange("sessionTimeout", e.target.value)
            }
            className="form-input"
            min="5"
            max="480"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ipWhitelist">IP Whitelist</label>
          <textarea
            id="ipWhitelist"
            value={formData.ipWhitelist}
            onChange={(e) => handleInputChange("ipWhitelist", e.target.value)}
            className="form-textarea"
            placeholder="Enter IP addresses or ranges, one per line"
            rows={4}
          />
          <span className="form-help">Leave empty to allow all IPs</span>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="settings-section">
      <h2>Backup & Recovery</h2>
      <div className="form-grid">
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.backupEnabled}
              onChange={(e) =>
                handleInputChange("backupEnabled", e.target.checked)
              }
              className="form-checkbox"
            />
            Enable Automatic Backups
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="backupFrequency">Backup Frequency</label>
          <select
            id="backupFrequency"
            value={formData.backupFrequency}
            onChange={(e) =>
              handleInputChange("backupFrequency", e.target.value)
            }
            className="form-select"
            disabled={!formData.backupEnabled}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="retentionPeriod">Retention Period (days)</label>
          <input
            id="retentionPeriod"
            type="number"
            value={formData.retentionPeriod}
            onChange={(e) =>
              handleInputChange("retentionPeriod", e.target.value)
            }
            className="form-input"
            min="1"
            max="365"
            disabled={!formData.backupEnabled}
          />
        </div>
        <div className="backup-actions">
          <Button variant="outline" size="sm">
            Create Backup Now
          </Button>
          <Button variant="outline" size="sm">
            Restore from Backup
          </Button>
          <Button variant="outline" size="sm">
            Download Backup
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSLASettings = () => (
    <div className="settings-section">
      <h2>SLA Settings</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="slaResponseTime">Response Time (hours)</label>
          <input
            id="slaResponseTime"
            type="number"
            value={formData.slaResponseTime}
            onChange={(e) =>
              handleInputChange("slaResponseTime", e.target.value)
            }
            className="form-input"
            min="1"
            max="72"
          />
        </div>
        <div className="form-group">
          <label htmlFor="slaResolutionTime">Resolution Time (hours)</label>
          <input
            id="slaResolutionTime"
            type="number"
            value={formData.slaResolutionTime}
            onChange={(e) =>
              handleInputChange("slaResolutionTime", e.target.value)
            }
            className="form-input"
            min="1"
            max="168"
          />
        </div>
        <div className="form-group">
          <label htmlFor="businessHours">Business Hours</label>
          <select
            id="businessHours"
            value={formData.businessHours}
            onChange={(e) => handleInputChange("businessHours", e.target.value)}
            className="form-select"
          >
            <option value="24/7">24/7</option>
            <option value="9-17">9 AM - 5 PM</option>
            <option value="8-18">8 AM - 6 PM</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div className="form-group">
          <label>Working Days</label>
          <div className="days-selector">
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => (
              <label key={day} className="day-label">
                <input
                  type="checkbox"
                  checked={formData.workingDays.includes(day)}
                  onChange={(e) => {
                    const newDays = e.target.checked
                      ? [...formData.workingDays, day]
                      : formData.workingDays.filter((d) => d !== day);
                    handleInputChange("workingDays", newDays);
                  }}
                  className="form-checkbox"
                />
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsContent = () => {
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
      default:
        return (
          <div className="settings-section">
            <h2>{sections.find((s) => s.id === activeSection)?.title}</h2>
            <div className="placeholder-content">
              <p>
                Settings for{" "}
                {sections.find((s) => s.id === activeSection)?.title} will be
                implemented here.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <PageLayout>
      <div className="settings-page">
        <div className="settings-header">
          <div className="header-content">
            <h1>Settings</h1>
            <p>Configure your IT support system</p>
          </div>
          <div className="header-actions">
            <Button variant="outline" size="sm">
              Reset to Defaults
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="settings-layout">
          <div className="settings-sidebar">
            <div className="settings-menu">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`menu-item ${
                    activeSection === section.id ? "active" : ""
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="menu-icon">{section.icon}</div>
                  <div className="menu-content">
                    <div className="menu-title">{section.title}</div>
                    <div className="menu-description">
                      {section.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="settings-content">
            <Card className="settings-card">{renderSettingsContent()}</Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export { SettingsPage };
