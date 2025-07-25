import { useState, useEffect, useCallback } from "react";
import { SlaService, type DepartmentSlaPolicy, type TicketPrioritySlaRule } from "../services/slaService";
import { useNotifications } from "./useNotifications";
import { Priority } from "../types";

export interface UseSlaPoliciesDisplayResult {
  // State
  slaPolicies: DepartmentSlaPolicy[];
  selectedDepartment: string | null;
  editingPolicy: DepartmentSlaPolicy | null;
  editablePolicy: DepartmentSlaPolicy | null;

  // Loading states
  loading: boolean;
  refreshing: boolean;
  saving: boolean;

  // Actions
  handleDepartmentSelect: (departmentId: string) => void;
  handleEditPolicy: (policy: DepartmentSlaPolicy) => void;
  handleCloseEdit: () => void;
  handleRefresh: () => Promise<void>;
  handleSavePolicy: () => Promise<void>;
  handleUpdateEditablePolicy: (updates: Partial<DepartmentSlaPolicy>) => void;
  handleUpdateRule: (priority: Priority, updates: Partial<TicketPrioritySlaRule>) => void;

  // Data fetching
  fetchSlaPolicies: () => Promise<void>;

  // Utilities
  formatTimeMinutes: (minutes: number) => string;
  getPriorityColor: (priority: Priority) => string;
  getPriorityLabel: (priority: Priority) => string;
  hasSlaPolicies: (departmentId: string) => boolean;
}

export const useSlaPoliciesDisplay = (): UseSlaPoliciesDisplayResult => {
  const [slaPolicies, setSlaPolicies] = useState<DepartmentSlaPolicy[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<DepartmentSlaPolicy | null>(null);
  const [editablePolicy, setEditablePolicy] = useState<DepartmentSlaPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { addNotification } = useNotifications();

  // Fetch all SLA policies
  const fetchSlaPolicies = useCallback(async () => {
    try {
      setLoading(true);
      const policies = await SlaService.getAllSlaPolicies();
      setSlaPolicies(policies);
    } catch (error) {
      console.error("Error fetching SLA policies:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to load SLA policies",
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Refresh SLA policies
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchSlaPolicies();
      addNotification({
        type: "success",
        title: "Success",
        message: "SLA policies refreshed successfully",
      });
    } catch (error) {
      console.error("Error refreshing SLA policies:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to refresh SLA policies",
      });
    } finally {
      setRefreshing(false);
    }
  }, [fetchSlaPolicies, addNotification]);

  // Handle department selection
  const handleDepartmentSelect = useCallback((departmentId: string) => {
    setSelectedDepartment(departmentId);
  }, []);

  // Handle edit policy
  const handleEditPolicy = useCallback((policy: DepartmentSlaPolicy) => {
    setEditingPolicy(policy);
    // Create a deep copy for editing
    setEditablePolicy(JSON.parse(JSON.stringify(policy)));
  }, []);

  // Handle close edit
  const handleCloseEdit = useCallback(() => {
    setEditingPolicy(null);
    setEditablePolicy(null);
  }, []);

  // Handle update editable policy
  const handleUpdateEditablePolicy = useCallback((updates: Partial<DepartmentSlaPolicy>) => {
    setEditablePolicy(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // Handle update specific rule
  const handleUpdateRule = useCallback((priority: Priority, updates: Partial<TicketPrioritySlaRule>) => {
    setEditablePolicy(prev => {
      if (!prev) return null;
      
      const updatedRules = prev.ticketPrioritySlaRulesDTOS.map(rule => 
        rule.priority === priority ? { ...rule, ...updates } : rule
      );
      
      return {
        ...prev,
        ticketPrioritySlaRulesDTOS: updatedRules
      };
    });
  }, []);

  // Handle save policy
  const handleSavePolicy = useCallback(async () => {
    if (!editablePolicy) return;

    try {
      setSaving(true);
      
      // Validate the data
      const validation = SlaService.validateSlaRule({
        helpdeskDepartmentId: editablePolicy.helpdeskDepartmentId,
        prioritySlaSettings: editablePolicy.ticketPrioritySlaRulesDTOS.map(rule => ({
          priority: rule.priority,
          responseTimeMinutes: rule.responseTimeMinutes,
          resolutionTimeMinutes: rule.resolutionTimeMinutes
        }))
      });

      if (!validation.isValid) {
        addNotification({
          type: "error",
          title: "Validation Error",
          message: validation.errors.join(", "),
        });
        return;
      }

      // Update the SLA policies using the new method
      await SlaService.updateDepartmentSlaPolicy(
        editablePolicy.helpdeskDepartmentId,
        editablePolicy.ticketPrioritySlaRulesDTOS
      );

      // Update local state
      setSlaPolicies(prev => 
        prev.map(policy => 
          policy.helpdeskDepartmentId === editablePolicy.helpdeskDepartmentId 
            ? editablePolicy 
            : policy
        )
      );

      addNotification({
        type: "success",
        title: "Success",
        message: "SLA policies updated successfully",
      });

      // Close the edit modal
      handleCloseEdit();
    } catch (error) {
      console.error("Error saving SLA policy:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to save SLA policies",
      });
    } finally {
      setSaving(false);
    }
  }, [editablePolicy, addNotification, handleCloseEdit]);

  // Format time utility
  const formatTimeMinutes = useCallback((minutes: number) => {
    return SlaService.formatTimeMinutes(minutes);
  }, []);

  // Get priority color
  const getPriorityColor = useCallback((priority: Priority) => {
    const colors = {
      [Priority.LOW]: "#28a745",
      [Priority.MEDIUM]: "#ffc107",
      [Priority.HIGH]: "#fd7e14",
      [Priority.CRITICAL]: "#dc3545",
    };
    return colors[priority] || "#6c757d";
  }, []);

  // Get priority label
  const getPriorityLabel = useCallback((priority: Priority) => {
    const labels = {
      [Priority.LOW]: "Low",
      [Priority.MEDIUM]: "Medium",
      [Priority.HIGH]: "High",
      [Priority.CRITICAL]: "Critical",
    };
    return labels[priority] || priority;
  }, []);

  // Check if department has SLA policies
  const hasSlaPolicies = useCallback((departmentId: string) => {
    const policy = slaPolicies.find(p => p.helpdeskDepartmentId === departmentId);
    return Boolean(policy && policy.ticketPrioritySlaRulesDTOS.length > 0);
  }, [slaPolicies]);

  // Load initial data
  useEffect(() => {
    fetchSlaPolicies();
  }, [fetchSlaPolicies]);

  return {
    // State
    slaPolicies,
    selectedDepartment,
    editingPolicy,
    editablePolicy,

    // Loading states
    loading,
    refreshing,
    saving,

    // Actions
    handleDepartmentSelect,
    handleEditPolicy,
    handleCloseEdit,
    handleRefresh,
    handleSavePolicy,
    handleUpdateEditablePolicy,
    handleUpdateRule,

    // Data fetching
    fetchSlaPolicies,

    // Utilities
    formatTimeMinutes,
    getPriorityColor,
    getPriorityLabel,
    hasSlaPolicies,
  };
};

export default useSlaPoliciesDisplay; 