import React from 'react';
import { Card as MuiCard, CardContent as MuiCardContent } from '@mui/material';

const Card = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  backgroundColor,
  ...props
}) => {
  const baseClasses = 'transition-all duration-300 ease-in-out';

  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border-2 border-purple-200',
    filled: 'bg-purple-50 border border-purple-200'
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';

  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;

  // Se backgroundColor for fornecido, sobrescrever o background
  const cardStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <MuiCard
      className={classes}
      style={cardStyle}
      {...props}
    >
      {children}
    </MuiCard>
  );
};

const CardContent = ({
  children,
  padding = 'default',
  className = '',
  backgroundColor,
  ...props
}) => {
  const paddingClasses = {
    small: 'p-3',
    default: 'p-4',
    large: 'p-6'
  };

  const classes = `${paddingClasses[padding]} ${className}`;

  // Se backgroundColor for fornecido, sobrescrever o background
  const contentStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <MuiCardContent
      className={classes}
      style={contentStyle}
      {...props}
    >
      {children}
    </MuiCardContent>
  );
};

Card.Content = CardContent;

export default Card;
