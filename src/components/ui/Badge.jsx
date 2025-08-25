import React from 'react';
import { Badge as MuiBadge } from '@mui/material';

const Badge = ({ 
  children,
  badgeContent,
  variant = 'standard',
  color = 'primary',
  max = 99,
  showZero = false,
  invisible = false,
  className = '',
  ...props 
}) => {
  return (
    <MuiBadge
      badgeContent={badgeContent}
      variant={variant}
      color={color}
      max={max}
      showZero={showZero}
      invisible={invisible}
      className={className}
      {...props}
    >
      {children}
    </MuiBadge>
  );
};

export default Badge;
