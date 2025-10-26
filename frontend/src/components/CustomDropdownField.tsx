import { useMemo } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  styled,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Controller,
  useFormContext,
  Control,
  FieldValues,
  Path,
} from "react-hook-form";
import { Colors } from "@/theme/colors";

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownFieldProps<T extends FieldValues = FieldValues> {
  label: string;
  name?: Path<T>;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  control?: Control<any>;
  value?: string | string[] | Option | null;
  onChange?: (value: string | string[] | null) => void;
  options?: (Option | string)[];
  labelPosition?: "inside" | "outside";
}
const StyledTextField = styled(TextField)(({ theme }) => {
  const palette = Colors[theme.palette.mode];
  return {
    "& .MuiOutlinedInput-root": {
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
        borderRadius: "8px",
        color: palette.inputText,
        backgroundColor: palette.inputBackground,
        fontSize: "15px",
        padding: "10px 12px",
        "::placeholder": {
          color: palette.inputPlaceholder,
          opacity: 1,
        },
      },
    },
    "& .MuiInputLabel-root": {
      color: palette.inputLabel,
      "&.Mui-focused": { color: palette.inputFocus },
      "& .MuiFormLabel-asterisk": {
        color: theme.palette.error.main,
      },
    },
  };
});
const StyledLabel = styled("label")(({ theme }) => ({
  display: "block",
  fontSize: "0.875rem",
  marginBottom: 1,
  "& span": { color: theme.palette.error.main },
}));

// const getErrorMessage = <T extends FieldValues>(
//   errors: Record<string, unknown>,
//   name: Path<T>
// ): string | undefined => {
//   const keys = name.split(".");
//   let error: unknown = errors;
//   for (const key of keys) {
//     if (error && typeof error === "object" && key in error) {
//       error = (error as Record<string, unknown>)[key];
//     } else {
//       return undefined;
//     }
//   }
//   return (error as { message?: string })?.message;
// };

const CustomDropdownField = <T extends FieldValues>({
  label,
  name,
  placeholder = "Select",
  multiple = false,
  disabled = false,
  required = true,
  fullWidth = true,
  loading = false,
  control: incomingControl,
  value: propValue,
  onChange: propOnChange,
  options = [],
  labelPosition = "outside",
}: CustomDropdownFieldProps<T>) => {
  const formContext = useFormContext<T>();
  const control = incomingControl ?? formContext?.control;
  const theme = useTheme();
  // const errorMsg =
  //   name && control
  //     ? getErrorMessage(formContext?.formState.errors ?? {}, name)
  //     : undefined;

  const combinedOptions: Option[] = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === "string" ? { label: opt, value: opt } : opt
      ),
    [options]
  );

  const getDisplayValue = (val: string | string[] | Option | null) => {
    if (multiple)
      return combinedOptions.filter(
        (opt) => Array.isArray(val) && val.includes(opt.value)
      );
    if (val && typeof val === "object" && "value" in val) return val as Option;
    return combinedOptions.find((opt) => opt.value === val) || null;
  };

  const renderAutocompleteField = (
    val: string | string[] | Option | null,
    onChange: (v: string | string[] | null) => void,
    err?: string
  ) => (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      {labelPosition === "outside" && (
        <StyledLabel htmlFor={name} sx={{ fontSize: "14px", pb: "4px" }}>
          {label}
           {required && (
            <Box component="span" sx={{ color: theme.palette.error.main }}>
              *
            </Box>
          )}
        </StyledLabel>
      )}
      <Autocomplete
        multiple={multiple}
        options={combinedOptions}
        value={getDisplayValue(val)}
        onChange={(_, newVal) => {
          const selected = multiple
            ? (newVal as Option[]).map((opt) => opt.value)
            : (newVal as Option)?.value || null;
          onChange(selected);
        }}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(a, b) => a.value === b.value}
        disabled={disabled}
        fullWidth={fullWidth}
        loading={loading}
        noOptionsText="No options available"
        loadingText={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} /> Loading...
          </Box>
        }
        renderInput={(params) => (
          <StyledTextField
            {...params}
            id={name}
            label={labelPosition === "inside" ? label : undefined}
            placeholder={placeholder}
            required={required}
            error={!!err}
            helperText={err}
            size="small"
            InputLabelProps={{ required }}
          />
        )}
      />
    </Box>
  );
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) =>
        renderAutocompleteField(field.value, field.onChange, fieldState.error?.message)
      }
      />
    );
  }
  return renderAutocompleteField(
    propValue ?? null,
    propOnChange ?? (() => {}),
    undefined
  );
};

export default CustomDropdownField;
