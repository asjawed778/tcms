import { useState, useCallback } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  TextFieldProps,
  useTheme,
  styled,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Controller,
  useFormContext,
  Control,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";

interface CustomInputFieldProps<T extends FieldValues = FieldValues>
  extends Omit<TextFieldProps, "name" | "label" | "onChange" | "value"> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  size?: "small" | "medium";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  control?: Control<T>;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  maxDate?: string | Date;
  minDate?: string | Date;
  rows?: number;
  readOnly?: boolean;
  labelPosition?: "outside" | "inside";
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
      borderWidth: 1.5,
    },
    "& input": {
      padding: "8px 10px",
      fontSize: "15px",
    },
  },
}));
const Label = styled("label")<{ error?: boolean }>(({ theme, error }) => ({
  fontSize: "0.875rem",
  marginBottom: 1,
  display: "inline-block",
  color: error ? theme.palette.error.main : theme.palette.text.primary,
}));

function CustomInputField<T extends FieldValues = FieldValues>({
  name,
  label,
  labelPosition = "inside",
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
  rows,
  readOnly = false,
  ...rest
}: CustomInputFieldProps<T>) {
  const { control: contextControl } = useFormContext<T>() || {};
  const activeControl = control ?? contextControl;

  const [showPassword, setShowPassword] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const isPassword = type === "password";
  const isDate = type === "date";
  const theme = useTheme();

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const renderTextField = (
    field: {
      value: T[Path<T>] | undefined;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    },
    error: FieldError | null
  ) => (
    <Box>
      {labelPosition === "outside" && (
        <Label htmlFor={name} error={!!error}>
          {label}{" "}
          {required && (
            <Box component="span" sx={{ color: theme.palette.error.main }}>
              *
            </Box>
          )}
        </Label>
      )}
      <StyledTextField
        {...field}
        id={name}
        label={labelPosition === "inside" ? label : undefined}
        multiline={!!rows}
        rows={rows}
        disabled={disabled}
        value={
          isDate && field.value
            ? new Date(field.value).toISOString().split("T")[0]
            : field.value ?? ""
        }
        placeholder={placeholder}
        size={size}
        type={
          isDate
            ? "date"
            : isPassword
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        fullWidth={fullWidth}
        variant="outlined"
        error={!!error}
        helperText={error?.message}
        required={labelPosition === "inside" ? false : required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error-text` : undefined}
        aria-label={labelPosition === "inside" ? label : undefined}
        InputProps={{
          startAdornment: startIcon && (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ),
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : endIcon ? (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ) : undefined,
        }}
        InputLabelProps={{
          shrink: isDate ? true : undefined,
          sx:
            labelPosition === "inside" && required
              ? {
                  "&::after": {
                    content: '" *"',
                    color: theme.palette.error.main,
                  },
                }
              : {},
        }}
        inputProps={{
          readOnly,
          "aria-required": required,
          max:
            isDate && maxDate
              ? new Date(maxDate).toISOString().split("T")[0]
              : undefined,
          min:
            isDate && minDate
              ? new Date(minDate).toISOString().split("T")[0]
              : undefined,
        }}
        {...rest}
      />
    </Box>
  );

  return activeControl ? (
    <Controller
      name={name}
      control={activeControl}
      render={({ field, fieldState: { error } }) =>
        renderTextField(field, error ?? null)
      }
    />
  ) : (
    renderTextField(
      {
        value: uncontrolledValue as T[Path<T>] | undefined,
        onChange: (e) => setUncontrolledValue(e.target.value),
      },
      null
    )
  );
};

export default CustomInputField;
