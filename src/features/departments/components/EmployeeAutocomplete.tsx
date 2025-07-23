/**
 * EmployeeAutocomplete - Autocomplete for searching and selecting employees.
 * Props: value, onChange, disabled
 */
import React, { useState } from "react";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useEmployeeSearch } from "../../../hooks/useEmployeeSearch";
import type { EmployeeSearchResult } from "../../../hooks/useEmployeeSearch";
import { styled } from "@mui/material/styles";

interface Props {
  value: EmployeeSearchResult | null;
  onChange: (value: EmployeeSearchResult | null) => void;
  disabled?: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  minWidth: 340,
  maxWidth: 480,
  boxShadow: theme.shadows[4],
  borderRadius: 10,
  [`& .${autocompleteClasses.option}`]: {
    padding: theme.spacing(1.2, 2),
    alignItems: "flex-start",
    borderBottom: `1px solid ${theme.palette.divider}`,
    "&:last-child": { borderBottom: "none" },
  },
}));

const EmployeeAutocomplete: React.FC<Props> = ({
  value,
  onChange,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState("");
  const { results, loading, error, search } = useEmployeeSearch();

  // Only trigger search if input is not empty
  const handleInputChange = (_: unknown, newValue: string) => {
    setInputValue(newValue);
    search(newValue);
  };

  return (
    <Autocomplete
      options={inputValue ? results : []}
      getOptionLabel={(option) =>
        option && typeof option === "object"
          ? `${option.employeeName} - ${option.employeeId}`
          : ""
      }
      filterOptions={(x) => x}
      loading={loading}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      isOptionEqualToValue={(option, value) =>
        option.employeeId === value.employeeId
      }
      PaperComponent={StyledPaper}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Employee"
          required
          fullWidth
          inputProps={{
            ...params.inputProps,
            "aria-label": `Employee`,
            style: { minWidth: 200 },
          }}
          disabled={disabled}
          error={!!error}
          helperText={error || undefined}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id} style={{ padding: 0 }}>
          <Box
            display="flex"
            alignItems="center"
            sx={{ width: "100%", p: 1.2 }}
          >
            {option.profilePic && option.profilePicContentType ? (
              <Avatar
                src={`${option.profilePicContentType},${option.profilePic}`}
                alt={option.employeeName}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
            ) : (
              <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                {option.employeeName?.[0] || "?"}
              </Avatar>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body1"
                fontWeight={600}
                noWrap
                sx={{ maxWidth: 320 }}
              >
                {option.employeeName} - {option.employeeId}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  maxWidth: 320,
                }}
              >
                {option.designation}
              </Typography>
            </Box>
          </Box>
        </li>
      )}
    />
  );
};

export default EmployeeAutocomplete;
