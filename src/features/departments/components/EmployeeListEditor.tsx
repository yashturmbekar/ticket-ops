/**
 * EmployeeListEditor - handles the list of employees for a department.
 * Props: employees, setEmployees, loading
 */
import React from "react";
import {
  Box,
  IconButton,
  Switch,
  FormControlLabel,
  Button,
  Tooltip,
  Stack,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Add, Remove } from "@mui/icons-material";
import EmployeeAutocomplete from "./EmployeeAutocomplete";
import type { EmployeeSearchResult } from "../../../hooks/useEmployeeSearch";

interface EmployeeRow {
  employeeId: string;
  isActive: boolean;
  employeeObj?: EmployeeSearchResult | null;
}

interface Props {
  employees: EmployeeRow[];
  setEmployees: React.Dispatch<React.SetStateAction<EmployeeRow[]>>;
  loading?: boolean;
}

const EmployeeListEditor: React.FC<Props> = ({
  employees,
  setEmployees,
  loading,
}) => {
  const handleEmployeeChange = (
    idx: number,
    field: "employeeId" | "isActive" | "employeeObj",
    value: string | boolean | EmployeeSearchResult | null
  ) => {
    setEmployees((prev) =>
      prev.map((emp, i) =>
        i === idx
          ? {
              ...emp,
              [field]: value,
              ...(field === "employeeObj" && value
                ? {
                    employeeId: (
                      value as EmployeeSearchResult
                    ).employeeId.toString(),
                  }
                : {}),
            }
          : emp
      )
    );
  };

  const handleAddEmployee = () => {
    setEmployees((prev) => [
      ...prev,
      { employeeId: "", isActive: true, employeeObj: null },
    ]);
  };

  const handleRemoveEmployee = (idx: number) => {
    setEmployees((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <Box>
      <Stack spacing={2}>
        {employees.map((emp, idx) => (
          <Paper key={idx} elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={7}>
                <EmployeeAutocomplete
                  value={emp.employeeObj || null}
                  onChange={(newValue) =>
                    handleEmployeeChange(idx, "employeeObj", newValue)
                  }
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emp.isActive}
                      onChange={(e) =>
                        handleEmployeeChange(idx, "isActive", e.target.checked)
                      }
                      color="primary"
                      inputProps={{
                        "aria-label": `Employee Active ${idx + 1}`,
                      }}
                      disabled={loading}
                    />
                  }
                  label={<Typography variant="body2">Active</Typography>}
                />
              </Grid>
              <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Remove Employee">
                  <span>
                    <IconButton
                      aria-label="Remove Employee"
                      onClick={() => handleRemoveEmployee(idx)}
                      disabled={employees.length === 1 || loading}
                      size="medium"
                      color="error"
                    >
                      <Remove />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Box>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddEmployee}
            disabled={loading}
            aria-label="Add Employee"
            sx={{ mt: 1, fontWeight: 600, borderRadius: 2 }}
          >
            Add Employee
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default EmployeeListEditor;
