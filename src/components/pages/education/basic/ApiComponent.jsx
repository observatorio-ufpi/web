import { forwardRef, useImperativeHandle } from "react";
import { processResults as processApiResults } from "../../../../services/dataProcessors";

const ApiContainer = forwardRef(({
  type,
  basePath = 'basicEducation',
  onDataFetched,
  onError,
  onLoading,
  selectedFilters
}, ref) => {

  useImperativeHandle(ref, () => ({
    fetchData: async (filters) => {
      const { year, isHistorical, startYear, endYear, state = "22", city, territory, faixaPopulacional, aglomerado, gerencia, citiesList } = filters;

      const isEtapaSelected = selectedFilters.some((filter) => filter.value === "etapa");
      const isLocalidadeSelected = selectedFilters.some((filter) => filter.value === "localidade");
      const isDependenciaSelected = selectedFilters.some((filter) => filter.value === "dependencia");
      const isVinculoSelected = selectedFilters.some((filter) => filter.value === "vinculo");
      const isFormacaoDocenteSelected = selectedFilters.some((filter) => filter.value === "formacaoDocente");
      const isFaixaEtariaSelected = selectedFilters.some((filter) => filter.value === "faixaEtaria");
      const isMunicipioSelected = selectedFilters.some((filter) => filter.value === "municipio");

      const buildFilter = (cityId = null) => {
        const yearFilter = isHistorical
          ? `min_year:"${startYear}",max_year:"${endYear}"`
          : `min_year:"${year}",max_year:"${year}"`;

        return `${yearFilter},state:"${state}"${cityId ? `,city:"${cityId}"` : ""}`;
      };

      const buildUrl = (filter, forceEndpoint = null) => {
        let selectedDims = [];

        if (basePath === 'basicEducation') {
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
          if (isMunicipioSelected) {
            selectedDims.push("municipality");
          }
        } else if (basePath === 'censo-escolar') {
          selectedDims = selectedFilters.map(filter => filter.value);
        }

        const dims = selectedDims.length > 0 ? `dims=${selectedDims.join(",")}` : "";

        // Determinar o endpoint correto
        let endpoint = forceEndpoint || type;

        if (basePath === 'basicEducation' && isHistorical) {
          if (endpoint === 'school/count') {
            endpoint = 'school/count/timeseries';
          } else {
            endpoint = `${endpoint}/timeseries`;
          }
        }

        const baseUrl = `${import.meta.env.VITE_API_PUBLIC_URL}/${basePath}/${endpoint}`;

        const params = [];
        if (dims) params.push(dims);
        params.push(`filter=${encodeURIComponent(filter)}`);

        const yearMatch = filter.match(/min_year:"?(\d{4})"?,?max_year:"?(\d{4})"?/);
        if (yearMatch) {
          params.push(`min_year=${encodeURIComponent(yearMatch[1])}`);
          params.push(`max_year=${encodeURIComponent(yearMatch[2])}`);
        }

        if (territory) params.push(`territory=${encodeURIComponent(territory)}`);
        if (faixaPopulacional) params.push(`faixa_populacional=${encodeURIComponent(faixaPopulacional)}`);
        if (aglomerado) params.push(`aglomerado=${encodeURIComponent(aglomerado)}`);
        if (gerencia && basePath !== 'censo-escolar') {
          params.push(`gerencia=${encodeURIComponent(gerencia)}`);
        }

        return `${baseUrl}?${params.join('&')}`;
      };

      const fetchCityData = async (cityId, cityName) => {
        const filter = buildFilter(cityId);
        const url = buildUrl(filter);
        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro na resposta da API:', errorText);
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const result = await response.json();
        result.cityName = cityName;
        return result;
      };

      const handleResults = (allResults) => {
        if (basePath === 'censo-escolar') {
          const combinedResult = { result: [] };
          allResults.forEach(res => {
            if (res && res.result) {
              combinedResult.result.push(...res.result);
            }
          });
          return combinedResult;
        }
        return processApiResults(allResults, selectedFilters);
      };

      try {
        onError(null);
        onLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (isHistorical) {
          if (citiesList.length > 0 && !city) {
            const allResults = await Promise.all(
              citiesList.map(async ([cityId, cityInfo]) => {
                return fetchCityData(cityId, cityInfo.nomeMunicipio);
              })
            );

            const allUniqueData = [];
            allResults.forEach(cityResult => {
              cityResult.result.forEach(item => {
                const existingItem = allUniqueData.find(existing => {
                  if (existing.year !== item.year) return false;
                  if (isEtapaSelected && existing.education_level_mod_id !== item.education_level_mod_id) return false;
                  if (isLocalidadeSelected && existing.location_id !== item.location_id) return false;
                  if (isDependenciaSelected && existing.adm_dependency_detailed_id !== item.adm_dependency_detailed_id) return false;
                  if (isVinculoSelected && existing.contract_type_id !== item.contract_type_id) return false;
                  if (isFormacaoDocenteSelected && existing.initial_training_id !== item.initial_training_id) return false;
                  if (isFaixaEtariaSelected && existing.age_range_id !== item.age_range_id) return false;
                  if (isMunicipioSelected && existing.municipality_id !== item.municipality_id) return false;
                  return true;
                });

                if (!existingItem) {
                  allUniqueData.push({...item, total: 0});
                }
              });
            });

            allUniqueData.forEach(uniqueItem => {
              allResults.forEach(cityResult => {
                const matchingItem = cityResult.result.find(item => {
                  if (item.year !== uniqueItem.year) return false;
                  if (isEtapaSelected && item.education_level_mod_id !== uniqueItem.education_level_mod_id) return false;
                  if (isLocalidadeSelected && item.location_id !== uniqueItem.location_id) return false;
                  if (isDependenciaSelected && item.adm_dependency_detailed_id !== uniqueItem.adm_dependency_detailed_id) return false;
                  if (isVinculoSelected && item.contract_type_id !== uniqueItem.contract_type_id) return false;
                  if (isFormacaoDocenteSelected && item.initial_training_id !== uniqueItem.initial_training_id) return false;
                  if (isFaixaEtariaSelected && item.age_range_id !== uniqueItem.age_range_id) return false;
                  if (isMunicipioSelected && item.municipality_id !== uniqueItem.municipality_id) return false;
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

            onDataFetched({ finalResult: summedResults, allResults });
          } else if (citiesList.length === 0 && (territory || faixaPopulacional || aglomerado || gerencia)) {
            onDataFetched({ finalResult: [], allResults: [] });
          } else {
            const filter = buildFilter(city);
            const url = buildUrl(filter);
            console.log('URL histórica:', url);
            const response = await fetch(url);

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Erro na resposta da API:', errorText);
              throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

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

          // CORREÇÃO: Para censo-escolar, retornar o finalResult diretamente
          // Para outros casos, manter a estrutura { finalResult, allResults }
          if (basePath === 'censo-escolar') {
            onDataFetched(finalResult);
          } else {
            onDataFetched({ finalResult, allResults });
          }
        } else if (citiesList.length === 0 && (territory || faixaPopulacional || aglomerado || gerencia)) {
          onDataFetched({ finalResult: [], allResults: [] });
        } else {
          const filter = buildFilter(city);
          const url = buildUrl(filter);
          console.log('URL:', url);
          const response = await fetch(url);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta da API:', errorText);
            throw new Error(`Erro HTTP! Status: ${response.status}`);
          }

          const result = await response.json();
          const allResults = [result];
          console.log("All Results:", allResults);
          const finalResult = handleResults(allResults);
          console.log("API Result:", finalResult);
          onDataFetched(finalResult);
        }

        onError(null);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        onError("Falha ao carregar os dados. Por favor, tente novamente mais tarde.");
      } finally {
        onLoading(false);
      }
    }
  }));

  return null;
});

export default ApiContainer;