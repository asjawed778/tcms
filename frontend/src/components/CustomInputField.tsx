import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller, useFormContext, Control } from "react-hook-form";
import type { TextFieldPropsSizeOverrides } from "@mui/material/TextField";
import type { OverridableStringUnion } from "@mui/types";
import { useAppTheme } from "@/context/ThemeContext";

interface CustomInputFieldProps extends Omit<TextFieldProps, "name"> {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  control?: Control<any>;
  minDate?: string;
  maxDate?: string;
  required?: boolean;
  size?: OverridableStringUnion<
    "small" | "medium",
    TextFieldPropsSizeOverrides
  >;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  size = "small",
  startIcon,
  endIcon,
  control,
  disabled = false,
  fullWidth = true,
  required = true,
  maxDate,
  minDate,
  sx = {},
  ...rest
}) => {
  const { control: contextControl } = useFormContext() || {};
  const activeControl = control || contextControl;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isDate = type === "date";
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const { colors } = useAppTheme();

  const renderTextField = (field: any, error?: any) => (
    <TextField
      {...field}
      label={label}
      disabled={disabled}
      value={field?.value ?? ""}
      placeholder={isDate ? undefined : placeholder}
      size={size}
      type={isDate ? "date" : isPassword && !showPassword ? "password" : type}
      fullWidth={fullWidth}
      required={required}
      variant="outlined"
      error={!!error}
      helperText={error?.message}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          transition: "border-color 0.3s",
          "&:hover": { borderColor: colors.inputHover },
          "&.Mui-focused": { borderColor: colors.inputFocus },
        },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        ...sx,
      }}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ),
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : undefined,
      }}
      InputLabelProps={{
        sx: {
          color: colors.inputLabel,
          "&.Mui-focused": {
            color: colors.primary,
          },
          "& .MuiFormLabel-asterisk": {
            color: colors.error,
          },
        },
        ...(isDate && { shrink: true }), // keep shrink if date
      }}
      inputProps={isDate ? { max: maxDate, min: minDate } : undefined}
      {...rest}
    />
  );

  return activeControl ? (
    <Controller
      name={name}
      control={activeControl}
      render={({ field, fieldState: { error } }) =>
        renderTextField(field, error)
      }
    />
  ) : (
    renderTextField(
      {
        value: uncontrolledValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setUncontrolledValue(e.target.value),
      },
      null
    )
  );
};

export default CustomInputField;
