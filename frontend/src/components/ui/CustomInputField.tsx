import { useState, useCallback, ReactNode } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  TextFieldProps,
  styled,
  SxProps,
  Theme,
  useTheme,
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
  name?: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  size?: "small" | "medium";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  control?: Control<any>;
  value?: string | number | readonly string[] | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  sx?: SxProps<Theme>;
  step?: number;
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
          WebkitAppearance: "none",
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

const Label = styled("label")<{ error?: boolean }>(({ theme, error }) => ({
  fontSize: "14px",
  marginBottom: "4px",
  display: "block",
  // color: error ? theme.palette.error.main : theme.palette.text.primary,
  "& span": { color: theme.palette.error.main, marginLeft: 2 },
}));

function CustomInputField<T extends FieldValues>({
  name,
  label,
  labelPosition = "outside",
  placeholder,
  type = "text",
  size = "small",
  startIcon,
  endIcon,
  control: propControl,
  value: propValue,
  onChange: propOnChange,
  disabled = false,
  fullWidth = true,
  required = true,
  maxDate,
  minDate,
  rows,
  readOnly = false,
  minValue,
  maxValue,
  error: propError,
  helperText: propHelperText,
  step = 1,
  sx = {},
  ...rest
}: CustomInputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const formContext = useFormContext<T>();
  const contextControl = formContext?.control;
  const activeControl = propControl ?? contextControl;
  const isPassword = type === "password";
  const isDate = type === "date";
  const isNumber = type === "number";
  const theme = useTheme();

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    const value = e.target.value;
    if (value === "") {
      onChange("");
      return;
    }
    if (value.startsWith("-")) return;
    const num = Number(value);
    if (minValue !== undefined && num < minValue) return;
    if (maxValue !== undefined && num > maxValue) return;
    onChange(num);
    propOnChange?.(e);
  };

  const renderTextField = (
    fieldValue: any,
    fieldOnChange: (value: any) => void,
    error: FieldError | boolean | undefined,
    helperText?: ReactNode
  ) => {
    const displayValue =
      isDate && fieldValue
        ? new Date(fieldValue).toISOString().split("T")[0]
        : fieldValue ?? "";

    return (
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
          value={displayValue}
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
          helperText={helperText || (error as FieldError)?.message}
          required={labelPosition === "inside" ? false : required}
          onChange={(e: any) =>
            isNumber
              ? handleNumberChange(e, fieldOnChange)
              : fieldOnChange(e.target.value)
          }
          onWheel={(e) => type === "number" && e.currentTarget.blur()}
          InputProps={{
            startAdornment: startIcon && (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ),
            endAdornment: isPassword ? (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
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
            min:
              isDate && minDate
                ? new Date(minDate).toISOString().split("T")[0]
                : minValue,
            max:
              isDate && maxDate
                ? new Date(maxDate).toISOString().split("T")[0]
                : maxValue,
            step,
            readOnly,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor:
                (sx as any)?.bgcolor ??
                Colors[theme.palette.mode].inputBackground,
            },
          }}
          {...rest}
        />
      </Box>
    );
  };
  if (activeControl && name) {
    return (
      <Controller
        name={name}
        control={activeControl}
        render={({ field, fieldState: { error } }) =>
          renderTextField(field.value, field.onChange, error, error?.message)
        }
      />
    );
  }
  return renderTextField(
    propValue ?? "",
    (value) => {
      if (propOnChange && value?.target) {
        propOnChange(value);
      } else {
        const syntheticEvent = {
          target: {
            value: typeof value === "number" ? value.toString() : value,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        propOnChange?.(syntheticEvent);
      }
    },
    propError,
    propHelperText
  );
}

export default CustomInputField;
