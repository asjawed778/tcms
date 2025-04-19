import React, { useRef, useState, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  ClickAwayListener,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Debounce hook to limit API calls
const useDebounce = (func: Function, delay: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: any) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );

  return debouncedFunction;
};

export interface SearchBoxProps<T> {
  value: string;
  onChange: (value: string) => void;
  suggestions?: T[];
  getLabel: (item: T) => string;
  onSelectSuggestion: (item: T) => void;
  placeholder?: string;
  isLoading?: boolean;
  debounceDelay?: number;
}

const CustomSearchBox = <T,>({
  value,
  onChange,
  suggestions = [],
  getLabel,
  onSelectSuggestion,
  placeholder = 'Search...',
  isLoading = false,
  debounceDelay = 500,
}: SearchBoxProps<T>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !suggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onSelectSuggestion(suggestions[highlightedIndex]);
      setOpen(false);
    }
  };

  const handleClickAway = () => setOpen(false);

  // Using debounce for search input change
  const debouncedSearch = useDebounce(onChange, debounceDelay);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <TextField
          inputRef={inputRef}
          value={value}
          onChange={(e) => {
            const inputValue = e.target.value;
            debouncedSearch(inputValue);
            setOpen(true);
          }}
          onFocus={() => suggestions.length && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  value && (
                    <IconButton onClick={() => onChange('')}>
                      <ClearIcon />
                    </IconButton>
                  )
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 1,
          }}
        />

        <Popper
          open={open && (suggestions.length > 0 || value.length > 0)}
          anchorEl={inputRef.current}
          placement="bottom-start"
          style={{ zIndex: 1300 }}
        >
          <Paper sx={{ width: inputRef.current?.offsetWidth || 300 }}>
            <List dense>
              {suggestions.length ? (
                suggestions.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      selected={index === highlightedIndex}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => {
                        onSelectSuggestion(item);
                        setOpen(false);
                      }}
                    >
                      <ListItemText primary={getLabel(item)} />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                !isLoading && (
                  <ListItem>
                    <ListItemText primary="No results found" />
                  </ListItem>
                )
              )}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default CustomSearchBox;
