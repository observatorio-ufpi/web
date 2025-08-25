import React from 'react';
import { Alert as MuiAlert, AlertTitle } from '@mui/material';

const Alert = ({ 
  severity = 'info',
  title,
  children,
  onClose,
  className = '',
  ...props 
}) => {
  return (
    <MuiAlert
      severity={severity}
      onClose={onClose}
      className={className}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
};

export default Alert;
