import { Button, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Select } from '../../../ui';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import { FaixaPopulacional, municipios, Regioes } from '../../../../utils/citiesMapping';
import ApiContainer from './ApiComponent.jsx';
import ApiDataTable from './apiDataTable.jsx';
import { useTheme } from '@mui/material/styles';
import { Loading } from "../../../ui";

function ParentComponent() {
  const yearLimits = useMemo(() => ({
    enrollment: { min: 2007, max: 2024 },
    'school/count': { min: 2007, max: 2024 },
    class: { min: 2007, max: 2024 },
    teacher: { min: 2007, max: 2024 },
    auxiliar: { min: 2007, max: 2024 },
    employees: { min: 2007, max: 2023 }
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
  const [isVinculoSelected, setIsVinculoSelected] = useState(false);
  const [isFormacaoDocenteSelected, setIsFormacaoDocenteSelected] = useState(false);
  const [isFaixaEtariaSelected, setIsFaixaEtariaSelected] = useState(false);
  const [displayHistorical, setDisplayHistorical] = useState(false);
  const [year, setYear] = useState(yearLimits.enrollment.max);
  const [filteredYear, setFilteredYear] = useState(null);
  const [startYear, setStartYear] = useState(yearLimits.enrollment.min);
  const [endYear, setEndYear] = useState(yearLimits.enrollment.max);

  // Função para obter os limites de anos
  const getYearLimits = useMemo(() => {
    if (type === 'teacher' && selectedFilters.some(filter => filter.value === 'formacaoDocente')) {
      return { min: 2012, max: 2020 };
    }
    return yearLimits[type] || { min: 2007, max: 2022 };
  }, [type, selectedFilters, yearLimits]);

  // Usar getYearLimits para yearOptions
  const yearOptions = useMemo(() => {
    return Array.from(
      { length: getYearLimits.max - getYearLimits.min + 1 },
      (_, i) => getYearLimits.min + i
    ).map((year) => ({
      value: year,
      label: year.toString(),
    }));
  }, [getYearLimits]);

  // Atualizar os anos quando os limites mudarem
  useEffect(() => {
    setYear(getYearLimits.max);
    setStartYear(getYearLimits.min);
    setEndYear(getYearLimits.max);
  }, [getYearLimits]);



  const handleFilterClick = () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    // Limpar o título antes de definir um novo
    setTitle('');

    setIsHistorical(displayHistorical);
    setFilteredType(type);
    setFilteredYear(year);

    // Improved title generation logic
    const yearDisplay = displayHistorical ? `${startYear}-${endYear}` : year;

    // Get the city name if a city is selected
    let locationName = "Piauí";
    if (city) {
      const selectedCity = municipios[city];
      if (selectedCity) {
        locationName = selectedCity.nomeMunicipio;
      }
    }

    // Adicionar informações sobre os filtros selecionados
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

    // Adicionar filtros adicionais selecionados
    if (selectedFilters.length > 0) {
      const filterNames = selectedFilters.map(filter => {
        switch(filter.value) {
          case 'etapa': return 'Etapa de Ensino';
          case 'localidade': return 'Localidade';
          case 'dependencia': return 'Dependência Administrativa';
          case 'vinculo': return 'Vínculo Funcional';
          case 'formacaoDocente': return 'Formação Docente';
          case 'faixaEtaria': return 'Faixa Etária';
          default: return filter.value;
        }
      });
      filterInfo.push(`Filtros: ${filterNames.join(', ')}`);
    }

    // Construir o título completo
    let fullTitle = `${titleMapping[type]} - ${locationName} (${yearDisplay})`;

    // Adicionar informações de filtro se houver
    if (filterInfo.length > 0) {
      fullTitle += ` | ${filterInfo.join(' | ')}`;
    }

    setTitle(type ? fullTitle : '');

    setIsEtapaSelected(selectedFilters.some(filter => filter.value === 'etapa'));
    setIsLocalidadeSelected(selectedFilters.some(filter => filter.value === 'localidade'));
    setIsDependenciaSelected(selectedFilters.some(filter => filter.value === 'dependencia'));
    setIsVinculoSelected(selectedFilters.some(filter => filter.value === 'vinculo'));
    setIsFormacaoDocenteSelected(selectedFilters.some(filter => filter.value === 'formacaoDocente'));
    setIsFaixaEtariaSelected(selectedFilters.some(filter => filter.value === 'faixaEtaria'));
  };

  const handleClearFilters = () => {
    setDisplayHistorical(false);
    setIsHistorical(false);
    setType('enrollment');
    setFilteredType('enrollment');
    const limits = yearLimits['enrollment']; // usando enrollment pois é o tipo padrão
    setStartYear(limits.min);
    setEndYear(limits.max);
    setYear(limits.max);
    setFilteredYear(null);
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
    setIsVinculoSelected(false);
    setIsFormacaoDocenteSelected(false);
    setIsFaixaEtariaSelected(false);
  };

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
    const matchesGerencia = !gerencia || cityGerencia === gerencia;

    // Retorna true apenas se TODAS as condições selecionadas são atendidas
    return matchesTerritory && matchesFaixaPopulacional && matchesAglomerado && matchesGerencia;
  });

  const titleMapping = {
    enrollment: "Número de matrículas",
    "school/count": "Número de escolas",
    class: "Número de turmas",
    teacher: "Número de docentes",
    //auxiliar: "Número de auxiliares docentes",
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

  const gerenciaOptions = [...new Set(Object.values(municipios).map(m => m.gerencia))]
    .flatMap(gerencia => gerencia.split(',').map(g => g.trim()))  // Separa os valores por vírgula
    .filter(Boolean)  // Remove valores vazios
    .sort((a, b) => parseInt(a) - parseInt(b))  // Ordenação numérica
    .map(gerencia => ({
      value: gerencia,
      label: 'Gerencia ' + gerencia.padStart(2, '0'),
    }));

  const aglomeradoOptions = [...new Set(Object.values(municipios).map(m => m.aglomerado))]
    .flatMap(aglomerado => aglomerado.split(',').map(a => a.trim()))  // Separa os valores por vírgula
    .filter(Boolean)  // Remove valores vazios
    .sort((a, b) => parseInt(a) - parseInt(b))  // Ordenação numérica
    .map(aglomerado => ({
      value: aglomerado,
      label: 'Aglomerado ' + aglomerado.padStart(2, '0'),
    }));

  const cityOptions = filteredCities.map(([key, { nomeMunicipio }]) => ({
    value: key,
    label: nomeMunicipio,
  }));

  const customStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const filterOptions = [
    { value: 'localidade', label: 'Localidade' },
    ...(type !== 'employees' ? [{ value: 'etapa', label: 'Etapa' }] : []),
    { value: 'dependencia', label: 'Dependência Administrativa' },
    ...(type === 'teacher' ? [{ value: 'vinculo', label: 'Vínculo Funcional' }] : []),
    ...(type === 'teacher' ? [{ value: 'formacaoDocente', label: 'Formação Docente' }] : []),
  ];

  const theme = useTheme();

  return (
    <div className="app-container">
      <div className="filter-container">
        <div className="filter-grid">
          {/* Tipo - Primeira coluna, primeira linha */}
          <div className="filter-municipio">
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

          {/* Ano - Segunda e terceira colunas, primeira linha */}
          <div className="filter-territorio">
            <div className="flex items-center gap-4">
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
            
              {displayHistorical ? (
                <div className="flex gap-3 flex-1">
                  <div className="flex-1">
                    <label htmlFor="startYearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano Inicial:</label>
                    <Select
                      id="startYearSelect"
                      value={yearOptions.find(option => option.value === startYear)}
                      onChange={(selectedOption) => {
                        setStartYear(selectedOption.value);
                        if (selectedOption.value > endYear) {
                          setEndYear(selectedOption.value);
                        }
                      }}
                      options={yearOptions}
                      placeholder="Ano Inicial"
                      size="xs"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="endYearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano Final:</label>
                    <Select
                      id="endYearSelect"
                      value={yearOptions.find(option => option.value === endYear)}
                      onChange={(selectedOption) => setEndYear(selectedOption.value)}
                      options={yearOptions.filter(option => option.value >= startYear)}
                      placeholder="Ano Final"
                      size="xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <label htmlFor="yearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano:</label>
                  <Select
                    id="yearSelect"
                    value={yearOptions.find(option => option.value === year)}
                    onChange={(selectedOption) => setYear(selectedOption.value)}
                    options={yearOptions}
                    placeholder="Ano"
                    size="xs"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Território - Primeira coluna, segunda linha */}
          <div className="filter-faixa">
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
            />
          </div>

          {/* Faixa Populacional - Segunda coluna, segunda linha */}
          <div className="filter-aglomerado">
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
            />
          </div>

          {/* Aglomerado - Terceira coluna, segunda linha */}
          <div className="filter-gerencia">
            <Select
              id="aglomeradoSelect"
              value={aglomeradoOptions.find(option => option.value === aglomerado) || null}
              onChange={(selectedOption) => setAglomerado(selectedOption ? selectedOption.value : '')}
              options={aglomeradoOptions}
              placeholder="Aglomerado"
              size="xs"
            />
          </div>

          {/* Gerência - Primeira coluna, terceira linha */}
          <div className="filter-ano-inicial">
            <Select
              id="gerenciaSelect"
              value={gerenciaOptions.find(option => option.value === gerencia) || null}
              onChange={(selectedOption) => setGerencia(selectedOption ? selectedOption.value : '')}
              options={gerenciaOptions}
              placeholder="Gerencia"
              size="xs"
            />
          </div>

          {/* Cidade - Segunda coluna, terceira linha */}
          <div className="filter-ano-final">
            <Select
              id="citySelect"
              value={cityOptions.find(option => option.value === city) || null}
              onChange={(selectedOption) => setCity(selectedOption ? selectedOption.value : '')}
              options={cityOptions}
                            placeholder="Cidade"
              size="xs"
            />
          </div>

          {/* Filtros Múltiplos - Terceira coluna, terceira linha */}
          <div className="filter-button-container">
            <div style={{ marginBottom: '10px' }}>
              <Select
                id="multiFilterSelect"
                value={selectedFilters}
                onChange={(newValue, actionMeta) => {
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
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleFilterClick}
                className="filter-button"
              >
                Filtrar
              </Button>

              <Button
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#000',
                }}
                variant="contained"
                onClick={handleClearFilters}
                className="filter-button"
              >
                Limpar
              </Button>
            </div>
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
        type={filteredType}
        year={filteredYear || year}
        isHistorical={isHistorical}
        startYear={startYear}
        endYear={endYear}
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
        <ApiDataTable
          data={data.finalResult ? data.finalResult : data}
          municipioData={data.allResults && data.allResults.length > 0 ? data.allResults : []}
          isEtapaSelected={isEtapaSelected}
          isLocalidadeSelected={isLocalidadeSelected}
          isDependenciaSelected={isDependenciaSelected}
          isVinculoSelected={isVinculoSelected}
          isFaixaEtariaSelected={isFaixaEtariaSelected}
          isHistorical={isHistorical}
          type={filteredType}
          isFormacaoDocenteSelected={isFormacaoDocenteSelected}
          year={filteredYear || year}
          title={title} // Passando o título para o ApiDataTable
        />
      ) : null}
    </div>
  );
}

export default ParentComponent;