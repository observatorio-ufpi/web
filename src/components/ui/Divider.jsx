import React from 'react';
import { Divider as MuiDivider } from '@mui/material';

const Divider = ({ 
  orientation = 'horizontal',
  variant = 'fullWidth',
  flexItem = false,
  light = false,
  className = '',
  ...props 
}) => {
  return (
    <MuiDivider
      orientation={orientation}
      variant={variant}
      flexItem={flexItem}
      light={light}
      className={className}
      {...props}
    />
  );
};

export default Divider;
