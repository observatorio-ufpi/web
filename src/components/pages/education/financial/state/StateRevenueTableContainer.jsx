import React, { useState } from 'react';
import { stateTableNames } from '../../../../../services/csvService.jsx';
import StateRevenueTable from './StateRevenueTable.jsx';
import StateFilters from './StateFilters.jsx';
import { useStateData } from '../../../../../hooks/useStateData.jsx';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import '../../../../../style/RevenueTableContainer.css';
import { Loading } from "../../../../ui";

const StateRevenueTableContainer = () => {
  const theme = useTheme();
  const [selectedTable, setSelectedTable] = useState('tabela1');
  const [startYear, setStartYear] = useState(2007);
  const [endYear, setEndYear] = useState(2024);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Usar o hook personalizado para gerenciar os dados (sem autoLoad)
  const { csvData, loading, error, refetch } = useStateData(selectedTable, startYear, endYear, false);

  const handleTableChange = (tableValue) => {
    setSelectedTable(tableValue);
    // Resetar dados e estado quando mudar de tabela
    setHasInitialLoad(false);
  };

  const handleStartYearChange = (year) => {
    setStartYear(year);
    // Não resetar hasInitialLoad quando apenas o ano mudar
  };

  const handleEndYearChange = (year) => {
    setEndYear(year);
    // Não resetar hasInitialLoad quando apenas o ano mudar
  };

  const handleFilter = () => {
    setHasInitialLoad(true);
    refetch();
  };

  return (
    <div className='app-container'>
      <div className="filters-section">
        <StateFilters
          selectedTable={selectedTable}
          onTableChange={handleTableChange}
          startYear={startYear}
          endYear={endYear}
          onStartYearChange={handleStartYearChange}
          onEndYearChange={handleEndYearChange}
          onFilter={handleFilter}
          loading={loading}
        />
      </div>

      <hr className="divider" />

      {/* Área de dados - sempre visível */}
      <div className="data-section">
        {loading && <Loading />}

        {!loading && error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#d9534f',
            fontSize: '18px'
          }}>
            <p>Falha ao carregar os dados. Por favor, tente novamente mais tarde.</p>
          </div>
        )}

        {!loading && !error && !csvData && !hasInitialLoad && (
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '20px auto',
              maxWidth: '400px',
              color: theme.palette.primary.main
            }}
          >
            Selecione os filtros desejados e clique em "Filtrar" para montar uma consulta.
          </Typography>
        )}

        {!loading && !error && !csvData && hasInitialLoad && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#d9534f',
            fontSize: '18px'
          }}>
            <p>Nenhum dado encontrado com os filtros selecionados.</p>
          </div>
        )}

        {!loading && !error && csvData && (
          <div className='table-container'>
            <StateRevenueTable 
              csvData={csvData} 
              tableName={stateTableNames[selectedTable]}
              startYear={startYear}
              endYear={endYear}
              enableMonetaryCorrection={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StateRevenueTableContainer; 