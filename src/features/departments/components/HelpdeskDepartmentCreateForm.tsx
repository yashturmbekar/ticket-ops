import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Alert,
  Container,
  Stack,
} from "@mui/material";
import type { EmployeeSearchResult } from "../../../hooks/useEmployeeSearch";
import DepartmentDetailsForm from "./DepartmentDetailsForm";
import EmployeeListEditor from "./EmployeeListEditor";

interface Department {
  name: string;
  isActive: boolean;
}

interface Employee {
  employeeId: number;
  isActive: boolean;
}

export interface HelpdeskDepartmentPayload {
  department: Department;
  employees: Employee[];
}

interface Props {
  onSubmit: (payload: HelpdeskDepartmentPayload) => void;
  loading?: boolean;
  error?: string | null;
}

const HelpdeskDepartmentCreateForm: React.FC<Props> = ({
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [departmentName, setDepartmentName] = useState("");
  const [departmentActive, setDepartmentActive] = useState(true);
  const [employees, setEmployees] = useState<
    {
      employeeId: string;
      isActive: boolean;
      employeeObj?: EmployeeSearchResult | null;
    }[]
  >([{ employeeId: "", isActive: true, employeeObj: null }]);
  const [formError, setFormError] = useState<string | null>(null);

  const validate = () => {
    if (!departmentName.trim()) {
      setFormError("Department name is required.");
      return false;
    }
    if (
      employees.some(
        (emp) =>
          !emp.employeeId ||
          isNaN(Number(emp.employeeId)) ||
          Number(emp.employeeId) <= 0
      )
    ) {
      setFormError("All employees must have a valid Employee ID.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload: HelpdeskDepartmentPayload = {
      department: {
        name: departmentName.trim(),
        isActive: departmentActive,
      },
      employees: employees.map((emp) => ({
        employeeId: Number(emp.employeeId),
        isActive: emp.isActive,
      })),
    };
    onSubmit(payload);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper
        elevation={4}
        sx={{ p: { xs: 2, sm: 4 }, maxWidth: 600, mx: "auto", borderRadius: 4 }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              align="center"
            >
              Create Helpdesk Department
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          <form
            onSubmit={handleSubmit}
            aria-label="Create Helpdesk Department Form"
            autoComplete="off"
          >
            <Stack spacing={3}>
              <DepartmentDetailsForm
                name={departmentName}
                setName={setDepartmentName}
                active={departmentActive}
                setActive={setDepartmentActive}
                loading={loading}
              />
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Employees
                </Typography>
                <EmployeeListEditor
                  employees={employees}
                  setEmployees={setEmployees}
                  loading={loading}
                />
              </Box>
              {(formError || error) && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {formError || error}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                aria-label="Create Department"
                size="large"
                sx={{ mt: 2, py: 1.5, fontSize: 18, borderRadius: 2 }}
              >
                {loading ? "Creating..." : "Create Department"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default HelpdeskDepartmentCreateForm;
