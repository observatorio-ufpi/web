import React, { useState, useEffect } from 'react';
import { loadCSVFile, stateTableNames } from '../../../../../services/csvService.jsx';
import StateRevenueTable from './StateRevenueTable.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '../../../../../style/RevenueTableContainer.css';
import { Loading, Select } from "../../../../ui";

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
    return <Loading />;
  }

  if (error) {
    return (
      <div className="app-container">
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#d9534f',
          fontSize: '18px'
        }}>
          <p>Falha ao carregar os dados. Por favor, tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className='app-container'>
        <div className="filters-section">
          <div className="selects-wrapper">
            <div className="select-container">
              <label htmlFor="tableSelect" className="select-label">Tipo de Tabela do Estado:</label>
              <Select
                value={{ value: selectedTable, label: stateTableNames[selectedTable] }}
                onChange={(selectedOption) => setSelectedTable(selectedOption.value)}
                options={[
                  { value: 'tabela1', label: "Receita bruta de impostos próprios do Piauí" },
                  { value: 'tabela2', label: "Receita líquida de impostos próprios do Piauí" },
                  { value: 'tabela3', label: "Receita bruta de transferências constitucionais recebidas pelo Piauí" },
                  { value: 'tabela4', label: "Receita líquida de transferências constitucionais recebidas pelo Piauí" },
                  { value: 'tabela5', label: "Receita líquida resultante de impostos e transferências constitucionais no Piauí" },
                  { value: 'tabela6', label: "Receitas adicionais para o financiamento do ensino no Piauí" },
                  { value: 'tabela7', label: "Composição do Fundeb no Piauí" },
                  { value: 'tabela8', label: "Composição da complementação do Fundeb no Piauí" },
                  { value: 'tabela9', label: "Limite constitucional em MDE no Piauí " },
                  { value: 'tabela10', label: "Despesas com profissionais da educação básica com o Fundeb no Piauí" },
                  { value: 'tabela11', label: "Despesas em MDE por área de atuação no Piauí" },
                  { value: 'tabela12', label: "Receita Potencial Mínima vinculada à Educação Básica (RPEB)" },
                  { value: 'tabela13', label: "Protocolo Complementar" },
                ]}
                placeholder="Selecione o tipo de tabela"
                size="small"
              />
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