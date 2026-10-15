import { useState, useEffect, useRef } from 'react';
import { loadCSVFile } from '../services/csvService.jsx';

export const useStateData = (selectedTable, startYear, endYear, autoLoad = false) => {
  const [csvData, setCsvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Tabela do pedido mais recente: respostas de pedidos anteriores são descartadas
  const ultimaTabelaPedida = useRef(null);

  useEffect(() => {
    // Limpar dados apenas quando a tabela mudar
    setCsvData(null);
    setError(null);
    
    if (autoLoad) {
      loadTableData();
    }
  }, [selectedTable, autoLoad]); // Removido startYear e endYear das dependências

  // `tabela` explícita: quem chama costuma fazer setSelectedTable(nova) e refetch()
  // no mesmo clique — sem o parâmetro, o refetch ainda via a tabela ANTERIOR
  // (estado do React só atualiza no próximo render) e carregava o CSV errado
  // com o título da tabela nova.
  const loadTableData = async (tabela = selectedTable) => {
    ultimaTabelaPedida.current = tabela;
    try {
      setLoading(true);
      setError(null);

      // Adicionar delay de 1 segundo para melhor UX
      const [data] = await Promise.all([
        loadCSVFile(tabela),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);

      if (ultimaTabelaPedida.current !== tabela) return; // chegou atrasado
      setCsvData(data);
    } catch (error) {
      console.error('Erro ao carregar dados da tabela:', error);
      setError(`Erro ao carregar dados da tabela: ${error.message}`);
    } finally {
      if (ultimaTabelaPedida.current === tabela) setLoading(false);
    }
  };

  const refetch = (tabela) => {
    loadTableData(tabela);
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
