import React from 'react';
import Select from 'react-select';

const CustomSelect = ({ 
  options = [],
  value,
  onChange,
  label,
  placeholder = 'Selecione uma opção',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const sizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  
  const baseClasses = `${sizes[size]} transition-colors duration-200`;
  
  // Estilos customizados baseados no que já existe no Home.jsx
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? '2px solid #8b5cf6' : '2px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 1px #8b5cf6' : 'none',
      minHeight: size === 'small' ? '36px' : size === 'large' ? '48px' : '40px',
      '&:hover': {
        border: '2px solid #8b5cf6'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontSize: sizes[size],
      '&:hover': {
        backgroundColor: state.isSelected ? '#8b5cf6' : '#f3f4f6'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151',
      fontSize: sizes[size]
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: sizes[size]
    }),
    input: (provided) => ({
      ...provided,
      fontSize: sizes[size]
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: size === 'small' ? '4px 8px' : size === 'large' ? '12px 16px' : '8px 12px'
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: size === 'small' ? '4px 8px' : size === 'large' ? '12px 16px' : '8px 12px'
    })
  };
  
  return (
    <div className={`${fullWidth ? 'w-full' : 'min-w-[200px]'} ${className}`}>
      {label && (
        <label className="block text-gray-700 mb-2 text-sm font-medium">
          {label}
        </label>
      )}
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isDisabled={disabled}
        className={baseClasses}
        classNamePrefix="react-select"
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        {...props}
      />
    </div>
  );
};

export default CustomSelect;
