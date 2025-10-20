import { Button, Switch, Typography, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import { FaixaPopulacional, municipios, Regioes } from '../../../../utils/citiesMapping';
import { Loading, Select } from '../../../ui';
import YearRangeSlider from '../../../ui/YearRangeSlider';
import ApiContainer from './ApiComponent.jsx';
import ApiDataTable from './apiDataTable.jsx';

function ParentComponent() {
  const apiRef = useRef();
  const yearLimits = useMemo(() => ({
    enrollment: { min: 2007, max: 2024 },
    'school/count': { min: 2007, max: 2024 },
    class: { min: 2007, max: 2024 },
    teacher: { min: 2021, max: 2024 },
    auxiliar: { min: 2007, max: 2024 },
    employees: { min: 2007, max: 2024 }
  }), []);

  const [type, setType] = useState('enrollment');
  const [filteredType, setFilteredType] = useState('enrollment');
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
  const [isEtapaSelected, setIsEtapaSelected] = useState(false);
  const [isLocalidadeSelected, setIsLocalidadeSelected] = useState(false);
  const [isDependenciaSelected, setIsDependenciaSelected] = useState(false);
  const [displayHistorical, setDisplayHistorical] = useState(false);
  const [showConsolidated, setShowConsolidated] = useState(false);
  const [year, setYear] = useState(yearLimits.enrollment.max);
  const [filteredYear, setFilteredYear] = useState(null);
  const [startYear, setStartYear] = useState(yearLimits.enrollment.min);
  const [endYear, setEndYear] = useState(yearLimits.enrollment.max);
  
  // Estado para controlar se os filtros estão expandidos
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  // Estado para o range slider
  const [yearRange, setYearRange] = useState([2007, 2024]);

  const getYearLimits = useMemo(() => {
    return yearLimits[type] || { min: 2007, max: 2022 };
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

  useEffect(() => {
    setYear(getYearLimits.max);
    setStartYear(getYearLimits.min);
    setEndYear(getYearLimits.max);
    setYearRange([getYearLimits.min, getYearLimits.max]);
  }, [getYearLimits]);

  const handleFilterClick = () => {
    setError(null);
    setData(null);
    setTitle('');
    setFilteredType(type);

    // Determina se é série histórica baseado no yearRange
    const isHistoricalRange = yearRange[0] !== yearRange[1];
    const yearDisplay = isHistoricalRange ? `${yearRange[0]}-${yearRange[1]}` : yearRange[0];
    let locationName = "Piauí";
    if (city) {
      const selectedCity = municipios[city];
      if (selectedCity) {
        locationName = selectedCity.nomeMunicipio;
      }
    }

    let filterInfo = [];
    if (territory) {
      filterInfo.push(`Território: ${Regioes[territory]}`);
    }
    if (faixaPopulacional) {
      filterInfo.push(`Faixa Populacional: ${FaixaPopulacional[faixaPopulacional]}`);
    }
    if (aglomerado) {
      filterInfo.push(`Aglomerado: ${aglomerado}`);
    }
    if (gerencia) {
      filterInfo.push(`Gerência: ${gerencia}`);
    }
    if (selectedFilters.length > 0) {
      const filterNames = selectedFilters.map(filter => {
        switch(filter.value) {
          case 'etapa': return 'Etapa de Ensino';
          case 'localidade': return 'Localidade';
          case 'dependencia': return 'Dependência Administrativa';
          default: return filter.value;
        }
      });
      filterInfo.push(`Filtros: ${filterNames.join(', ')}`);
    }

    let fullTitle = `${titleMapping[type]} - ${locationName} (${yearDisplay})`;
    if (filterInfo.length > 0) {
      fullTitle += ` | ${filterInfo.join(' | ')}`;
    }
    setTitle(fullTitle);
    
    setIsHistorical(isHistoricalRange);
    setDisplayHistorical(isHistoricalRange);
    setFilteredYear(yearRange[0]);
    setIsEtapaSelected(selectedFilters.some(filter => filter.value === 'etapa'));
    setIsLocalidadeSelected(selectedFilters.some(filter => filter.value === 'localidade'));
    setIsDependenciaSelected(selectedFilters.some(filter => filter.value === 'dependencia'));

    if (apiRef.current) {
      apiRef.current.fetchData({
        year: yearRange[0],
        isHistorical: isHistoricalRange,
        startYear: yearRange[0],
        endYear: yearRange[1],
        city,
        territory,
        faixaPopulacional,
        aglomerado,
        gerencia,
        citiesList: territory || faixaPopulacional || aglomerado || gerencia ? filteredCities : [],
      });
    }
  };

  const handleClearFilters = () => {
    setDisplayHistorical(false);
    setIsHistorical(false);
    setType('enrollment');
    setFilteredType('enrollment');
    const limits = yearLimits['enrollment'];
    setStartYear(limits.min);
    setEndYear(limits.max);
    setYear(limits.max);
    setFilteredYear(null);
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
    setIsEtapaSelected(false);
    setIsLocalidadeSelected(false);
    setIsDependenciaSelected(false);
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

  const filteredCities = Object.entries(municipios).filter(([, {
    territorioDesenvolvimento,
    faixaPopulacional: cityFaixaPopulacional,
    aglomerado: cityAglomerado,
    gerencia: cityGerencia
  }]) => {
    const matchesTerritory = !territory || territorioDesenvolvimento === Regioes[territory];
    const matchesFaixaPopulacional = !faixaPopulacional || cityFaixaPopulacional === FaixaPopulacional[faixaPopulacional];
    const matchesAglomerado = !aglomerado || cityAglomerado === aglomerado;

    // Para gerência, verificar se a gerencia selecionada está contida na string de gerencias da cidade
    // (considerando que uma cidade pode ter múltiplas gerencias separadas por vírgula)
    const matchesGerencia = !gerencia || cityGerencia.split(',').map(g => g.trim()).includes(gerencia);

    // Retorna true apenas se TODAS as condições selecionadas são atendidas
    return matchesTerritory && matchesFaixaPopulacional && matchesAglomerado && matchesGerencia;
  });

  const titleMapping = {
    enrollment: "Número de matrículas",
    "school/count": "Número de escolas",
    class: "Número de turmas",
    teacher: "Número de docentes",
    employees: "Número de funcionários"
  };

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

  const gerenciaOptions = [...new Set(Object.values(municipios).flatMap(m => String(m.gerencia).split(',').map(g => g.trim())).filter(Boolean))]
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(gerencia => ({
      value: gerencia,
      label: gerencia + 'ª GRE',
    }));

  const aglomeradoOptions = [...new Set(Object.values(municipios).flatMap(m => String(m.aglomerado).split(',').map(a => a.trim())).filter(Boolean))]
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(aglomerado => ({
      value: aglomerado,
      label: 'AG ' + aglomerado,
    }));

  const cityOptions = filteredCities.map(([key, { nomeMunicipio }]) => ({
    value: key,
    label: nomeMunicipio,
  }));

  const filterOptions = [
    { value: 'localidade', label: 'Localidade' },
    ...(type !== 'employees' ? [{ value: 'etapa', label: 'Etapa' }] : []),
    { value: 'dependencia', label: 'Dependência Administrativa' },
  ];

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
                  onChange={(newValue, actionMeta) => {
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
                  placeholder={yearRange[0] !== yearRange[1] ? "Selecione 1 filtro" : "Selecione até 2 filtros"}
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
              {/* Toggle para modo consolidado (apenas quando há filtros territoriais combinados com outros filtros) */}
              {(territory || faixaPopulacional || aglomerado || gerencia) && (isEtapaSelected || isLocalidadeSelected || isDependenciaSelected) && (
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


       {isLoading && (
        <Loading />
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <hr className="divider" />

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
      <ApiContainer
        ref={apiRef}
        type={filteredType}
        onDataFetched={setData}
        onError={setError}
        onLoading={setIsLoading}
        selectedFilters={selectedFilters}
      />
      {!isLoading && !error && data && title ? (
        <ApiDataTable
          data={data.finalResult ? data.finalResult : data}
          municipioData={data.allResults && data.allResults.length > 0 ? data.allResults : []}
          isEtapaSelected={isEtapaSelected}
          isLocalidadeSelected={isLocalidadeSelected}
          isDependenciaSelected={isDependenciaSelected}
          isHistorical={isHistorical}
          type={filteredType}
          year={filteredYear || year}
          title={title} // Passando o título para o ApiDataTable
          showConsolidated={showConsolidated}
        />
      ) : null}
    </div>
  );
}

export default ParentComponent;
