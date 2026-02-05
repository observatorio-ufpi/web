import React, { useState } from 'react';
import { Button } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import YearRangeFilter from './YearRangeFilter';

const StateYearRangeFilter = ({ 
  anoInicial = 2007, 
  anoFinal = 2024,
  onFilterChange,
  filtersExpanded = true
}) => {
  const [startYear, setStartYear] = useState(anoInicial);
  const [endYear, setAnoFinal] = useState(anoFinal);
  const [expanded, setExpanded] = useState(filtersExpanded);

  const handleFilterClick = () => {
    onFilterChange({
      anoInicial: startYear,
      anoFinal: endYear
    });
  };

  const handleClear = () => {
    setStartYear(2007);
    setAnoFinal(2024);
    onFilterChange({
      anoInicial: 2007,
      anoFinal: 2024
    });
  };

  return (
    <div className="filter-container">
      <button
        className="filter-header flex justify-between items-center w-full p-3 rounded-lg hover:bg-gray-200 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-semibold text-gray-700">Período</span>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </button>

      {expanded && (
        <div className="filter-content p-3 space-y-4">
          <YearRangeFilter
            startYear={startYear}
            endYear={endYear}
            onStartYearChange={setStartYear}
            onEndYearChange={setAnoFinal}
            minYear={2007}
            maxYear={2024}
          />

          <div className="flex gap-2">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleFilterClick}
              sx={{ flex: 1, textTransform: 'none' }}
            >
              Mostrar resultados
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleClear}
              sx={{ flex: 1, textTransform: 'none' }}
            >
              Limpar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateYearRangeFilter;
