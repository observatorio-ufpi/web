import { useEffect } from "react";
import { processResults as processApiResults } from "../../../../services/dataProcessors";

function ApiContainer({
  type,
  year,
  isHistorical,
  startYear,
  endYear,
  state = "22",
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

    const isEtapaSelected = selectedFilters.some((filter) => filter.value === "etapa");
    const isLocalidadeSelected = selectedFilters.some((filter) => filter.value === "localidade");
    const isDependenciaSelected = selectedFilters.some((filter) => filter.value === "dependencia");
    const isVinculoSelected = selectedFilters.some((filter) => filter.value === "vinculo");
    const isFormacaoDocenteSelected = selectedFilters.some((filter) => filter.value === "formacaoDocente");
    const isFaixaEtariaSelected = selectedFilters.some((filter) => filter.value === "faixaEtaria");

    const buildFilter = (cityId = null) => {
      const yearFilter = isHistorical
        ? `min_year:"${startYear}",max_year:"${endYear}"`
        : `min_year:"${year}",max_year:"${year}"`;

      return `${yearFilter},state:"${state}"${cityId ? `,city:"${cityId}"` : ""}`;
    };

    const buildUrl = (filter, forceEndpoint = null) => {
      const selectedDims = [];

      if (isEtapaSelected) {
        selectedDims.push("education_level_mod");
      }
      if (isLocalidadeSelected) {
        selectedDims.push("location");
      }
      if (isDependenciaSelected) {
        selectedDims.push("adm_dependency_detailed");
      }
      if (isVinculoSelected) {
        selectedDims.push("contract_type");
      }
      if (isFormacaoDocenteSelected) {
        selectedDims.push("initial_training");
      }
      if (isFaixaEtariaSelected) {
        selectedDims.push("age_range");
      }


      const dims = selectedDims.length > 0 ? `dims=${selectedDims.join(",")}` : "";

      // Determinar o endpoint correto
      let endpoint = forceEndpoint || type;

      // Se for histórico, usar os novos endpoints de série histórica
      if (isHistorical) {
        // Tratar endpoint school/count que já tem uma barra
        if (endpoint === 'school/count') {
          endpoint = 'school/count/timeseries';
        } else {
          endpoint = `${endpoint}/timeseries`;
        }
      }

      //return `https://simcaq.c3sl.ufpr.br/api/v1/${endpoint}?${dims}&filter=${encodeURIComponent(filter)}`;
      return `${import.meta.env.VITE_API_PUBLIC_URL}/basicEducation/${endpoint}?${dims}&filter=${encodeURIComponent(filter)}`;
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
      return processApiResults(allResults, selectedFilters);
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
                // Verificar se já existe um item com as mesmas características
                const existingItem = allUniqueData.find(existing => {
                  // Verificar ano
                  if (existing.year !== item.year) return false;

                  // Verificar filtros selecionados
                  if (isEtapaSelected && existing.education_level_mod_id !== item.education_level_mod_id) return false;
                  if (isLocalidadeSelected && existing.location_id !== item.location_id) return false;
                  if (isDependenciaSelected && existing.adm_dependency_detailed_id !== item.adm_dependency_detailed_id) return false;
                  if (isVinculoSelected && existing.contract_type_id !== item.contract_type_id) return false;
                  if (isFormacaoDocenteSelected && existing.initial_training_id !== item.initial_training_id) return false;
                  if (isFaixaEtariaSelected && existing.age_range_id !== item.age_range_id) return false;

                  return true;
                });

                if (!existingItem) {
                  // Se não existe, adiciona à lista
                  allUniqueData.push({...item, total: 0});
                }
              });
            });

            // Agora, para cada item único, somamos os totais de todas as cidades
            allUniqueData.forEach(uniqueItem => {
              allResults.forEach(cityResult => {
                const matchingItem = cityResult.result.find(item => {
                  // Verificar ano
                  if (item.year !== uniqueItem.year) return false;

                  // Verificar filtros selecionados
                  if (isEtapaSelected && item.education_level_mod_id !== uniqueItem.education_level_mod_id) return false;
                  if (isLocalidadeSelected && item.location_id !== uniqueItem.location_id) return false;
                  if (isDependenciaSelected && item.adm_dependency_detailed_id !== uniqueItem.adm_dependency_detailed_id) return false;
                  if (isVinculoSelected && item.contract_type_id !== uniqueItem.contract_type_id) return false;
                  if (isFormacaoDocenteSelected && item.initial_training_id !== uniqueItem.initial_training_id) return false;
                  if (isFaixaEtariaSelected && item.age_range_id !== uniqueItem.age_range_id) return false;

                  return true;
                });

                if (matchingItem) {
                  // Garantir que estamos somando números, não strings
                  uniqueItem.total += Number(matchingItem.total);
                }
              });
            });

            const summedResults = {
              result: allUniqueData
            };

            onDataFetched(summedResults);
          } else if (citiesList.length === 0 && (territory || faixaPopulacional || aglomerado || gerencia)) {
            onDataFetched({ finalResult: [], allResults: [] });
          } else {
            // Busca histórica original para cidade/estado único
            const filter = buildFilter(city);
            const url = buildUrl(filter);
            const response = await fetch(url);

            if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

            const result = await response.json();
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

export default ApiContainer;
