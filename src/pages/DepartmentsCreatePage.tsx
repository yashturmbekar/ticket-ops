import React, { useState } from "react";
import HelpdeskDepartmentCreateForm from "../features/departments/components/HelpdeskDepartmentCreateForm";
import type { HelpdeskDepartmentPayload } from "../features/departments/components/HelpdeskDepartmentCreateForm";
import { createHelpdeskDepartment } from "../services/helpdeskDepartmentService";

const DepartmentsCreatePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: HelpdeskDepartmentPayload) => {
    setLoading(true);
    setError(null);
    try {
      await createHelpdeskDepartment(payload);
      alert("Department Created!");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <HelpdeskDepartmentCreateForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
};

export default DepartmentsCreatePage;
