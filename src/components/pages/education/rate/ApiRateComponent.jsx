import { useEffect } from "react";
import { processResults as processApiResults } from "../../../../services/dataProcessors";

function ApiRateContainer({
  type,
  year,
  isHistorical,
  startYear,
  endYear,
  state = "22",
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
    const isFaixaEtariaSelected = selectedFilters.some((filter) => filter.value === "faixaEtaria");
    const isInstructionLevelSelected = selectedFilters.some((filter) => filter.value === "instruction_level");

    const buildFilter = () => {
      const yearFilter = isHistorical
        ? `min_year:"${startYear}",max_year:"${endYear}"`
        : `min_year:"${year}",max_year:"${year}"`;

      return `${yearFilter},state:"${state}"`;
    };

    const buildUrl = (filter, forceEndpoint = null) => {
      const selectedDims = [];

      if (isEtapaSelected) {
        selectedDims.push("education_level_mod");
      }
      if (isLocalidadeSelected) {
        selectedDims.push("location");
      }
      if (isFaixaEtariaSelected) {
        selectedDims.push("age_range");
      }
      if (isInstructionLevelSelected) {
        selectedDims.push("instruction_level");
      }

      const dims = selectedDims.length > 0 ? `dims=${selectedDims.join(",")}` : "";

      // Determinar o endpoint correto
      let endpoint = forceEndpoint || type;

      // Se for histórico, usar os novos endpoints de série histórica
      if (isHistorical) {
        // Tratar endpoint que já tem uma barra
        if (endpoint.includes('/')) {
          endpoint = `${endpoint}/timeseries`;
        } else {
          endpoint = `${endpoint}/timeseries`;
        }
      }

      //return `https://simcaq.c3sl.ufpr.br/api/v1/${endpoint}?${dims}&filter=${encodeURIComponent(filter)}`;
      return `${import.meta.env.VITE_API_PUBLIC_URL}/rate/${endpoint}?${dims}&filter=${encodeURIComponent(filter)}`;
    };

    const handleResults = (allResults) => {
      return processApiResults(allResults, selectedFilters);
    };

    const fetchData = async () => {
      try {
        onError(null);
        onLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Para taxas, sempre buscar dados do estado (Piauí)
        const filter = buildFilter();
        const url = buildUrl(filter);
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

        const result = await response.json();
        console.log('Dados da API:', result);

        if (isHistorical) {
          // Para dados históricos, retornar diretamente
          console.log('ApiRateComponent - Dados históricos, retornando diretamente:', result);
          onDataFetched(result);
        } else {
          // Para dados não históricos, verificar se precisa processar
          if (Array.isArray(result)) {
            // Se result é um array direto, criar o formato esperado
            console.log('ApiRateComponent - Result é array, criando formato esperado');
            onDataFetched({ result: result });
          } else {
            // Se result já tem o formato esperado, processar normalmente
            console.log('ApiRateComponent - Result já tem formato esperado, processando');
            const allResults = [result];
            const finalResult = handleResults(allResults);
            console.log('ApiRateComponent - Resultado final processado:', finalResult);
            onDataFetched(finalResult);
          }
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
  }, [triggerFetch, type, year, isHistorical, startYear, endYear, state, onDataFetched, onError, onLoading, selectedFilters]);

  return null;
}

export default ApiRateContainer;
