import React, { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface DebouncedSearchProps {
  label?: string;
  placeholder?: string;
  delay?: number;
  onSearch: (query: string) => void;
}

const CustomSearchField: React.FC<DebouncedSearchProps> = ({
  label = "",
  placeholder = "Search...",
  delay = 500,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay, onSearch]);

  return (
    <TextField
      variant="outlined"
      label={label}
      size="small"
      placeholder={placeholder}
      fullWidth
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomSearchField;
