import { useEffect, useRef } from "react";
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
  selectedFilters,
  paginationPage = 1,
  paginationLimit = 20
}) {
  const prevPaginationRef = useRef({ page: paginationPage, limit: paginationLimit });
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Verificar se paginação mudou
    const paginationChanged =
      prevPaginationRef.current.page !== paginationPage ||
      prevPaginationRef.current.limit !== paginationLimit;

    // Atualizar referência
    prevPaginationRef.current = { page: paginationPage, limit: paginationLimit };

    // Se é o mount inicial e não há triggerFetch, não executar ainda
    if (isInitialMount.current && !triggerFetch) {
      isInitialMount.current = false;
      return;
    }

    // Executar se triggerFetch for true OU se paginação mudou
    if (!triggerFetch && !paginationChanged) {
      return;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    const isModalidadeSelected = Array.isArray(selectedFilters) && selectedFilters.some((filter) => filter.value === "modalidade");
    const isRegimeSelected = Array.isArray(selectedFilters) && selectedFilters.some((filter) => filter.value === "regimeDeTrabalho");
    const isFormacaoDocenteSelected = Array.isArray(selectedFilters) && selectedFilters.some((filter) => filter.value === "formacaoDocente");
    const isCategoriaAdministrativaSelected = Array.isArray(selectedFilters) && selectedFilters.some((filter) => filter.value === "categoriaAdministrativa");
    const isFaixaEtariaSuperiorSelected = Array.isArray(selectedFilters) && selectedFilters.some((filter) => filter.value === "faixaEtariaSuperior");
    const isOrganizacaoAcademicaSelected = Array.isArray(selectedFilters) && selectedFilters.some((filter) => filter.value === "organizacaoAcademica");
    const isInstituicaoEnsinoSelected = Array.isArray(selectedFilters) && selectedFilters.some((filter) => filter.value === "instituicaoEnsino");
    const isMunicipioSelected = Array.isArray(selectedFilters) && selectedFilters.some((filter) => filter.value === "municipio");

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

      if (isFormacaoDocenteSelected) {
        selectedDims.push("initial_training");
      }

      if (isCategoriaAdministrativaSelected) {
        selectedDims.push("upper_adm_dependency");
      }

      if (isFaixaEtariaSuperiorSelected) {
        selectedDims.push("age_student_code");
      }

      if (isOrganizacaoAcademicaSelected) {
        selectedDims.push("academic_level");
      }

      if (isInstituicaoEnsinoSelected) {
        selectedDims.push("institution");
      }

      if (isMunicipioSelected) {
        selectedDims.push("municipality");
      }

      const endpoint = forceEndpoint || type;
      const dims = selectedDims.length > 0 ? `dims=${selectedDims.join(",")}` : "";

      // Adicionar paginação quando municipality estiver selecionado e não houver city específica
      const paginationParams = isMunicipioSelected && !city
        ? `&page=${paginationPage}&limit=${paginationLimit}`
        : "";

      // Usar apenas backend local
      let finalEndpoint = endpoint;
      if (isHistorical) {
        finalEndpoint = `${endpoint}/timeseries`;
      }

      return `${import.meta.env.VITE_API_PUBLIC_URL}/higherEducation/${finalEndpoint}?${dims}&filter=${encodeURIComponent(filter)}${paginationParams}`;
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
                citiesList.map(([cityId, cityInfo]) => fetchCityData(cityId, cityInfo.nomeMunicipio))
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
                        if (isFormacaoDocenteSelected && item.initial_training_id !== existing.initial_training_id) return false;
                        if (isCategoriaAdministrativaSelected && item.upper_adm_dependency_id !== existing.upper_adm_dependency_id) return false;
                        if (isFaixaEtariaSuperiorSelected && item.age_student_code_id !== existing.age_student_code_id) return false;
                        if (isOrganizacaoAcademicaSelected && item.academic_level_id !== existing.academic_level_id) return false;
                        if (isInstituicaoEnsinoSelected && item.institution_id !== existing.institution_id) return false;
                        if (isMunicipioSelected && item.municipality_id !== existing.municipality_id) return false;
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
                        if (isFormacaoDocenteSelected && item.initial_training_id !== uniqueItem.initial_training_id) return false;
                        if (isCategoriaAdministrativaSelected && item.upper_adm_dependency_id !== uniqueItem.upper_adm_dependency_id) return false;
                        if (isFaixaEtariaSuperiorSelected && item.age_student_code_id !== uniqueItem.age_student_code_id) return false;
                        if (isOrganizacaoAcademicaSelected && item.academic_level_id !== uniqueItem.academic_level_id) return false;
                        if (isInstituicaoEnsinoSelected && item.institution_id !== uniqueItem.institution_id) return false;
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
              console.log("Summed Results:", summedResults);

              onDataFetched({ finalResult: summedResults, allResults });
            } else if (citiesList.length === 0 && (territory || faixaPopulacional || aglomerado || gerencia)){
                onDataFetched({ finalResult: [], allResults: [] });
            } else {
                // Busca histórica para cidade/estado único
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
            console.log("API Result:", result);

            // Se o backend já retornou dados cruzados (byMunicipioAnd..., byInstitutionAnd..., etc),
            // não precisamos processar novamente - os dados já vêm prontos
            const hasCrossData = result.byMunicipioAndModalidade ||
                                 result.byMunicipioAndCategoriaAdministrativa ||
                                 result.byMunicipioAndOrganizacaoAcademica ||
                                 result.byMunicipioAndFaixaEtariaSuperior ||
                                 result.byInstitutionAndModalidade ||
                                 result.byInstitutionAndCategoriaAdministrativa ||
                                 result.byInstitutionAndOrganizacaoAcademica ||
                                 result.byInstitutionAndFaixaEtariaSuperior ||
                                 // Outras combinações do backend
                                 result.byModalidadeAndFaixaEtariaSuperior ||
                                 result.byModalidadeAndOrganizacaoAcademica ||
                                 result.byModalidadeAndCategoriaAdministrativa ||
                                 result.byCategoriaAdministrativaAndFaixaEtariaSuperior ||
                                 result.byCategoriaAdministrativaAndOrganizacaoAcademica ||
                                 result.byOrganizacaoAcademicaAndFaixaEtariaSuperior ||
                                 result.byCategoriaAdministrativaAndRegime ||
                                 result.byCategoriaAdministrativaAndFormacaoDocente ||
                                 result.byOrganizacaoAcademicaAndRegime ||
                                 result.byOrganizacaoAcademicaAndFormacaoDocente;

            if (hasCrossData) {
              // Dados já vêm prontos do backend
              onDataFetched(result);
            } else {
              // Processar dados para agregação
              const allResults = [result];
              const finalResult = handleResults(allResults);
              console.log("Processed API Result:", finalResult);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerFetch, type, year, isHistorical, startYear, endYear, state, city, territory, faixaPopulacional, aglomerado, gerencia, citiesList, selectedFilters, paginationPage, paginationLimit]);

  return null;
}

export default ApiHigherContainer;