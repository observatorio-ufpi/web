import React from 'react';
import { 
  Modal as MuiModal, 
  Box, 
  IconButton 
} from '@mui/material';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ 
  open,
  onClose,
  children,
  maxWidth = 'sm',
  className = '',
  ...props 
}) => {
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: maxWidth === 'xs' ? '300px' : 
           maxWidth === 'sm' ? '400px' : 
           maxWidth === 'md' ? '600px' : 
           maxWidth === 'lg' ? '800px' : 
           maxWidth === 'xl' ? '1200px' : '400px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    overflow: 'hidden'
  };

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      className={className}
      {...props}
    >
      <Box sx={modalStyle}>
        <div className="relative">
          <IconButton
            onClick={onClose}
            size="small"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
          >
            <FaTimes />
          </IconButton>
          {children}
        </div>
      </Box>
    </MuiModal>
  );
};

export default Modal;
