import { useEffect } from "react";
import { processResults as processApiResults } from "../../../../services/dataProcessors";

function ApiHigherContainer({
  type,
  year,
  isHistorical,
  state = "22",
  startYear,
  endYear,
  city,
  territory,
  faixaPopulacional,
  aglomerado,
  gerencia,
  citiesList,
  onDataFetched,
  onError,
  onLoading,
  triggerFetch,
  selectedFilters
}) {
  useEffect(() => {
    if (!triggerFetch) return;

    const buildFilter = (cityId = null) => {
        const yearFilter = isHistorical
          ? `min_year:"${startYear}",max_year:"${endYear}"`
          : `min_year:"${year}",max_year:"${year}"`;
  
        return `${yearFilter},state:"${state}"${cityId ? `,city:"${cityId}"` : ""}`;
    };

    const buildUrl = (filter) => {
      return `https://simcaq.c3sl.ufpr.br/api/v1/${type}?filter=${encodeURIComponent(filter)}`;
    };

    const fetchCityData = async (cityId, cityName) => {
      const filter = buildFilter(cityId);
      const url = buildUrl(filter);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
      const result = await response.json();
      result.cityName = cityName;
      return result;
    };

    const handleResults = (allResults) => {
        return processApiResults(allResults, selectedFilters, type, year);
      };

    const fetchData = async () => {
      try {
        onError(null);
        onLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (isHistorical) {
            if (citiesList.length > 0 && !city) {
              // Busca dados históricos para múltiplas cidades
              const allResults = await Promise.all(
                citiesList.map(async ([cityId, cityInfo]) => {
                    return fetchCityData(cityId, cityInfo.nomeMunicipio);
                })
              );
  
              // Soma os resultados por ano e filtros selecionados
              // Primeiro, vamos coletar todos os dados únicos de todas as cidades
              const allUniqueData = [];
              allResults.forEach(cityResult => {
                  cityResult.result.forEach(item => {
                      // Verificar se já existe um item com o mesmo ano
                      const existingItem = allUniqueData.find(existing => existing.year === item.year);
              
                      if (!existingItem) {
                          // Se não existe, adiciona à lista
                          allUniqueData.push({ ...item, total: 0 });
                      }
                  });
              });
              
              allUniqueData.forEach(uniqueItem => {
                  allResults.forEach(cityResult => {
                      const matchingItem = cityResult.result.find(item => item.year === uniqueItem.year);
              
                      if (matchingItem) {
                          uniqueItem.total += Number(matchingItem.total);
                      }
                  });
              });
  
              const summedResults = {
                result: allUniqueData
              };
              console.log("Summed Results:", summedResults);
  
              onDataFetched(summedResults);
            } else if (citiesList.length === 0 && (territory || faixaPopulacional || aglomerado || gerencia)){
                onDataFetched({ finalResult: [], allResults: [] });
            } else {
                // Busca histórica original para cidade/estado único
                const filter = buildFilter(city);
                const url = buildUrl(filter);
                const response = await fetch(url);
  
                if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
  
                const result = await response.json();
                console.log("Result:", result);
                onDataFetched(result);
            }
            return;
          }

        if (citiesList.length > 0 && !city) {
            console.log("Cities List:", citiesList);
            const allResults = await Promise.all(
              citiesList.map(([cityId, cityInfo]) => fetchCityData(cityId, cityInfo.nomeMunicipio))
            );
  
            const finalResult = handleResults(allResults);
            console.log("Final Result:", finalResult);
            onDataFetched({ finalResult, allResults });
        } else if (citiesList.length === 0 && (territory || faixaPopulacional || aglomerado || gerencia)) {
            onDataFetched({ finalResult: [], allResults: [] });
        } else {
            const filter = buildFilter(city);
            const url = buildUrl(filter);
            const response = await fetch(url);
  
            if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
  
            const result = await response.json();
            const allResults = [result];
            console.log("All Results:", allResults);
            const finalResult = handleResults(allResults);
            console.log("AQui API Result:", finalResult);
            onDataFetched(finalResult);
          }
  
          onError(null);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        onError("Falha ao carregar os dados. Por favor, tente novamente mais tarde.");
      } finally {
        onLoading(false);
      }
    };

    fetchData();
  }, [triggerFetch, type, year, isHistorical, startYear, endYear, state, city, territory, faixaPopulacional, aglomerado, gerencia, citiesList, onDataFetched, onError, onLoading, selectedFilters]);

  return null;
}

export default ApiHigherContainer;