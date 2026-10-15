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
import EmptyState from '../../../../common/EmptyState';
import { RESUMO_ESTADO } from './stateSummaryConfig';
import PageHeader, { periodoEtiqueta } from '../../../../common/PageHeader';
import ComoCitarButton from '../../../../common/ComoCitarButton';

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
    refetch(selectedTable);
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
      refetch(event.detail.stateTableType || selectedTable);
    };

    window.addEventListener('applyFinancialFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFinancialFilters', handleApplyFilters);
  }, [refetch, selectedTable]);

  return (
    <div className='app-container'>

      {/* Área de dados - sempre visível */}
      <div className="data-section">
        {loading && <Loading />}

        {!loading && error && (
          <EmptyState erro titulo="Não foi possível carregar os dados" texto="Tente novamente em alguns instantes." />
        )}

        {!loading && !error && !csvData && !hasInitialLoad && (
          <EmptyState titulo="Monte sua consulta" texto={'Escolha os filtros na lateral e clique em "Mostrar".'} />
        )}

        {!loading && !error && !csvData && hasInitialLoad && (
          <EmptyState titulo="Nenhum dado encontrado" texto="Tente outro período ou outro filtro." />
        )}

        {!loading && !error && csvData && (
          <>
            {tableTitle && (
              <PageHeader
                caminho="Dados financeiros  ›  Estado"
                titulo={stateTableNames[selectedTable]}
                etiquetas={['Piauí', periodoEtiqueta(startYear, endYear)]}
                acoes={<ComoCitarButton titulo={`${stateTableNames[selectedTable]}: ${periodoEtiqueta(startYear, endYear)}`} />}
              />
            )}
            <div className='table-container'>
              <StateRevenueTable 
                csvData={csvData} 
                tableName={stateTableNames[selectedTable]}
                startYear={startYear}
                endYear={endYear}
                enableMonetaryCorrection={true}
                resumo={RESUMO_ESTADO[selectedTable]}
              />
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default StateRevenueTableContainer; 
