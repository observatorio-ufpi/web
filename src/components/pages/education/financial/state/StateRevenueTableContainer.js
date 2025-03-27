import React, { useState, useEffect } from 'react';
import { loadCSVFile, stateTableNames } from '../../../../../services/csvService';
import StateRevenueTable from './StateRevenueTable';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '../../../../../style/RevenueTableContainer.css';

const theme = createTheme({
  palette: {
    background: {
      default: '#f0f0f0',
    },
  },
});

const StateRevenueTableContainer = () => {
  const [selectedTable, setSelectedTable] = useState('tabela1');
  const [csvData, setCsvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTableData();
  }, [selectedTable]);

  const loadTableData = async () => {
    try {
      setLoading(true);
      console.log(`Carregando dados para a tabela: ${selectedTable}`);
      // Usar a função loadCSVFile para carregar os dados
      const data = await loadCSVFile(selectedTable);
      
      console.log(`Dados carregados com sucesso: ${data ? 'sim' : 'não'}`);
      setCsvData(data);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dados da tabela:', error);
      setError(`Erro ao carregar dados da tabela: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className='app-container'>
        <div className="filters-section">
          <div className="selects-wrapper">
            <div className="select-container">
              <label htmlFor="tableSelect" className="select-label">Tipo de Tabela do Estado:</label>
              <select id="tableSelect" value={selectedTable} onChange={handleTableChange} className="select-box">
                <option value="tabela1">Impostos Próprios</option>
                <option value="tabela2">Receita líquida de impostos próprios do Piauí</option>
                <option value="tabela3">Receita de transferências constitucionais e legais</option>
                <option value="tabela4">Receita Líquida de Impostos</option>
                <option value="tabela5">Receitas adicionais da educação</option>
                <option value="tabela6">Composição do Fundef/Fundeb</option>
                <option value="tabela7">Composição da complementação do Fundef/Fundeb</option>
                <option value="tabela8">Limite constitucional em MDE</option>
                <option value="tabela9">Despesas com profissionais da educação básica do Fundef/Fundeb</option>
                <option value="tabela10">Despesas em MDE por área de atuação</option>
                <option value="tabela11">Receita Potencial Mínima vinculada à Educação Básica</option>
                <option value="tabela12">Protocolo Complementar</option>
              </select>
            </div>
          </div>
        </div>

        {csvData && (
          <div className='table-container'>
            <StateRevenueTable 
              csvData={csvData} 
              tableName={stateTableNames[selectedTable]} 
            />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default StateRevenueTableContainer; 