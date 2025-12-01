import { Button, Switch, Typography, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useMemo, useState } from 'react';
// import { exportHigherEducationTable } from '../../../../services/exportTableService.jsx';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import { FaixaPopulacional, municipios, Regioes } from '../../../../utils/citiesMapping';
import { Loading, Select } from '../../../ui';
import YearRangeSlider from '../../../ui/YearRangeSlider';
import ApiHigherContainer from './ApiHigherComponent.jsx';
import DataTable from './DataTable.jsx';

function FilterComponent() {
  const [type, setType] = useState('university/count');
  const [isHistorical, setIsHistorical] = useState(false);
  const [city, setCity] = useState('');
  const [territory, setTerritory] = useState('');
  const [faixaPopulacional, setFaixaPopulacional] = useState('');
  const [aglomerado, setAglomerado] = useState('');
  const [gerencia, setGerencia] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [displayHistorical, setDisplayHistorical] = useState(false);
  const [isModalidadeSelected, setIsModalidadeSelected] = useState(false);
  const [isRegimeSelected, setIsRegimeSelected] = useState(false);
  const [isFormacaoDocenteSelected, setIsFormacaoDocenteSelected] = useState(false);
  const [isCategoriaAdministrativaSelected, setIsCategoriaAdministrativaSelected] = useState(false);
  const [isFaixaEtariaSuperiorSelected, setIsFaixaEtariaSuperiorSelected] = useState(false);
  const [isOrganizacaoAcademicaSelected, setIsOrganizacaoAcademicaSelected] = useState(false);
  const [isInstituicaoEnsinoSelected, setIsInstituicaoEnsinoSelected] = useState(false);
  const [isMunicipioSelected, setIsMunicipioSelected] = useState(false);
  const [showConsolidated, setShowConsolidated] = useState(false);

  // Estado para controlar se os filtros estão expandidos
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Estado para o range slider
  const [yearRange, setYearRange] = useState([2020, 2023]);

  // Estados para armazenar os filtros aplicados na última busca
  const [appliedTerritory, setAppliedTerritory] = useState('');
  const [appliedFaixaPopulacional, setAppliedFaixaPopulacional] = useState('');
  const [appliedAglomerado, setAppliedAglomerado] = useState('');
  const [appliedGerencia, setAppliedGerencia] = useState('');
  const [appliedSelectedFilters, setAppliedSelectedFilters] = useState([]);


  const yearLimits = useMemo(() => ({
    'university/count': { min: 2020, max: 2023 },
    'university_enrollment': { min: 2020, max: 2023 },
    'university_teacher': { min: 2020, max: 2023 },
    'course_count': { min: 2020, max: 2023 }
  }), []);

  const getYearLimits = useMemo(() => {
    return yearLimits[type] || { min: 2000, max: 2023 };
  }, [type, yearLimits]);

  const yearOptions = useMemo(() => {
    return Array.from(
      { length: getYearLimits.max - getYearLimits.min + 1 },
      (_, i) => getYearLimits.min + i
    ).map((year) => ({
      value: year,
      label: year.toString(),
    }));
  }, [getYearLimits]);

  const [startYear, setStartYear] = useState(yearLimits['university/count'].min);
  const [endYear, setEndYear] = useState(yearLimits['university/count'].max);
  const [year, setYear] = useState(yearLimits['university/count'].max);

  useEffect(() => {
    setYear(getYearLimits.max);
    setStartYear(getYearLimits.min);
    setEndYear(getYearLimits.max);
    setYearRange([getYearLimits.min, getYearLimits.max]);
  }, [getYearLimits]);

  const handleFilterClick = () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setTitle('');

    // Determina se é série histórica baseado no yearRange
    const isHistoricalRange = yearRange[0] !== yearRange[1];
    const yearDisplay = isHistoricalRange ? `${yearRange[0]}-${yearRange[1]}` : yearRange[0];

    setIsHistorical(isHistoricalRange);
    setDisplayHistorical(isHistoricalRange);

    let locationName = "Piauí";
    if (city) {
      const selectedCity = municipios[city];
      if (selectedCity) {
        locationName = selectedCity.nomeMunicipio;
      }
    }

    let filterInfo = [];

    // Adicionar território se selecionado
    if (territory) {
      filterInfo.push(`Território: ${Regioes[territory]}`);
    }

    // Adicionar faixa populacional se selecionada
    if (faixaPopulacional) {
      filterInfo.push(`Faixa Populacional: ${FaixaPopulacional[faixaPopulacional]}`);
    }

    // Adicionar aglomerado se selecionado
    if (aglomerado) {
      filterInfo.push(`Aglomerado: ${aglomerado}`);
    }

    // Adicionar gerência se selecionada
    if (gerencia) {
      filterInfo.push(`Gerência: ${gerencia}`);
    }

    if (selectedFilters.length > 0) {
      const filterNames = selectedFilters.map(filter => {
        switch(filter.value) {
          case 'modalidade': return 'Modalidade';
          case 'regimeDeTrabalho': return 'Regime de Trabalho';
          case 'formacaoDocente': return 'Formação Docente';
          case 'categoriaAdministrativa': return 'Categoria Administrativa';
          case 'faixaEtariaSuperior': return 'Faixa Etária';
          case 'organizacaoAcademica': return 'Organização Acadêmica';
          case 'instituicaoEnsino': return 'Instituição de Ensino';
          case 'municipio': return 'Município';
          default: return filter.value;
        }
      });
      filterInfo.push(`Filtros: ${filterNames.join(', ')}`);
    }

    let fullTitle = `${titleMapping[type]} - ${locationName} (${yearDisplay})`;

    if (filterInfo.length > 0) {
      fullTitle += ` | ${filterInfo.join(' | ')}`;
    }

    setTitle(type ? fullTitle : '');

    setIsModalidadeSelected(selectedFilters.some(filter => filter.value === 'modalidade'));
    setIsRegimeSelected(selectedFilters.some(filter => filter.value === 'regimeDeTrabalho'));
    setIsFormacaoDocenteSelected(selectedFilters.some(filter => filter.value === 'formacaoDocente'));
    setIsCategoriaAdministrativaSelected(selectedFilters.some(filter => filter.value === 'categoriaAdministrativa'));
    setIsFaixaEtariaSuperiorSelected(selectedFilters.some(filter => filter.value === 'faixaEtariaSuperior'));
    setIsOrganizacaoAcademicaSelected(selectedFilters.some(filter => filter.value === 'organizacaoAcademica'));
    setIsInstituicaoEnsinoSelected(selectedFilters.some(filter => filter.value === 'instituicaoEnsino'));
    setIsMunicipioSelected(selectedFilters.some(filter => filter.value === 'municipio'));

    // Armazenar os filtros aplicados na última busca
    setAppliedTerritory(territory);
    setAppliedFaixaPopulacional(faixaPopulacional);
    setAppliedAglomerado(aglomerado);
    setAppliedGerencia(gerencia);
    setAppliedSelectedFilters(selectedFilters);
  };

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
    setDisplayHistorical(false);
    setIsHistorical(false);
    setType('university/count');
    const limits = yearLimits['university/count'];
    setStartYear(limits.min);
    setEndYear(limits.max);
    setYear(limits.max);
    setYearRange([limits.min, limits.max]);
    setCity('');
    setTerritory('');
    setFaixaPopulacional('');
    setAglomerado('');
    setGerencia('');
    setData(null);
    setError(null);
    setTitle('');
    setSelectedFilters([]);

    // Limpar também os filtros aplicados
    setAppliedTerritory('');
    setAppliedFaixaPopulacional('');
    setAppliedAglomerado('');
    setAppliedGerencia('');
    setAppliedSelectedFilters([]);
  };

  const filterOptions = type === 'university_enrollment'
    ? [{ value: 'modalidade', label: 'Modalidade' }, { value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'faixaEtariaSuperior', label: 'Faixa Etária' },
       { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}, { value: 'instituicaoEnsino', label: 'Instituição de Ensino' }, { value: 'municipio', label: 'Município' }]
    : type === 'university_teacher'
    ? [{ value: 'regimeDeTrabalho', label: 'Regime de Trabalho' }, { value: 'formacaoDocente', label: 'Formação Docente' }, { value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}, { value: 'municipio', label: 'Município' }]
    : type === 'course_count'
    ?[{ value: 'modalidade', label: 'Modalidade' }, { value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}, { value: 'municipio', label: 'Município' }]
    : [{ value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}, { value: 'municipio', label: 'Município' }];

  const titleMapping = {
    "university/count": "Número de intituições de ensino superior",
    "university_enrollment": "Número de matrículas",
    "university_teacher": "Número de docentes",
    "course_count": "Número de cursos"
  };

  // Lógica de filtros dependentes - baseado nos filtros de localização
  const baseFilteredMunicipios = useMemo(() => {
    const territorioLabel = territory ? Regioes[territory] : null;
    const faixaLabel = faixaPopulacional ? FaixaPopulacional[faixaPopulacional] : null;

    return Object.values(municipios).filter((m) => {
      if (territorioLabel && m.territorioDesenvolvimento !== territorioLabel) return false;
      if (faixaLabel && m.faixaPopulacional !== faixaLabel) return false;
      if (aglomerado && String(m.aglomerado) !== String(aglomerado)) return false;
      if (gerencia) {
        const gerencias = String(m.gerencia).split(',').map((g) => g.trim());
        if (!gerencias.includes(String(gerencia))) return false;
      }
      return true;
    });
  }, [territory, faixaPopulacional, aglomerado, gerencia]);

  // Desabilitar outros filtros quando município específico é selecionado
  const otherLocalityDisabled = !!city;

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

  // Função para limpar filtros inválidos quando as opções mudam
  const useClearInvalidFilter = (value, setter, options) => {
    useEffect(() => {
      if (value && options.length > 0) {
        const exists = options.some((opt) => opt.value === value);
        if (!exists) {
          setter('');
        }
      }
    }, [value, setter, options]);
  };

  // Aplicar limpeza de filtros inválidos
  useClearInvalidFilter(city, setCity, filteredMunicipioOptions);
  useClearInvalidFilter(territory, setTerritory, filteredTerritorioOptions);
  useClearInvalidFilter(faixaPopulacional, setFaixaPopulacional, filteredFaixaPopulacionalOptions);
  useClearInvalidFilter(aglomerado, setAglomerado, filteredAglomeradoOptions);
  useClearInvalidFilter(gerencia, setGerencia, filteredGerenciaOptions);

  // Limpar filtros de localização quando um município específico é selecionado
  useEffect(() => {
    if (city) {
      setTerritory('');
      setFaixaPopulacional('');
      setAglomerado('');
      setGerencia('');
    }
  }, [city]);

  const filteredCities = Object.entries(municipios).filter(([key, {
    territorioDesenvolvimento,
    faixaPopulacional: cityFaixaPopulacional,
    aglomerado: cityAglomerado,
    gerencia: cityGerencia
  }]) => {
    // Verifica todas as condições selecionadas
    const matchesTerritory = !territory || territorioDesenvolvimento === Regioes[territory];
    const matchesFaixaPopulacional = !faixaPopulacional || cityFaixaPopulacional === FaixaPopulacional[faixaPopulacional];
    const matchesAglomerado = !aglomerado || cityAglomerado === aglomerado;

    // Para gerência, verificar se a gerencia selecionada está contida na string de gerencias da cidade
    // (considerando que uma cidade pode ter múltiplas gerencias separadas por vírgula)
    const matchesGerencia = !gerencia || cityGerencia.split(',').map(g => g.trim()).includes(gerencia);

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

  const theme = useTheme();

  return (
    <div className="app-container">
      <div className="flex flex-col gap-4 p-0 m-0">

          {/* Tipo + Filtros Múltiplos + Botão Mais Filtros - Primeira linha */}
          <div className="md:col-span-3">
            <div className="flex flex-col lg:flex-row items-end gap-4">
              <div className="w-full lg:flex-1">
                <label htmlFor="typeSelect" className="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
                <Select
                  id="typeSelect"
                  value={typeOptions.find(option => option.value === type)}
                  onChange={(selectedOption) => {
                    setType(selectedOption.value);
                    setSelectedFilters([]);
                    // Se mudou para docentes, garantir que não há filtros selecionados
                    if (selectedOption.value === 'university_teacher') {
                      setSelectedFilters([]);
                    }
                  }}
                  options={typeOptions}
                  placeholder="Selecione o tipo"
                  size="xs"
                />
              </div>

              <div className="w-full lg:flex-1">
                <label htmlFor="multiFilterSelect" className="block text-sm font-medium text-gray-700 mb-1">Filtros:</label>
                <Select
                  id="multiFilterSelect"
                  value={selectedFilters}
                  onChange={(newValue) => {
                    // Para docentes (university_teacher), permitir apenas um filtro por vez
                    if (type === 'university_teacher') {
                      setSelectedFilters(newValue.slice(-1)); // Manter apenas o último selecionado
                      return;
                    }

                    // Validação para impedir combinação de regime + formação docente (para outros tipos)
                    const hasRegime = newValue.some(filter => filter.value === 'regimeDeTrabalho');
                    const hasFormacao = newValue.some(filter => filter.value === 'formacaoDocente');

                    if (hasRegime && hasFormacao) {
                      // Se está tentando adicionar os dois, manter apenas o último selecionado
                      const lastSelected = newValue[newValue.length - 1];
                      if (lastSelected.value === 'regimeDeTrabalho') {
                        // Removeu formação docente, manter regime
                        setSelectedFilters(newValue.filter(f => f.value !== 'formacaoDocente'));
                      } else {
                        // Removeu regime, manter formação docente
                        setSelectedFilters(newValue.filter(f => f.value !== 'regimeDeTrabalho'));
                      }
                      return;
                    }

                    const isHistoricalRange = yearRange[0] !== yearRange[1];
                    if (isHistoricalRange) {
                      setSelectedFilters(newValue.slice(-1));
                    } else if (newValue.length <= 2) {
                      setSelectedFilters(newValue);
                    } else {
                      setSelectedFilters(newValue.slice(-2));
                    }
                  }}
                  options={filterOptions}
                  isMulti
                  placeholder={
                    type === 'university_teacher'
                      ? "Selecione 1 filtro (docentes)"
                      : yearRange[0] !== yearRange[1]
                        ? "Selecione 1 filtro"
                        : "Selecione até 2 filtros"
                  }
                  size="xs"
                />
              </div>

              {/* Botão de toggle para filtros adicionais */}
              <div className="w-full lg:w-auto">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={filtersExpanded ? <ExpandLess /> : <ExpandMore />}
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  sx={{
                    minWidth: 'auto',
                    padding: '8px 16px',
                    whiteSpace: 'nowrap',
                    height: 'fit-content',
                    mb: 0.5,
                    width: { xs: '100%', lg: 'auto' }
                  }}
                >
                  {filtersExpanded ? 'Menos Filtros' : 'Mais Filtros'}
                </Button>
              </div>
            </div>
          </div>

          {/* Filtros recolhíveis */}
          <Collapse in={filtersExpanded} timeout="auto" unmountOnExit>
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Território */}
                <div className="md:col-span-1">
                  <Select
                    id="territorySelect"
                    value={filteredTerritorioOptions.find(option => option.value === territory) || null}
                    onChange={(selectedOption) => {
                      setTerritory(selectedOption ? selectedOption.value : '');
                      setCity('');
                    }}
                    options={filteredTerritorioOptions}
                    placeholder="Território de Desenvolvimento"
                    size="xs"
                    isClearable={true}
                    disabled={otherLocalityDisabled}
                  />
                </div>

                {/* Faixa Populacional */}
                <div className="md:col-span-1">
                  <Select
                    id="faixaPopulacionalSelect"
                    value={filteredFaixaPopulacionalOptions.find(option => option.value === faixaPopulacional) || null}
                    onChange={(selectedOption) => {
                      setFaixaPopulacional(selectedOption ? selectedOption.value : '');
                      setCity('');
                    }}
                    options={filteredFaixaPopulacionalOptions}
                    placeholder="Faixa Populacional"
                    size="xs"
                    isClearable={true}
                    disabled={otherLocalityDisabled}
                  />
                </div>

                {/* Aglomerado */}
                <div className="md:col-span-1">
                  <Select
                    id="aglomeradoSelect"
                    value={filteredAglomeradoOptions.find(option => option.value === aglomerado) || null}
                    onChange={(selectedOption) => setAglomerado(selectedOption ? selectedOption.value : '')}
                    options={filteredAglomeradoOptions}
                    placeholder="Aglomerado - AG"
                    size="xs"
                    isClearable={true}
                    disabled={otherLocalityDisabled}
                  />
                </div>

                {/* Gerência */}
                <div className="md:col-span-1">
                  <Select
                    id="gerenciaSelect"
                    value={filteredGerenciaOptions.find(option => option.value === gerencia) || null}
                    onChange={(selectedOption) => setGerencia(selectedOption ? selectedOption.value : '')}
                    options={filteredGerenciaOptions}
                    placeholder="Gerência Regional de Ensino - GRE"
                    size="xs"
                    isClearable={true}
                    disabled={otherLocalityDisabled}
                  />
                </div>

                {/* Cidade */}
                <div className="md:col-span-1">
                  <Select
                    id="citySelect"
                    value={filteredMunicipioOptions.find(option => option.value === city) || null}
                    onChange={(selectedOption) => setCity(selectedOption ? selectedOption.value : '')}
                    options={filteredMunicipioOptions}
                    placeholder="Município"
                    size="xs"
                    isClearable={true}
                  />
                </div>
              </div>
            </div>
          </Collapse>

          {/* Período - Todas as colunas, terceira linha */}
          <div className="md:col-span-3">
            <YearRangeSlider
              minYear={getYearLimits.min}
              maxYear={getYearLimits.max}
              value={yearRange}
              onChange={setYearRange}
            />
          </div>

          {/* Botões - Ocupa todo o espaço da linha */}
          <div className="md:col-span-3 flex flex-col justify-end">
            <div className="flex flex-col sm:flex-row gap-3 justify-end items-end">
              {/* Toggle para modo consolidado (apenas quando há filtros territoriais combinados com outros filtros aplicados na última busca) */}
              {(appliedTerritory || appliedFaixaPopulacional || appliedAglomerado || appliedGerencia) && (isModalidadeSelected || isRegimeSelected || isFormacaoDocenteSelected || isCategoriaAdministrativaSelected || isFaixaEtariaSuperiorSelected || isOrganizacaoAcademicaSelected || isInstituicaoEnsinoSelected) && !isMunicipioSelected && (
                <div className="flex items-center space-x-2">
                  <label className="flex items-center pb-2 space-x-2 cursor-pointer">
                    <Switch
                      checked={showConsolidated}
                      onChange={(e) => setShowConsolidated(e.target.checked)}
                      color="primary"
                      size="small"
                      sx={{
                        '& .MuiSwitch-thumb': {
                          backgroundColor: showConsolidated ? '#1976d2' : '#fafafa',
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: showConsolidated ? '#1976d2' : '#ccc',
                        },
                      }}
                    />
                    <span className="text-gray-700">Mostrar dados consolidados</span>
                  </label>
                </div>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleFilterClick}
                className="w-full sm:w-auto"
              >
                Mostrar resultados
              </Button>

              {/* <Button
                variant="contained"
                color="success"
                onClick={handleExportTable}
                disabled={selectedFilters.length !== 1}
                startIcon={<DownloadIcon />}
                className="w-full sm:w-auto"
                title={selectedFilters.length !== 1 ? 'Selecione exatamente 1 filtro' : 'Exportar tabelão para Excel'}
              >
                Exportar Tabelão
              </Button> */}

              <Button
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#000',
                }}
                variant="contained"
                onClick={handleClearFilters}
                className="w-full sm:w-auto"
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>

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
          Selecione os filtros desejados e clique em "Filtrar" para montar uma consulta.
        </Typography>
      )}

      {!isLoading && !error && data && title ? (
        <div>
          <h2>{title}</h2>
        </div>
      ) : null}
      <ApiHigherContainer
        type={type}
        year={yearRange[0]}
        isHistorical={yearRange[0] !== yearRange[1]}
        startYear={yearRange[0]}
        endYear={yearRange[1]}
        city={city}
        territory={territory}
        faixaPopulacional={faixaPopulacional}
        aglomerado={aglomerado}
        gerencia={gerencia}
        citiesList={territory || faixaPopulacional || aglomerado || gerencia ? filteredCities : []}
        onDataFetched={setData}
        onError={setError}
        onLoading={setIsLoading}
        triggerFetch={isLoading}
        selectedFilters={selectedFilters}
      />
      {!isLoading && !error && data && title ? (
        <DataTable
          data={data.finalResult ? data.finalResult : data}
          municipioData={data.allResults && data.allResults.length > 0 ? data.allResults : []}
          isHistorical={yearRange[0] !== yearRange[1]}
          type={type}
          isModalidadeSelected={isModalidadeSelected}
          isRegimeSelected={isRegimeSelected}
          isFormacaoDocenteSelected={isFormacaoDocenteSelected}
          isCategoriaAdministrativaSelected={isCategoriaAdministrativaSelected}
          isFaixaEtariaSuperiorSelected={isFaixaEtariaSuperiorSelected}
          isOrganizacaoAcademicaSelected={isOrganizacaoAcademicaSelected}
          isInstituicaoEnsinoSelected={isInstituicaoEnsinoSelected}
          isMunicipioSelected={isMunicipioSelected}
          title={title}
          showConsolidated={showConsolidated}
        />
      ) : null}
    </div>
  );
}

export default FilterComponent;