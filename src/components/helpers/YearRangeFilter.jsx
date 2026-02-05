import React from 'react';
import { Select } from '../ui';

const YearRangeFilter = ({ 
  startYear, 
  endYear, 
  onStartYearChange, 
  onEndYearChange,
  minYear = 2007,
  maxYear = new Date().getFullYear(),
  className = ""
}) => {
  // Gerar opções de anos
  const yearOptions = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  ).map(year => ({
    value: year,
    label: year.toString()
  }));

  // Filtrar opções do ano final baseado no ano inicial
  const endYearOptions = yearOptions.filter(option => 
    option.value >= startYear
  );

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="w-full">
        <label htmlFor="startYearSelect" className="block text-xs font-medium text-gray-600 mb-1">
          Ano Inicial:
        </label>
        <Select
          id="startYearSelect"
          value={yearOptions.find(option => option.value === startYear)}
          onChange={(selectedOption) => {
            const newStartYear = selectedOption.value;
            onStartYearChange(newStartYear);
            
            // Se o ano inicial for maior que o final, ajustar o final
            if (newStartYear > endYear) {
              onEndYearChange(newStartYear);
            }
          }}
          options={yearOptions}
          placeholder="Ano Inicial"
          size="xs"
        />
      </div>
      
      <div className="w-full">
        <label htmlFor="endYearSelect" className="block text-xs font-medium text-gray-600 mb-1">
          Ano Final:
        </label>
        <Select
          id="endYearSelect"
          value={endYearOptions.find(option => option.value === endYear)}
          onChange={(selectedOption) => onEndYearChange(selectedOption.value)}
          options={endYearOptions}
          placeholder="Ano Final"
          size="xs"
        />
      </div>
    </div>
  );
};

export default YearRangeFilter;
