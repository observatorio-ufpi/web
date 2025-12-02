// Função principal para processar resultados da API
export function processResults(allResults, selectedFilters) {
  // Extrair informações dos filtros selecionados
  let isEtapaSelected = false;
  let isLocalidadeSelected = false;
  let isDependenciaSelected = false;
  let isVinculoSelected = false;
  let isFormacaoDocenteSelected = false;
  let isFaixaEtariaSelected = false;
  let isMunicipioSelected = false;


  //educacao superior
  let isModalidadeSelected = false;
  let isRegimeSelected = false;
  let isCategoriaAdministrativaSelected = false;
  let isFaixaEtariaSuperiorSelected = false;
  let isOrganizacaoAcademicaSelected = false;
  let isInstituicaoEnsinoSelected = false;


  if (selectedFilters) {
    isEtapaSelected = selectedFilters.some((filter) => filter.value === "etapa");
    isLocalidadeSelected = selectedFilters.some((filter) => filter.value === "localidade");
    isDependenciaSelected = selectedFilters.some((filter) => filter.value === "dependencia");
    isVinculoSelected = selectedFilters.some((filter) => filter.value === "vinculo");
    isFormacaoDocenteSelected = selectedFilters.some((filter) => filter.value === "formacaoDocente");
    isFaixaEtariaSelected = selectedFilters.some((filter) => filter.value === "faixaEtaria");
    isMunicipioSelected = selectedFilters.some((filter) => filter.value === "municipio");
    isModalidadeSelected = selectedFilters.some((filter) => filter.value === "modalidade");
    isRegimeSelected = selectedFilters.some((filter) => filter.value === "regimeDeTrabalho");
    isCategoriaAdministrativaSelected = selectedFilters.some((filter) => filter.value === "categoriaAdministrativa");
    isFaixaEtariaSuperiorSelected = selectedFilters.some((filter) => filter.value === "faixaEtariaSuperior");
    isOrganizacaoAcademicaSelected = selectedFilters.some((filter) => filter.value === "organizacaoAcademica");
    isInstituicaoEnsinoSelected = selectedFilters.some((filter) => filter.value === "instituicaoEnsino");
  }
  // Inicializar objetos para armazenar totais
  const totalByEtapa = {};
  const totalByLocalidade = {};
  const totalByDependencia = {};
  const totalByVinculo = {};
  const totalByFormacaoDocente = {};
  const totalByFaixaEtaria = {};
  const totalByMunicipio = {};
  const totalByModalidade = {};
  const totalByRegime = {};
  const totalByCategoriaAdministrativa = {};
  const totalByFaixaEtariaSuperior = {};
  const totalByOrganizacaoAcademica = {};
  const totalByInstituicaoEnsino = {};
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
          processCrossedEtapaDependencia(crossedData, item);
        }
        else if (isEtapaSelected && isLocalidadeSelected) {
          processCrossedEtapaLocalidade(crossedData, item);
        }
        else if (isEtapaSelected && isVinculoSelected) {
          processCrossedEtapaVinculo(crossedData, item);
        }
        else if (isLocalidadeSelected && isVinculoSelected) {
          processCrossedLocalidadeVinculo(crossedData, item);
        }
        else if (isDependenciaSelected && isVinculoSelected) {
          processCrossedDependenciaVinculo(crossedData, item);
        }
        else if (isEtapaSelected && isFormacaoDocenteSelected) {
          processCrossedEtapaFormacaoDocente(crossedData, item);
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
        else if (isModalidadeSelected && isFaixaEtariaSuperiorSelected) {
          processCrossedModalidadeFaixaEtariaSuperior(crossedData, item);
        }
        else if (isModalidadeSelected && isOrganizacaoAcademicaSelected) {
          processCrossedModalidadeOrganizacaoAcademica(crossedData, item);
        }
        else if (isModalidadeSelected && isCategoriaAdministrativaSelected) {
          processCrossedModalidadeCategoriaAdministrativa(crossedData, item);
        }
        else if (isCategoriaAdministrativaSelected && isFaixaEtariaSuperiorSelected) {
          processCrossedCategotiaFaixaEtariaSuperior(crossedData, item);
        }
        else if (isCategoriaAdministrativaSelected && isOrganizacaoAcademicaSelected) {
          processCrossedCategoriaOrganizacaoAcademica(crossedData, item);
        }
        else if (isOrganizacaoAcademicaSelected && isFaixaEtariaSuperiorSelected) {
          processCrossedOrganizacaoAcademicaFaixaEtariaSuperior(crossedData, item);
        }
        // Combinações com Instituição de Ensino
        else if (isInstituicaoEnsinoSelected && isModalidadeSelected) {
          processCrossedInstituicaoEnsinoModalidade(crossedData, item);
        }
        else if (isInstituicaoEnsinoSelected && isCategoriaAdministrativaSelected) {
          processCrossedInstituicaoEnsinoCategoriaAdministrativa(crossedData, item);
        }
        else if (isInstituicaoEnsinoSelected && isOrganizacaoAcademicaSelected) {
          processCrossedInstituicaoEnsinoOrganizacaoAcademica(crossedData, item);
        }
        else if (isInstituicaoEnsinoSelected && isFaixaEtariaSuperiorSelected) {
          processCrossedInstituicaoEnsinoFaixaEtariaSuperior(crossedData, item);
        }
        else if (isCategoriaAdministrativaSelected && isRegimeSelected) {
          processCrossedCategotiaRegimeDeTrabalho(crossedData, item);
        }
        else if (isCategoriaAdministrativaSelected && isFormacaoDocenteSelected) {
          processCrossedCategoriaFormacaoDocente(crossedData, item);
        }
        else if (isOrganizacaoAcademicaSelected && isRegimeSelected) {
          processCrossedOrganizacaoAcademicaRegime(crossedData, item);
        }
        else if (isOrganizacaoAcademicaSelected && isFormacaoDocenteSelected) {
          processCrossedOrganizacaoAcademicaFormacaoDocente(crossedData, item);
        }
        // Processar cruzamentos com municipality
        else if (isMunicipioSelected && isEtapaSelected) {
          processCrossedMunicipioEtapa(crossedData, item);
        }
        else if (isMunicipioSelected && isDependenciaSelected) {
          processCrossedMunicipioDependencia(crossedData, item);
        }
        else if (isMunicipioSelected && isLocalidadeSelected) {
          processCrossedMunicipioLocalidade(crossedData, item);
        }
        // Processar totais individuais para filtros únicos
        else if (isMunicipioSelected) {
          processMunicipioTotal(totalByMunicipio, item);
        }
        else if (isEtapaSelected) {
          processEtapaTotal(totalByEtapa, item);
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
        else if (isCategoriaAdministrativaSelected) {
          processCategoriaAdministrativaTotal(totalByCategoriaAdministrativa, item);
        }
        else if (isFaixaEtariaSuperiorSelected) {
          processFaixaEtariaSuperiorTotal(totalByFaixaEtariaSuperior, item);
        }
        else if (isOrganizacaoAcademicaSelected) {
          processOrganizacaoAcademicaTotal(totalByOrganizacaoAcademica, item);
        }
        else if (isInstituicaoEnsinoSelected) {
          processInstituicaoEnsinoTotal(totalByInstituicaoEnsino, item);
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
    isVinculoSelected, isFormacaoDocenteSelected, isFaixaEtariaSelected, isMunicipioSelected,
    isModalidadeSelected, isRegimeSelected, isCategoriaAdministrativaSelected, isFaixaEtariaSuperiorSelected, isOrganizacaoAcademicaSelected, isInstituicaoEnsinoSelected, crossedData, totalByEtapa, totalByLocalidade, totalByDependencia,
    totalByVinculo, totalByFormacaoDocente, totalByFaixaEtaria, totalByMunicipio, totalByModalidade, totalByRegime, totalByCategoriaAdministrativa, totalByFaixaEtariaSuperior, totalByOrganizacaoAcademica, totalByInstituicaoEnsino,
    totalSum
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

function processCrossedEtapaDependencia(crossedData, item) {
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

function processCrossedEtapaLocalidade(crossedData, item) {
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

function processCrossedEtapaVinculo(crossedData, item) {
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

function processCrossedEtapaFormacaoDocente(crossedData, item) {
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

function processCrossedModalidadeFaixaEtariaSuperior(crossedData, item) {
  const crossKey = `${item.upper_education_mod_id}-${item.age_student_code_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      upper_education_mod_id: item.upper_education_mod_id,
      upper_education_mod_name: item.upper_education_mod_name,
      age_student_code_id: item.age_student_code_id,
      age_student_code_name: item.age_student_code_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedModalidadeOrganizacaoAcademica(crossedData, item) {
  const crossKey = `${item.upper_education_mod_id}-${item.academic_level_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      upper_education_mod_id: item.upper_education_mod_id,
      upper_education_mod_name: item.upper_education_mod_name,
      academic_level_id: item.academic_level_id,
      academic_level_name: item.academic_level_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedModalidadeCategoriaAdministrativa(crossedData, item) {
  const crossKey = `${item.upper_education_mod_id}-${item.upper_adm_dependency_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      upper_education_mod_id: item.upper_education_mod_id,
      upper_education_mod_name: item.upper_education_mod_name,
      upper_adm_dependency_id: item.upper_adm_dependency_id,
      upper_adm_dependency_name: item.upper_adm_dependency_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedCategotiaFaixaEtariaSuperior(crossedData, item) {
  const crossKey = `${item.upper_adm_dependency_id}-${item.age_student_code_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      upper_adm_dependency_id: item.upper_adm_dependency_id,
      upper_adm_dependency_name: item.upper_adm_dependency_name,
      age_student_code_id: item.age_student_code_id,
      age_student_code_name: item.age_student_code_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedCategoriaOrganizacaoAcademica(crossedData, item) {
  const crossKey = `${item.upper_adm_dependency_id}-${item.academic_level_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      upper_adm_dependency_id: item.upper_adm_dependency_id,
      upper_adm_dependency_name: item.upper_adm_dependency_name,
      academic_level_id: item.academic_level_id,
      academic_level_name: item.academic_level_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedOrganizacaoAcademicaFaixaEtariaSuperior(crossedData, item) {
  const crossKey = `${item.academic_level_id}-${item.age_student_code_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      academic_level_id: item.academic_level_id,
      academic_level_name: item.academic_level_name,
      age_student_code_id: item.age_student_code_id,
      age_student_code_name: item.age_student_code_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedCategotiaRegimeDeTrabalho(crossedData, item) {
  const crossKey = `${item.upper_adm_dependency_id}-${item.work_regime_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      upper_adm_dependency_id: item.upper_adm_dependency_id,
      upper_adm_dependency_name: item.upper_adm_dependency_name,
      work_regime_id: item.work_regime_id,
      work_regime_name: item.work_regime_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedCategoriaFormacaoDocente(crossedData, item) {
  const crossKey = `${item.upper_adm_dependency_id}-${item.initial_training_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      upper_adm_dependency_id: item.upper_adm_dependency_id,
      upper_adm_dependency_name: item.upper_adm_dependency_name,
      initial_training_id: item.initial_training_id,
      initial_training_name: item.initial_training_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedOrganizacaoAcademicaRegime(crossedData, item) {
  const crossKey = `${item.academic_level_id}-${item.work_regime_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      academic_level_id: item.academic_level_id,
      academic_level_name: item.academic_level_name,
      work_regime_id: item.work_regime_id,
      work_regime_name: item.work_regime_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedOrganizacaoAcademicaFormacaoDocente(crossedData, item) {
  const crossKey = `${item.academic_level_id}-${item.initial_training_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      academic_level_id: item.academic_level_id,
      academic_level_name: item.academic_level_name,
      initial_training_id: item.initial_training_id,
      initial_training_name: item.initial_training_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

// ====== IES Cross Processors ======
function processCrossedInstituicaoEnsinoModalidade(crossedData, item) {
  const instId = item.institution_id ?? item.instituicao_ensino_id ?? item.codigo_ies;
  if (instId == null || item.upper_education_mod_id == null) return;
  const crossKey = `${instId}-${item.upper_education_mod_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      institution_id: Number(instId),
      institution_name: item.institution_name ?? item.instituicao_ensino_name ?? String(instId),
      upper_education_mod_id: item.upper_education_mod_id,
      upper_education_mod_name: item.upper_education_mod_name,
      total: 0,
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedInstituicaoEnsinoCategoriaAdministrativa(crossedData, item) {
  const instId = item.institution_id ?? item.instituicao_ensino_id ?? item.codigo_ies;
  if (instId == null || item.upper_adm_dependency_id == null) return;
  const crossKey = `${instId}-${item.upper_adm_dependency_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      institution_id: Number(instId),
      institution_name: item.institution_name ?? item.instituicao_ensino_name ?? String(instId),
      upper_adm_dependency_id: item.upper_adm_dependency_id,
      upper_adm_dependency_name: item.upper_adm_dependency_name,
      total: 0,
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedInstituicaoEnsinoOrganizacaoAcademica(crossedData, item) {
  const instId = item.institution_id ?? item.instituicao_ensino_id ?? item.codigo_ies;
  if (instId == null || item.academic_level_id == null) return;
  const crossKey = `${instId}-${item.academic_level_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      institution_id: Number(instId),
      institution_name: item.institution_name ?? item.instituicao_ensino_name ?? String(instId),
      academic_level_id: item.academic_level_id,
      academic_level_name: item.academic_level_name,
      total: 0,
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedInstituicaoEnsinoFaixaEtariaSuperior(crossedData, item) {
  const instId = item.institution_id ?? item.instituicao_ensino_id ?? item.codigo_ies;
  if (instId == null || item.age_student_code_id == null) return;
  const crossKey = `${instId}-${item.age_student_code_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      institution_id: Number(instId),
      institution_name: item.institution_name ?? item.instituicao_ensino_name ?? String(instId),
      age_student_code_id: item.age_student_code_id,
      age_student_code_name: item.age_student_code_name,
      total: 0,
    };
  }
  crossedData[crossKey].total += item.total;
}

// Funções auxiliares para processamento de totais individuais
function processEtapaTotal(totalByEtapa, item) {
  if (!totalByEtapa[item.education_level_mod_id]) {
    totalByEtapa[item.education_level_mod_id] = {
      total: 0,
      name: item.education_level_mod_name
    };
  }
  totalByEtapa[item.education_level_mod_id].total += item.total;
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

function processCategoriaAdministrativaTotal(totalByCategoriaAdministrativa, item) {
  if (!totalByCategoriaAdministrativa[item.upper_adm_dependency_id]) {
    totalByCategoriaAdministrativa[item.upper_adm_dependency_id] = {
      total: 0,
      name: item.upper_adm_dependency_name
    };
  }
  totalByCategoriaAdministrativa[item.upper_adm_dependency_id].total += item.total;
}

function processFaixaEtariaSuperiorTotal(totalByFaixaEtariaSuperior, item) {
  if (!totalByFaixaEtariaSuperior[item.age_student_code_id]) {
    totalByFaixaEtariaSuperior[item.age_student_code_id] = {
      total: 0,
      name: item.age_student_code_name
    };
  }
  totalByFaixaEtariaSuperior[item.age_student_code_id].total += item.total;
}

function processOrganizacaoAcademicaTotal(totalByOrganizacaoAcademica, item) {
  if (!totalByOrganizacaoAcademica[item.academic_level_id]) {
    totalByOrganizacaoAcademica[item.academic_level_id] = {
      total: 0,
      name: item.academic_level_name
    };
  }
  totalByOrganizacaoAcademica[item.academic_level_id].total += item.total;
}

function processInstituicaoEnsinoTotal(totalByInstituicaoEnsino, item) {
  const id = item.institution_id ?? item.instituicao_ensino_id ?? item.codigo_ies;
  const name = item.institution_name ?? item.instituicao_ensino_name ?? item.nome_ies;
  if (id == null) return;
  if (!totalByInstituicaoEnsino[id]) {
    totalByInstituicaoEnsino[id] = {
      total: 0,
      name: name
    };
  }
  totalByInstituicaoEnsino[id].total += item.total;
}

// Funções para processamento de municipality
function processMunicipioTotal(totalByMunicipio, item) {
  const id = item.municipality_id;
  const name = item.municipality_name;
  if (!id) return;
  if (!totalByMunicipio[id]) {
    totalByMunicipio[id] = {
      total: 0,
      name: name
    };
  }
  totalByMunicipio[id].total += item.total;
}

function processCrossedMunicipioEtapa(crossedData, item) {
  const crossKey = `${item.municipality_id}-${item.education_level_mod_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      municipality_id: item.municipality_id,
      municipality_name: item.municipality_name,
      education_level_mod_id: item.education_level_mod_id,
      education_level_mod_name: item.education_level_mod_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedMunicipioDependencia(crossedData, item) {
  const crossKey = `${item.municipality_id}-${item.adm_dependency_detailed_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      municipality_id: item.municipality_id,
      municipality_name: item.municipality_name,
      adm_dependency_detailed_id: item.adm_dependency_detailed_id,
      adm_dependency_detailed_name: item.adm_dependency_detailed_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

function processCrossedMunicipioLocalidade(crossedData, item) {
  const crossKey = `${item.municipality_id}-${item.location_id}`;
  if (!crossedData[crossKey]) {
    crossedData[crossKey] = {
      municipality_id: item.municipality_id,
      municipality_name: item.municipality_name,
      location_id: item.location_id,
      location_name: item.location_name,
      total: 0
    };
  }
  crossedData[crossKey].total += item.total;
}

// Função para formatar o resultado final
function getFormattedResult(
  isEtapaSelected, isLocalidadeSelected, isDependenciaSelected,
  isVinculoSelected, isFormacaoDocenteSelected, isFaixaEtariaSelected, isMunicipioSelected,
  isModalidadeSelected, isRegimeSelected, isCategoriaAdministrativaSelected, isFaixaEtariaSuperiorSelected, isOrganizacaoAcademicaSelected, isInstituicaoEnsinoSelected, crossedData, totalByEtapa, totalByLocalidade, totalByDependencia,
  totalByVinculo, totalByFormacaoDocente, totalByFaixaEtaria, totalByMunicipio, totalByModalidade, totalByRegime, totalByCategoriaAdministrativa, totalByFaixaEtariaSuperior, totalByOrganizacaoAcademica, totalByInstituicaoEnsino,
  totalSum
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
  if (isModalidadeSelected && isFaixaEtariaSuperiorSelected) {
    return { result: { byModalidadeAndFaixaEtariaSuperior: Object.values(crossedData) } };
  }
  if (isModalidadeSelected && isOrganizacaoAcademicaSelected) {
    return { result: { byModalidadeAndOrganizacaoAcademica: Object.values(crossedData) } };
  }
  if (isModalidadeSelected && isCategoriaAdministrativaSelected) {
    return { result: { byModalidadeAndCategoriaAdministrativa: Object.values(crossedData) } };
  }
  if (isCategoriaAdministrativaSelected && isFaixaEtariaSuperiorSelected) {
    return { result: { byCategoriaAdministrativaAndFaixaEtariaSuperior: Object.values(crossedData) } };
  }
  if (isCategoriaAdministrativaSelected && isOrganizacaoAcademicaSelected) {
    return { result: { byCategoriaAdministrativaAndOrganizacaoAcademica: Object.values(crossedData) } };
  }
  if (isOrganizacaoAcademicaSelected && isFaixaEtariaSuperiorSelected) {
    return { result: { byOrganizacaoAcademicaAndFaixaEtariaSuperior: Object.values(crossedData) } };
  }
  if (isCategoriaAdministrativaSelected && isRegimeSelected) {
    return { result: { byCategoriaAdministrativaAndRegime: Object.values(crossedData) } };
  }
  if (isCategoriaAdministrativaSelected && isFormacaoDocenteSelected) {
    return { result: { byCategoriaAdministrativaAndFormacaoDocente: Object.values(crossedData) } };
  }
  if (isOrganizacaoAcademicaSelected && isRegimeSelected) {
    return { result: { byOrganizacaoAcademicaAndRegime: Object.values(crossedData) } };
  }
  if (isOrganizacaoAcademicaSelected && isFormacaoDocenteSelected) {
    return { result: { byOrganizacaoAcademicaAndFormacaoDocente: Object.values(crossedData) } };
  }
  // Processar cruzamentos com municipality
  if (isMunicipioSelected && isEtapaSelected) {
    return { result: { byMunicipioAndEtapa: Object.values(crossedData) } };
  }
  if (isMunicipioSelected && isDependenciaSelected) {
    return { result: { byMunicipioAndDependencia: Object.values(crossedData) } };
  }
  if (isMunicipioSelected && isLocalidadeSelected) {
    return { result: { byMunicipioAndLocalidade: Object.values(crossedData) } };
  }

  // ====== IES Cross Returns ======
  if (isInstituicaoEnsinoSelected && isModalidadeSelected) {
    return { result: { byInstitutionAndModalidade: Object.values(crossedData) } };
  }
  if (isInstituicaoEnsinoSelected && isCategoriaAdministrativaSelected) {
    return { result: { byInstitutionAndCategoriaAdministrativa: Object.values(crossedData) } };
  }
  if (isInstituicaoEnsinoSelected && isOrganizacaoAcademicaSelected) {
    return { result: { byInstitutionAndOrganizacaoAcademica: Object.values(crossedData) } };
  }
  if (isInstituicaoEnsinoSelected && isFaixaEtariaSuperiorSelected) {
    return { result: { byInstitutionAndFaixaEtariaSuperior: Object.values(crossedData) } };
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

  if (isMunicipioSelected) {
    return {
      result: Object.entries(totalByMunicipio).map(([id, { total, name }]) => ({
        municipality_id: Number(id),
        municipality_name: name,
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

  if (isCategoriaAdministrativaSelected) {
    return {
      result: Object.entries(totalByCategoriaAdministrativa).map(([id, { total, name }]) => ({
        upper_adm_dependency_id: id,
        upper_adm_dependency_name: name,
        total
      }))
    };
  }

  if (isFaixaEtariaSuperiorSelected) {
    return {
      result: Object.entries(totalByFaixaEtariaSuperior).map(([id, { total, name }]) => ({
        age_student_code: id,
        age_student_code_name: name,
        total
      }))
    };
  }

  if (isOrganizacaoAcademicaSelected) {
    return {
      result: Object.entries(totalByOrganizacaoAcademica).map(([id, { total, name }]) => ({
        academic_level_id: id,
        academic_level_name: name,
        total
      }))
    };
  }

  if (isInstituicaoEnsinoSelected) {
    return {
      result: Object.entries(totalByInstituicaoEnsino).map(([id, { total, name }]) => ({
        institution_id: Number(id),
        institution_name: name,
        total
      }))
    };
  }

  return { result: [{ total: totalSum }] };
}
