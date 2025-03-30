// Função principal para processar resultados da API
export function processResults(allResults, selectedFilters, type, year) {
  // Extrair informações dos filtros selecionados
  let isEtapaSelected = false;
  let isLocalidadeSelected = false;
  let isDependenciaSelected = false;
  let isVinculoSelected = false;
  let isFormacaoDocenteSelected = false;
  let isFaixaEtariaSelected = false;
  
  //educacao superior
  let isModalidadeSelected = false;
  let isRegimeSelected = false;

  
  if (selectedFilters) {
    isEtapaSelected = selectedFilters.some((filter) => filter.value === "etapa");
    isLocalidadeSelected = selectedFilters.some((filter) => filter.value === "localidade");
    isDependenciaSelected = selectedFilters.some((filter) => filter.value === "dependencia");
    isVinculoSelected = selectedFilters.some((filter) => filter.value === "vinculo");
    isFormacaoDocenteSelected = selectedFilters.some((filter) => filter.value === "formacaoDocente");
    isFaixaEtariaSelected = selectedFilters.some((filter) => filter.value === "faixaEtaria");
    isModalidadeSelected = selectedFilters.some((filter) => filter.value === "modalidade");
    isRegimeSelected = selectedFilters.some((filter) => filter.value === "regimeDeTrabalho");
  }
  // Inicializar objetos para armazenar totais
  const totalByEtapa = {};
  const totalByLocalidade = {};
  const totalByDependencia = {};
  const totalByVinculo = {};
  const totalByFormacaoDocente = {};
  const totalByFaixaEtaria = {};
  const totalByModalidade = {};
  const totalByRegime = {};
  const crossedData = {};
  let totalSum = 0;

  // Processar todos os resultados
  allResults.forEach((result) => {
    if (Array.isArray(result.result) && result.result.length > 0) {
      result.result.forEach((item) => {
        // Converter total para número se ainda não for
        item.total = typeof item.total === 'number' ? item.total : Number(item.total);

        // Processar cruzamentos de filtros
        if (isLocalidadeSelected && isDependenciaSelected) {
          processCrossedLocalidadeDependencia(crossedData, item);
        }
        else if (isEtapaSelected && isDependenciaSelected) {
          processCrossedEtapaDependencia(crossedData, item, type, year);
        }
        else if (isEtapaSelected && isLocalidadeSelected) {
          processCrossedEtapaLocalidade(crossedData, item, type, year);
        }
        else if (isEtapaSelected && isVinculoSelected) {
          processCrossedEtapaVinculo(crossedData, item, type);
        }
        else if (isLocalidadeSelected && isVinculoSelected) {
          processCrossedLocalidadeVinculo(crossedData, item);
        }
        else if (isDependenciaSelected && isVinculoSelected) {
          processCrossedDependenciaVinculo(crossedData, item);
        }
        else if (isEtapaSelected && isFormacaoDocenteSelected) {
          processCrossedEtapaFormacaoDocente(crossedData, item, type);
        }
        else if (isLocalidadeSelected && isFormacaoDocenteSelected) {
          processCrossedLocalidadeFormacaoDocente(crossedData, item);
        }
        else if (isDependenciaSelected && isFormacaoDocenteSelected) {
          processCrossedDependenciaFormacaoDocente(crossedData, item);
        }
        else if (isVinculoSelected && isFormacaoDocenteSelected) {
          processCrossedVinculoFormacaoDocente(crossedData, item);
        }
        // Processar totais individuais para filtros únicos
        else if (isEtapaSelected) {
          processEtapaTotal(totalByEtapa, item, type, year);
        }
        else if (isLocalidadeSelected) {
          processLocalidadeTotal(totalByLocalidade, item);
        }
        else if (isDependenciaSelected) {
          processDependenciaTotal(totalByDependencia, item);
        }
        else if (isVinculoSelected) {
          processVinculoTotal(totalByVinculo, item);
        }
        else if (isFormacaoDocenteSelected) {
          processFormacaoDocenteTotal(totalByFormacaoDocente, item);
        }
        else if (isFaixaEtariaSelected) {
          processFaixaEtariaTotal(totalByFaixaEtaria, item);
        }
        else if (isModalidadeSelected) {
          processModalidadeTotal(totalByModalidade, item);
        }
        else if (isRegimeSelected) {
          processRegimeTotal(totalByRegime, item);
        }
        else {
          totalSum += item.total;
        }
      });
    }
  });

  // Retornar o resultado apropriado baseado nos filtros selecionados
  return getFormattedResult(
    isEtapaSelected, isLocalidadeSelected, isDependenciaSelected,
    isVinculoSelected, isFormacaoDocenteSelected, isFaixaEtariaSelected,
    isModalidadeSelected, isRegimeSelected, crossedData, totalByEtapa, totalByLocalidade, totalByDependencia,
    totalByVinculo, totalByFormacaoDocente, totalByFaixaEtaria, totalByModalidade, totalByRegime,
    totalSum, type
  );
}

// Funções auxiliares para processamento de cruzamentos
function processCrossedLocalidadeDependencia(crossedData, item) {
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

function processCrossedEtapaDependencia(crossedData, item, type, year) {
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
  } else if (type === 'enrollment' && year >= 2021) {
    if (item.education_level_mod_agg_id === 11) {
      return; // Pula este item e continua com o próximo
    }
    const crossKey = `${item.education_level_mod_agg_id}-${item.adm_dependency_detailed_id}`;
    if (!crossedData[crossKey]) {
      crossedData[crossKey] = {
        education_level_mod_agg_id: item.education_level_mod_agg_id,
        education_level_mod_agg_name: item.education_level_mod_agg_name,
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

function processCrossedEtapaLocalidade(crossedData, item, type, year) {
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
  } else if (type === 'enrollment' && year >= 2021) {
    if (item.education_level_mod_agg_id === 11) {
      return; // Pula este item e continua com o próximo
    }
    const crossKey = `${item.education_level_mod_agg_id}-${item.location_id}`;
    if (!crossedData[crossKey]) {
      crossedData[crossKey] = {
        education_level_mod_agg_id: item.education_level_mod_agg_id,
        education_level_mod_agg_name: item.education_level_mod_agg_name,
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

function processCrossedEtapaVinculo(crossedData, item, type) {
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

function processCrossedLocalidadeVinculo(crossedData, item) {
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

function processCrossedDependenciaVinculo(crossedData, item) {
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

function processCrossedEtapaFormacaoDocente(crossedData, item, type) {
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

function processCrossedLocalidadeFormacaoDocente(crossedData, item) {
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

function processCrossedDependenciaFormacaoDocente(crossedData, item) {
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

function processCrossedVinculoFormacaoDocente(crossedData, item) {
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

// Funções auxiliares para processamento de totais individuais
function processEtapaTotal(totalByEtapa, item, type, year) {
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
  } else if (type === 'enrollment' && year >= 2021) {
    if (item.education_level_mod_agg_id === 11) {
      return; // Pula este item e continua com o próximo
    }
    if (!totalByEtapa[item.education_level_mod_agg_id]) {
      totalByEtapa[item.education_level_mod_agg_id] = {
        total: 0,
        name: item.education_level_mod_agg_name
      };
    }
    totalByEtapa[item.education_level_mod_agg_id].total += item.total;
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

function processLocalidadeTotal(totalByLocalidade, item) {
  if (!totalByLocalidade[item.location_id]) {
    totalByLocalidade[item.location_id] = {
      total: 0,
      name: item.location_name
    };
  }
  totalByLocalidade[item.location_id].total += item.total;
}

function processDependenciaTotal(totalByDependencia, item) {
  if (!totalByDependencia[item.adm_dependency_detailed_id]) {
    totalByDependencia[item.adm_dependency_detailed_id] = {
      total: 0,
      name: item.adm_dependency_detailed_name
    };
  }
  totalByDependencia[item.adm_dependency_detailed_id].total += item.total;
}

function processVinculoTotal(totalByVinculo, item) {
  if (!totalByVinculo[item.contract_type_id]) {
    totalByVinculo[item.contract_type_id] = {
      total: 0,
      name: item.contract_type_name
    };
  }
  totalByVinculo[item.contract_type_id].total += item.total;
}

function processFormacaoDocenteTotal(totalByFormacaoDocente, item) {
  if (!totalByFormacaoDocente[item.initial_training_id]) {
    totalByFormacaoDocente[item.initial_training_id] = {
      total: 0,
      name: item.initial_training_name
    };
  }
  totalByFormacaoDocente[item.initial_training_id].total += item.total;
}

function processFaixaEtariaTotal(totalByFaixaEtaria, item) {
  if (!totalByFaixaEtaria[item.age_range_id]) {
    totalByFaixaEtaria[item.age_range_id] = {
      total: 0,
      name: item.age_range_name
    };
  }
  totalByFaixaEtaria[item.age_range_id].total += item.total;
}

function processModalidadeTotal(totalByModalidade, item) {
  if (!totalByModalidade[item.upper_education_mod_id]) {
    totalByModalidade[item.upper_education_mod_id] = {
      total: 0,
      name: item.upper_education_mod_name
    };
  }
  totalByModalidade[item.upper_education_mod_id].total += item.total;
}

function processRegimeTotal(totalByRegime, item) {
  if (!totalByRegime[item.work_regime_id]) {
    totalByRegime[item.work_regime_id] = {
      total: 0,
      name: item.work_regime_name
    };
  }
  totalByRegime[item.work_regime_id].total += item.total;
}

// Função para formatar o resultado final
function getFormattedResult(
  isEtapaSelected, isLocalidadeSelected, isDependenciaSelected,
  isVinculoSelected, isFormacaoDocenteSelected, isFaixaEtariaSelected,
  isModalidadeSelected, isRegimeSelected, crossedData, totalByEtapa, totalByLocalidade, totalByDependencia,
  totalByVinculo, totalByFormacaoDocente, totalByFaixaEtaria, totalByModalidade, totalByRegime,
  totalSum, type
) {
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

  if (isFaixaEtariaSelected) {
    return {
      result: Object.entries(totalByFaixaEtaria).map(([id, { total, name }]) => ({
        age_range_id: id,
        age_range_name: name,
        total
      }))
    };
  }

  if (isModalidadeSelected) {
    return {
      result: Object.entries(totalByModalidade).map(([id, { total, name }]) => ({
        upper_education_mod_id: id,
        upper_education_mod_name: name,
        total
      }))
    };
  }

  if (isRegimeSelected) {
    return {
      result: Object.entries(totalByRegime).map(([id, { total, name }]) => ({
        work_regime_id: id,
        work_regime_name: name,
        total
      }))
    };
  }

  return { result: [{ total: totalSum }] };
}
