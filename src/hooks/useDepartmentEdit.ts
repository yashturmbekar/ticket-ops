import { useState, useCallback } from "react";
import {
  getHelpdeskDepartmentWithEmployees,
  updateHelpdeskDepartment,
  type HelpdeskDepartmentPayload,
  type DepartmentWithEmployeesResponse,
} from "../services/helpdeskDepartmentService";
import { useNotifications } from "./useNotifications";

export interface DepartmentEditHookOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useDepartmentEdit = (options: DepartmentEditHookOptions = {}) => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [departmentData, setDepartmentData] =
    useState<DepartmentWithEmployeesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load department with employees
  const loadDepartment = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getHelpdeskDepartmentWithEmployees(id);
        setDepartmentData(response);

        return response;
      } catch (err) {
        const errorMessage =
          "Failed to load department details. Please try again.";
        setError(errorMessage);
        addNotification({
          type: "error",
          title: "Failed to Load Department",
          message: errorMessage,
        });
        options.onError?.();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addNotification, options]
  );

  // Update department
  const updateDepartment = useCallback(
    async (_id: string, payload: HelpdeskDepartmentPayload) => {
      try {
        setLoading(true);
        setError(null);

        const updatedDepartment = await updateHelpdeskDepartment(payload);

        addNotification({
          type: "success",
          title: "Department Updated",
          message: "Department has been updated successfully.",
        });

        options.onSuccess?.();
        return updatedDepartment;
      } catch (err) {
        const errorMessage = "Failed to update department. Please try again.";
        setError(errorMessage);
        addNotification({
          type: "error",
          title: "Update Failed",
          message: errorMessage,
        });
        options.onError?.();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addNotification, options]
  );

  return {
    departmentData,
    loading,
    error,
    loadDepartment,
    updateDepartment,
  };
};
