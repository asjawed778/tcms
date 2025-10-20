import { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

interface CustomSearchFieldProps {
  label?: string;
  placeholder?: string;
  delay?: number;
  onSearch: (query: string) => void;
  value?: string | null;
  className?: string;
}

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: 1.5,
    },
  },
}));
const StyledClearButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[600],
  "&:hover": {
    color: theme.palette.error.main,
  },
}));

const CustomSearchField: React.FC<CustomSearchFieldProps> = ({
  label = "",
  placeholder = "Search...",
  delay = 500,
  onSearch,
  value,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(value || "");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, delay);
    return () => clearTimeout(handler);
  }, [searchTerm, delay, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <StyledTextField
      variant="outlined"
      label={label}
      size="small"
      placeholder={placeholder}
      fullWidth
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-label={label || placeholder}
      className={className}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color={isFocused ? "primary" : "action"} />
          </InputAdornment>
        ),
        endAdornment: searchTerm && (
          <InputAdornment position="end">
            <StyledClearButton
              size="small"
              onClick={handleClear}
              edge="end"
              aria-label="clear"
            >
              <CloseIcon fontSize="small" />
            </StyledClearButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomSearchField;
