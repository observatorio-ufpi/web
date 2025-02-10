import React, { useEffect, useState } from 'react';

function ApiContainer({ type, year, state = '22', onDataFetched }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const filter = `min_year:"${year}",max_year:"${year}",state:"${state}"`;
        const url = `https://simcaq.c3sl.ufpr.br/api/v1/${type}?filter=${encodeURIComponent(filter)}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        onDataFetched(result); // Passa os dados para o ParentComponent
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Falha ao carregar os dados. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, year, state, onDataFetched]); // Inclui onDataFetched nas dependências

  if (isLoading) {
    return <div>Carregando dados...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return null; // Não renderiza nada, pois os dados são passados para o ParentComponent
}

export default ApiContainer;