import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormHelperText,
  SxProps,
  Theme,
} from "@mui/material";
import {
  Controller,
  useFormContext,
  Control,
  FieldError,
} from "react-hook-form";
import { colors } from "material-ui/styles";
import { useAppTheme } from "@/context/ThemeContext";

interface OptionType {
  label: string;
  value: string | number;
}

interface CustomDropdownFieldProps {
  name: string;
  label: string;
  options: OptionType[];
  control?: Control<any>;
  value?: string | number;
  onChange?: (val: string | number) => void;
  size?: "small" | "medium";
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  sx?: SxProps<Theme>;
}

const CustomDropdownField: React.FC<CustomDropdownFieldProps> = ({
  name,
  label,
  options,
  control,
  value,
  onChange,
  size = "small",
  disabled = false,
  fullWidth = true,
  required = true,
  sx = {},
}) => {
  const methods = useFormContext();
  const contextControl = methods?.control;
  const activeControl = control || contextControl;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | number>(
    ""
  );
  const { colors } = useAppTheme();

  const renderSelect = (
    fieldValue: string | number,
    handleChange: (val: string | number) => void,
    error?: FieldError | null
  ) => (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      sx={{
        minWidth: 150,
        textAlign: "left",
        borderRadius: "8px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderRadius: "8px",
        },
        ...sx,
      }}
      error={!!error}
    >
      <InputLabel
        required={required}
        sx={{
          color: colors.inputLabel,
          "&.Mui-focused": {
            color: colors.primary,
          },
          "& .MuiFormLabel-asterisk": {
            color: colors.error,
          },
        }}
      >
        {label}
      </InputLabel>

      <Select
        label={label}
        value={fieldValue}
        onChange={(e: SelectChangeEvent<string | number>) =>
          handleChange(e.target.value as string | number)
        }
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 250,
              overflowY: "auto",
              borderRadius: 8,
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );

  return activeControl && name ? (
    <Controller
      name={name}
      control={activeControl}
      render={({ field, fieldState: { error } }) =>
        renderSelect(field.value ?? "", field.onChange, error)
      }
    />
  ) : (
    renderSelect(
      value ?? uncontrolledValue,
      (val) => {
        onChange?.(val);
        setUncontrolledValue(val);
      },
      null
    )
  );
};

export default CustomDropdownField;
