import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaCog,
  FaRoute,
  FaEnvelope,
} from "react-icons/fa";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import type { Priority, Category } from "../../types";
import "./TicketRules.css";

interface TicketRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RuleCondition {
  field: string;
  operator:
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan";
  value: string;
}

interface RuleAction {
  type:
    | "assign"
    | "setStatus"
    | "setPriority"
    | "setCategory"
    | "addTag"
    | "sendEmail"
    | "createTask";
  value: string;
}

interface AutoResponseTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
  triggerEvent:
    | "ticket_created"
    | "ticket_updated"
    | "ticket_resolved"
    | "ticket_closed";
  conditions: RuleCondition[];
}

interface SLASettings {
  id: string;
  name: string;
  category: Category;
  priority: Priority;
  responseTime: number; // in hours
  resolutionTime: number; // in hours
  isActive: boolean;
}

export const TicketRules: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"rules" | "templates" | "sla">(
    "rules"
  );
  const [rules, setRules] = useState<TicketRule[]>([]);
  const [templates, setTemplates] = useState<AutoResponseTemplate[]>([]);
  const [slaSettings, setSlaSettings] = useState<SLASettings[]>([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSLAModal, setShowSLAModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<TicketRule | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<AutoResponseTemplate | null>(null);
  const [selectedSLA, setSelectedSLA] = useState<SLASettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRulesData();
  }, []);

  const loadRulesData = async () => {
    try {
      setLoading(true);

      // Mock data - in real implementation, this would come from API
      setRules([
        {
          id: "1",
          name: "Auto-assign Network Issues",
          description:
            "Automatically assign network-related tickets to network team",
          isActive: true,
          conditions: [
            { field: "category", operator: "equals", value: "network" },
          ],
          actions: [{ type: "assign", value: "network-team" }],
          priority: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Escalate Critical Issues",
          description: "Auto-escalate critical priority tickets after 1 hour",
          isActive: true,
          conditions: [
            { field: "priority", operator: "equals", value: "critical" },
            { field: "age", operator: "greaterThan", value: "1" },
          ],
          actions: [
            { type: "assign", value: "senior-technician" },
            { type: "sendEmail", value: "manager@company.com" },
          ],
          priority: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      setTemplates([
        {
          id: "1",
          name: "Ticket Acknowledgment",
          subject: "Ticket #{ticket.id} - We've received your request",
          body: "Thank you for submitting your request. We have received your ticket and will respond within our SLA timeframe.",
          isActive: true,
          triggerEvent: "ticket_created",
          conditions: [],
        },
        {
          id: "2",
          name: "Ticket Resolution",
          subject: "Ticket #{ticket.id} - Resolved",
          body: "Your ticket has been resolved. Please review the solution and let us know if you need further assistance.",
          isActive: true,
          triggerEvent: "ticket_resolved",
          conditions: [],
        },
      ]);

      setSlaSettings([
        {
          id: "1",
          name: "Critical Hardware Issues",
          category: "hardware",
          priority: "critical",
          responseTime: 1,
          resolutionTime: 4,
          isActive: true,
        },
        {
          id: "2",
          name: "Network Issues",
          category: "network",
          priority: "high",
          responseTime: 2,
          resolutionTime: 8,
          isActive: true,
        },
        {
          id: "3",
          name: "Software Support",
          category: "software",
          priority: "medium",
          responseTime: 4,
          resolutionTime: 24,
          isActive: true,
        },
      ]);
    } catch (error) {
      console.error("Error loading rules data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
  };

  const handleToggleTemplate = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, isActive: !template.isActive }
          : template
      )
    );
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates((prev) =>
      prev.filter((template) => template.id !== templateId)
    );
  };

  const handleToggleSLA = (slaId: string) => {
    setSlaSettings((prev) =>
      prev.map((sla) =>
        sla.id === slaId ? { ...sla, isActive: !sla.isActive } : sla
      )
    );
  };

  const handleDeleteSLA = (slaId: string) => {
    setSlaSettings((prev) => prev.filter((sla) => sla.id !== slaId));
  };

  if (loading) {
    return (
      <div className="ticket-rules">
        <div className="loading-spinner">Loading rules...</div>
      </div>
    );
  }

  return (
    <div className="ticket-rules">
      <div className="rules-header">
        <h1>Ticket Rules & Automation</h1>
        <p>Manage ticket routing, auto-responses, and SLA settings</p>
      </div>

      {/* Navigation Tabs */}
      <div className="rules-tabs">
        <button
          className={`tab-button ${activeTab === "rules" ? "active" : ""}`}
          onClick={() => setActiveTab("rules")}
        >
          <FaRoute />
          Routing Rules
        </button>
        <button
          className={`tab-button ${activeTab === "templates" ? "active" : ""}`}
          onClick={() => setActiveTab("templates")}
        >
          <FaEnvelope />
          Auto-Response Templates
        </button>
        <button
          className={`tab-button ${activeTab === "sla" ? "active" : ""}`}
          onClick={() => setActiveTab("sla")}
        >
          <FaCog />
          SLA Settings
        </button>
      </div>

      {/* Rules Tab */}
      {activeTab === "rules" && (
        <Card>
          <div className="section-header">
            <h2>Ticket Routing Rules</h2>
            <Button variant="primary" onClick={() => setShowRuleModal(true)}>
              <FaPlus />
              Add Rule
            </Button>
          </div>

          <div className="rules-list">
            {rules.map((rule) => (
              <div key={rule.id} className="rule-item">
                <div className="rule-info">
                  <div className="rule-header">
                    <h3>{rule.name}</h3>
                    <div className="rule-actions">
                      <button
                        className="toggle-button"
                        onClick={() => handleToggleRule(rule.id)}
                      >
                        {rule.isActive ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRule(rule);
                          setShowRuleModal(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  <p className="rule-description">{rule.description}</p>
                  <div className="rule-details">
                    <div className="conditions">
                      <h4>Conditions:</h4>
                      <ul>
                        {rule.conditions.map((condition, index) => (
                          <li key={index}>
                            {condition.field} {condition.operator} "
                            {condition.value}"
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="actions">
                      <h4>Actions:</h4>
                      <ul>
                        {rule.actions.map((action, index) => (
                          <li key={index}>
                            {action.type}: {action.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <Card>
          <div className="section-header">
            <h2>Auto-Response Templates</h2>
            <Button
              variant="primary"
              onClick={() => setShowTemplateModal(true)}
            >
              <FaPlus />
              Add Template
            </Button>
          </div>

          <div className="templates-list">
            {templates.map((template) => (
              <div key={template.id} className="template-item">
                <div className="template-info">
                  <div className="template-header">
                    <h3>{template.name}</h3>
                    <div className="template-actions">
                      <button
                        className="toggle-button"
                        onClick={() => handleToggleTemplate(template.id)}
                      >
                        {template.isActive ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowTemplateModal(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  <p>
                    <strong>Subject:</strong> {template.subject}
                  </p>
                  <p>
                    <strong>Trigger:</strong>{" "}
                    {template.triggerEvent.replace("_", " ")}
                  </p>
                  <div className="template-preview">
                    <h4>Body Preview:</h4>
                    <p>{template.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* SLA Tab */}
      {activeTab === "sla" && (
        <Card>
          <div className="section-header">
            <h2>SLA Settings</h2>
            <Button variant="primary" onClick={() => setShowSLAModal(true)}>
              <FaPlus />
              Add SLA Rule
            </Button>
          </div>

          <div className="sla-list">
            {slaSettings.map((sla) => (
              <div key={sla.id} className="sla-item">
                <div className="sla-info">
                  <div className="sla-header">
                    <h3>{sla.name}</h3>
                    <div className="sla-actions">
                      <button
                        className="toggle-button"
                        onClick={() => handleToggleSLA(sla.id)}
                      >
                        {sla.isActive ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSLA(sla);
                          setShowSLAModal(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSLA(sla.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  <div className="sla-details">
                    <div className="sla-criteria">
                      <span className="sla-tag category">{sla.category}</span>
                      <span className="sla-tag priority">{sla.priority}</span>
                    </div>
                    <div className="sla-times">
                      <div className="sla-time">
                        <span className="time-label">Response Time:</span>
                        <span className="time-value">{sla.responseTime}h</span>
                      </div>
                      <div className="sla-time">
                        <span className="time-label">Resolution Time:</span>
                        <span className="time-value">
                          {sla.resolutionTime}h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modals would go here - simplified for now */}
      {showRuleModal && (
        <Modal
          isOpen={showRuleModal}
          onClose={() => {
            setShowRuleModal(false);
            setSelectedRule(null);
          }}
          title={selectedRule ? "Edit Rule" : "Add New Rule"}
        >
          <div className="rule-form">
            <p>Rule form implementation would go here</p>
          </div>
        </Modal>
      )}

      {showTemplateModal && (
        <Modal
          isOpen={showTemplateModal}
          onClose={() => {
            setShowTemplateModal(false);
            setSelectedTemplate(null);
          }}
          title={selectedTemplate ? "Edit Template" : "Add New Template"}
        >
          <div className="template-form">
            <p>Template form implementation would go here</p>
          </div>
        </Modal>
      )}

      {showSLAModal && (
        <Modal
          isOpen={showSLAModal}
          onClose={() => {
            setShowSLAModal(false);
            setSelectedSLA(null);
          }}
          title={selectedSLA ? "Edit SLA" : "Add New SLA Rule"}
        >
          <div className="sla-form">
            <p>SLA form implementation would go here</p>
          </div>
        </Modal>
      )}
    </div>
  );
};
