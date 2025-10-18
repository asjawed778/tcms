// import React from "react";
// import {
//   Autocomplete,
//   TextField,
//   CircularProgress,
//   AutocompleteRenderInputParams,
// } from "@mui/material";
// import {
//   Controller,
//   useFormContext,
//   Control,
//   FieldValues,
//   useFormState,
// } from "react-hook-form";
// import { useAppTheme } from "@/context/ThemeContext";

// // Types
// export interface DropdownOption {
//   label: string;
//   value: string;
// }

// interface SharedProps {
//   label: string;
//   options: DropdownOption[];
//   placeholder?: string;
//   multiple?: boolean;
//   disabled?: boolean;
//   required?: boolean;
//   fullWidth?: boolean;
//   loading?: boolean;
//   loadMoreOptions?: () => Promise<void>;
//   hasMore?: boolean;
// }

// interface WithHookFormProps extends SharedProps {
//   name: string;
//   control?: Control<any>;
// }

// interface WithoutHookFormProps extends SharedProps {
//   value: string | string[] | null;
//   onChange: (value: string | string[] | null) => void;
// }

// type DropdownFieldProps = WithHookFormProps | WithoutHookFormProps;

// const getErrorMessage = (errors: any, name: string) => {
//   const keys = name.split(".");
//   let error = errors;
//   for (let key of keys) {
//     if (error && error[key]) {
//       error = error[key];
//     } else {
//       return undefined;
//     }
//   }
//   return error?.message;
// };

// const CustomDropdownField: React.FC<DropdownFieldProps> = (props) => {
//   const {
//     label,
//     options,
//     placeholder,
//     multiple = false,
//     disabled = false,
//     required = true,
//     fullWidth = true,
//     loading = false,
//     control: incomingControl,
//     name,
//     loadMoreOptions,
//     hasMore = false,
//   } = props as Partial<WithHookFormProps & { loadMoreOptions?: () => Promise<void>; hasMore?: boolean }>;

//   const formContext = useFormContext<FieldValues>();
//   const control = incomingControl ?? formContext?.control;
//   const isUsingHookForm = !!name && !!control;
//   const { colors } = useAppTheme();

//   const handleScroll = React.useCallback(
//     (event: React.UIEvent<HTMLElement>) => {
//       const listboxNode = event.currentTarget;
//       if (
//         hasMore &&
//         listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10
//       ) {
//         loadMoreOptions && loadMoreOptions();
//       }
//     },
//     [hasMore, loadMoreOptions]
//   );

//   const renderAutocomplete = (
//     value: any,
//     onChange: (value: any) => void,
//     errorMsg?: string
//   ) => {
//     const displayValue = React.useMemo(() => {
//       if (multiple) {
//         return options?.filter((opt) =>
//           Array.isArray(value) ? value.includes(opt.value) : false
//         );
//       }
//       return options?.find((opt) => opt.value === value) || null;
//     }, [value, options, multiple]);

//     return (
//       <Autocomplete
//         multiple={multiple}
//         options={options ?? []}
//         value={displayValue}
//         onChange={(_, newValue) => {
//           const selected = multiple
//             ? (newValue as DropdownOption[]).map((opt) => opt?.value)
//             : (newValue as DropdownOption | null)?.value;
//           onChange(selected);
//         }}
//         getOptionLabel={(option) => (option as DropdownOption)?.label || ""}
//         isOptionEqualToValue={(a, b) =>
//           (a as DropdownOption).value === (b as DropdownOption).value
//         }
//         disabled={disabled}
//         fullWidth={fullWidth}
//         loading={loading}
//         loadingText={
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <CircularProgress size={20} />
//             Loading...
//           </div>
//         }
//         ListboxProps={{
//           onScroll: handleScroll,
//           style: { maxHeight: 250, overflowY: "auto" },
//         }}
//         renderInput={(params: AutocompleteRenderInputParams) => (
//           <TextField
//             {...params}
//             label={label}
//             placeholder={placeholder}
//             required={required}
//             error={!!errorMsg}
//             size="small"
//             helperText={errorMsg}
//             InputLabelProps={{
//               sx: {
//                 color: colors.inputLabel,
//                 "&.Mui-focused": {
//                   color: colors.inputLabel,
//                 },
//                 "& .MuiFormLabel-asterisk": {
//                   color: required ? colors.error : "transparent",
//                 },
//               },
//             }}
//             sx={{
//               minWidth: 200,
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: "8px",
//               },
//             }}
//           />
//         )}
//         renderOption={(props, option) => (
//           <li {...props} key={(option as DropdownOption)?.value}>
//             {(option as DropdownOption)?.label}
//           </li>
//         )}
//       />
//     );
//   };

//   if (isUsingHookForm) {
//     const { errors } = useFormState({ control });
//     const errorMsg = getErrorMessage(errors, name!);

//     return (
//       <Controller
//         name={name!}
//         control={control}
//         render={({ field }) =>
//           renderAutocomplete(field.value, field.onChange, errorMsg)
//         }
//       />
//     );
//   }

//   const { value, onChange } = props as WithoutHookFormProps;
//   return renderAutocomplete(value, onChange);
// };

// export default CustomDropdownField;





import { useMemo } from 'react'
import { Autocomplete, TextField, Box, styled, CircularProgress } from '@mui/material'
import { Controller, useFormContext, Control, FieldValues, Path } from 'react-hook-form'

interface Option {
  label: string
  value: string
}

interface CustomDropdownFieldProps<T extends FieldValues = FieldValues> {
  label: string
  name?: Path<T>
  placeholder?: string
  multiple?: boolean
  disabled?: boolean
  required?: boolean
  fullWidth?: boolean
  loading?: boolean
  control?: Control<T>
  value?: string | string[] | Option | null
  onChange?: (value: string | string[] | null) => void
  options?: (Option | string)[]
  labelPosition?: 'inside' | 'outside'
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  minWidth: 200,
  borderRadius: 8,
  '& .MuiOutlinedInput-root': { borderRadius: 8, fontSize: 15 },
  '& .MuiFormLabel-asterisk': { color: theme.palette.error.main },
}))

const StyledLabel = styled('label')(({ theme }) => ({
  display: 'block',
  fontSize: '0.875rem',
  marginBottom: 1,
  '& span': { color: theme.palette.error.main },
}))

const getErrorMessage = <T extends FieldValues>(
  errors: Record<string, unknown>,
  name: Path<T>
): string | undefined => {
  const keys = name.split('.')
  let error: unknown = errors
  for (const key of keys) {
    if (error && typeof error === 'object' && key in error) {
      error = (error as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return (error as { message?: string })?.message
}

const CustomDropdownField = <T extends FieldValues>({
  label,
  name,
  placeholder = 'Select',
  multiple = false,
  disabled = false,
  required = true,
  fullWidth = true,
  loading = false,
  control: incomingControl,
  value: propValue,
  onChange: propOnChange,
  options = [],
  labelPosition = 'inside',
}: CustomDropdownFieldProps<T>) => {
  const formContext = useFormContext<T>()
  const control = incomingControl ?? formContext?.control

  const errorMsg = name && control ? getErrorMessage(formContext?.formState.errors ?? {}, name) : undefined

  const combinedOptions: Option[] = useMemo(
    () => options.map((opt) => (typeof opt === 'string' ? { label: opt, value: opt } : opt)),
    [options]
  )

  const getDisplayValue = (val: string | string[] | Option | null) => {
    if (multiple) return combinedOptions.filter((opt) => Array.isArray(val) && val.includes(opt.value))
    if (val && typeof val === 'object' && 'value' in val) return val as Option
    return combinedOptions.find((opt) => opt.value === val) || null
  }

  const renderAutocompleteField = (
    val: string | string[] | Option | null,
    onChange: (v: string | string[] | null) => void,
    err?: string
  ) => (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {labelPosition === 'outside' && (
        <StyledLabel htmlFor={name}>
          {label} {required && <span>*</span>}
        </StyledLabel>
      )}
      <Autocomplete
        multiple={multiple}
        options={combinedOptions}
        value={getDisplayValue(val)}
        onChange={(_, newVal) => {
          const selected = multiple
            ? (newVal as Option[]).map((opt) => opt.value)
            : (newVal as Option)?.value || null
          onChange(selected)
        }}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(a, b) => a.value === b.value}
        disabled={disabled}
        fullWidth={fullWidth}
        loading={loading}
        noOptionsText="No options available"
        loadingText={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} /> Loading...
          </Box>
        }
        renderInput={(params) => (
          <StyledTextField
            {...params}
            id={name}
            label={labelPosition === 'inside' ? label : undefined}
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
  )
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => renderAutocompleteField(field.value, field.onChange, errorMsg)}
      />
    )
  }
  return renderAutocompleteField(propValue ?? null, propOnChange ?? (() => {}), undefined)
}

export default CustomDropdownField


