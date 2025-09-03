import React from 'react';
import { Select } from '../ui';

const TableTypeFilter = ({ 
  selectedTable, 
  onTableChange, 
  tableOptions, 
  label = "Tipo de Tabela:",
  placeholder = "Selecione o tipo de tabela",
  className = ""
}) => {
  return (
    <div className={className}>
      <label htmlFor="tableSelect" className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Select
        id="tableSelect"
        value={tableOptions.find(option => option.value === selectedTable)}
        onChange={(selectedOption) => onTableChange(selectedOption.value)}
        options={tableOptions}
        placeholder={placeholder}
        size="xs"
      />
    </div>
  );
};

export default TableTypeFilter;
