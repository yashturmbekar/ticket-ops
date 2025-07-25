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
import { Loader } from "../components/common";
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

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
  code?: string;
}
const fileToByteArray = (file: File): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    // Check file size before processing
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      reject(new Error(`File ${file.name} exceeds the 10MB limit`));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const result = reader.result as ArrayBuffer;
        const byteArray = Array.from(new Uint8Array(result));
        resolve(byteArray);
      } catch (error) {
        reject(new Error(`Failed to process file ${file.name}: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file ${file.name}`));
    };

    reader.readAsArrayBuffer(file);
  });
};
export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [operationStatus, setOperationStatus] = useState<string>("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  // Add state for selectedImage
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

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
    setOperationStatus("Processing attachments...");

    try {
      // Convert files to byte arrays with progress handling
      const byteArrays: Array<{
        fileName: string;
        fileData: number[];
        fileSize: number;
        fileType: string;
      }> = [];

      for (let i = 0; i < formData.attachments.length; i++) {
        const file = formData.attachments[i];
        setOperationStatus(
          `Processing file ${i + 1}/${formData.attachments.length}: ${
            file.name
          }`
        );
        try {
          console.log(
            `Processing file ${i + 1}/${formData.attachments.length}: ${
              file.name
            }`
          );
          const fileData = await fileToByteArray(file);
          byteArrays.push({
            fileName: file.name,
            fileData,
            fileSize: file.size,
            fileType: file.type,
          });
        } catch (fileError) {
          console.error(`Failed to process file ${file.name}:`, fileError);
          throw new Error(
            `Failed to process attachment "${file.name}". Please try with a different file.`
          );
        }
      }

      setOperationStatus("Creating ticket...");

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

      console.log(`Submitting ticket with ${byteArrays.length} attachments`);

      // Show additional warning for large uploads
      const totalSize = byteArrays.reduce((sum, att) => sum + att.fileSize, 0);
      if (totalSize > 5 * 1024 * 1024) {
        // 5MB
        console.log(`Large upload detected: ${totalSize} bytes`);
        setOperationStatus(
          "Uploading large files... This may take a few minutes."
        );

        // Show user notification for large uploads
        addNotification({
          type: "info",
          title: "🔄 Large Upload Detected",
          message:
            "Your files are being processed. This may take a few minutes for large attachments.",
        });
      }

      setOperationStatus("Creating your ticket...");
      const response = await createTicket(ticketData);
      console.log("Ticket created successfully:", response);

      setOperationStatus("Ticket created successfully!");

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
    } catch (error: unknown) {
      console.error("Error creating ticket:", error);

      let errorMessage =
        "There was an error creating your support ticket. Please try again.";
      let errorTitle = "❌ Failed to Create Ticket";

      // Handle different types of errors
      const axiosError = error as ApiError;
      if (
        axiosError?.response?.status === 413 ||
        axiosError?.message?.includes("413") ||
        axiosError?.message?.includes("Payload Too Large")
      ) {
        errorTitle = "❌ Files Too Large";
        errorMessage =
          "The attachment files are too large for the server. Please reduce file sizes or remove some attachments.";
      } else if (
        axiosError?.response?.status === 408 ||
        axiosError?.code === "ECONNABORTED" ||
        axiosError?.message?.includes("timeout")
      ) {
        errorTitle = "❌ Operation Timed Out";
        errorMessage =
          "The ticket creation took longer than expected. Please try again with smaller files or check your internet connection.";
      } else if (axiosError?.response?.status === 400) {
        errorTitle = "❌ Invalid Request";
        errorMessage =
          axiosError?.response?.data?.message ||
          "Please check your inputs and try again.";
      } else if (axiosError?.response?.status === 500) {
        errorTitle = "❌ Server Error";
        errorMessage =
          "The server encountered an error processing your request. Please try again later or contact support if the issue persists.";
      } else if (
        axiosError?.response?.status === 502 ||
        axiosError?.response?.status === 503 ||
        axiosError?.response?.status === 504
      ) {
        errorTitle = "❌ Service Temporarily Unavailable";
        errorMessage =
          "The service is temporarily unavailable. Please wait a moment and try again.";
      } else if (
        axiosError?.message?.includes("Network Error") ||
        axiosError?.message?.includes("ERR_NETWORK")
      ) {
        errorTitle = "❌ Network Error";
        errorMessage =
          "Unable to connect to the server. Please check your internet connection and try again.";
      }

      addNotification({
        type: "error",
        title: errorTitle,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
      setOperationStatus("");
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
          setUploadingFiles(false);
          e.target.value = "";
          return;
        }

        const filesToAdd = files.slice(0, availableSlots);

        // Validate file sizes (1MB = 1024 * 1024 bytes)
        const maxFileSize = 10 * 1024 * 1024; // 10MB per file
        const oversizedFiles = filesToAdd.filter(
          (file) => file.size > maxFileSize
        );
        const validFiles = filesToAdd.filter(
          (file) => file.size <= maxFileSize
        );

        if (oversizedFiles.length > 0) {
          const oversizedNames = oversizedFiles.map((f) => f.name).join(", ");
          addNotification({
            type: "error",
            title: "❌ Files Too Large",
            message: `The following files exceed the 10MB limit and cannot be attached: ${oversizedNames}`,
          });
        }

        if (validFiles.length === 0) {
          setUploadingFiles(false);
          e.target.value = "";
          return;
        }

        // Validate total payload size (prevent API failures)
        const currentTotalSize = formData.attachments.reduce(
          (sum, file) => sum + file.size,
          0
        );
        const newFilesSize = validFiles.reduce(
          (sum, file) => sum + file.size,
          0
        );
        const totalSize = currentTotalSize + newFilesSize;
        const maxTotalSize = 30 * 1024 * 1024; // 30MB total limit

        if (totalSize > maxTotalSize) {
          addNotification({
            type: "error",
            title: "❌ Total Size Limit Exceeded",
            message:
              "The total size of all attachments cannot exceed 30MB. Please remove some files or choose smaller files.",
          });
          setUploadingFiles(false);
          e.target.value = "";
          return;
        }

        if (files.length > availableSlots) {
          addNotification({
            type: "warning",
            title: "⚠️ Some Files Not Added",
            message: `Only ${availableSlots} file(s) could be added. Maximum of 3 attachments allowed.`,
          });
        }

        setFormData((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...validFiles],
        }));

        addNotification({
          type: "success",
          title: "📎 Files Added",
          message: `${validFiles.length} file(s) successfully attached.`,
        });
      } catch (error) {
        console.error("File upload error:", error);
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
            onClick={() =>
              setSelectedImage({ src: imagePreview, alt: file.name })
            }
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
      {/* Content Body Loader */}
      {loading && (
        <div className="create-content-body-loader">
          <Loader
            useTicketAnimation={true}
            centered={true}
            text="Creating your ticket..."
            ticketMessage="Please wait while we process your request..."
          />
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
                Screenshots, error logs, or other relevant files (Max 10 MB per
                file, 30 MB total)
              </span>
            </label>
            <div className="create-form-group">
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
                        : "Max 10 MB per file | Total limit: 30 MB"}
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
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes />
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <div className="image-modal-title">{selectedImage.alt}</div>
          </div>
        </div>
      )}
    </div>
  );
};
