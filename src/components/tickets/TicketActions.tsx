import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaUserPlus,
  FaLevelUpAlt,
  FaCheck,
  FaPaperclip,
  FaClock,
  FaExternalLinkAlt,
  FaPrint,
  FaDownload,
  FaEye,
  FaEyeSlash,
  FaComments,
} from "react-icons/fa";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { Card } from "../common/Card";
import { Form, FormField, Input, Select, Textarea } from "../common/Form";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import {
  getNotes,
  getTimeEntries,
  getTicketHistory,
  getAttachments,
  getAvailableAgents,
  assignTicket,
  updateStatus,
  closeTicket,
  addNote,
  addTimeEntry,
  watchTicket,
  unwatchTicket,
  printTicket,
  exportTicket
} from "../../services/ticketActionsService";
import type {
  Ticket,
  TicketStatus,
  Priority,
  User,
  TicketNote,
  TimeEntry,
  TicketHistory,
  Attachment,
} from "../../types";
import "./TicketActions.css";

interface TicketActionsProps {
  ticket: Ticket;
  onTicketUpdate: (ticket: Ticket) => void;
  onClose?: () => void;
}

interface ActionModalState {
  type:
    | "status"
    | "assign"
    | "escalate"
    | "note"
    | "time"
    | "link"
    | "close"
    | "approve"
    | null;
  isOpen: boolean;
  data?: Record<string, unknown>;
}

export const TicketActions: React.FC<TicketActionsProps> = ({
  ticket,
  onTicketUpdate,
  onClose,
}) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [modal, setModal] = useState<ActionModalState>({
    type: null,
    isOpen: false,
  });
  const [agents, setAgents] = useState<User[]>([]);
  const [notes, setNotes] = useState<TicketNote[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [history, setHistory] = useState<TicketHistory[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isWatching, setIsWatching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "details" | "notes" | "time" | "history" | "attachments"
  >("details");

  // Utility function for notifications
  const showNotification = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    addNotification({
      type,
      title:
        type === "success"
          ? "Success"
          : type === "error"
          ? "Error"
          : type === "warning"
          ? "Warning"
          : "Info",
      message,
    });
  };

  // Load additional data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [notesRes, timeRes, historyRes, attachmentsRes] =
          await Promise.all([
            getNotes(ticket.id),
            getTimeEntries(ticket.id),
            getTicketHistory(ticket.id),
            getAttachments(ticket.id),
          ]);

        setNotes(notesRes.data);
        setTimeEntries(timeRes.data);
        setHistory(historyRes.data);
        setAttachments(attachmentsRes.data);
      } catch (error: unknown) {
        console.error("Failed to load ticket data:", error);
      }
    };

    loadData();
  }, [ticket.id]);

  const loadAvailableAgents = async () => {
    try {
      const response = await getAvailableAgents(ticket.id);
      setAgents(response.data);
    } catch (error: unknown) {
      console.error("Failed to load agents:", error);
    }
  };

  const handleStatusUpdate = async (formData: Record<string, unknown>) => {
    try {
      setLoading(true);
      const response = await updateStatus(
        ticket.id,
        { status: formData.status as TicketStatus, note: formData.note as string }
      );

      onTicketUpdate(response.data);
      addNotification({
        type: "success",
        title: "Status Updated",
        message: `Ticket status updated to ${formData.status}`,
      });
      setModal({ type: null, isOpen: false });
    } catch (error: unknown) {
      console.error("Failed to update ticket status:", error);
      addNotification({
        type: "error",
        title: "Update Failed",
        message: "Failed to update ticket status",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async (formData: Record<string, unknown>) => {
    try {
      setLoading(true);
      const response = await assignTicket(ticket.id, {
        userId: formData.userId as string,
        note: formData.note as string,
        notifyUser: formData.notifyUser as boolean,
      });

      onTicketUpdate(response.data);
      addNotification({
        type: "success",
        title: "Success",
        message: "Ticket assigned successfully",
      });
      setModal({ type: null, isOpen: false });
    } catch (error: unknown) {
      console.error("Failed to assign ticket:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to assign ticket",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (formData: Record<string, unknown>) => {
    try {
      setLoading(true);
      const response = await addNote(ticket.id, {
        content: formData.content as string,
        isInternal: (formData.isInternal as boolean) || false,
        attachments: formData.attachments as File[],
      });

      setNotes((prev) => [...prev, response.data]);
      showNotification("success", "Note added successfully");
      setModal({ type: null, isOpen: false });
    } catch (error: unknown) {
      console.error("Failed to add note:", error);
      showNotification("error", "Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeEntry = async (formData: Record<string, unknown>) => {
    try {
      setLoading(true);
      const response = await addTimeEntry(
        ticket.id,
        {
          hours: formData.hours as number,
          description: formData.description as string,
          date: formData.date ? new Date(formData.date as string) : new Date()
        }
      );

      setTimeEntries((prev) => [...prev, response.data]);
      showNotification("success", "Time entry added successfully");
      setModal({ type: null, isOpen: false });
    } catch (error: unknown) {
      console.error("Failed to add time entry:", error);
      showNotification("error", "Failed to add time entry");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTicket = async (formData: Record<string, unknown>) => {
    try {
      setLoading(true);
      const response = await closeTicket(
        ticket.id,
        {
          resolution: formData.resolution as string,
          satisfactionRating: formData.satisfactionRating as number
        }
      );

      onTicketUpdate(response.data);
      showNotification("success", "Ticket closed successfully");
      setModal({ type: null, isOpen: false });
    } catch (error: unknown) {
      console.error("Failed to close ticket:", error);
      showNotification("error", "Failed to close ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleWatchToggle = async () => {
    try {
      if (isWatching) {
        await unwatchTicket(ticket.id);
        setIsWatching(false);
        showNotification("success", "Stopped watching ticket");
      } else {
        await watchTicket(ticket.id);
        setIsWatching(true);
        showNotification("success", "Now watching ticket");
      }
    } catch (error: unknown) {
      console.error("Failed to update watch status:", error);
      showNotification("error", "Failed to update watch status");
    }
  };

  const handlePrint = async () => {
    try {
      const response = await printTicket(ticket.id);
      window.open(response.data.url, "_blank");
    } catch (error: unknown) {
      console.error("Failed to generate print version:", error);
      showNotification("error", "Failed to generate print version");
    }
  };

  const handleExport = async (format: "pdf" | "csv") => {
    try {
      const response = await exportTicket(
        ticket.id,
        format
      );
      window.open(response.data.url, "_blank");
    } catch (error: unknown) {
      console.error("Failed to export ticket:", error);
      showNotification("error", "Failed to export ticket");
    }
  };

  const openModal = (
    type: ActionModalState["type"],
    data?: Record<string, unknown>
  ) => {
    setModal({ type, isOpen: true, data });
    if (type === "assign" || type === "escalate") {
      loadAvailableAgents();
    }
  };

  // Form submission wrappers
  const handleFormSubmit = (
    handler: (data: Record<string, unknown>) => Promise<void>
  ) => {
    return async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const data: Record<string, unknown> = {};

      formData.forEach((value, key) => {
        if (key === "hours" || key === "satisfactionRating") {
          data[key] = parseFloat(value.toString());
        } else if (
          key === "notifyUser" ||
          key === "notifyManagement" ||
          key === "isInternal"
        ) {
          data[key] = value === "on" || value === "true";
        } else {
          data[key] = value;
        }
      });

      await handler(data);
    };
  };

  const closeModal = () => {
    setModal({ type: null, isOpen: false });
  };

  const getStatusColor = (status: TicketStatus): string => {
    switch (status) {
      case "RAISED":
        return "#dc3545";
      case "IN_PROGRESS":
        return "#007bff";
      case "PENDING_APPROVAL":
        return "#ffc107";
      case "RESOLVED":
        return "#28a745";
      case "APPROVED":
        return "#28a745";
      case "REJECTED":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case "CRITICAL":
        return "#dc3545";
      case "HIGH":
        return "#fd7e14";
      case "MEDIUM":
        return "#ffc107";
      case "LOW":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  const canUpdateStatus = () => {
    // Logic to determine if user can update status
    return (
      user?.role === "admin" ||
      user?.role === "it_staff" ||
      ticket.assignedTo === user?.id
    );
  };

  const canAssign = () => {
    // Logic to determine if user can assign tickets
    return (
      user?.role === "admin" ||
      user?.role === "manager" ||
      user?.role === "it_staff"
    );
  };

  const canEscalate = () => {
    // Logic to determine if user can escalate tickets
    return (
      user?.role === "admin" ||
      user?.role === "it_staff" ||
      ticket.assignedTo === user?.id
    );
  };

  return (
    <div className="ticket-actions">
      <div className="ticket-actions-header">
        <div className="ticket-info">
          <h2>
            #{ticket.id} - {ticket.title}
          </h2>
          <div className="ticket-meta">
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(ticket.status) }}
            >
              {ticket.status.replace("_", " ").toUpperCase()}
            </span>
            <span
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(ticket.priority) }}
            >
              {ticket.priority.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ticket-actions-buttons">
          <Button
            variant="outline"
            size="sm"
            icon={<FaPrint />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<FaDownload />}
            onClick={() => handleExport("pdf")}
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={isWatching ? <FaEyeSlash /> : <FaEye />}
            onClick={handleWatchToggle}
          >
            {isWatching ? "Unwatch" : "Watch"}
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <div className="action-buttons">
          {canUpdateStatus() && (
            <Button
              variant="primary"
              size="sm"
              icon={<FaEdit />}
              onClick={() => openModal("status")}
            >
              Update Status
            </Button>
          )}
          {canAssign() && (
            <Button
              variant="outline"
              size="sm"
              icon={<FaUserPlus />}
              onClick={() => openModal("assign")}
            >
              Assign
            </Button>
          )}
          {canEscalate() && (
            <Button
              variant="outline"
              size="sm"
              icon={<FaLevelUpAlt />}
              onClick={() => openModal("escalate")}
            >
              Escalate
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            icon={<FaComments />}
            onClick={() => openModal("note")}
          >
            Add Note
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<FaClock />}
            onClick={() => openModal("time")}
          >
            Log Time
          </Button>
          {ticket.status !== "RESOLVED" && ticket.status !== "APPROVED" && (
            <Button
              variant="success"
              size="sm"
              icon={<FaCheck />}
              onClick={() => openModal("close")}
            >
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="ticket-details-tabs">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`tab-button ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            Notes ({notes.length})
          </button>
          <button
            className={`tab-button ${activeTab === "time" ? "active" : ""}`}
            onClick={() => setActiveTab("time")}
          >
            Time ({timeEntries.length})
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            History ({history.length})
          </button>
          <button
            className={`tab-button ${
              activeTab === "attachments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("attachments")}
          >
            Attachments ({attachments.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "details" && (
            <Card className="ticket-details">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Description:</label>
                  <p>{ticket.description}</p>
                </div>
                <div className="detail-item">
                  <label>Category:</label>
                  <p>{ticket.category}</p>
                </div>
                <div className="detail-item">
                  <label>Created:</label>
                  <p>{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                <div className="detail-item">
                  <label>Assigned To:</label>
                  <p>{ticket.assignedTo || "Unassigned"}</p>
                </div>
                <div className="detail-item">
                  <label>SLA Deadline:</label>
                  <p>{new Date(ticket.slaDeadline).toLocaleString()}</p>
                </div>
                <div className="detail-item">
                  <label>Tags:</label>
                  <div className="tags">
                    {ticket.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "notes" && (
            <div className="notes-list">
              {notes.map((note) => (
                <Card key={note.id} className="note-item">
                  <div className="note-header">
                    <span className="note-author">{note.userId}</span>
                    <span className="note-date">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                    {note.isInternal && (
                      <span className="internal-badge">Internal</span>
                    )}
                  </div>
                  <div className="note-content">
                    <p>{note.content}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "time" && (
            <div className="time-entries">
              {timeEntries.map((entry) => (
                <Card key={entry.id} className="time-entry">
                  <div className="time-header">
                    <span className="time-user">{entry.userId}</span>
                    <span className="time-hours">{entry.hours}h</span>
                    <span className="time-date">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="time-description">{entry.description}</p>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "history" && (
            <div className="history-list">
              {history.map((entry) => (
                <Card key={entry.id} className="history-item">
                  <div className="history-header">
                    <span className="history-user">{entry.userId}</span>
                    <span className="history-action">{entry.action}</span>
                    <span className="history-date">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="history-changes">
                    {Object.entries(entry.changes).map(([field, change]) => (
                      <div key={field} className="change-item">
                        <strong>{field}:</strong> {String(change.from)} →{" "}
                        {String(change.to)}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "attachments" && (
            <div className="attachments-list">
              {attachments.map((attachment) => (
                <Card key={attachment.id} className="attachment-item">
                  <div className="attachment-info">
                    <FaPaperclip />
                    <span className="attachment-name">
                      {attachment.originalName}
                    </span>
                    <span className="attachment-size">
                      {(attachment.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="attachment-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FaExternalLinkAlt />}
                      onClick={() => window.open(attachment.url, "_blank")}
                    >
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modals */}
      <Modal
        isOpen={modal.isOpen && modal.type === "status"}
        onClose={closeModal}
        title="Update Status"
      >
        <Form onSubmit={handleFormSubmit(handleStatusUpdate)}>
          <FormField label="New Status" required>
            <Select
              name="status"
              required
              options={[
                { value: "RAISED", label: "Raised" },
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "PENDING_APPROVAL", label: "Pending Approval" },
                { value: "RESOLVED", label: "Resolved" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
              ]}
            />
          </FormField>
          <FormField label="Note">
            <Textarea
              name="note"
              placeholder="Add a note about the status change..."
            />
          </FormField>
          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        isOpen={modal.isOpen && modal.type === "assign"}
        onClose={closeModal}
        title="Assign Ticket"
      >
        <Form onSubmit={handleFormSubmit(handleAssignment)}>
          <FormField label="Assign To" required>
            <Select
              name="userId"
              required
              options={agents.map((agent) => ({
                value: agent.id,
                label: `${agent.firstName} ${agent.lastName}`,
              }))}
            />
          </FormField>
          <FormField label="Note">
            <Textarea
              name="note"
              placeholder="Add a note about the assignment..."
            />
          </FormField>
          <FormField label="Notify User">
            <Input type="checkbox" name="notifyUser" defaultChecked={true} />
          </FormField>
          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? "Assigning..." : "Assign Ticket"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        isOpen={modal.isOpen && modal.type === "note"}
        onClose={closeModal}
        title="Add Note"
      >
        <Form onSubmit={handleFormSubmit(handleAddNote)}>
          <FormField label="Note Content" required>
            <Textarea
              name="content"
              required
              placeholder="Enter your note..."
            />
          </FormField>
          <FormField label="Internal Note">
            <Input type="checkbox" name="isInternal" />
          </FormField>
          <FormField label="Attachments">
            <Input type="file" name="attachments" multiple />
          </FormField>
          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Note"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        isOpen={modal.isOpen && modal.type === "time"}
        onClose={closeModal}
        title="Log Time"
      >
        <Form onSubmit={handleFormSubmit(handleAddTimeEntry)}>
          <FormField label="Hours" required>
            <Input type="number" name="hours" required min="0" step="0.25" />
          </FormField>
          <FormField label="Description" required>
            <Textarea
              name="description"
              required
              placeholder="Describe the work performed..."
            />
          </FormField>
          <FormField label="Date">
            <Input
              type="date"
              name="date"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </FormField>
          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? "Logging..." : "Log Time"}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        isOpen={modal.isOpen && modal.type === "close"}
        onClose={closeModal}
        title="Close Ticket"
      >
        <Form onSubmit={handleFormSubmit(handleCloseTicket)}>
          <FormField label="Resolution" required>
            <Textarea
              name="resolution"
              required
              placeholder="Describe how the issue was resolved..."
            />
          </FormField>
          <FormField label="Satisfaction Rating">
            <Select
              name="satisfactionRating"
              options={[
                { value: "5", label: "5 - Excellent" },
                { value: "4", label: "4 - Good" },
                { value: "3", label: "3 - Average" },
                { value: "2", label: "2 - Poor" },
                { value: "1", label: "1 - Very Poor" },
              ]}
            />
          </FormField>
          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? "Closing..." : "Close Ticket"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
