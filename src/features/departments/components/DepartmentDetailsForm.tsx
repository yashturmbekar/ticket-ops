/**
 * DepartmentDetailsForm - handles department name and active switch fields.
 * Props: name, setName, active, setActive, loading
 */
import React from "react";
import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  name: string;
  setName: (name: string) => void;
  active: boolean;
  setActive: (active: boolean) => void;
  loading?: boolean;
}

const DepartmentDetailsForm: React.FC<Props> = ({
  name,
  setName,
  active,
  setActive,
  loading,
}) => (
  <Box mb={2}>
    <Stack spacing={2}>
      <TextField
        label="Department Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        inputProps={{ "aria-label": "Department Name" }}
        disabled={loading}
        sx={{ fontSize: 18 }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            color="primary"
            inputProps={{ "aria-label": "Department Active" }}
            disabled={loading}
            sx={{ mr: 1 }}
          />
        }
        label={
          <Typography variant="body1" fontWeight={500}>
            Active
          </Typography>
        }
        sx={{ ml: 1 }}
      />
    </Stack>
  </Box>
);

export default DepartmentDetailsForm;
