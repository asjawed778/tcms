// import React, { useState } from "react";
// import {
//   TextField,
//   InputAdornment,
//   IconButton,
//   TextFieldProps,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { Controller, useFormContext, Control } from "react-hook-form";
// import type { TextFieldPropsSizeOverrides } from "@mui/material/TextField";
// import type { OverridableStringUnion } from "@mui/types";
// import { useAppTheme } from "@/context/ThemeContext";

// interface CustomInputFieldProps extends Omit<TextFieldProps, "name"> {
//   name: string;
//   label: string;
//   placeholder?: string;
//   type?: string;
//   startIcon?: React.ReactNode;
//   endIcon?: React.ReactNode;
//   control?: Control<any>;
//   minDate?: string;
//   maxDate?: string;
//   minValue?: number;
//   maxValue?: number;
//   required?: boolean;
//   readOnly?: boolean;
//   size?: OverridableStringUnion<
//     "small" | "medium",
//     TextFieldPropsSizeOverrides
//   >;
// }

// const CustomInputField: React.FC<CustomInputFieldProps> = ({
//   name,
//   label,
//   placeholder,
//   type = "text",
//   size = "small",
//   startIcon,
//   endIcon,
//   control,
//   disabled = false,
//   fullWidth = true,
//   required = true,
//   readOnly = false,
//   maxDate,
//   minDate,
//   minValue,
//   maxValue,
//   sx = {},
//   ...rest
// }) => {
//   const { control: contextControl } = useFormContext() || {};
//   const activeControl = control || contextControl;

//   const [showPassword, setShowPassword] = useState(false);
//   const isPassword = type === "password";
//   const isDate = type === "date";
//   const [uncontrolledValue, setUncontrolledValue] = useState("");
//   const { colors } = useAppTheme();

//   const renderTextField = (field: any, error?: any) => (
//     <TextField
//       {...field}
//       label={label}
//       disabled={disabled}
//       readOnly={readOnly}
//       value={field?.value ?? ""}
//       placeholder={isDate ? undefined : placeholder}
//       size={size}
//       // type={isDate ? "date" : isPassword && !showPassword ? "password" : "text"}
//       type={
//         isDate
//           ? "date"
//           : isPassword
//           ? showPassword
//             ? "text"
//             : "password"
//           : type
//       }
//       fullWidth={fullWidth}
//       required={required}
//       variant="outlined"
//       error={!!error}
//       helperText={error?.message}
//       sx={{
//         "& .MuiOutlinedInput-root": {
//           borderRadius: "8px",
//           transition: "border-color 0.3s",
//           "&:hover": { borderColor: colors.inputHover },
//           "&.Mui-focused": { borderColor: colors.inputFocus },
//         },
//         ...sx,
//       }}
//       InputProps={{
//         startAdornment: startIcon && (
//           <InputAdornment position="start">{startIcon}</InputAdornment>
//         ),
//         endAdornment: isPassword ? (
//           <InputAdornment position="end">
//             <IconButton
//               onClick={() => setShowPassword(!showPassword)}
//               edge="end"
//             >
//               {showPassword ? <VisibilityOff /> : <Visibility />}
//             </IconButton>
//           </InputAdornment>
//         ) : endIcon ? (
//           <InputAdornment position="end">{endIcon}</InputAdornment>
//         ) : undefined,
//       }}
//       InputLabelProps={{
//         sx: {
//           color: colors.inputLabel,
//           "&.Mui-focused": {
//             color: colors.primary,
//           },
//           "& .MuiFormLabel-asterisk": {
//             color: colors.error,
//           },
//         },
//         ...(isDate && { shrink: true }), // keep shrink if date
//       }}
//       // inputProps={isDate ? { max: maxDate, min: minDate } : undefined}
//       inputProps={
//         isDate
//           ? { max: maxDate, min: minDate }
//           : type === "number"
//           ? { min: minValue, max: maxValue }
//           : undefined
//       }
//       {...rest}
//     />
//   );
//   return activeControl ? (
//     <Controller
//       name={name}
//       control={activeControl}
//       render={({ field, fieldState: { error } }) => {
//         const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//           const val = e.target.value;
//           if (type === "number") {
//             field.onChange(val === "" ? "" : Number(val));
//           } else {
//             field.onChange(val);
//           }
//         };

//         return renderTextField(
//           {
//             ...field,
//             value: field.value ?? "",
//             onChange: handleChange,
//           },
//           error
//         );
//       }}
//     />
//   ) : (
//     // uncontrolled fallback
//     renderTextField(
//       {
//         value: uncontrolledValue,
//         onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
//           setUncontrolledValue(e.target.value),
//       },
//       null
//     )
//   );
// };

// export default CustomInputField;




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
    "& .MuiOutlinedInput-notchedOutline": {
      // borderColor: theme.palette.i,
      borderWidth: 1.5,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      // borderColor: theme.palette.inputBorderHover,
    },
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
