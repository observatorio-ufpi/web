import React from 'react';
import { Tooltip as MuiTooltip } from '@mui/material';

const Tooltip = ({ 
  children,
  title,
  placement = 'top',
  arrow = true,
  enterDelay = 200,
  leaveDelay = 0,
  className = '',
  ...props 
}) => {
  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      className={className}
      {...props}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
