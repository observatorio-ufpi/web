import React from 'react';
import { Button } from '@mui/material';
import TableTypeFilter from '../../../../helpers/TableTypeFilter.jsx';
import YearRangeFilter from '../../../../helpers/YearRangeFilter.jsx';
import { stateTableNames } from '../../../../../services/csvService.jsx';

const StateFilters = ({ 
  selectedTable, 
  onTableChange, 
  startYear, 
  endYear, 
  onStartYearChange, 
  onEndYearChange,
  onFilter,
  loading = false
}) => {
  // Opções das tabelas do estado
  const tableOptions = Object.entries(stateTableNames).map(([key, label]) => ({
    value: key,
    label: label
  }));

  return (
    <div className="flex flex-col gap-4 p-0 m-0">
    </div>
  );
};

export default StateFilters;
