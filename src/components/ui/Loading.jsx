import React from 'react';

const Loading = ({ 
  variant = 'spinner',
  size = 'medium',
  text = 'Carregando...',
  className = '',
  ...props 
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  const spinnerClasses = `${sizes[size]} border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin`;
  
  const variants = {
    spinner: (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={spinnerClasses}></div>
        {text && <p className="text-gray-600 text-sm">{text}</p>}
      </div>
    ),
    dots: (
      <div className="flex items-center justify-center space-x-1">
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    ),
    pulse: (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={`${sizes[size]} bg-purple-600 rounded-full animate-pulse`}></div>
        {text && <p className="text-gray-600 text-sm">{text}</p>}
      </div>
    )
  };
  
  return (
    <div className={`flex items-center justify-center p-4 ${className}`} {...props}>
      {variants[variant]}
    </div>
  );
};

export default Loading;
