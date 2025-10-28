import { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  styled,
  SxProps,
  Theme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Colors } from "@/theme/colors";

interface CustomSearchFieldProps {
  label?: string;
  placeholder?: string;
  delay?: number;
  onSearch: (query: string) => void;
  value?: string | null;
  className?: string;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  fullWidth?: boolean;
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
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: palette.inputFocus,
    },
  };
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[600],
  "&:hover": {
    color: theme.palette.primary.main,
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
  sx,
  disabled = false,
  fullWidth = true,
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
      fullWidth={fullWidth}
      disabled={disabled}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-label={label || placeholder}
      className={className}
      sx={{
        backgroundColor: (theme) => Colors[theme.palette.mode].inputBackground,
        borderRadius: "8px",
        "& .MuiOutlinedInput-root": {
          backgroundColor: "inherit",
        },
        ...sx,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" sx={{ gap: 0.5 }}>
            {searchTerm && (
              <StyledClearButton
                size="small"
                onClick={handleClear}
                edge="end"
                aria-label="clear"
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </StyledClearButton>
            )}
            <StyledIconButton
              size="small"
              onClick={() => onSearch(searchTerm.trim())}
              aria-label="search"
            >
              <SearchIcon
                color={isFocused ? "primary" : "action"}
                sx={{ fontSize: 20 }}
              />
            </StyledIconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomSearchField;
