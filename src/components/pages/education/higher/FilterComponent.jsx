import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ApiHigherContainer from './ApiHigherComponent.jsx';
import DataTable from './DataTable.jsx';
import { Loading } from '../../../ui';
import { useEducationFilters } from '../../../../contexts/EducationFilterContext';
import { municipios, Regioes, FaixaPopulacional } from '../../../../utils/citiesMapping';

function FilterComponent() {
  const filters = useEducationFilters();
  const theme = useTheme();

  const validHigherEducationTypes = ['university/count', 'university_enrollment', 'university_teacher', 'course_count'];
  
  // Garantir que o tipo é válido para educação superior
  const validType = validHigherEducationTypes.includes(filters.type) ? filters.type : 'university/count';

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);

  // const handleExportTable = async () => {
  //   // Validações
  //   if (selectedFilters.length !== 1) {
  //     alert('Por favor, selecione exatamente UM filtro para exportar o tabelão.');
  //     return;
  //   }

  //   const selectedFilter = selectedFilters[0].value;

  //   try {
  //     setIsLoading(true);

  //     // Se for série histórica, passar objeto com startYear e endYear
  //     const yearParam = displayHistorical
  //       ? { startYear, endYear }
  //       : year;

  //     await exportHigherEducationTable(type, selectedFilter, yearParam);
  //     alert('Tabelão exportado com sucesso!');
  //   } catch (error) {
  //     console.error('Erro ao exportar:', error);
  //     alert('Erro ao exportar tabelão. Tente novamente.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleClearFilters = () => {
    filters.setType?.('university/count');
    filters.setSelectedFilters?.([]);
    filters.setStartYear?.(2007);
    filters.setEndYear?.(2024);
    filters.setCity?.('');
    filters.setTerritory?.('');
    filters.setFaixaPopulacional?.('');
    filters.setAglomerado?.('');
    filters.setGerencia?.('');
    setData(null);
    setError(null);
    setTitle('');
    setIsLoading(false);
    setShouldFetch(false);
  };

  const titleMapping = {
    "university/count": "Número de intituições de ensino superior",
    "university_enrollment": "Número de matrículas",
    "university_teacher": "Número de docentes",
    "course_count": "Número de cursos"
  };

  // Listener para o evento applyFilters do sidebar
  useEffect(() => {
    const handleApplyFilters = (event) => {
      console.log('applyFilters event received:', event.detail);
      const filterData = event.detail;
      
      setData(null);
      setError(null);
      
      // Construir título baseado nos filtros
      const typeTitle = titleMapping[filterData.type] || 'Educação Superior';
      const yearDisplay = filterData.startYear !== filterData.endYear 
        ? `${filterData.startYear}-${filterData.endYear}` 
        : filterData.startYear;
      
      let fullTitle = `${typeTitle} - Piauí (${yearDisplay})`;
      
      // Adicionar informações sobre filtros selecionados
      if (filterData.selectedFilters && filterData.selectedFilters.length > 0) {
        const filterNames = filterData.selectedFilters.map(f => f.label || f.value).join(', ');
        fullTitle += ` - Filtros: ${filterNames}`;
      }
      
      setTitle(fullTitle);
      setShouldFetch(true);
      setIsLoading(true);
    };

    window.addEventListener('applyFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFilters', handleApplyFilters);
  }, []);

  const filterOptions = validType === 'university_enrollment'
    ? [{ value: 'modalidade', label: 'Modalidade' }, { value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'faixaEtariaSuperior', label: 'Faixa Etária' },
       { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}, { value: 'instituicaoEnsino', label: 'Instituição de Ensino' }, { value: 'municipio', label: 'Município' }]
    : validType === 'university_teacher'
    ? [{ value: 'regimeDeTrabalho', label: 'Regime de Trabalho' }, { value: 'formacaoDocente', label: 'Formação Docente' }, { value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}, { value: 'municipio', label: 'Município' }]
    : validType === 'course_count'
    ?[{ value: 'modalidade', label: 'Modalidade' }, { value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}, { value: 'municipio', label: 'Município' }]
    : [{ value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}, { value: 'municipio', label: 'Município' }];

  // Lógica de filtros dependentes - baseado nos filtros de localização
  const baseFilteredMunicipios = useMemo(() => {
    const territorioLabel = filters.territory ? Regioes[filters.territory] : null;
    const faixaLabel = filters.faixaPopulacional ? FaixaPopulacional[filters.faixaPopulacional] : null;

    return Object.values(municipios).filter((m) => {
      if (territorioLabel && m.territorioDesenvolvimento !== territorioLabel) return false;
      if (faixaLabel && m.faixaPopulacional !== faixaLabel) return false;
      if (filters.aglomerado && String(m.aglomerado) !== String(filters.aglomerado)) return false;
      if (filters.gerencia) {
        const gerencias = String(m.gerencia).split(',').map((g) => g.trim());
        if (!gerencias.includes(String(filters.gerencia))) return false;
      }
      return true;
    });
  }, [filters.territory, filters.faixaPopulacional, filters.aglomerado, filters.gerencia]);

  // Desabilitar outros filtros quando município específico é selecionado
  const otherLocalityDisabled = !!filters.city;

  // Opções filtradas baseadas nos filtros de localização
  const filteredMunicipioOptions = useMemo(() => {
    return Object.entries(municipios)
      .filter(([, m]) => baseFilteredMunicipios.includes(m))
      .map(([key, { nomeMunicipio }]) => ({ value: key, label: nomeMunicipio }));
  }, [baseFilteredMunicipios]);

  const filteredTerritorioOptions = useMemo(() => {
    const uniqueLabels = [...new Set(baseFilteredMunicipios.map((m) => m.territorioDesenvolvimento).filter(Boolean))];
    return Object.entries(Regioes)
      .filter(([, label]) => uniqueLabels.includes(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const filteredFaixaPopulacionalOptions = useMemo(() => {
    const uniqueLabels = [...new Set(baseFilteredMunicipios.map((m) => m.faixaPopulacional).filter(Boolean))];
    return Object.entries(FaixaPopulacional)
      .filter(([, label]) => uniqueLabels.includes(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const filteredAglomeradoOptions = useMemo(() => {
    return [...new Set(baseFilteredMunicipios.map((m) => m.aglomerado).filter((a) => a && a !== 'undefined'))]
      .sort((a, b) => Number(a) - Number(b))
      .map((a) => ({ value: a, label: `AG ${a}` }));
  }, [baseFilteredMunicipios]);

  const filteredGerenciaOptions = useMemo(() => {
    return [...new Set(
      baseFilteredMunicipios
        .map((m) => m.gerencia)
        .filter((g) => g && g !== 'undefined')
        .flatMap((g) => (g.includes(',') ? g.split(',').map((x) => x.trim()) : [g]))
    )]
      .sort((a, b) => Number(a) - Number(b))
      .map((g) => ({ value: g, label: `${g}ª GRE` }));
  }, [baseFilteredMunicipios]);

  // Resetar shouldFetch após a requisição ser completada
  useEffect(() => {
    if (!isLoading && shouldFetch) {
      setShouldFetch(false);
    }
  }, [isLoading, shouldFetch]);

  // Limpar filtros de localização quando um município específico é selecionado
  useEffect(() => {
    if (filters.city) {
      filters.setTerritory?.('');
      filters.setFaixaPopulacional?.('');
      filters.setAglomerado?.('');
      filters.setGerencia?.('');
    }
  }, [filters.city, filters]);

  const filteredCities = Object.entries(municipios).filter(([key, {
    territorioDesenvolvimento,
    faixaPopulacional: cityFaixaPopulacional,
    aglomerado: cityAglomerado,
    gerencia: cityGerencia
  }]) => {
    // Verifica todas as condições selecionadas
    const matchesTerritory = !filters.territory || territorioDesenvolvimento === Regioes[filters.territory];
    const matchesFaixaPopulacional = !filters.faixaPopulacional || cityFaixaPopulacional === FaixaPopulacional[filters.faixaPopulacional];
    const matchesAglomerado = !filters.aglomerado || cityAglomerado === filters.aglomerado;

    // Para gerência, verificar se a gerencia selecionada está contida na string de gerencias da cidade
    // (considerando que uma cidade pode ter múltiplas gerencias separadas por vírgula)
    const matchesGerencia = !filters.gerencia || cityGerencia.split(',').map(g => g.trim()).includes(filters.gerencia);

    // Retorna true apenas se TODAS as condições selecionadas são atendidas
    return matchesTerritory && matchesFaixaPopulacional && matchesAglomerado && matchesGerencia;
  });

  const typeOptions = Object.entries(titleMapping).map(([key, label]) => ({
    value: key,
    label: label,
  }));

  const territoryOptions = Object.entries(Regioes).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const faixaPopulacionalOptions = Object.entries(FaixaPopulacional).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const gerenciaOptions = [...new Set(Object.values(municipios).map(m => m.gerencia))]
    .flatMap(gerencia => gerencia.split(',').map(g => g.trim()))
    .filter(Boolean)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(gerencia => ({
      value: gerencia,
      label: gerencia + 'ª GRE',
    }));

  const aglomeradoOptions = [...new Set(Object.values(municipios).map(m => m.aglomerado))]
    .flatMap(aglomerado => aglomerado.split(',').map(a => a.trim()))
    .filter(Boolean)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(aglomerado => ({
      value: aglomerado,
      label: 'AG ' + aglomerado,
    }));

  const cityOptions = filteredCities.map(([key, { nomeMunicipio }]) => ({
    value: key,
    label: nomeMunicipio,
  }));

  const customStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <div className="app-container">
      <div className="flex flex-col gap-4 p-0 m-0">
          <hr className="divider" />

          {isLoading && (
            <Loading />
          )}
          {error && (
            <div className="error-message">
              <p>{error}</p>
                </div>
              )}

          {!isLoading && !error && !data && (
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '20px auto',
                maxWidth: '400px',
                color: theme.palette.primary.main
              }}
            >
              Selecione os filtros desejados na lateral e clique em "Filtrar" para montar uma consulta.
            </Typography>
          )}

          {!isLoading && !error && data && title ? (
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
                {title}
              </Typography>
            </Box>
          ) : null}
          <ApiHigherContainer
            type={validType}
            year={filters.startYear}
            isHistorical={filters.startYear !== filters.endYear}
            startYear={filters.startYear}
            endYear={filters.endYear}
            city={filters.city}
            territory={filters.territory}
            faixaPopulacional={filters.faixaPopulacional}
            aglomerado={filters.aglomerado}
            gerencia={filters.gerencia}
            citiesList={filters.territory || filters.faixaPopulacional || filters.aglomerado || filters.gerencia ? [] : []}
            onDataFetched={setData}
            onError={setError}
            onLoading={setIsLoading}
            triggerFetch={shouldFetch}
            selectedFilters={filters.selectedFilters}
            paginationPage={0}
            paginationLimit={100}
          />
          {!isLoading && !error && data && title ? (
            <>
              <DataTable
                data={data.finalResult ? data.finalResult : data}
                municipioData={data.allResults && data.allResults.length > 0 ? data.allResults : []}
                isHistorical={filters.startYear !== filters.endYear}
                type={validType}
                isModalidadeSelected={false}
                isRegimeSelected={false}
                isFormacaoDocenteSelected={false}
                isCategoriaAdministrativaSelected={false}
                isFaixaEtariaSuperiorSelected={false}
                isOrganizacaoAcademicaSelected={false}
                isInstituicaoEnsinoSelected={false}
                isMunicipioSelected={false}
                title={title}
                showConsolidated={false}
                pagination={data.finalResult?.pagination || data.pagination}
                onPaginationChange={() => {}}
                fetchAllDataConfig={null}
              />

              {/* Ficha Técnica */}
              <Box sx={{ marginTop: 6, padding: 3, backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#333' }}>
                  Ficha Técnica
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Informações sobre a metodologia, fonte de dados, periodicidade e outras informações técnicas estarão disponíveis aqui.
                </Typography>
              </Box>
            </>
          ) : null}
      </div>
    </div>
  );
}

export default FilterComponent;