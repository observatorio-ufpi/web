import React, { useImperativeHandle, forwardRef } from "react";
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
      
      console.log('ApiComponent.fetchData - Filters received:', { year, isHistorical, startYear, endYear, citiesList: citiesList?.length });

      const isEtapaSelected = selectedFilters.some((filter) => filter.value === "etapa");
      const isLocalidadeSelected = selectedFilters.some((filter) => filter.value === "localidade");
      const isDependenciaSelected = selectedFilters.some((filter) => filter.value === "dependencia");
      const isVinculoSelected = selectedFilters.some((filter) => filter.value === "vinculo");
      const isFormacaoDocenteSelected = selectedFilters.some((filter) => filter.value === "formacaoDocente");
      const isFaixaEtariaSelected = selectedFilters.some((filter) => filter.value === "faixaEtaria");

      const buildFilter = (cityId = null) => {
        let yearFilter;
        if (isHistorical) {
          yearFilter = `min_year:"${startYear}",max_year:"${endYear}"`;
        } else {
          yearFilter = `year:"${year}"`;
        }

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
        console.log('fetchCityData URL:', url, 'filter:', filter);
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
          // Para censo-escolar, combinar todos os resultados em um único array
          const combinedResult = [];
          allResults.forEach(res => {
            if (res && res.result && Array.isArray(res.result)) {
              combinedResult.push(...res.result);
            }
          });
          return { result: combinedResult };
        }
        return processApiResults(allResults, selectedFilters);
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

            const finalResult = handleResults(allResults);
            console.log("Final Result (historical, multiple cities):", finalResult);
            console.log("Total items:", finalResult.result.length);
            
            onDataFetched({ finalResult, allResults });
          } else if (citiesList.length === 0 && (territory || faixaPopulacional || aglomerado || gerencia)) {
            // Filtros que não retornam cidades
            console.log("No cities match the filters");
            onDataFetched({ finalResult: { result: [] }, allResults: [] });
          } else {
            // Uma cidade específica em série histórica
            const filter = buildFilter(city);
            const url = buildUrl(filter);
            console.log('URL histórica (single city):', url);
            const response = await fetch(url);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta da API:', errorText);
            throw new Error(`Erro HTTP! Status: ${response.status}`);
          }

            const result = await response.json();
            console.log("Single city result:", result);
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
        } else {
          // Uma cidade específica
          const filter = buildFilter(city);
          const url = buildUrl(filter);
          console.log('URL (single city):', url);
          const response = await fetch(url);

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