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