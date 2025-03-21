import { Button } from '@mui/material'; // Import the new component
import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select'; // Import react-select
import '../../../style/RevenueTableContainer.css'; // Importar o CSS para reutilizar estilos
import '../../../style/TableFilters.css';
import { FaixaPopulacional, municipios, Regioes } from '../../../utils/citiesMapping';
import ApiContainer from './ApiComponent';
import ApiDataTable from './apiDataTable';

function ParentComponent() {
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

  const yearLimits = useMemo(() => ({
    enrollment: { min: 2007, max: 2023 },
    'school/count': { min: 2007, max: 2023 },
    class: { min: 2007, max: 2023 },
    teacher: { min: 2007, max: 2020 },
    auxiliar: { min: 2007, max: 2020 },
    employees: { min: 2007, max: 2023 },
    out_of_school: { min: 2007, max: 2015 },
    liquid_enrollment_ratio: { min: 2007, max: 2015 },
    gloss_enrollment_ratio: { min: 2007, max: 2015 },
    rate_school_new: { min: 2019, max: 2023 }
  }), []);

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

  const [startYear, setStartYear] = useState(yearLimits.enrollment.min);
  const [endYear, setEndYear] = useState(yearLimits.enrollment.max);
  const [year, setYear] = useState(yearLimits.enrollment.max);

  // Atualizar os anos quando os limites mudarem
  useEffect(() => {
    setYear(getYearLimits.max);
    setStartYear(getYearLimits.min);
    setEndYear(getYearLimits.max);
  }, [getYearLimits]);

  // Adicionar este useEffect para limpar filtros desabilitados quando o tipo muda
  useEffect(() => {
    // Limpar filtros que não se aplicam ao tipo selecionado
    if (type === 'out_of_school' || type === 'liquid_enrollment_ratio' ||
        type === 'gloss_enrollment_ratio' || type === 'rate_school_new') {
      // Limpar filtros geográficos para tipos que só funcionam a nível estadual
      setCity('');
      setTerritory('');
      setFaixaPopulacional('');
      setAglomerado('');
      setGerencia('');
    }

    // Ajustar filtros específicos para cada tipo
    if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
      // Garantir que etapa esteja selecionada
      const etapaFilter = { value: 'etapa', label: 'Etapa de Ensino (Obrigatório)' };
      if (!selectedFilters.some(filter => filter.value === 'etapa')) {
        setSelectedFilters([etapaFilter]);
      }
    } else if (type === 'rate_school_new') {
      // Garantir que faixa etária esteja selecionada
      const faixaEtariaFilter = { value: 'faixaEtaria', label: 'Faixa Etária (Obrigatório)' };
      if (!selectedFilters.some(filter => filter.value === 'faixaEtaria')) {
        setSelectedFilters([faixaEtariaFilter]);
      }
    }
  }, [type, selectedFilters]);

  const handleFilterClick = () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    // Limpar o título antes de definir um novo
    setTitle('');

    setIsHistorical(displayHistorical);
    setFilteredType(type);

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
    auxiliar: "Número de auxiliares docentes",
    employees: "Número de funcionários",
    out_of_school: "Número de alunos fora da escola",
    liquid_enrollment_ratio: "Taxa de matrículas líquidas",
    gloss_enrollment_ratio: "Taxa de matrículas brutas",
    rate_school_new: "Taxa de atendimento educacional"
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

  const filterOptions = type === 'out_of_school'
    ? [{ value: 'localidade', label: 'Localidade' }]
    : type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio'
    ? [
        { value: 'localidade', label: 'Localidade' },
        { value: 'etapa', label: 'Etapa (Obrigatório)' }
      ]
    : type === 'rate_school_new'
    ? [{ value: 'faixaEtaria', label: 'Faixa Etária (Obrigatório)' }]
    : [
        { value: 'localidade', label: 'Localidade' },
        ...(type !== 'employees' ? [{ value: 'etapa', label: 'Etapa' }] : []),
        { value: 'dependencia', label: 'Dependência Administrativa' },
        ...(type === 'teacher' ? [{ value: 'vinculo', label: 'Vínculo Funcional' }] : []),
        ...(type === 'teacher' ? [{ value: 'formacaoDocente', label: 'Formação Docente' }] : []),
      ];

  return (
    <div className="app-container">
      <div className="filters-section">
        <div className="selects-wrapper">
          <div className="select-container">
            <label htmlFor="typeSelect">Tipo: </label>
            <Select
              id="typeSelect"
              value={typeOptions.find(option => option.value === type)}
              onChange={(selectedOption) => {
                setType(selectedOption.value);
                setSelectedFilters([]);
              }}
              options={typeOptions}
              className="select-box"
              styles={customStyles}
              menuPortalTarget={document.body}
              placeholder="Selecione o tipo"
            />
          </div>

          <div className="year-selection-container">
            <div className="historical-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={displayHistorical}
                  onChange={(e) => {
                    setDisplayHistorical(e.target.checked);
                    setSelectedFilters([]);
                  }}
                />
                Série Histórica
              </label>
            </div>

            {displayHistorical ? (
              <>
                <div className="select-container">
                  <label htmlFor="startYearSelect">Ano Inicial: </label>
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
                    className="select-box"
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    placeholder="Ano Inicial"
                  />
                </div>
                <div className="select-container">
                  <label htmlFor="endYearSelect">Ano Final: </label>
                  <Select
                    id="endYearSelect"
                    value={yearOptions.find(option => option.value === endYear)}
                    onChange={(selectedOption) => setEndYear(selectedOption.value)}
                    options={yearOptions.filter(option => option.value >= startYear)}
                    className="select-box"
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    placeholder="Ano Final"
                  />
                </div>
              </>
            ) : (
              <div className="select-container">
                <label htmlFor="yearSelect">Ano: </label>
                <Select
                  id="yearSelect"
                  value={yearOptions.find(option => option.value === year)}
                  onChange={(selectedOption) => setYear(selectedOption.value)}
                  options={yearOptions}
                  className="select-box"
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  placeholder="Ano"
                />
              </div>
            )}
          </div>
        </div>

        <div className="selects-wrapper filters-row">
          <div className="select-container filter-item">
            <Select
              id="territorySelect"
              value={territoryOptions.find(option => option.value === territory) || null}
              onChange={(selectedOption) => {
                setTerritory(selectedOption ? selectedOption.value : '');
                setCity('');
              }}
              options={territoryOptions}
              className="select-box"
              styles={customStyles}
              menuPortalTarget={document.body}
              isClearable
              placeholder="Território de Desenvolvimento"
              isDisabled={type === 'out_of_school' || type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio' || type === 'rate_school_new'}
            />
          </div>
          <div className="select-container filter-item">
            <Select
              id="faixaPopulacionalSelect"
              value={faixaPopulacionalOptions.find(option => option.value === faixaPopulacional) || null}
              onChange={(selectedOption) => {
                setFaixaPopulacional(selectedOption ? selectedOption.value : '');
                setCity('');
              }}
              options={faixaPopulacionalOptions}
              className="select-box"
              styles={customStyles}
              menuPortalTarget={document.body}
              isClearable
              placeholder="Faixa Populacional"
              isDisabled={type === 'out_of_school' || type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio' || type === 'rate_school_new'}
            />
          </div>
          <div className="select-container filter-item">
            <Select
              id="aglomeradoSelect"
              value={aglomeradoOptions.find(option => option.value === aglomerado) || null}
              onChange={(selectedOption) => setAglomerado(selectedOption ? selectedOption.value : '')}
              options={aglomeradoOptions}
              className="select-box"
              styles={customStyles}
              menuPortalTarget={document.body}
              isClearable
              placeholder="Aglomerado"
              isDisabled={type === 'out_of_school' || type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio' || type === 'rate_school_new'}
            />
          </div>
          <div className="select-container filter-item">
            <Select
              id="gerenciaSelect"
              value={gerenciaOptions.find(option => option.value === gerencia) || null}
              onChange={(selectedOption) => setGerencia(selectedOption ? selectedOption.value : '')}
              options={gerenciaOptions}
              className="select-box"
              styles={customStyles}
              menuPortalTarget={document.body}
              isClearable
              placeholder="Gerencia"
              isDisabled={type === 'out_of_school' || type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio' || type === 'rate_school_new'}
            />
          </div>
          <div className="select-container filter-item">
            <Select
              id="citySelect"
              value={cityOptions.find(option => option.value === city) || null}
              onChange={(selectedOption) => setCity(selectedOption ? selectedOption.value : '')}
              options={cityOptions}
              className="select-box"
              styles={customStyles}
              menuPortalTarget={document.body}
              isClearable
              placeholder="Cidade"
              isDisabled={type === 'out_of_school' || type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio' || type === 'rate_school_new'}
            />
          </div>
        </div>
        <div className="selects-wrapper">
          <div className="select-container">
            <Select
              id="multiFilterSelect"
              value={selectedFilters}
              onChange={(newValue, actionMeta) => {
                if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
                  const etapaFilter = { value: 'etapa', label: 'Etapa de Ensino (Obrigatório)' };

                  if (newValue.length === 0) {
                    setSelectedFilters([etapaFilter]);
                  } else if (!newValue.some(filter => filter.value === 'etapa')) {
                    setSelectedFilters([etapaFilter, ...newValue.slice(-1)]);
                  } else {
                    setSelectedFilters(newValue.slice(-2));
                  }
                } else if (displayHistorical) {
                  setSelectedFilters(newValue.slice(-1));
                } else if (newValue.length <= 2) {
                  setSelectedFilters(newValue);
                } else {
                  setSelectedFilters(newValue.slice(-2));
                }
              }}
              options={filterOptions}
              className="select-box"
              styles={customStyles}
              menuPortalTarget={document.body}
              isMulti
              placeholder={displayHistorical ? "Selecione 1 filtro" : "Selecione até 2 filtros"}
            />
          </div>
        </div>
        {(type === 'out_of_school' || type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio' || type === 'rate_school_new') && (
          <div className="info-message" style={{
            width: '100%',
            color: '#666',
            fontSize: '0.85em',
            marginTop: '5px',
            marginBottom: '10px',
            maxWidth: '100%'
          }}>
            {type === 'out_of_school'
              ? 'Para população fora da escola, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí.'
              : type === 'rate_school_new'
              ? <span>Para taxa de atendimento educacional, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí <span style={{ color: '#ff6b6b' }}>e é obrigatório selecionar faixa etaria para consulta</span>.</span>
              : <span>Para taxa de matrículas {type === 'liquid_enrollment_ratio' ? 'líquidas' : 'brutas'}, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí <span style={{ color: '#ff6b6b' }}>e é obrigatório selecionar etapa para consulta</span>.</span>}
          </div>
        )}
        <div className="filter-button-container">
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
              marginLeft: '10px',
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

      {isLoading && (
        <div className="loading-message">
          <p>Carregando dados...</p>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && !data && (
        <div className="info-message">
          <p>Por favor, selecione os filtros desejados e clique em "Filtrar" para montar uma consulta.</p>
        </div>
      )}

      {!isLoading && !error && data && title ? (
        <div>
          <h2>{title}</h2>
        </div>
      ) : null}
      <ApiContainer
        type={type}
        year={year}
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
          year={year}
        />
      ) : null}
    </div>
  );
}

export default ParentComponent;