import React from 'react';
import { TextField } from '@mui/material';

const Input = ({ 
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  required = false,
  error = false,
  helperText = '',
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
      className={className}
      {...props}
    />
  );
};

export default Input;
