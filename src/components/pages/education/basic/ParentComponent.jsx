import { Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import { FaixaPopulacional, municipios, Regioes } from '../../../../utils/citiesMapping';
import { Loading, Select } from '../../../ui';
import ApiContainer from './ApiComponent.jsx';
import ApiDataTable from './apiDataTable.jsx';

function ParentComponent() {
  const apiRef = useRef();
  const theme = useTheme();
  
  const yearLimits = useMemo(() => ({
    enrollment: { min: 2007, max: 2024 },
    'school/count': { min: 2007, max: 2024 },
    class: { min: 2007, max: 2024 },
    teacher: { min: 2021, max: 2024 },
    auxiliar: { min: 2007, max: 2024 },
    employees: { min: 2007, max: 2024 }
  }), []);

  // Estados principais
  const [type, setType] = useState('enrollment');
  const [filteredType, setFilteredType] = useState('enrollment');
  const [displayHistorical, setDisplayHistorical] = useState(false);
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
  const [showConsolidated, setShowConsolidated] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [yearRange, setYearRange] = useState([2007, 2024]);

  // Estados para rastrear quais filtros foram aplicados
  const [isEtapaSelected, setIsEtapaSelected] = useState(false);
  const [isLocalidadeSelected, setIsLocalidadeSelected] = useState(false);
  const [isDependenciaSelected, setIsDependenciaSelected] = useState(false);
  const [isHistorical, setIsHistorical] = useState(false);
  const [filteredYear, setFilteredYear] = useState(null);

  const getYearLimits = useMemo(() => {
    return yearLimits[type] || { min: 2007, max: 2024 };
  }, [type, yearLimits]);

  // Sincronizar range slider com limites de ano
  useEffect(() => {
    setYearRange([getYearLimits.min, getYearLimits.max]);
  }, [getYearLimits]);

  const filteredCities = Object.entries(municipios).filter(([, {
    territorioDesenvolvimento,
    faixaPopulacional: cityFaixaPopulacional,
    aglomerado: cityAglomerado,
    gerencia: cityGerencia
  }]) => {
    const matchesTerritory = !territory || territorioDesenvolvimento === Regioes[territory];
    const matchesFaixaPopulacional = !faixaPopulacional || cityFaixaPopulacional === FaixaPopulacional[faixaPopulacional];
    const matchesAglomerado = !aglomerado || cityAglomerado === aglomerado;
    const matchesGerencia = !gerencia || cityGerencia.split(',').map(g => g.trim()).includes(gerencia);

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
      label: 'Gerencia ' + gerencia.padStart(2, '0'),
    }));

  const aglomeradoOptions = [...new Set(Object.values(municipios).flatMap(m => String(m.aglomerado).split(',').map(a => a.trim())).filter(Boolean))]
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(aglomerado => ({
      value: aglomerado,
      label: 'Aglomerado ' + aglomerado.padStart(2, '0'),
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

  const handleFilterClick = () => {
    setError(null);
    setData(null);
    setTitle('');
    setFilteredType(type);

    const [startYear, endYear] = yearRange;
    const isHist = displayHistorical && startYear !== endYear;
    const yearDisplay = isHist ? `${startYear}-${endYear}` : startYear;
    
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

    setIsHistorical(isHist);
    setFilteredYear(startYear);
    setIsEtapaSelected(selectedFilters.some(filter => filter.value === 'etapa'));
    setIsLocalidadeSelected(selectedFilters.some(filter => filter.value === 'localidade'));
    setIsDependenciaSelected(selectedFilters.some(filter => filter.value === 'dependencia'));

    if (apiRef.current) {
      apiRef.current.fetchData({
        year: startYear,
        isHistorical: isHist,
        startYear,
        endYear,
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
    setType('enrollment');
    setFilteredType('enrollment');
    setYearRange([2007, 2024]);
    setCity('');
    setTerritory('');
    setFaixaPopulacional('');
    setAglomerado('');
    setGerencia('');
    setData(null);
    setError(null);
    setTitle('');
    setSelectedFilters([]);
    setShowConsolidated(false);
    setFiltersExpanded(false);
    setIsEtapaSelected(false);
    setIsLocalidadeSelected(false);
    setIsDependenciaSelected(false);
    setIsHistorical(false);
    setFilteredYear(null);
  };

  return (
    <div className="app-container">
      <div className="flex flex-col gap-4 p-0 m-0">
        {/* Linha 1: Tipo + Botão de Toggle de Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="md:col-span-1">
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

          <div className="md:col-span-2 flex items-end gap-3">
            <div className="flex-1">
              <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={displayHistorical}
                  onChange={(e) => {
                    setDisplayHistorical(e.target.checked);
                    setSelectedFilters([]);
                  }}
                  className="cursor-pointer"
                />
                <span className="font-medium text-gray-700">Série Histórica</span>
              </label>
            </div>

            <Button
              variant="outlined"
              size="small"
              startIcon={filtersExpanded ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              sx={{
                minWidth: 'auto',
                whiteSpace: 'nowrap',
                height: 'fit-content',
              }}
            >
              {filtersExpanded ? 'Menos Filtros' : 'Mais Filtros'}
            </Button>
          </div>
        </div>

        {/* Linha 2: Filtros Colapsáveis */}
        <Collapse in={filtersExpanded} timeout="auto" unmountOnExit>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Território:</label>
              <Select
                id="territorySelect"
                value={territoryOptions.find(option => option.value === territory) || null}
                onChange={(selectedOption) => {
                  setTerritory(selectedOption ? selectedOption.value : '');
                  setCity('');
                }}
                options={territoryOptions}
                placeholder="Território de Desenvolvimento"
                size="xs"
                isClearable={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faixa Populacional:</label>
              <Select
                id="faixaPopulacionalSelect"
                value={faixaPopulacionalOptions.find(option => option.value === faixaPopulacional) || null}
                onChange={(selectedOption) => {
                  setFaixaPopulacional(selectedOption ? selectedOption.value : '');
                  setCity('');
                }}
                options={faixaPopulacionalOptions}
                placeholder="Faixa Populacional"
                size="xs"
                isClearable={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aglomerado:</label>
              <Select
                id="aglomeradoSelect"
                value={aglomeradoOptions.find(option => option.value === aglomerado) || null}
                onChange={(selectedOption) => setAglomerado(selectedOption ? selectedOption.value : '')}
                options={aglomeradoOptions}
                placeholder="Aglomerado - AG"
                size="xs"
                isClearable={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gerência:</label>
              <Select
                id="gerenciaSelect"
                value={gerenciaOptions.find(option => option.value === gerencia) || null}
                onChange={(selectedOption) => setGerencia(selectedOption ? selectedOption.value : '')}
                options={gerenciaOptions}
                placeholder="Gerência Regional de Ensino - GRE"
                size="xs"
                isClearable={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Município:</label>
              <Select
                id="citySelect"
                value={cityOptions.find(option => option.value === city) || null}
                onChange={(selectedOption) => setCity(selectedOption ? selectedOption.value : '')}
                options={cityOptions}
                placeholder="Município"
                size="xs"
                isClearable={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filtros:</label>
              <Select
                id="multiFilterSelect"
                value={selectedFilters}
                onChange={(newValue) => {
                  if (displayHistorical) {
                    setSelectedFilters(newValue.slice(-1));
                  } else if (newValue.length <= 2) {
                    setSelectedFilters(newValue);
                  } else {
                    setSelectedFilters(newValue.slice(-2));
                  }
                }}
                options={filterOptions}
                isMulti
                placeholder={displayHistorical ? "Selecione 1 filtro" : "Selecione até 2 filtros"}
                size="xs"
              />
            </div>
          </div>
        </Collapse>

        {/* Linha 3: Range Slider de Anos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <YearRangeSlider
              minYear={getYearLimits.min}
              maxYear={getYearLimits.max}
              value={yearRange}
              onChange={setYearRange}
            />
          </div>
        </div>

        {/* Linha 4: Botões de Ação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 flex flex-col sm:flex-row gap-3 justify-end items-center">
            {(territory || faixaPopulacional || aglomerado || gerencia) && (isEtapaSelected || isLocalidadeSelected || isDependenciaSelected) && (
              <div className="flex items-center gap-2">
                <Switch
                  checked={showConsolidated}
                  onChange={(e) => setShowConsolidated(e.target.checked)}
                  color="primary"
                  size="small"
                />
                <label className="text-sm font-medium text-gray-700">Dados consolidados</label>
              </div>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleFilterClick}
              className="w-full sm:w-auto"
            >
              Mostrar Resultados
            </Button>

            <Button
              variant="contained"
              onClick={handleClearFilters}
              className="w-full sm:w-auto"
              sx={{
                backgroundColor: '#f0f0f0',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            >
              Limpar
            </Button>
          </div>
        </div>
      </div>

      {isLoading && <Loading />}

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
          Selecione os filtros desejados e clique em "Mostrar Resultados" para montar uma consulta.
        </Typography>
      )}

      {!isLoading && !error && data && title && (
        <div>
          <h2>{title}</h2>
        </div>
      )}

      <ApiContainer
        ref={apiRef}
        type={filteredType}
        onDataFetched={setData}
        onError={setError}
        onLoading={setIsLoading}
        selectedFilters={selectedFilters}
      />

      {!isLoading && !error && data && title && (
        <ApiDataTable
          data={data.finalResult ? data.finalResult : data}
          municipioData={data.allResults && data.allResults.length > 0 ? data.allResults : []}
          isEtapaSelected={isEtapaSelected}
          isLocalidadeSelected={isLocalidadeSelected}
          isDependenciaSelected={isDependenciaSelected}
          isHistorical={isHistorical}
          type={filteredType}
          year={filteredYear}
          title={title}
          showConsolidated={showConsolidated}
        />
      )}
    </div>
  );
}

export default ParentComponent;