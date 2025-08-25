import React from 'react';
import { Select as MuiSelect, MenuItem, FormControl, InputLabel } from '@mui/material';

const Select = ({ 
  options = [],
  value,
  onChange,
  label,
  placeholder = 'Selecione uma opção',
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const sizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  
  const baseClasses = `${sizes[size]} transition-colors duration-200`;
  
  return (
    <FormControl 
      fullWidth={fullWidth} 
      className={`min-w-[200px] ${className}`}
      disabled={disabled}
    >
      {label && (
        <InputLabel className="text-gray-700 mb-2">
          {label}
        </InputLabel>
      )}
      <MuiSelect
        value={value || ''}
        onChange={onChange}
        variant={variant}
        size={size}
        className={baseClasses}
        displayEmpty
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <span className="text-gray-400">{placeholder}</span>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
