import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import type { EmployeeSearchResult } from "../../../hooks/useEmployeeSearch";
import DepartmentDetailsForm from "./DepartmentDetailsForm";
import EmployeeListEditor from "./EmployeeListEditor";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

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
  initialData?: {
    name?: string;
    isActive?: boolean;
    // Add more fields as needed for editing
  } | null;
}

const HelpdeskDepartmentCreateForm: React.FC<Props> = ({
  onSubmit,
  loading = false,
  error = null,
  initialData = null,
}) => {
  const [departmentName, setDepartmentName] = useState(initialData?.name || "");
  const [departmentActive, setDepartmentActive] = useState(initialData?.isActive ?? true);
  const [employees, setEmployees] = useState<
    {
      employeeId: string;
      isActive: boolean;
      employeeObj?: EmployeeSearchResult | null;
    }[]
  >([{ employeeId: "", isActive: true, employeeObj: null }]);
  const [formError, setFormError] = useState<string | null>(null);

  // Update form fields if initialData changes (for edit)
  React.useEffect(() => {
    if (initialData) {
      setDepartmentName(initialData.name || "");
      setDepartmentActive(initialData.isActive ?? true);
      // Optionally set employees if available in initialData
    }
  }, [initialData]);

  const validate = () => {
    if (!departmentName.trim()) {
      setFormError("Department name is required.");
      return false;
    }
    if (
      employees.some(
        (emp) =>
          (!emp.employeeObj?.id && !emp.employeeId) ||
          (!emp.employeeObj?.id && (isNaN(Number(emp.employeeId)) || Number(emp.employeeId) <= 0))
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
        employeeId: emp.employeeObj?.id || Number(emp.employeeId),
        isActive: emp.isActive,
      })),
    };
    onSubmit(payload);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Helpdesk Department
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
         Create Helpdesk Department
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>

          <Stack spacing={3}>
           
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

              </Stack>
            </form>
          </Stack>
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </BootstrapDialog>


    </Box >
  );
};

export default HelpdeskDepartmentCreateForm;
