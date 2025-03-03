import { useEffect } from "react";

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

    const buildFilter = (cityId = null) => {
      const yearFilter = isHistorical
        ? `min_year:"${startYear}",max_year:"${endYear}"`
        : `min_year:"${year}",max_year:"${year}"`;

      return `${yearFilter},state:"${state}"${cityId ? `,city:"${cityId}"` : ""}`;
    };

    const buildUrl = (filter) => {
      const selectedDims = [];

      if (isEtapaSelected) {
        if (type === 'school/count') {
          selectedDims.push("arrangement");
        } else if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
          selectedDims.push("education_level_short");
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


      const dims = selectedDims.length > 0 ? `dims=${selectedDims.join(",")}` : "";

      return `https://simcaq.c3sl.ufpr.br/api/v1/${type}?${dims}&filter=${encodeURIComponent(filter)}`;
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

    const processResults = (allResults) => {
      const totalByEtapa = {};
      const totalByLocalidade = {};
      const totalByDependencia = {};
      const totalByVinculo = {};
      const totalByFormacaoDocente = {};
      const crossedData = {};
      let totalSum = 0;

      allResults.forEach((result) => {
        if (Array.isArray(result.result) && result.result.length > 0) {
          result.result.forEach((item) => {
            // Cruzamento Localidade x Dependencia
            if (isLocalidadeSelected && isDependenciaSelected) {
              const crossKey = `${item.location_id}-${item.adm_dependency_detailed_id}`;
              if (!crossedData[crossKey]) {
                crossedData[crossKey] = {
                  location_id: item.location_id,
                  location_name: item.location_name,
                  adm_dependency_detailed_id: item.adm_dependency_detailed_id,
                  adm_dependency_detailed_name: item.adm_dependency_detailed_name,
                  total: 0
                };
              }
              crossedData[crossKey].total += item.total;
            }
            // Cruzamento Etapa x Dependencia
            else if (isEtapaSelected && isDependenciaSelected) {
              if (type === 'school/count') {
                const crossKey = `${item.arrangement_id}-${item.adm_dependency_detailed_id}`;
                if (!crossedData[crossKey]) {
                  crossedData[crossKey] = {
                    arrangement_id: item.arrangement_id,
                    arrangement_name: item.arrangement_name,
                    adm_dependency_detailed_id: item.adm_dependency_detailed_id,
                    adm_dependency_detailed_name: item.adm_dependency_detailed_name,
                    total: 0
                  };
                }
                crossedData[crossKey].total += item.total;
              } else {
                const crossKey = `${item.education_level_mod_id}-${item.adm_dependency_detailed_id}`;
                if (!crossedData[crossKey]) {
                  crossedData[crossKey] = {
                    education_level_mod_id: item.education_level_mod_id,
                    education_level_mod_name: item.education_level_mod_name,
                    adm_dependency_detailed_id: item.adm_dependency_detailed_id,
                    adm_dependency_detailed_name: item.adm_dependency_detailed_name,
                    total: 0
                  };
                }
                crossedData[crossKey].total += item.total;
              }
            }
            // Cruzamento Etapa x Localidade
            else if (isEtapaSelected && isLocalidadeSelected) {
              if (type === 'school/count') {
                const crossKey = `${item.arrangement_id}-${item.location_id}`;
                if (!crossedData[crossKey]) {
                  crossedData[crossKey] = {
                    arrangement_id: item.arrangement_id,
                    arrangement_name: item.arrangement_name,
                    location_id: item.location_id,
                    location_name: item.location_name,
                    total: 0
                  };
                }
                crossedData[crossKey].total += item.total;
              } else if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
                const crossKey = `${item.education_level_short_id}-${item.location_id}`;
                if (!crossedData[crossKey]) {
                  crossedData[crossKey] = {
                    education_level_short_id: item.education_level_short_id,
                    education_level_short_name: item.education_level_short_name,
                    location_id: item.location_id,
                    location_name: item.location_name,
                    total: 0
                  };
                }
                crossedData[crossKey].total += item.total;
              } else {
                const crossKey = `${item.education_level_mod_id}-${item.location_id}`;
                if (!crossedData[crossKey]) {
                  crossedData[crossKey] = {
                    education_level_mod_id: item.education_level_mod_id,
                    education_level_mod_name: item.education_level_mod_name,
                    location_id: item.location_id,
                    location_name: item.location_name,
                    total: 0
                  };
                }
                crossedData[crossKey].total += item.total;
              }
            }
            // Cruzamento Etapa x Vinculo
            else if (isEtapaSelected && isVinculoSelected) {
              if (type === 'school/count') {
                const crossKey = `${item.arrangement_id}-${item.contract_type_id}`;
                if (!crossedData[crossKey]) {
                  crossedData[crossKey] = {
                    arrangement_id: item.arrangement_id,
                    arrangement_name: item.arrangement_name,
                    contract_type_id: item.contract_type_id,
                    contract_type_name: item.contract_type_name,
                    total: 0
                  };
                }
                crossedData[crossKey].total += item.total;
              } else {
                const crossKey = `${item.education_level_mod_id}-${item.contract_type_id}`;
                if (!crossedData[crossKey]) {
                  crossedData[crossKey] = {
                    education_level_mod_id: item.education_level_mod_id,
                    education_level_mod_name: item.education_level_mod_name,
                    contract_type_id: item.contract_type_id,
                    contract_type_name: item.contract_type_name,
                    total: 0
                  };
                }
                crossedData[crossKey].total += item.total;
              }
            }
            // Cruzamento Localidade x Vinculo
            else if (isLocalidadeSelected && isVinculoSelected) {
              const crossKey = `${item.location_id}-${item.contract_type_id}`;
              if (!crossedData[crossKey]) {
                crossedData[crossKey] = {
                  location_id: item.location_id,
                  location_name: item.location_name,
                  contract_type_id: item.contract_type_id,
                  contract_type_name: item.contract_type_name,
                  total: 0
                };
              }
              crossedData[crossKey].total += item.total;
            }
            // Cruzamento Dependencia x Vinculo
            else if (isDependenciaSelected && isVinculoSelected) {
              const crossKey = `${item.adm_dependency_detailed_id}-${item.contract_type_id}`;
              if (!crossedData[crossKey]) {
                crossedData[crossKey] = {
                  adm_dependency_detailed_id: item.adm_dependency_detailed_id,
                  adm_dependency_detailed_name: item.adm_dependency_detailed_name,
                  contract_type_id: item.contract_type_id,
                  contract_type_name: item.contract_type_name,
                  total: 0
                };
              }
              crossedData[crossKey].total += item.total;
            }
            // Cruzamento Etapa x Formação Docente
            else if (isEtapaSelected && isFormacaoDocenteSelected) {
              if (type === 'school/count') {
                const crossKey = `${item.arrangement_id}-${item.initial_training_id}`;
                if (!crossedData[crossKey]) {
                  crossedData[crossKey] = {
                    arrangement_id: item.arrangement_id,
                    arrangement_name: item.arrangement_name,
                    initial_training_id: item.initial_training_id,
                    initial_training_name: item.initial_training_name,
                    total: 0
                  };
                }
                crossedData[crossKey].total += item.total;
              } else {
                const crossKey = `${item.education_level_mod_id}-${item.initial_training_id}`;
                if (!crossedData[crossKey]) {
                  crossedData[crossKey] = {
                    education_level_mod_id: item.education_level_mod_id,
                    education_level_mod_name: item.education_level_mod_name,
                    initial_training_id: item.initial_training_id,
                    initial_training_name: item.initial_training_name,
                    total: 0
                  };
                }
                crossedData[crossKey].total += item.total;
              }
            }
            // Cruzamento Localidade x Formação Docente
            else if (isLocalidadeSelected && isFormacaoDocenteSelected) {
              const crossKey = `${item.location_id}-${item.initial_training_id}`;
              if (!crossedData[crossKey]) {
                crossedData[crossKey] = {
                  location_id: item.location_id,
                  location_name: item.location_name,
                  initial_training_id: item.initial_training_id,
                  initial_training_name: item.initial_training_name,
                  total: 0
                };
              }
              crossedData[crossKey].total += item.total;
            }
            // Cruzamento Dependencia x Formação Docente
            else if (isDependenciaSelected && isFormacaoDocenteSelected) {
              const crossKey = `${item.adm_dependency_detailed_id}-${item.initial_training_id}`;
              if (!crossedData[crossKey]) {
                crossedData[crossKey] = {
                  adm_dependency_detailed_id: item.adm_dependency_detailed_id,
                  adm_dependency_detailed_name: item.adm_dependency_detailed_name,
                  initial_training_id: item.initial_training_id,
                  initial_training_name: item.initial_training_name,
                  total: 0
                };
              }
              crossedData[crossKey].total += item.total;
            }
            // Cruzamento Vinculo x Formação Docente
            else if (isVinculoSelected && isFormacaoDocenteSelected) {
              const crossKey = `${item.contract_type_id}-${item.initial_training_id}`;
              if (!crossedData[crossKey]) {
                crossedData[crossKey] = {
                  contract_type_id: item.contract_type_id,
                  contract_type_name: item.contract_type_name,
                  initial_training_id: item.initial_training_id,
                  initial_training_name: item.initial_training_name,
                  total: 0
                };
              }
              crossedData[crossKey].total += item.total;
            }
            // Totais individuais para filtros únicos
            else if (isEtapaSelected) {
              if (type === 'school/count') {
                if (!totalByEtapa[item.arrangement_id]) {
                  totalByEtapa[item.arrangement_id] = {
                    total: 0,
                    name: item.arrangement_name
                  };
                }
                totalByEtapa[item.arrangement_id].total += item.total;
              } else if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
                if (!totalByEtapa[item.education_level_short_id]) {
                  totalByEtapa[item.education_level_short_id] = {
                    total: 0,
                    name: item.education_level_short_name
                  };
                }
                totalByEtapa[item.education_level_short_id].total += item.total;
              } else {
                if (!totalByEtapa[item.education_level_mod_id]) {
                  totalByEtapa[item.education_level_mod_id] = {
                    total: 0,
                    name: item.education_level_mod_name
                  };
                }
                totalByEtapa[item.education_level_mod_id].total += item.total;
              }

            }
            else if (isLocalidadeSelected) {
              if (!totalByLocalidade[item.location_id]) {
                totalByLocalidade[item.location_id] = {
                  total: 0,
                  name: item.location_name
                };
              }
              totalByLocalidade[item.location_id].total += item.total;
            }
            else if (isDependenciaSelected) {
              if (!totalByDependencia[item.adm_dependency_detailed_id]) {
                totalByDependencia[item.adm_dependency_detailed_id] = {
                  total: 0,
                  name: item.adm_dependency_detailed_name
                };
              }
              totalByDependencia[item.adm_dependency_detailed_id].total += item.total;
            }
            else if (isVinculoSelected) {
              if (!totalByVinculo[item.contract_type_id]) {
                totalByVinculo[item.contract_type_id] = {
                  total: 0,
                  name: item.contract_type_name
                };
              }
              totalByVinculo[item.contract_type_id].total += item.total;
            }
            else if (isFormacaoDocenteSelected) {
              if (!totalByFormacaoDocente[item.initial_training_id]) {
                totalByFormacaoDocente[item.initial_training_id] = {
                  total: 0,
                  name: item.initial_training_name
                };
              }
              totalByFormacaoDocente[item.initial_training_id].total += item.total;
            }
            else {
              totalSum += item.total;
            }
          });
        }
      });

      // Retorna o resultado apropriado baseado nos filtros selecionados
      if (isLocalidadeSelected && isDependenciaSelected) {
        return { result: { byLocalidadeAndDependencia: Object.values(crossedData) } };
      }
      if (isEtapaSelected && isDependenciaSelected) {
        return { result: { byEtapaAndDependencia: Object.values(crossedData) } };
      }
      if (isEtapaSelected && isLocalidadeSelected) {
        return { result: { byEtapaAndLocalidade: Object.values(crossedData) } };
      }
      if (isEtapaSelected && isVinculoSelected) {
        return { result: { byEtapaAndVinculo: Object.values(crossedData) } };
      }
      if (isLocalidadeSelected && isVinculoSelected) {
        return { result: { byLocalidadeAndVinculo: Object.values(crossedData) } };
      }
      if (isDependenciaSelected && isVinculoSelected) {
        return { result: { byDependenciaAndVinculo: Object.values(crossedData) } };
      }
      if (isEtapaSelected && isFormacaoDocenteSelected) {
        return { result: { byEtapaAndFormacaoDocente: Object.values(crossedData) } };
      }
      if (isLocalidadeSelected && isFormacaoDocenteSelected) {
        return { result: { byLocalidadeAndFormacaoDocente: Object.values(crossedData) } };
      }
      if (isDependenciaSelected && isFormacaoDocenteSelected) {
        return { result: { byDependenciaAndFormacaoDocente: Object.values(crossedData) } };
      }
      if (isVinculoSelected && isFormacaoDocenteSelected) {
        return { result: { byVinculoAndFormacaoDocente: Object.values(crossedData) } };
      }

      if (isEtapaSelected) {
        if (type === 'school/count') {
          return {
            result: Object.entries(totalByEtapa).map(([id, { total, name }]) => ({
              arrangement_id: id,
              arrangement_name: name,
              total
            }))
          };
        } else if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
          return {
            result: Object.entries(totalByEtapa).map(([id, { total, name }]) => ({
              education_level_short_id: id,
              education_level_short_name: name,
              total
            }))
          };
        } else {
        return {
          result: Object.entries(totalByEtapa).map(([id, { total, name }]) => ({
            education_level_mod_id: id,
            education_level_mod_name: name,
            total
            }))
          };
        }
      }
      if (isLocalidadeSelected) {
        return {
          result: Object.entries(totalByLocalidade).map(([id, { total, name }]) => ({
            location_id: id,
            location_name: name,
            total
          }))
        };
      }
      if (isDependenciaSelected) {
        return {
          result: Object.entries(totalByDependencia).map(([id, { total, name }]) => ({
            adm_dependency_detailed_id: id,
            adm_dependency_detailed_name: name,
            total
          }))
        };
      }
      if (isVinculoSelected) {
        return {
          result: Object.entries(totalByVinculo).map(([id, { total, name }]) => ({
            contract_type_id: id,
            contract_type_name: name,
            total
          }))
        };
      }
      if (isFormacaoDocenteSelected) {
        return {
          result: Object.entries(totalByFormacaoDocente).map(([id, { total, name }]) => ({
            initial_training_id: id,
            initial_training_name: name,
            total
          }))
        };
      }

      return { result: [{ total: totalSum }] };
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
            const summedResults = {
              result: allResults[0].result.map(yearData => {
                const matchingResults = allResults.map(cityResult =>
                  cityResult.result.find(y => {
                    // Verifica o ano
                    if (y.year !== yearData.year) return false;

                    // Verifica cada filtro selecionado
                    if (isEtapaSelected &&
                        y.education_level_mod_id !== yearData.education_level_mod_id) return false;

                    if (isLocalidadeSelected &&
                        y.location_id !== yearData.location_id) return false;

                    if (isEtapaSelected && type === 'school/count' &&
                        y.arrangement_id !== yearData.arrangement_id) return false;

                    if (isEtapaSelected && (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') &&
                        y.education_level_short_id !== yearData.education_level_short_id) return false;

                    if (isDependenciaSelected &&
                        y.adm_dependency_detailed_id !== yearData.adm_dependency_detailed_id) return false;

                    if (isVinculoSelected &&
                        y.contract_type_id !== yearData.contract_type_id) return false;

                    if (isFormacaoDocenteSelected &&
                        y.initial_training_id !== yearData.initial_training_id) return false;

                    return true;
                  })
                ).filter(Boolean);

                return {
                  ...yearData,
                  total: matchingResults.reduce((sum, result) => sum + result.total, 0)
                };
              })
            };

            onDataFetched(summedResults);
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

          const finalResult = processResults(allResults);
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
          const allResults = [result]; // Wrap result in an array to use processResults
          const finalResult = processResults(allResults);
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
