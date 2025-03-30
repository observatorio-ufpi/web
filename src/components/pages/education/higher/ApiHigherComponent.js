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

    const isModalidadeSelected = Array.isArray(selectedFilters) && selectedFilters.some((filter) => filter.value === "modalidade");
    const isRegimeSelected = Array.isArray(selectedFilters) && selectedFilters.some((filter) => filter.value === "regimeDeTrabalho");

    const buildFilter = (cityId = null) => {
        const yearFilter = isHistorical
          ? `min_year:"${startYear}",max_year:"${endYear}"`
          : `min_year:"${year}",max_year:"${year}"`;
  
        return `${yearFilter},state:"${state}"${cityId ? `,city:"${cityId}"` : ""}`;
    };

    const buildUrl = (filter, forceEndpoint = null) => {
      const selectedDims = [];

      if (isModalidadeSelected) {
        selectedDims.push("upper_education_mod");
      }

      if (isRegimeSelected) {
        selectedDims.push("work_regime");
      }

      let endpoint = forceEndpoint || type;
      if (!forceEndpoint && type === 'course_count' && year >= 2020) {
        endpoint = 'course_aggregate';
      }

      const dims = selectedDims.length > 0 ? `dims=${selectedDims.join(",")}` : "";

      return `https://simcaq.c3sl.ufpr.br/api/v1/${endpoint}?${dims}&filter=${encodeURIComponent(filter)}`;
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
                  if (type === 'course_count') {
                    // Buscar dados antigos (até 2019)
                    const oldFilter = buildFilter(cityId);
                    const oldUrl = buildUrl(oldFilter, 'course_count');
                    const oldResponse = await fetch(oldUrl);
                    const oldData = await oldResponse.json();
  
                    // Buscar dados novos (2020 em diante)
                    const newFilter = buildFilter(cityId);
                    const newUrl = buildUrl(newFilter, 'course_aggregate');
                    const newResponse = await fetch(newUrl);
                    const newData = await newResponse.json();

                    return {
                      cityName: cityInfo.nomeMunicipio,
                      result: [
                        ...oldData.result.filter(item => item.year <= 2019),
                        ...newData.result.filter(item => item.year >= 2020)
                      ].sort((a, b) => a.year - b.year)
                    };
                  }
                  else {
                    return fetchCityData(cityId, cityInfo.nomeMunicipio); 
                  }
                })
              );
  
              // Soma os resultados por ano e filtros selecionados
              // Primeiro, vamos coletar todos os dados únicos de todas as cidades
              const allUniqueData = [];
              allResults.forEach(cityResult => {
                  cityResult.result.forEach(item => {
                      // Verificar se já existe um item com o mesmo ano
                      const existingItem = allUniqueData.find(existing => {
                        if (existing.year !== item.year) return false;

                        if (isModalidadeSelected && item.upper_education_mod_id !== existing.upper_education_mod_id) return false;
                        if (isRegimeSelected && item.work_regime_id !== existing.work_regime_id) return false;
                        return true;
                      });
              
                      if (!existingItem) {
                          // Se não existe, adiciona à lista
                          allUniqueData.push({ ...item, total: 0 });
                      }
                  });
              });
              
              allUniqueData.forEach(uniqueItem => {
                  allResults.forEach(cityResult => {
                      const matchingItem = cityResult.result.find(item => {
                        if (item.year !== uniqueItem.year) return false;
                        if (isModalidadeSelected && item.upper_education_mod_id !== uniqueItem.upper_education_mod_id) return false;
                        if (isRegimeSelected && item.work_regime_id !== uniqueItem.work_regime_id) return false;
                        return true;
                      });
              
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
                if (type === 'course_count'){
                    // Buscar dados antigos (até 2019)
                    const oldFilter = buildFilter(city);
                    const oldUrl = buildUrl(oldFilter, 'course_count');
                    const oldResponse = await fetch(oldUrl);
                    const oldData = await oldResponse.json();
  
                    // Buscar dados novos (2020 em diante)
                    const newFilter = buildFilter(city);
                    const newUrl = buildUrl(newFilter, 'course_aggregate');
                    const newResponse = await fetch(newUrl);
                    const newData = await newResponse.json();

                    const combinedResults = {
                      result: [
                        ...oldData.result.filter(item => item.year <= 2019),
                        ...newData.result.filter(item => item.year >= 2020)
                      ].sort((a, b) => a.year - b.year)
                    };
                    console.log("Combined Results:", combinedResults);
                    onDataFetched(combinedResults);
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