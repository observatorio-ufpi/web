import { useState, useEffect } from 'react';
import { loadCSVFile } from '../services/csvService.jsx';

export const useStateData = (selectedTable, startYear, endYear, autoLoad = false) => {
  const [csvData, setCsvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Limpar dados apenas quando a tabela mudar
    setCsvData(null);
    setError(null);
    
    if (autoLoad) {
      loadTableData();
    }
  }, [selectedTable, autoLoad]); // Removido startYear e endYear das dependências

  const loadTableData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Carregando dados para a tabela: ${selectedTable}, anos: ${startYear}-${endYear}`);
      
      // Adicionar delay de 1 segundo para melhor UX
      const [data] = await Promise.all([
        loadCSVFile(selectedTable),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      console.log(`Dados carregados com sucesso: ${data ? 'sim' : 'não'}`);
      setCsvData(data);
    } catch (error) {
      console.error('Erro ao carregar dados da tabela:', error);
      setError(`Erro ao carregar dados da tabela: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadTableData();
  };

  return {
    csvData,
    loading,
    error,
    refetch
  };
};

// Função para usar com backend (exemplo futuro)
export const fetchStateData = async (tableType, startYear, endYear) => {
  // Exemplo de como seria com backend:
  // const response = await fetch(`/api/state-data/${tableType}?startYear=${startYear}&endYear=${endYear}`);
  // if (!response.ok) throw new Error('Erro ao carregar dados');
  // return response.json();
  
  // Por enquanto, retorna null para usar o CSV
  return null;
};
