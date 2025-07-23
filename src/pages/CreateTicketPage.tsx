import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaPaperclip,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { getAllHelpdeskDepartments } from "../services/helpdeskDepartmentService";
import { createTicket, uploadAttachment } from "../services/ticketService";
import { TicketStatus } from "../types";
import "../styles/createModern.css";

interface TicketFormData {
  title: string;
  description: string;
  category: string;
  attachments: File[];
}

interface CategoryOption {
  id: string;
  name: string;
  isActive: boolean;
}

export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [formData, setFormData] = useState<TicketFormData>({
    title: "",
    description: "",
    category: "",
    attachments: [],
  });

  const [errors, setErrors] = useState<Partial<TicketFormData>>({});

  useEffect(() => {
    // Load categories from API
    const loadCategories = async () => {
      try {
        const response = await getAllHelpdeskDepartments();
        setCategories(response || []);
      } catch (error) {
        console.error("Failed to load categories:", error);

        // Show warning and fallback to default categories
        addNotification({
          type: "warning",
          title: "Categories Loading Failed",
          message: "Using default categories. Some options may be limited.",
        });
      }
    };

    loadCategories();
  }, [addNotification]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TicketFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addNotification({
        type: "warning",
        title: "⚠️ Form Validation Failed",
        message:
          "Please fill in all required fields before submitting your ticket.",
      });
      return;
    }

    setLoading(true);

    try {
      // Create ticket with simplified data
      const ticketData = {
        title: formData.title,
        description: formData.description,
        assignedDepartmentId: formData.category,
        requestedBy: user?.email || "",
        status: TicketStatus.RAISED,
        priority: "LOW", // Default priority
      };

      // Call the actual API to create ticket
      const response = await createTicket(ticketData);
      console.log("Ticket created successfully:", response);

      // If there are attachments, upload them
      if (formData.attachments.length > 0 && response.data?.id) {
        const ticketId = response.data.id;

        // Upload each attachment
        for (const file of formData.attachments) {
          try {
            await uploadAttachment(ticketId, file);
            console.log(`Attachment ${file.name} uploaded successfully`);
          } catch (attachmentError) {
            console.error(
              `Failed to upload attachment ${file.name}:`,
              attachmentError
            );
            addNotification({
              type: "warning",
              title: "⚠️ Attachment Upload Warning",
              message: `Failed to upload "${file.name}". Your ticket was created successfully, but you may need to attach this file later.`,
            });
          }
        }
      }

      // Show success notification
      addNotification({
        type: "success",
        title: "🎫 Ticket Created Successfully!",
        message: `Your support ticket "${
          formData.title
        }" has been created and assigned to the ${
          categories.find((c) => c.id === formData.category)?.name || "selected"
        } department.`,
      });

      // Navigate to tickets page on success
      navigate("/tickets");
    } catch (error) {
      console.error("Error creating ticket:", error);

      // Show error notification
      addNotification({
        type: "error",
        title: "❌ Failed to Create Ticket",
        message:
          "There was an error creating your support ticket. Please check your internet connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...files],
      }));
    }
  };

  const handleFileRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="create-page">
      {/* Page Title */}
      <div className="create-page-header">
        <div className="create-page-title-section">
          <div className="create-page-icon">
            <FaTicketAlt />
          </div>
          <div className="create-page-title-text">
            <h1 className="create-page-title ">Create New Ticket</h1>
            <p className="create-page-subtitle">
              Report an issue or request assistance from the IT team
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-form-simple">
        <div className="create-form-grid-simple">
          {/* Title */}
          <div className="create-form-group">
            <label className="create-form-label">
              Title *
              <span className="create-form-hint">
                Brief summary of the issue
              </span>
            </label>
            <input
              type="text"
              className={`create-form-input ${errors.title ? "error" : ""}`}
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Unable to access email on mobile device"
              maxLength={100}
            />
            {errors.title && (
              <div className="create-form-error">
                <FaExclamationTriangle />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="create-form-group">
            <label className="create-form-label">
              Description *
              <span className="create-form-hint">
                Detailed explanation of the problem or request
              </span>
            </label>
            <textarea
              className={`create-form-textarea ${
                errors.description ? "error" : ""
              }`}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Please describe the issue in detail. Include any error messages, steps you've tried, and when the problem started..."
              rows={3}
              maxLength={1000}
            />
            {errors.description && (
              <div className="create-form-error">
                <FaExclamationTriangle />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="create-form-group">
            <label className="create-form-label">
              Category *
              <span className="create-form-hint">
                What type of issue is this?
              </span>
            </label>
            <select
              className={`create-form-select ${errors.category ? "error" : ""}`}
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            >
              <option value="">Select a category...</option>
              {categories
                .filter((cat) => cat.isActive)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            {errors.category && (
              <div className="create-form-error">
                <FaExclamationTriangle />
                <span>{errors.category}</span>
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="create-form-group">
            <label className="create-form-label">
              Attachments
              <span className="create-form-hint">
                Screenshots, error logs, or other relevant files
              </span>
            </label>
            <div className="create-file-upload">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                className="create-file-input"
                accept=".jpg,.jpeg,.png,.pdf,.txt,.log,.docx,.xlsx"
              />
              <label htmlFor="file-upload" className="create-file-label">
                <FaPaperclip />
                <span>Choose files or drag them here</span>
                <small>
                  Max 10MB per file. Supported: images, PDFs, documents
                </small>
              </label>
            </div>

            {formData.attachments.length > 0 && (
              <div className="create-file-list">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="create-file-item">
                    <div className="create-file-info">
                      <span className="create-file-name">{file.name}</span>
                      <span className="create-file-size">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileRemove(index)}
                      className="create-file-remove"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="create-form-actions">
          <div className="create-form-buttons">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              <FaTimes />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="create-spinner"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Create Ticket</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
