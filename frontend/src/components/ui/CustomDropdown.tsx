import React, { useMemo } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  styled,
  CircularProgress,
  useTheme,
  SxProps,
  Theme,
} from "@mui/material";
import {
  Controller,
  useFormContext,
  Control,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";
import { Colors } from "@/theme/colors";

interface Option {
  label: string;
  dropdownItem?: React.ReactNode;
  value: string;
}
type OnChangeMode = "value" | "option";
interface CustomDropdownFieldProps<T extends FieldValues = FieldValues> {
  label?: string;
  name?: Path<T>;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  showClearIcon?: boolean;
  control?: Control<T>;
  value?: string | string[] | Option | Option[] | null;
  onChange?: (value: string | string[] | Option | Option[] | null) => void;
  onChangeMode?: OnChangeMode;
  options?: (Option | string)[];
  labelPosition?: "inside" | "outside";
  sx?: SxProps<Theme>;
}
interface StyledTextFieldOwnerState {
  multiple?: boolean;
}
const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "ownerState",
})<{ ownerState: StyledTextFieldOwnerState }>(({ theme, ownerState }) => {
  const palette = Colors[theme.palette.mode];
  const multiple = ownerState?.multiple;
  return {
    "& .MuiOutlinedInput-root": {
      minHeight: "40px",
      height: multiple ? "auto" : "40px",
      alignItems: "center",
      backgroundColor: palette.inputBackground,
      borderRadius: "8px",
      transition: "all 0.2s ease-in-out",

      "& .MuiAutocomplete-tag": {
        height: "24px",
        fontSize: "14px",
        margin: "1px",
      },
      "& .MuiOutlinedInput-input": {
        padding: "2px 10px !important",
        fontSize: "15px",
        color: palette.inputText,
        "::placeholder": {
          color: palette.inputPlaceholder,
          opacity: 1,
        },
      },
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
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.error.main,
      },
      "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.error.main,
      },
      "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.error.main,
        borderWidth: "1.5px",
      },
      "&.Mui-error.Mui-focused": {
        boxShadow: `0 0 6px ${theme.palette.error.main}40`,
      },
    },
    "& .MuiInputLabel-root": {
      color: palette.inputLabel,
      "&.Mui-focused": { color: palette.inputFocus },
      "& .MuiFormLabel-asterisk": {
        color: theme.palette.error.main,
      },
      "&.Mui-error": {
        color: theme.palette.error.main,
      },
    },
  };
});

const StyledLabel = styled("label")(({ theme }) => ({
  display: "block",
  fontSize: "14px",
  marginBottom: "4px",
  // color: error ? theme.palette.error.main : theme.palette.text.primary,
  "& span": {
    color: theme.palette.error.main,
    marginLeft: 2,
  },
}));

const CustomDropdown = <T extends FieldValues>({
  label,
  name,
  placeholder = "Select",
  multiple = false,
  disabled = false,
  required = true,
  fullWidth = true,
  loading = false,
  showClearIcon = true,
  control: incomingControl,
  value: propValue,
  onChange: propOnChange,
  onChangeMode = "value",
  options = [],
  labelPosition = "outside",
  sx = {},
}: CustomDropdownFieldProps<T>) => {
  const theme = useTheme();
  const formContext = useFormContext<T>();
  const control = incomingControl ?? formContext?.control;

  const combinedOptions: Option[] = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === "string" ? { label: opt, value: opt } : opt,
      ),
    [options],
  );

  const getDisplayValue = (
    val: string | string[] | Option | Option[] | null,
  ): Option | Option[] | null => {
    if (multiple && Array.isArray(val)) {
      return combinedOptions.filter((opt) =>
        val.some((v) => {
          if (typeof v === "string") return v === opt.value;
          if (v && typeof v === "object" && "value" in v)
            return v.value === opt.value;
          return false;
        }),
      );
    }
    if (!multiple && val !== null && val !== undefined) {
      if (typeof val === "string") {
        return combinedOptions.find((opt) => opt.value === val) || null;
      }
      if (typeof val === "object" && "value" in val) {
        return (
          combinedOptions.find((opt) => opt.value === (val as Option).value) ||
          null
        );
      }
    }

    return null;
  };

  const renderAutocomplete = (
    fieldValue: any,
    onFieldChange: (v: any) => void,
    error?: FieldError,
  ) => {
    const hasError = !!error?.message;

    return (
      <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
        {labelPosition === "outside" && (
          <StyledLabel htmlFor={name}>
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
          ChipProps={{
            size: "small",
          }}
          limitTags={2}
          value={getDisplayValue(fieldValue)}
          // onChange={(_, newValue) => {
          //   const selected = multiple
          //     ? (newValue as Option[]).map((opt) => opt.value)
          //     : ((newValue as Option)?.value ?? null);
          //   onFieldChange(selected);
          // }}
          onChange={(_, newValue) => {
            const selectedOption = multiple
              ? (newValue as Option[])
              : (newValue as Option | null);
            const selectedValue =
              multiple && Array.isArray(newValue)
                ? newValue.map((o) => o.value)
                : ((newValue as Option | null)?.value ?? null);
            onFieldChange(selectedValue);
            if (propOnChange) {
              propOnChange(
                onChangeMode === "option" ? selectedOption : selectedValue,
              );
            }
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          disabled={disabled}
          disableClearable={!showClearIcon}
          loading={loading}
          fullWidth={fullWidth}
          noOptionsText="No options"
          loadingText={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} />
              Loading...
            </Box>
          }
          sx={{
            ...sx,
            borderRadius: "8px",
            minWidth: 180,
          }}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              id={name}
              label={labelPosition === "inside" ? label : undefined}
              placeholder={placeholder}
              ownerState={{ multiple }}
              required={required}
              error={hasError}
              helperText={error?.message}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor:
                    (sx as any)?.bgcolor ??
                    Colors[theme.palette.mode].inputBackground,
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              key={option.value}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderRadius: "4px",
              }}
            >
              {option.dropdownItem ?? option.label}
            </Box>
          )}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "8px",
                marginTop: "4px",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.18)",
                padding: "4px",
              },
            },
          }}
        />
      </Box>
    );
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) =>
          renderAutocomplete(field.value, field.onChange, fieldState.error)
        }
      />
    );
  }

  return renderAutocomplete(
    propValue ?? null,
    propOnChange ?? (() => {}),
    undefined,
  );
};

export default CustomDropdown;
