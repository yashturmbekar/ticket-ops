import { useState, useEffect, useCallback } from "react";
import {
  SlaService,
  type SlaPolicy,
  type SlaRuleFormData,
  type HelpdeskDepartment,
} from "../services/slaService";
import { useNotifications } from "./useNotifications";
import { Priority } from "../types";

export interface UseSlaManagementResult {
  // State
  formData: SlaRuleFormData;
  departments: HelpdeskDepartment[];
  slaPolicies: SlaPolicy[];

  // Loading states
  loading: boolean;
  departmentsLoading: boolean;
  policiesLoading: boolean;

  // Actions
  handleDepartmentChange: (departmentId: string) => void;
  handlePriorityTimeChange: (
    priority: Priority,
    field: "responseTimeMinutes" | "resolutionTimeMinutes",
    value: number
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleReset: () => void;

  // Data fetching
  fetchDepartments: () => Promise<void>;
  fetchSlaPolicies: () => Promise<void>;

  // Validation
  validateForm: () => boolean;

  // Utilities
  formatTimeMinutes: (minutes: number) => string;
  departmentOptions: Array<{ value: string; label: string }>;
  priorities: Priority[];
}

const initialFormData: SlaRuleFormData = {
  helpdeskDepartmentId: "",
  prioritySlaSettings: [
    {
      priority: Priority.LOW,
      responseTimeMinutes: 60,
      resolutionTimeMinutes: 1440,
    },
    {
      priority: Priority.MEDIUM,
      responseTimeMinutes: 60,
      resolutionTimeMinutes: 1440,
    },
    {
      priority: Priority.HIGH,
      responseTimeMinutes: 60,
      resolutionTimeMinutes: 1440,
    },
    {
      priority: Priority.CRITICAL,
      responseTimeMinutes: 60,
      resolutionTimeMinutes: 1440,
    },
  ],
};

export const useSlaManagement = (): UseSlaManagementResult => {
  const [formData, setFormData] = useState<SlaRuleFormData>(initialFormData);
  const [departments, setDepartments] = useState<HelpdeskDepartment[]>([]);
  const [slaPolicies, setSlaPolicies] = useState<SlaPolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [policiesLoading, setPoliciesLoading] = useState(false);

  const { addNotification } = useNotifications();

  // Fetch helpdesk departments
  const fetchDepartments = useCallback(async () => {
    try {
      setDepartmentsLoading(true);
      const fetchedDepartments =
        await SlaService.getActiveHelpdeskDepartments();
      setDepartments(fetchedDepartments);
    } catch (error) {
      console.error("Error fetching helpdesk departments:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to load helpdesk departments",
      });
    } finally {
      setDepartmentsLoading(false);
    }
  }, [addNotification]);

  // Fetch SLA policies
  const fetchSlaPolicies = useCallback(async () => {
    try {
      setPoliciesLoading(true);
      const fetchedPolicies = await SlaService.getSlapolicies();
      setSlaPolicies(fetchedPolicies);
    } catch (error) {
      console.error("Error fetching SLA policies:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to load SLA policies",
      });
    } finally {
      setPoliciesLoading(false);
    }
  }, [addNotification]);

  // Load initial data
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Handle department selection
  const handleDepartmentChange = useCallback((departmentId: string) => {
    setFormData((prev) => ({
      ...prev,
      helpdeskDepartmentId: departmentId,
    }));
  }, []);

  // Handle priority time changes
  const handlePriorityTimeChange = useCallback(
    (
      priority: Priority,
      field: "responseTimeMinutes" | "resolutionTimeMinutes",
      value: number
    ) => {
      setFormData((prev) => ({
        ...prev,
        prioritySlaSettings: prev.prioritySlaSettings.map((setting) =>
          setting.priority === priority
            ? { ...setting, [field]: value }
            : setting
        ),
      }));
    },
    []
  );

  // Validate form data
  const validateForm = useCallback(() => {
    const validation = SlaService.validateSlaRule(formData);
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        addNotification({
          type: "error",
          title: "Validation Error",
          message: error,
        });
      });
      return false;
    }
    return true;
  }, [formData, addNotification]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        setLoading(true);

        await SlaService.createSlaPolicy(formData);

        addNotification({
          type: "success",
          title: "Success",
          message: `SLA policies created successfully for ${formData.prioritySlaSettings.length} priority levels`,
        });

        // Reset form and refresh policies list
        setFormData(initialFormData);
        await fetchSlaPolicies();
      } catch (error) {
        console.error("Error creating SLA policy:", error);
        const errorMessage =
          error instanceof Error && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : "Failed to create SLA policy";
        addNotification({
          type: "error",
          title: "Error",
          message: errorMessage || "Failed to create SLA policy",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, validateForm, addNotification, fetchSlaPolicies]
  );

  // Handle form reset
  const handleReset = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  // Format time utility
  const formatTimeMinutes = useCallback((minutes: number) => {
    return SlaService.formatTimeMinutes(minutes);
  }, []);

  // Generate department options for dropdown
  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  // Available priorities
  const priorities = Object.values(Priority);

  return {
    // State
    formData,
    departments,
    slaPolicies,

    // Loading states
    loading,
    departmentsLoading,
    policiesLoading,

    // Actions
    handleDepartmentChange,
    handlePriorityTimeChange,
    handleSubmit,
    handleReset,

    // Data fetching
    fetchDepartments,
    fetchSlaPolicies,

    // Validation
    validateForm,

    // Utilities
    formatTimeMinutes,
    departmentOptions,
    priorities,
  };
};

export default useSlaManagement;
