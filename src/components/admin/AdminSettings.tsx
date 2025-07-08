import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaBell,
  FaPlug,
  FaHistory,
  FaShieldAlt,
  FaLock,
  FaDownload,
  FaTrash,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaUndo,
} from "react-icons/fa";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { TicketRules } from "../admin/TicketRules";
import "./AdminSettings.css";

interface CompanySettings {
  name: string;
  logo: string;
  website: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  timezone: string;
  businessHours: {
    start: string;
    end: string;
    days: string[];
  };
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    ticketCreated: boolean;
    ticketUpdated: boolean;
    ticketResolved: boolean;
    slaBreached: boolean;
    escalations: boolean;
  };
  slack: {
    enabled: boolean;
    webhookUrl: string;
    channels: {
      general: string;
      critical: string;
      escalations: string;
    };
  };
  sms: {
    enabled: boolean;
    provider: string;
    apiKey: string;
  };
}

interface Integration {
  id: string;
  name: string;
  type: "active_directory" | "slack" | "email" | "webhook" | "api";
  status: "active" | "inactive" | "error";
  lastSync: Date;
  settings: Record<string, unknown>;
}

interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  details: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "company"
    | "notifications"
    | "integrations"
    | "audit"
    | "rules"
    | "security"
  >("company");
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: "Your Company",
    logo: "",
    website: "https://yourcompany.com",
    supportEmail: "support@yourcompany.com",
    supportPhone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    timezone: "America/New_York",
    businessHours: {
      start: "09:00",
      end: "17:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  });
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      email: {
        enabled: true,
        ticketCreated: true,
        ticketUpdated: true,
        ticketResolved: true,
        slaBreached: true,
        escalations: true,
      },
      slack: {
        enabled: false,
        webhookUrl: "",
        channels: {
          general: "#general",
          critical: "#critical",
          escalations: "#escalations",
        },
      },
      sms: {
        enabled: false,
        provider: "twilio",
        apiKey: "",
      },
    });
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      setLoading(true);

      // Mock data - in real implementation, this would come from API
      setIntegrations([
        {
          id: "1",
          name: "Active Directory",
          type: "active_directory",
          status: "active",
          lastSync: new Date(),
          settings: {
            server: "ldap://ad.company.com",
            domain: "company.com",
            syncInterval: 24,
          },
        },
        {
          id: "2",
          name: "Slack Integration",
          type: "slack",
          status: "inactive",
          lastSync: new Date(),
          settings: {
            webhookUrl: "",
            botToken: "",
          },
        },
        {
          id: "3",
          name: "Email Server",
          type: "email",
          status: "active",
          lastSync: new Date(),
          settings: {
            smtpServer: "smtp.gmail.com",
            port: 587,
            encryption: "TLS",
          },
        },
      ]);

      // Mock audit logs
      const mockAuditLogs: AuditLog[] = [
        {
          id: "1",
          userId: "admin1",
          userEmail: "admin@company.com",
          action: "LOGIN",
          resource: "System",
          details: "User logged in successfully",
          timestamp: new Date(),
          ipAddress: "192.168.1.100",
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        {
          id: "2",
          userId: "admin1",
          userEmail: "admin@company.com",
          action: "UPDATE",
          resource: "Ticket",
          details: "Updated ticket #T001 status to resolved",
          timestamp: new Date(Date.now() - 3600000),
          ipAddress: "192.168.1.100",
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        {
          id: "3",
          userId: "user1",
          userEmail: "user@company.com",
          action: "CREATE",
          resource: "Ticket",
          details: "Created new ticket #T002",
          timestamp: new Date(Date.now() - 7200000),
          ipAddress: "192.168.1.101",
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
      ];
      setAuditLogs(mockAuditLogs);
    } catch (error) {
      console.error("Error loading settings data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      // In real implementation, this would save to API
      console.log("Saving settings...");
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setHasChanges(false);
    loadSettingsData();
  };

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              status: integration.status === "active" ? "inactive" : "active",
            }
          : integration
      )
    );
    setHasChanges(true);
  };

  const handleDeleteIntegration = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.filter((integration) => integration.id !== integrationId)
    );
    setHasChanges(true);
  };

  const exportAuditLogs = () => {
    const csvContent = [
      ["Timestamp", "User", "Action", "Resource", "Details", "IP Address"].join(
        ","
      ),
      ...auditLogs.map((log) =>
        [
          log.timestamp.toISOString(),
          log.userEmail,
          log.action,
          log.resource,
          log.details,
          log.ipAddress,
        ].join(",")
      ),
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-logs.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="admin-settings">
        <div className="loading-spinner">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h1>Admin Settings</h1>
        <div className="settings-actions">
          {hasChanges && (
            <>
              <Button variant="outline" onClick={handleResetSettings}>
                <FaUndo />
                Reset
              </Button>
              <Button variant="primary" onClick={handleSaveSettings}>
                <FaSave />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === "company" ? "active" : ""}`}
          onClick={() => setActiveTab("company")}
        >
          <FaBuilding />
          Company
        </button>
        <button
          className={`tab-button ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          <FaBell />
          Notifications
        </button>
        <button
          className={`tab-button ${
            activeTab === "integrations" ? "active" : ""
          }`}
          onClick={() => setActiveTab("integrations")}
        >
          <FaPlug />
          Integrations
        </button>
        <button
          className={`tab-button ${activeTab === "rules" ? "active" : ""}`}
          onClick={() => setActiveTab("rules")}
        >
          <FaShieldAlt />
          Rules & Automation
        </button>
        <button
          className={`tab-button ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <FaLock />
          Security
        </button>
        <button
          className={`tab-button ${activeTab === "audit" ? "active" : ""}`}
          onClick={() => setActiveTab("audit")}
        >
          <FaHistory />
          Audit Logs
        </button>
      </div>

      {/* Company Settings */}
      {activeTab === "company" && (
        <Card>
          <div className="settings-section">
            <h2>Company Information</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={companySettings.name}
                  onChange={(e) => {
                    setCompanySettings((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={companySettings.website}
                  onChange={(e) => {
                    setCompanySettings((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }));
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Support Email</label>
                <input
                  type="email"
                  value={companySettings.supportEmail}
                  onChange={(e) => {
                    setCompanySettings((prev) => ({
                      ...prev,
                      supportEmail: e.target.value,
                    }));
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Support Phone</label>
                <input
                  type="tel"
                  value={companySettings.supportPhone}
                  onChange={(e) => {
                    setCompanySettings((prev) => ({
                      ...prev,
                      supportPhone: e.target.value,
                    }));
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={companySettings.address}
                  onChange={(e) => {
                    setCompanySettings((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }));
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={companySettings.timezone}
                  onChange={(e) => {
                    setCompanySettings((prev) => ({
                      ...prev,
                      timezone: e.target.value,
                    }));
                    setHasChanges(true);
                  }}
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <Card>
          <div className="settings-section">
            <h2>Notification Settings</h2>
            <div className="notification-settings">
              <div className="notification-group">
                <h3>Email Notifications</h3>
                <div className="notification-options">
                  <div className="notification-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email.enabled}
                        onChange={(e) => {
                          setNotificationSettings((prev) => ({
                            ...prev,
                            email: { ...prev.email, enabled: e.target.checked },
                          }));
                          setHasChanges(true);
                        }}
                      />
                      Enable Email Notifications
                    </label>
                  </div>
                  <div className="notification-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email.ticketCreated}
                        onChange={(e) => {
                          setNotificationSettings((prev) => ({
                            ...prev,
                            email: {
                              ...prev.email,
                              ticketCreated: e.target.checked,
                            },
                          }));
                          setHasChanges(true);
                        }}
                      />
                      New Ticket Created
                    </label>
                  </div>
                  <div className="notification-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email.slaBreached}
                        onChange={(e) => {
                          setNotificationSettings((prev) => ({
                            ...prev,
                            email: {
                              ...prev.email,
                              slaBreached: e.target.checked,
                            },
                          }));
                          setHasChanges(true);
                        }}
                      />
                      SLA Breached
                    </label>
                  </div>
                </div>
              </div>

              <div className="notification-group">
                <h3>Slack Integration</h3>
                <div className="notification-options">
                  <div className="notification-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={notificationSettings.slack.enabled}
                        onChange={(e) => {
                          setNotificationSettings((prev) => ({
                            ...prev,
                            slack: { ...prev.slack, enabled: e.target.checked },
                          }));
                          setHasChanges(true);
                        }}
                      />
                      Enable Slack Notifications
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Webhook URL</label>
                    <input
                      type="url"
                      value={notificationSettings.slack.webhookUrl}
                      onChange={(e) => {
                        setNotificationSettings((prev) => ({
                          ...prev,
                          slack: { ...prev.slack, webhookUrl: e.target.value },
                        }));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Integrations */}
      {activeTab === "integrations" && (
        <Card>
          <div className="settings-section">
            <div className="section-header">
              <h2>Integrations</h2>
              <Button
                variant="primary"
                onClick={() => setShowIntegrationModal(true)}
              >
                <FaPlug />
                Add Integration
              </Button>
            </div>

            <div className="integrations-list">
              {integrations.map((integration) => (
                <div key={integration.id} className="integration-item">
                  <div className="integration-info">
                    <div className="integration-header">
                      <h3>{integration.name}</h3>
                      <div className="integration-status">
                        <span className={`status-badge ${integration.status}`}>
                          {integration.status}
                        </span>
                      </div>
                    </div>
                    <p className="integration-type">
                      {integration.type.replace("_", " ")}
                    </p>
                    <p className="integration-sync">
                      Last sync: {integration.lastSync.toLocaleString()}
                    </p>
                  </div>
                  <div className="integration-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleIntegration(integration.id)}
                    >
                      {integration.status === "active" ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                      {integration.status === "active" ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setShowIntegrationModal(true);
                      }}
                    >
                      <FaEdit />
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteIntegration(integration.id)}
                    >
                      <FaTrash />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Rules & Automation */}
      {activeTab === "rules" && <TicketRules />}

      {/* Security Settings */}
      {activeTab === "security" && (
        <Card>
          <div className="settings-section">
            <h2>Security Settings</h2>
            <div className="security-settings">
              <div className="security-group">
                <h3>Password Policy</h3>
                <div className="security-options">
                  <div className="security-option">
                    <label>Minimum password length: 8 characters</label>
                  </div>
                  <div className="security-option">
                    <label>Require special characters</label>
                  </div>
                  <div className="security-option">
                    <label>Password expiration: 90 days</label>
                  </div>
                </div>
              </div>

              <div className="security-group">
                <h3>Two-Factor Authentication</h3>
                <div className="security-options">
                  <div className="security-option">
                    <label>
                      <input type="checkbox" />
                      Require 2FA for all users
                    </label>
                  </div>
                  <div className="security-option">
                    <label>
                      <input type="checkbox" />
                      Require 2FA for admin users
                    </label>
                  </div>
                </div>
              </div>

              <div className="security-group">
                <h3>Session Management</h3>
                <div className="security-options">
                  <div className="security-option">
                    <label>Session timeout: 30 minutes</label>
                  </div>
                  <div className="security-option">
                    <label>Maximum concurrent sessions: 3</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Audit Logs */}
      {activeTab === "audit" && (
        <Card>
          <div className="settings-section">
            <div className="section-header">
              <h2>Audit Logs</h2>
              <Button variant="primary" onClick={exportAuditLogs}>
                <FaDownload />
                Export Logs
              </Button>
            </div>

            <div className="audit-logs">
              <div className="audit-filters">
                <input type="date" placeholder="From date" />
                <input type="date" placeholder="To date" />
                <select>
                  <option value="">All actions</option>
                  <option value="LOGIN">Login</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                </select>
                <input type="text" placeholder="Search user..." />
              </div>

              <div className="audit-list">
                {auditLogs.map((log) => (
                  <div key={log.id} className="audit-item">
                    <div className="audit-timestamp">
                      {log.timestamp.toLocaleString()}
                    </div>
                    <div className="audit-user">
                      <strong>{log.userEmail}</strong>
                    </div>
                    <div className="audit-action">
                      <span
                        className={`action-badge ${log.action.toLowerCase()}`}
                      >
                        {log.action}
                      </span>
                    </div>
                    <div className="audit-resource">{log.resource}</div>
                    <div className="audit-details">{log.details}</div>
                    <div className="audit-ip">{log.ipAddress}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Integration Modal */}
      {showIntegrationModal && (
        <Modal
          isOpen={showIntegrationModal}
          onClose={() => {
            setShowIntegrationModal(false);
            setSelectedIntegration(null);
          }}
          title={
            selectedIntegration
              ? `Configure ${selectedIntegration.name}`
              : "Add New Integration"
          }
        >
          <div className="integration-form">
            <p>
              Integration configuration form would be implemented here based on
              the integration type.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
