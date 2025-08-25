import React from 'react';
import { InputBase, IconButton, Paper } from '@mui/material';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBox = ({ 
  value,
  onChange,
  onClear,
  placeholder = 'Buscar...',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  return (
    <Paper 
      className={`flex items-center px-3 py-2 shadow-sm ${fullWidth ? 'w-full' : 'w-80'} ${className}`}
      elevation={1}
    >
      <FaSearch className="text-gray-400 mr-2" />
      <InputBase
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1"
        {...props}
      />
      {value && (
        <IconButton 
          size="small" 
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBox;
