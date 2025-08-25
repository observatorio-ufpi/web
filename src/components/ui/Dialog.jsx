import React from 'react';
import { 
  Dialog as MuiDialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton 
} from '@mui/material';
import { FaTimes } from 'react-icons/fa';

const Dialog = ({ 
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      className={className}
      {...props}
    >
      {title && (
        <DialogTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{title}</span>
          <IconButton
            onClick={onClose}
            size="small"
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
      )}
      
      <DialogContent className="py-4">
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions className="px-4 py-3">
          {actions}
        </DialogActions>
      )}
    </MuiDialog>
  );
};

export default Dialog;
