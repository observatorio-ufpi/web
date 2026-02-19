import React, { useState, useEffect } from 'react';
import { stateTableNames } from '../../../../../services/csvService.jsx';
import StateRevenueTable from './StateRevenueTable.jsx';
import StateFilters from './StateFilters.jsx';
import { useStateData } from '../../../../../hooks/useStateData.jsx';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { Select } from '../../../../ui';
import '../../../../../style/RevenueTableContainer.css';
import { Loading } from "../../../../ui";

const StateRevenueTableContainer = () => {
  const theme = useTheme();
  const [selectedTable, setSelectedTable] = useState('tabela1');
  const [startYear, setStartYear] = useState(2007);
  const [endYear, setEndYear] = useState(2023);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [tableTitle, setTableTitle] = useState('');

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
    const yearDisplay = startYear === endYear ? startYear : `${startYear}-${endYear}`;
    const tableName = stateTableNames[selectedTable];
    setTableTitle(`${tableName} (${yearDisplay})`);
    refetch();
  };

  // Escutar eventos de filtro aplicados
  useEffect(() => {
    const handleApplyFilters = (event) => {
      setStartYear(event.detail.anoInicial);
      setEndYear(event.detail.anoFinal);
      
      // Atualizar o tipo de tabela se foi passado no evento
      if (event.detail.stateTableType) {
        setSelectedTable(event.detail.stateTableType);
      }
      
      setHasInitialLoad(true);
      const yearDisplay = event.detail.anoInicial === event.detail.anoFinal 
        ? event.detail.anoInicial 
        : `${event.detail.anoInicial}-${event.detail.anoFinal}`;
      
      // Incluir o nome da tabela no título
      const tableName = event.detail.stateTableType 
        ? stateTableNames[event.detail.stateTableType] 
        : stateTableNames[selectedTable];
      setTableTitle(`${tableName} (${yearDisplay})`);
      refetch();
    };

    window.addEventListener('applyFinancialFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFinancialFilters', handleApplyFilters);
  }, [refetch, selectedTable]);

  return (
    <div className='app-container'>
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
            Selecione os filtros desejados na lateral e clique em "Filtrar" para montar uma consulta.
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
          <>
            {tableTitle && (
              <Box sx={{ padding: 2 }}>
                <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
                  {tableTitle}
                </Typography>
              </Box>
            )}
            <div className='table-container'>
              <StateRevenueTable 
                csvData={csvData} 
                tableName={stateTableNames[selectedTable]}
                startYear={startYear}
                endYear={endYear}
                enableMonetaryCorrection={true}
              />
            </div>

            {/* Ficha Técnica */}
            <Box sx={{ marginTop: 6, padding: 3, backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#333' }}>
                Ficha Técnica
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                Informações sobre a metodologia, fonte de dados, periodicidade e outras informações técnicas estarão disponíveis aqui.
              </Typography>
            </Box>
          </>
        )}
      </div>
    </div>
  );
};

export default StateRevenueTableContainer; 