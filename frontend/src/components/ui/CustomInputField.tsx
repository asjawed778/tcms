import { useState, useCallback } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  TextFieldProps,
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
import { Colors } from "@/theme/colors";

interface CustomInputFieldProps<T extends FieldValues = FieldValues>
  extends Omit<TextFieldProps, "name" | "label" | "onChange" | "value"> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  size?: "small" | "medium";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  control?: Control<any>;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  maxDate?: string | Date;
  minDate?: string | Date;
  rows?: number;
  readOnly?: boolean;
  labelPosition?: "outside" | "inside";
  minValue?: number;
  maxValue?: number;
}

const StyledTextField = styled(TextField)(({ theme }) => {
  const palette = Colors[theme.palette.mode];
  return {
    "& .MuiOutlinedInput-root": {
      minHeight: "40px",
      backgroundColor: palette.inputBackground,
      borderRadius: "8px",
      transition: "all 0.2s ease-in-out",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: palette.inputBorder,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: palette.inputBorder,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: palette.inputFocusBorder,
        borderWidth: "1.5px",
      },
      "&.Mui-focused": {
        boxShadow: `0 0 6px ${theme.palette.primary.main}`,
      },
      "& input": {
        color: palette.inputText,
        fontSize: "15px",
        padding: "10px 12px",
        "::placeholder": {
          color: palette.inputPlaceholder,
          opacity: 1,
        },
      },

      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
        {
          WebkitAppearance: "textfield",
          margin: 0,
        },
      "& input[type=number]": {
        MozAppearance: "textfield",
      },
    },
    "& .MuiInputLabel-root": {
      color: palette.inputLabel,
      "&.Mui-focused": { color: palette.inputFocus },
    },
  };
});

const Label = styled("label")<{ error?: boolean }>(({ theme }) => ({
  fontSize: "14px",
  marginBottom: "4px",
  display: "inline-block",
  // color: error ? theme.palette.error.main : theme.palette.text.primary,
  "& span": { color: theme.palette.error.main, marginLeft: 2 },
}));

function CustomInputField<T extends FieldValues = FieldValues>({
  name,
  label,
  labelPosition = "outside",
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
  minValue,
  maxValue,
  ...rest
}: CustomInputFieldProps<T>) {
  const { control: contextControl } = useFormContext<T>() || {};
  const activeControl = control ?? contextControl;

  const [showPassword, setShowPassword] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const isPassword = type === "password";
  const isDate = type === "date";
  const isNumber = type === "number";

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
    (e.target as HTMLInputElement).blur();
  };
  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    const value = e.target.value;
    const num = Number(value);
    if (value === "") {
      onChange("");
      return;
    }
    if (value.startsWith("-")) {
      return;
    }
    if (minValue !== undefined && num < minValue) return;
    if (maxValue !== undefined && num > maxValue) return;
    onChange(num);
  };

  const renderTextField = (
    field: {
      value: T[Path<T>] | undefined;
      onChange: (value: any) => void;
    },
    error: FieldError | null
  ) => (
    <Box>
      {labelPosition === "outside" && (
        <Label htmlFor={name} error={!!error}>
          {label}
          {required && <span>*</span>}
        </Label>
      )}
      <StyledTextField
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
        onChange={(e: any) =>
          isNumber ? handleNumberChange(e, field.onChange) : field.onChange(e)
        }
        onWheel={(e) => {
          if (type === "number") e.currentTarget.blur();
        }}
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
        }}
        inputProps={{
          ...(type === "number"
            ? {
                min: minValue,
                max: maxValue,
                onWheel: (e: React.WheelEvent<HTMLInputElement>) =>
                  e.currentTarget.blur(),
              }
            : {}),
          step: "1",
          readOnly,
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
        onChange: (value) => setUncontrolledValue(String(value)),
      },
      null
    )
  );
}

export default CustomInputField;
