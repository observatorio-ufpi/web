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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {/* Filtro de Tipo de Tabela - Primeira coluna */}
        <div className="md:col-span-1">
          <TableTypeFilter
            selectedTable={selectedTable}
            onTableChange={onTableChange}
            tableOptions={tableOptions}
            label="Tipo de Tabela:"
            placeholder="Selecione o tipo de tabela"
          />
        </div>

        {/* Filtro de Ano - Segunda coluna */}
        <div className="md:col-span-1">
          <YearRangeFilter
            startYear={startYear}
            endYear={endYear}
            onStartYearChange={onStartYearChange}
            onEndYearChange={onEndYearChange}
            minYear={2007}
            maxYear={2023}
          />
        </div>

        {/* Botão Filtrar - Terceira coluna */}
        <div className="md:col-span-1 flex justify-end items-end">
          <Button
            variant="contained"
            onClick={onFilter}
            className="w-full md:w-auto min-w-[120px] px-4 py-1.5"
          >
            Filtrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StateFilters;
