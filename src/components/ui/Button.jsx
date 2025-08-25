import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  // Mapear nossas variantes para as variantes do MUI
  const muiVariants = {
    primary: 'contained',
    secondary: 'outlined',
    outline: 'outlined',
    danger: 'contained',
    success: 'contained'
  };
  
  // Mapear nossos tamanhos para os tamanhos do MUI
  const muiSizes = {
    small: 'small',
    medium: 'medium',
    large: 'large'
  };
  
  // Cores baseadas na variante
  const colors = {
    primary: 'primary',
    secondary: 'default',
    outline: 'primary',
    danger: 'error',
    success: 'success'
  };
  
  return (
    <MuiButton
      variant={muiVariants[variant]}
      size={muiSizes[size]}
      color={colors[variant]}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
