import React, { useEffect, useState } from 'react';

function ApiContainer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Substitua a URL pelo endpoint correto da API
    const fetchData = async () => {
      try {
        const response = await fetch('https://simcaq.c3sl.ufpr.br/api/v1//region?dims=&filter=');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data ? (
        // Renderize o gráfico aqui usando os dados recebidos da API
        <div>Dados recebidos: {JSON.stringify(data)}</div>
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
}

export default ApiContainer;
