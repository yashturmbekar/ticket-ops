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
import { createTicket } from "../services/ticketService";
import { TicketStatus } from "../types";
import "../styles/createTicket.css";

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
const fileToByteArray = (file: File): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as ArrayBuffer;
      const byteArray = Array.from(new Uint8Array(result));
      resolve(byteArray);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
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

    if (formData.attachments.length > 3) {
      addNotification({
        type: "error",
        title: "❌ Too Many Attachments",
        message: "Please remove some attachments. Maximum of 3 files allowed.",
      });
      return false;
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
      // Convert files to byte arrays
      const byteArrays = await Promise.all(
        formData.attachments.map(async (file) => ({
          fileName: file.name,
          fileData: await fileToByteArray(file),
          fileSize: file.size,
          fileType: file.type,
        }))
      );

      // Construct ticket data
      const ticketData = {
        title: formData.title,
        description: formData.description,
        assignedDepartmentId: formData.category,
        requestedBy: user?.email || "",
        status: TicketStatus.RAISED,
        priority: "LOW",
        attachments: byteArrays,
      };

      // Call API
      const response = await createTicket(ticketData);
      console.log("Ticket created successfully:", response);

      addNotification({
        type: "success",
        title: "🎫 Ticket Created Successfully!",
        message: `Your support ticket "${
          formData.title
        }" has been created and assigned to the ${
          categories.find((c) => c.id === formData.category)?.name || "selected"
        } department.`,
      });

      navigate("/tickets");
    } catch (error) {
      console.error("Error creating ticket:", error);
      addNotification({
        type: "error",
        title: "❌ Failed to Create Ticket",
        message:
          "There was an error creating your support ticket. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadingFiles(true);

      try {
        const files = Array.from(e.target.files);
        const currentCount = formData.attachments.length;
        const availableSlots = 3 - currentCount;

        if (availableSlots <= 0) {
          addNotification({
            type: "warning",
            title: "⚠️ Attachment Limit Reached",
            message: "You can only attach up to 3 files per ticket.",
          });
          return;
        }

        const filesToAdd = files.slice(0, availableSlots);

        if (files.length > availableSlots) {
          addNotification({
            type: "warning",
            title: "⚠️ Some Files Not Added",
            message: `Only ${availableSlots} file(s) could be added. Maximum of 3 attachments allowed.`,
          });
        }

        // Simulate file processing delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        setFormData((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...filesToAdd],
        }));

        addNotification({
          type: "success",
          title: "📎 Files Added",
          message: `${filesToAdd.length} file(s) successfully attached.`,
        });
      } catch {
        addNotification({
          type: "error",
          title: "❌ Upload Failed",
          message: "Failed to process selected files. Please try again.",
        });
      } finally {
        setUploadingFiles(false);
        // Reset the input value so the same file can be selected again
        e.target.value = "";
      }
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

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
  };

  // Component for rendering individual file items
  const FileItem: React.FC<{ file: File; index: number }> = ({
    file,
    index,
  }) => {
    const [imagePreview, setImagePreview] = React.useState<string>("");

    React.useEffect(() => {
      if (isImageFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }, [file]);

    const isImage = isImageFile(file);

    return (
      <div className={`create-file-item ${isImage ? "has-image" : ""}`}>
        {isImage && imagePreview && (
          <img
            src={imagePreview}
            alt={file.name}
            className="create-file-image-preview"
          />
        )}
        <div className="create-file-info">
          <span className="create-file-name" title={file.name}>
            {file.name}
          </span>
          <span className="create-file-size">{formatFileSize(file.size)}</span>
        </div>
        <button
          type="button"
          onClick={() => handleFileRemove(index)}
          className="create-file-remove"
        >
          <FaTimes />
        </button>
      </div>
    );
  };

  return (
    <div className="create-page">
      {/* Clean Ticket Loading Animation */}
      {loading && (
        <div className="ticket-loading-backdrop">
          <div className="ticket-loading-content">
            <div className="ticket-loading-icon">
              <FaTicketAlt />
            </div>
            <h3 className="ticket-loading-title">Creating Ticket</h3>
            <p className="ticket-loading-message">
              Please wait while we process your request...
            </p>
            <div className="ticket-loading-spinner"></div>
          </div>
        </div>
      )}

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

      <form
        onSubmit={handleSubmit}
        className={`create-form-simple ${loading ? "form-disabled" : ""}`}
      >
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
            <div className="create-form-group">
              <label className="create-form-label">
                Attachments
                <span className="create-form-hint">
                  Screenshots, error logs, or other relevant files
                </span>
              </label>

              <div
                className={`create-attachment-container ${
                  uploadingFiles ? "create-file-upload-loading" : ""
                }`}
              >
                {/* File Upload Input */}
                <div className="create-file-upload">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileChange}
                    className="create-file-input"
                    accept=".jpg,.jpeg,.png,.pdf,.txt,.log,.docx,.xlsx"
                    disabled={
                      formData.attachments.length >= 3 || uploadingFiles
                    }
                  />

                  {/* Label for Upload */}
                  <label
                    htmlFor="file-upload"
                    className={`create-file-label ${
                      formData.attachments.length >= 3 || uploadingFiles
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <FaPaperclip />
                    <span>
                      {uploadingFiles
                        ? "Processing files..."
                        : formData.attachments.length >= 3
                        ? "Maximum 3 files reached"
                        : "Choose files or drag here"}
                    </span>
                    <small>
                      {uploadingFiles
                        ? "Please wait..."
                        : formData.attachments.length >= 3
                        ? `${formData.attachments.length}/3 files attached`
                        : "Max 10MB per file (3 files max)"}
                    </small>
                  </label>
                </div>

                {/* File Preview List */}
                <div
                  className={`create-file-preview ${
                    uploadingFiles ? "uploading" : ""
                  }`}
                >
                  {formData.attachments.length > 0 ? (
                    <div className="create-file-list">
                      {formData.attachments.map((file, index) => (
                        <FileItem key={index} file={file} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="create-file-preview-empty">
                      {uploadingFiles
                        ? "Processing files..."
                        : "No files selected"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="create-form-actions">
          <div className="create-form-buttons">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading || uploadingFiles}
            >
              <FaTimes />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || uploadingFiles}
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
