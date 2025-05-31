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
//   const keys = name.split("."); // Split nested field names like 'address.city'
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
//   } = props as Partial<WithHookFormProps>;

//   const formContext = useFormContext<FieldValues>();
//   const control = incomingControl ?? formContext?.control;
//   const isUsingHookForm = !!name && !!control;

//   const { colors } = useAppTheme();

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
//     const errorMsg = getErrorMessage(errors, name!); // Get error message for nested fields

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






import React from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  AutocompleteRenderInputParams,
} from "@mui/material";
import {
  Controller,
  useFormContext,
  Control,
  FieldValues,
  useFormState,
} from "react-hook-form";
import { useAppTheme } from "@/context/ThemeContext";

// Types
export interface DropdownOption {
  label: string;
  value: string;
}

interface SharedProps {
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  loadMoreOptions?: () => Promise<void>;
  hasMore?: boolean;
}

interface WithHookFormProps extends SharedProps {
  name: string;
  control?: Control<any>;
}

interface WithoutHookFormProps extends SharedProps {
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
}

type DropdownFieldProps = WithHookFormProps | WithoutHookFormProps;

const getErrorMessage = (errors: any, name: string) => {
  const keys = name.split(".");
  let error = errors;
  for (let key of keys) {
    if (error && error[key]) {
      error = error[key];
    } else {
      return undefined;
    }
  }
  return error?.message;
};

const CustomDropdownField: React.FC<DropdownFieldProps> = (props) => {
  const {
    label,
    options,
    placeholder,
    multiple = false,
    disabled = false,
    required = true,
    fullWidth = true,
    loading = false,
    control: incomingControl,
    name,
    loadMoreOptions,
    hasMore = false,
  } = props as Partial<WithHookFormProps & { loadMoreOptions?: () => Promise<void>; hasMore?: boolean }>;

  const formContext = useFormContext<FieldValues>();
  const control = incomingControl ?? formContext?.control;
  const isUsingHookForm = !!name && !!control;
  const { colors } = useAppTheme();

  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const listboxNode = event.currentTarget;
      if (
        hasMore &&
        listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10
      ) {
        loadMoreOptions && loadMoreOptions();
      }
    },
    [hasMore, loadMoreOptions]
  );

  const renderAutocomplete = (
    value: any,
    onChange: (value: any) => void,
    errorMsg?: string
  ) => {
    const displayValue = React.useMemo(() => {
      if (multiple) {
        return options?.filter((opt) =>
          Array.isArray(value) ? value.includes(opt.value) : false
        );
      }
      return options?.find((opt) => opt.value === value) || null;
    }, [value, options, multiple]);

    return (
      <Autocomplete
        multiple={multiple}
        options={options ?? []}
        value={displayValue}
        onChange={(_, newValue) => {
          const selected = multiple
            ? (newValue as DropdownOption[]).map((opt) => opt?.value)
            : (newValue as DropdownOption | null)?.value;
          onChange(selected);
        }}
        getOptionLabel={(option) => (option as DropdownOption)?.label || ""}
        isOptionEqualToValue={(a, b) =>
          (a as DropdownOption).value === (b as DropdownOption).value
        }
        disabled={disabled}
        fullWidth={fullWidth}
        loading={loading}
        loadingText={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CircularProgress size={20} />
            Loading...
          </div>
        }
        ListboxProps={{
          onScroll: handleScroll,
          style: { maxHeight: 250, overflowY: "auto" },
        }}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            required={required}
            error={!!errorMsg}
            size="small"
            helperText={errorMsg}
            InputLabelProps={{
              sx: {
                color: colors.inputLabel,
                "&.Mui-focused": {
                  color: colors.inputLabel,
                },
                "& .MuiFormLabel-asterisk": {
                  color: required ? colors.error : "transparent",
                },
              },
            }}
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={(option as DropdownOption)?.value}>
            {(option as DropdownOption)?.label}
          </li>
        )}
      />
    );
  };

  if (isUsingHookForm) {
    const { errors } = useFormState({ control });
    const errorMsg = getErrorMessage(errors, name!);

    return (
      <Controller
        name={name!}
        control={control}
        render={({ field }) =>
          renderAutocomplete(field.value, field.onChange, errorMsg)
        }
      />
    );
  }

  const { value, onChange } = props as WithoutHookFormProps;
  return renderAutocomplete(value, onChange);
};

export default CustomDropdownField;
