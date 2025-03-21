import { useEffect } from "react";
import { processResults as processApiResults } from "../../../services/dataProcessors";

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
        if (type === 'school/count') {
          selectedDims.push("arrangement");
        } else if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
          selectedDims.push("education_level_short");
        } else if (forceEndpoint === "enrollmentAggregate") {
          selectedDims.push("education_level_mod_agg");
        } else if (forceEndpoint === null && type === 'enrollment' && year >= 2021) {
          selectedDims.push("education_level_mod_agg");
        } else {
          selectedDims.push("education_level_mod");
        }
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
      if (!forceEndpoint && type === 'enrollment' && year >= 2021) {
        endpoint = 'enrollmentAggregate';
      }

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
                if (type === 'enrollment') {
                  // Buscar dados antigos (até 2020)
                  const oldFilter = buildFilter(cityId);
                  const oldUrl = buildUrl(oldFilter, 'enrollment');
                  const oldResponse = await fetch(oldUrl);
                  const oldData = await oldResponse.json();

                  // Buscar dados novos (2021 em diante)
                  const newFilter = buildFilter(cityId);
                  const newUrl = buildUrl(newFilter, 'enrollmentAggregate');
                  const newResponse = await fetch(newUrl);
                  const newData = await newResponse.json();

                  // Normalizar os campos dos dados novos e filtrar agg_id 11
                  const normalizedNewData = newData.result
                    .filter(item => !isEtapaSelected || item.education_level_mod_agg_id !== 11)
                    .map(item => {
                      // Converter total para número
                      const numericTotal = Number(item.total);

                      // Só adiciona os campos normalizados se etapa estiver selecionada
                      if (isEtapaSelected) {
                        return {
                          ...item,
                          education_level_mod_id: item.education_level_mod_agg_id,
                          education_level_mod_name: item.education_level_mod_agg_name,
                          total: numericTotal
                        };
                      }
                      return {
                        ...item,
                        total: numericTotal
                      };
                    });

                  return {
                    cityName: cityInfo.nomeMunicipio,
                    result: [
                      ...oldData.result.filter(item => item.year < 2021),
                      ...normalizedNewData.filter(item => item.year >= 2021)
                    ].sort((a, b) => a.year - b.year)
                  };
                } else {
                  return fetchCityData(cityId, cityInfo.nomeMunicipio);
                }
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
                  if (isEtapaSelected) {
                    if (type === 'school/count' && existing.arrangement_id !== item.arrangement_id) return false;
                    else if ((type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') &&
                             existing.education_level_short_id !== item.education_level_short_id) return false;
                    else if (existing.education_level_mod_id !== item.education_level_mod_id) return false;
                  }

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
                  if (isEtapaSelected) {
                    if (type === 'school/count' && item.arrangement_id !== uniqueItem.arrangement_id) return false;
                    else if ((type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') &&
                             item.education_level_short_id !== uniqueItem.education_level_short_id) return false;
                    else if (item.education_level_mod_id !== uniqueItem.education_level_mod_id) return false;
                  }

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
          } else {
            if(type === 'enrollment') {
              // Buscar dados antigos (até 2020)
              const oldFilter = buildFilter(city);
              const oldUrl = buildUrl(oldFilter, 'enrollment');
              const oldResponse = await fetch(oldUrl);
              const oldData = await oldResponse.json();

              // Buscar dados novos (2021 em diante)
              const newFilter = buildFilter(city);
              const newUrl = buildUrl(newFilter, 'enrollmentAggregate');
              const newResponse = await fetch(newUrl);
              const newData = await newResponse.json();

              // Normalizar os campos dos dados novos e filtrar agg_id 11
              const normalizedNewData = newData.result
                .filter(item => !isEtapaSelected || item.education_level_mod_agg_id !== 11)
                .map(item => {
                  // Converter total para número
                  const numericTotal = Number(item.total);

                  // Só adiciona os campos normalizados se etapa estiver selecionada
                  if (isEtapaSelected) {
                    return {
                      ...item,
                      education_level_mod_id: item.education_level_mod_agg_id,
                      education_level_mod_name: item.education_level_mod_agg_name,
                      total: numericTotal
                    };
                  }
                  return {
                    ...item,
                    total: numericTotal
                  };
                });

              // Combinar os resultados
              const combinedResults = {
                result: [
                  ...oldData.result.filter(item => item.year < 2021),
                  ...normalizedNewData.filter(item => item.year >= 2021)
                ].sort((a, b) => a.year - b.year)
              };

              onDataFetched(combinedResults);
            } else {
              // Busca histórica original para cidade/estado único
              const filter = buildFilter(city);
              const url = buildUrl(filter);
              const response = await fetch(url);

              if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

              const result = await response.json();
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

export default ApiContainer;
