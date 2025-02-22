import { useEffect } from "react";

function ApiContainer({
  type,
  year,
  state = "22",
  city,
  territory,
  faixaPopulacional,
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

    const buildFilter = (cityId = null) => {
      return `min_year:"${year}",max_year:"${year}",state:"${state}"${cityId ? `,city:"${cityId}"` : ""}`;
    };

    const buildUrl = (filter) => {
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
            // Cruzamento Etapa x Localidade
            else if (isEtapaSelected && isLocalidadeSelected) {
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
            // Totais individuais para filtros únicos
            else if (isEtapaSelected) {
              if (!totalByEtapa[item.education_level_mod_id]) {
                totalByEtapa[item.education_level_mod_id] = {
                  total: 0,
                  name: item.education_level_mod_name
                };
              }
              totalByEtapa[item.education_level_mod_id].total += item.total;
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
      if (isEtapaSelected) {
        return {
          result: Object.entries(totalByEtapa).map(([id, { total, name }]) => ({
            education_level_mod_id: id,
            education_level_mod_name: name,
            total
          }))
        };
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
      return { result: [{ total: totalSum }] };
    };

    const fetchData = async () => {
      try {
        onError(null);
        onLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (citiesList.length > 0 && !city) {
          const allResults = await Promise.all(
            citiesList.map(([cityId, cityInfo]) => fetchCityData(cityId, cityInfo.nomeMunicipio))
          );

          const finalResult = processResults(allResults);
          console.log("Final Result:", finalResult);
          onDataFetched({ finalResult, allResults });
        } else if (citiesList.length === 0 && (territory || faixaPopulacional)) {
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
  }, [triggerFetch, type, year, state, city, territory, faixaPopulacional, citiesList, onDataFetched, onError, onLoading, selectedFilters]);

  return null;
}

export default ApiContainer;
