
// import {
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
//   Typography,
// } from "@mui/material";
// import debounce from "lodash.debounce";
// import React, { useEffect, useRef, useState } from "react";

// interface Props {
//   label: string;
//   value: any;
//   onChange: (val: any) => void;
//   options: (string | Record<string, any>)[];
//   valueKey?: string;
//   labelKey?: string;
//   size?: "small" | "medium";
//   fullWidth?: boolean;
//   required?: boolean;
//   sx?: SxProps<Theme>;
// }

// const CustomDropdownField: React.FC<Props> = ({
//   label,
//   value,
//   onChange,
//   options,
//   size = "small",
//   fullWidth = true,
//   required = true,
//   sx = {},
//   valueKey = "value",
//   labelKey = "label",
// }) => {
//   const [open, setOpen] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [filtered, setFiltered] = useState(options);

//   const debouncedSearch = useRef(
//     debounce((val: string) => setSearchText(val), 300)
//   ).current;

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     debouncedSearch(e.target.value);
//   };

//   useEffect(() => {
//     if (!searchText.trim()) {
//       setFiltered(options);
//     } else {
//       const lower = searchText.toLowerCase();
//       const result = options.filter((opt) => {
//         const label =
//           typeof opt === "string" ? opt : opt[labelKey]?.toString() || "";
//         return label.toLowerCase().includes(lower);
//       });
//       setFiltered(result);
//     }
//   }, [searchText, options]);

//   return (
//     <FormControl
//       fullWidth={fullWidth}
//       size={size}
//       sx={{
//         minWidth: 150,
//         textAlign: "left",
//         ...sx,
//       }}
//     >
//       <InputLabel required={required}>{label}</InputLabel>
//       <Select
//         open={open}
//         onOpen={() => setOpen(true)}
//         onClose={() => setOpen(false)}
//         label={label}
//         value={value}
//         size="small"
//         onChange={(e) => onChange(e.target.value)}
//         renderValue={(val) => {
//           const item = options.find((opt) =>
//             typeof opt === "string" ? opt === val : opt[valueKey] === val
//           );
//           return typeof item === "string" ? item : item?.[labelKey];
//         }}
//       >
//         <MenuItem disabled>
//           <TextField
//             placeholder="Search..."
//             fullWidth
//             size="small"
//             onChange={handleSearchChange}
//           />
//         </MenuItem>

//         {filtered?.length === 0 && (
//           <MenuItem disabled>No results found</MenuItem>
//         )}

//         {filtered?.map((item) => {
//           const val = typeof item === "string" ? item : item[valueKey];
//           const label = typeof item === "string" ? item : item[labelKey];
//           return (
//             <MenuItem key={val} value={val}>
//               {label}
//             </MenuItem>
//           );
//         })}
//       </Select>
//     </FormControl>
//   );
// };

// export default CustomDropdownField;




import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import debounce from "lodash.debounce";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext, Control } from "react-hook-form";
import type { SxProps, Theme } from "@mui/material";

interface BaseProps {
  label: string;
  options: (string | Record<string, any>)[];
  valueKey?: string;
  labelKey?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  required?: boolean;
  sx?: SxProps<Theme>;
}

type HookFormMode = {
  name: string;
  control?: Control<any>; // Optional external control
  value?: never;
  onChange?: never;
};

type ControlledMode = {
  name?: never;
  control?: never;
  value: any;
  onChange: (val: any) => void;
};

type Props = BaseProps & (HookFormMode | ControlledMode);

const CustomDropdownField: React.FC<Props> = ({
  name,
  label,
  options,
  valueKey = "value",
  labelKey = "label",
  size = "small",
  fullWidth = true,
  required = true,
  sx = {},
  value,
  onChange,
  control: externalControl,
}) => {
  const formContext = useFormContext();
  const control = externalControl || formContext?.control;

  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState(options);

  const debouncedSearch = useRef(
    debounce((val: string) => setSearchText(val), 300)
  ).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    if (!searchText.trim()) {
      setFiltered(options);
    } else {
      const lower = searchText.toLowerCase();
      const result = options.filter((opt) => {
        const label =
          typeof opt === "string" ? opt : opt[labelKey]?.toString() || "";
        return label.toLowerCase().includes(lower);
      });
      setFiltered(result);
    }
  }, [searchText, options]);

  const renderSelect = (
    selectedValue: any,
    onValueChange: (val: any) => void,
    errorText?: string
  ) => (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={!!errorText}
      sx={{
        minWidth: 150,
        textAlign: "left",
        ...sx,
      }}
    >
      <InputLabel required={required}>{label}</InputLabel>
      <Select
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        label={label}
        value={selectedValue ?? ""}
        size={size}
        onChange={(e: SelectChangeEvent<any>) => onValueChange(e.target.value)}
        renderValue={(val) => {
          const item = options.find((opt) =>
            typeof opt === "string" ? opt === val : opt[valueKey] === val
          );
          return typeof item === "string" ? item : item?.[labelKey];
        }}
      >
        <MenuItem disabled>
          <TextField
            placeholder="Search..."
            fullWidth
            size="small"
            onChange={handleSearchChange}
          />
        </MenuItem>

        {filtered?.length === 0 ? (
          <MenuItem disabled>No results found</MenuItem>
        ) : (
          filtered?.map((item) => {
            const val = typeof item === "string" ? item : item[valueKey];
            const label = typeof item === "string" ? item : item[labelKey];
            return (
              <MenuItem key={val} value={val}>
                {label}
              </MenuItem>
            );
          })
        )}
      </Select>
      {errorText && (
        <Typography color="error" variant="caption">
          {errorText}
        </Typography>
      )}
    </FormControl>
  );

  if (name && control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) =>
          renderSelect(field.value, field.onChange, fieldState.error?.message)
        }
      />
    );
  }

  if (value !== undefined && typeof onChange === "function") {
    return renderSelect(value, onChange);
  }

  console.error(
    "CustomDropdownField must be used with either: 1) name + control/useFormContext OR 2) value + onChange"
  );
  return null;
};

export default CustomDropdownField;
