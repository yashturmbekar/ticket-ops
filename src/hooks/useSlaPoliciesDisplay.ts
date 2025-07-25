import { useState, useEffect, useCallback } from "react";
import { SlaService, type DepartmentSlaPolicy } from "../services/slaService";
import { useNotifications } from "./useNotifications";
import { Priority } from "../types";

export interface UseSlaPoliciesDisplayResult {
  // State
  slaPolicies: DepartmentSlaPolicy[];
  selectedDepartment: string | null;
  editingPolicy: DepartmentSlaPolicy | null;

  // Loading states
  loading: boolean;
  refreshing: boolean;

  // Actions
  handleDepartmentSelect: (departmentId: string) => void;
  handleEditPolicy: (policy: DepartmentSlaPolicy) => void;
  handleCloseEdit: () => void;
  handleRefresh: () => Promise<void>;

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
  }, []);

  // Handle close edit
  const handleCloseEdit = useCallback(() => {
    setEditingPolicy(null);
  }, []);

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

    // Loading states
    loading,
    refreshing,

    // Actions
    handleDepartmentSelect,
    handleEditPolicy,
    handleCloseEdit,
    handleRefresh,

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