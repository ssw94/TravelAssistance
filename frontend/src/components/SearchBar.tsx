import React, { useState, useEffect } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  fullWidth?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search destinations, places, activities...',
  value: initialValue = '',
  onSearch,
  debounceMs = 400,
  fullWidth = true,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceMs, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(searchTerm);
      }}
      sx={{
        p: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        width: fullWidth ? '100%' : 380,
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? '0 2px 10px rgba(0,0,0,0.04)'
            : '0 2px 10px rgba(0,0,0,0.3)',
      }}
    >
      <SearchIcon sx={{ color: 'text.secondary', ml: 1, mr: 1 }} />
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: '0.95rem' }}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        inputProps={{ 'aria-label': 'search travel destinations' }}
      />
      {searchTerm && (
        <IconButton size="small" onClick={handleClear} aria-label="clear search">
          <ClearIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
};
export default SearchBar;
