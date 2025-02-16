import { useEffect } from 'react';

function ApiContainer({ type, year, state = '22', city, territory, faixaPopulacional, citiesList, onDataFetched, onError, onLoading, triggerFetch }) {

  useEffect(() => {
    if (!triggerFetch) return; // Só faz a requisição se triggerFetch for true

    const fetchData = async () => {
      try {
        onError(null);
        onLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (citiesList.length > 0 && !city) {
          let totalSum = 0; // Variável para armazenar a soma total
          const allResults = []; // Array para armazenar todos os resultados
          for (const cityData of citiesList) {
            const [cityId, cityInfo] = cityData;
            const cityFilter = `,city:"${cityId}"`;
            const filter = `min_year:"${year}",max_year:"${year}",state:"${state}"${cityFilter}`;
            const url = `https://simcaq.c3sl.ufpr.br/api/v1/${type}?filter=${encodeURIComponent(filter)}`;

            const response = await fetch(url);

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            result.cityName = cityInfo.nomeMunicipio;
            allResults.push(result);

            if (Array.isArray(result.result) && result.result.length > 0) {
              totalSum += result.result[0].total;
            }
          }
          const finalResult = {
            result: [
              {
                total: totalSum,
              }
            ]
          };
          onDataFetched({finalResult, allResults});
          onError(null);
        } else if(citiesList.length === 0 && (territory || faixaPopulacional)) {
          onDataFetched({finalResult: [], allResults: []});
          onError(null);
        } else {
          const cityFilter = city ? `,city:"${city}"` : '';
          const filter = `min_year:"${year}",max_year:"${year}",state:"${state}"${cityFilter}`;
          const url = `https://simcaq.c3sl.ufpr.br/api/v1/${type}?filter=${encodeURIComponent(filter)}`;

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          onDataFetched(result);
          onError(null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        onError('Falha ao carregar os dados. Por favor, tente novamente mais tarde.');
      } finally {
        onLoading(false);
      }
    };

    fetchData();
  }, [triggerFetch, type, year, state, city, territory, faixaPopulacional, citiesList, onDataFetched, onError, onLoading]);

  return null;
}

export default ApiContainer;