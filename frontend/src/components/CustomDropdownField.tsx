// import {
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   CircularProgress,
//   TextField,
// } from "@mui/material";
// import { Controller, useFormContext } from "react-hook-form";
// import React, { useState, useRef } from "react";
// import debounce from "lodash.debounce";

// interface Props {
//   name: string;
//   label: string;
//   valueKey?: string;
//   labelKey?: string;
//   staticOptions: (string | Record<string, any>)[];
// }

// const CustomDropdownField: React.FC<Props> = ({
//   name,
//   label,
//   valueKey,
//   labelKey,
//   staticOptions,
// }) => {
//   const { control } = useFormContext();

//   const [searchText, setSearchText] = useState("");
//   const [open, setOpen] = useState(false);
//   const [filteredOptions, setFilteredOptions] = useState(staticOptions);
//   const [loading, setLoading] = useState(false);

//   const debouncedSearch = useRef(
//     debounce((value: string) => {
//       setLoading(true);
//       const filtered = staticOptions.filter((item) => {
//         const label =
//           typeof item === "string"
//             ? item
//             : labelKey
//             ? item[labelKey]
//             : item[valueKey || "value"];
//         return label?.toLowerCase().includes(value.toLowerCase());
//       });
//       setFilteredOptions(filtered);
//       setLoading(false);
//     }, 300)
//   ).current;

//   const handleOpen = () => {
//     setOpen(true);
//     setFilteredOptions(staticOptions);
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchText(value);
//     debouncedSearch(value);
//   };

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState }) => (
//         <FormControl fullWidth error={!!fieldState.error}>
//           <InputLabel>{label}</InputLabel>
//           <Select
//             {...field}
//             label={label}
//             onOpen={handleOpen}
//             open={open}
//             onClose={() => setOpen(false)}
//             MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
//             renderValue={(selected) => {
//               const selectedItem = staticOptions.find((item) =>
//                 typeof item === "string"
//                   ? item === selected
//                   : item[valueKey || "value"] === selected
//               );
//               return typeof selectedItem === "string"
//                 ? selectedItem
//                 : selectedItem?.[labelKey || "label"];
//             }}
//           >
//             <MenuItem disabled>
//               <TextField
//                 value={searchText}
//                 onChange={handleSearchChange}
//                 placeholder="Search..."
//                 fullWidth
//                 size="small"
//               />
//             </MenuItem>

//             {loading && (
//               <MenuItem disabled>
//                 <CircularProgress size={20} />
//               </MenuItem>
//             )}

//             {!loading && filteredOptions.length === 0 && (
//               <MenuItem disabled>No results found</MenuItem>
//             )}

//             {filteredOptions.map((item) => {
//               const value =
//                 typeof item === "string"
//                   ? item
//                   : item[valueKey || "value"];
//               const label =
//                 typeof item === "string"
//                   ? item
//                   : item[labelKey || "label"];

//               return (
//                 <MenuItem key={value} value={value}>
//                   {label}
//                 </MenuItem>
//               );
//             })}
//           </Select>

//           {fieldState.error && (
//             <Typography color="error" variant="caption">
//               {fieldState.error.message}
//             </Typography>
//           )}
//         </FormControl>
//       )}
//     />
//   );
// };

// export default CustomDropdownField;



import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import React, { useState, useRef, useEffect } from "react";
import debounce from "lodash.debounce";

interface Props {
  name: string;
  label: string;
  valueKey?: string;
  labelKey?: string;
  staticOptions: (string | Record<string, any>)[]; // The options you provide to the dropdown
}

const CustomDropdownField: React.FC<Props> = ({
  name,
  label,
  valueKey,
  labelKey,
  staticOptions,
}) => {
  const { control } = useFormContext();

  const [searchText, setSearchText] = useState("");  // Search input state
  const [open, setOpen] = useState(false);  // Dropdown open state
  const [filteredOptions, setFilteredOptions] = useState(staticOptions);  // Filtered options state

  // Debounced search update
  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearchText(value);
    }, 300)
  ).current;

  // Effect to filter options based on search text
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredOptions(staticOptions); // Show all options if search text is empty
    } else {
      const filtered = staticOptions.filter((item) => {
        const label =
          typeof item === "string"
            ? item
            : labelKey
            ? item[labelKey]
            : item[valueKey || "value"];

        return label?.toLowerCase().includes(searchText.toLowerCase());
      });
      setFilteredOptions(filtered);  // Update filtered options
    }
  }, [searchText, staticOptions]);  // Only rerun when searchText or staticOptions change

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);  // Debounce the search input
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={!!fieldState.error}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            value={field.value || ""} // Ensure Select value is always defined
            label={label}
            onOpen={handleOpen}
            open={open}
            onClose={() => setOpen(false)}
            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
            renderValue={(selected) => {
              const selectedItem = staticOptions.find((item) =>
                typeof item === "string"
                  ? item === selected
                  : item[valueKey || "value"] === selected
              );
              return typeof selectedItem === "string"
                ? selectedItem
                : selectedItem?.[labelKey || "label"];
            }}
          >
            <MenuItem disabled>
              <TextField
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Search..."
                fullWidth
                size="small"
              />
            </MenuItem>

            {filteredOptions.length === 0 && (
              <MenuItem disabled>No results found</MenuItem>
            )}

            {filteredOptions.map((item) => {
              const value =
                typeof item === "string"
                  ? item
                  : item[valueKey || "value"];
              const label =
                typeof item === "string"
                  ? item
                  : item[labelKey || "label"];

              return (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              );
            })}
          </Select>

          {fieldState.error && (
            <Typography color="error" variant="caption">
              {fieldState.error.message}
            </Typography>
          )}
        </FormControl>
      )}
    />
  );
};

export default CustomDropdownField;
