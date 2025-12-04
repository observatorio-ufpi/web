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
      const { type: filterType, year, isHistorical, startYear, endYear, state = "22", city, territory, faixaPopulacional, aglomerado, gerencia, citiesList, page, limit, selectedFilters: filtersSelectedFilters } = filters;

      // Usar type passado diretamente ou o prop do componente
      const activeType = filterType || type;

      // Usar selectedFilters passados diretamente ou os do componente
      const activeSelectedFilters = filtersSelectedFilters || selectedFilters;

      console.log('ApiComponent.fetchData - Filters received:', {
        type: activeType,
        typeFromProps: type,
        typeFromFilters: filterType,
        year,
        isHistorical,
        startYear,
        endYear,
        citiesList: citiesList?.length,
        selectedFilters: activeSelectedFilters,
        selectedFiltersFromProps: selectedFilters,
        filtersSelectedFilters: filtersSelectedFilters,
        page,
        limit,
        city,
        territory,
        faixaPopulacional,
        aglomerado,
        gerencia
      });

      const isEtapaSelected = activeSelectedFilters.some((filter) => filter.value === "etapa");
      const isLocalidadeSelected = activeSelectedFilters.some((filter) => filter.value === "localidade");
      const isDependenciaSelected = activeSelectedFilters.some((filter) => filter.value === "dependencia");
      const isVinculoSelected = activeSelectedFilters.some((filter) => filter.value === "vinculo");
      const isFormacaoDocenteSelected = activeSelectedFilters.some((filter) => filter.value === "formacaoDocente");
      const isFaixaEtariaSelected = activeSelectedFilters.some((filter) => filter.value === "faixaEtaria");
      const isMunicipioSelected = activeSelectedFilters.some((filter) => filter.value === "municipio");

      const buildFilter = (cityId = null) => {
        // IMPORTANTE: Respeitar startYear e endYear do range slider
        // Se isHistorical, usar o range completo
        // Se não é histórico, ainda assim respeitar o range selecionado
        const yearFilter = `min_year:"${startYear}",max_year:"${endYear}"`;
        const filterString = `${yearFilter},state:"${state}"${cityId ? `,city:"${cityId}"` : ""}`;

        console.log('buildFilter chamado:', { cityId, startYear, endYear, state, filterString });

        return filterString;
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
          selectedDims = activeSelectedFilters.map(filter => filter.value);
        }

        const dims = selectedDims.length > 0 ? `dims=${selectedDims.join(",")}` : "";

        // Determinar o endpoint correto - usar activeType em vez de type
        let endpoint = forceEndpoint || activeType;

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

        // Adicionar paginação quando municipality está selecionado e não há cidade específica
        // Só adicionar se page e limit foram explicitamente fornecidos (não usar valores padrão)
        const shouldPaginate = isMunicipioSelected && !city && page !== undefined && limit !== undefined;
        if (shouldPaginate) {
          params.push(`page=${page}`);
          params.push(`limit=${limit}`);
          console.log('Adicionando paginação à URL:', { page, limit, isMunicipioSelected, city });
        }

        // Adicionar timestamp para evitar cache
        params.push(`_t=${Date.now()}`);
        return `${baseUrl}?${params.join('&')}`;
      };

      const fetchCityData = async (cityId, cityName) => {
        const filter = buildFilter(cityId);
        const url = buildUrl(filter);
        console.log('fetchCityData URL:', url, 'filter:', filter);
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

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
          // Para censo-escolar, combinar todos os resultados em um único array
          const combinedResult = [];
          allResults.forEach(res => {
            if (res && res.result && Array.isArray(res.result)) {
              combinedResult.push(...res.result);
            }
          });
          return { result: combinedResult };
        }
        return processApiResults(allResults, activeSelectedFilters);
      };

      try {
        onError(null);
        onLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (isHistorical) {
          if (citiesList.length > 0 && !city) {
            // Múltiplas cidades em série histórica
            console.log("Fetching historical data for multiple cities:", citiesList.length);
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
            if (basePath === 'censo-escolar') {
              const finalResult = handleResults(allResults);
              console.log("Final Result (historical, multiple cities):", finalResult);
              console.log("Total items:", finalResult.result.length);

              onDataFetched({ finalResult, allResults });
            }
          } else if (citiesList.length === 0 && (territory || faixaPopulacional || aglomerado || gerencia)) {
            // Filtros que não retornam cidades
            console.log("No cities match the filters");
            onDataFetched({ finalResult: { result: [] }, allResults: [] });
          } else if (isMunicipioSelected && !city) {
            // Consulta por municipality sem cidade específica em série histórica - usar paginação do backend
            const filter = buildFilter();
            const url = buildUrl(filter);
            console.log('URL histórica (municipality with pagination):', url);
            const response = await fetch(url, {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Erro na resposta da API:', errorText);
              throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Historical municipality result with pagination:", result);

            // Passar resultado com paginação
            if (result.pagination) {
              onDataFetched({ ...result, pagination: result.pagination });
            } else {
              onDataFetched(result);
            }
          } else {
            // Uma cidade específica em série histórica
            const filter = buildFilter(city);
            const url = buildUrl(filter);
            console.log('URL histórica (single city):', url);
            const response = await fetch(url, {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Erro na resposta da API:', errorText);
              throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Historical result:", result);
            onDataFetched(result);
          }
          return;
        }

        // NÃO é série histórica
        if (citiesList.length > 0 && !city) {
          console.log("Fetching data for multiple cities (not historical):", citiesList.length);
          const allResults = await Promise.all(
            citiesList.map(([cityId, cityInfo]) => fetchCityData(cityId, cityInfo.nomeMunicipio))
          );

          const finalResult = handleResults(allResults);
          console.log("Final Result (multiple cities):", finalResult);
          console.log("Total items:", finalResult.result.length);

          onDataFetched({ finalResult, allResults });
        } else if (citiesList.length === 0 && (territory || faixaPopulacional || aglomerado || gerencia)) {
          console.log("No cities match the filters");
          onDataFetched({ finalResult: { result: [] }, allResults: [] });
        } else if (isMunicipioSelected && !city) {
          // Consulta por municipality sem cidade específica - usar paginação do backend
          const filter = buildFilter();
          const url = buildUrl(filter);
          console.log('URL (municipality with pagination):', url);
          const response = await fetch(url, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta da API:', errorText);
            throw new Error(`Erro HTTP! Status: ${response.status}`);
          }

          const result = await response.json();
          console.log("Municipality result with pagination:", result);

          // Passar resultado com paginação
          if (result.pagination) {
            onDataFetched({ ...result, pagination: result.pagination });
          } else {
            onDataFetched(result);
          }
        } else {
          // Uma cidade específica
          const filter = buildFilter(city);
          const url = buildUrl(filter);
          console.log('URL (single city):', url);
          const response = await fetch(url, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta da API:', errorText);
            throw new Error(`Erro HTTP! Status: ${response.status}`);
          }

          const result = await response.json();
          console.log("Single city result:", result);
          const allResults = [result];
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