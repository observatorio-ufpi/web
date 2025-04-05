import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { Button } from '@mui/material';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import { FaixaPopulacional, municipios, Regioes } from '../../../../utils/citiesMapping';
import ApiHigherContainer from './ApiHigherComponent';
import DataTable from './DataTable';

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

  
  const yearLimits = useMemo(() => ({
    'university/count': { min: 2010, max: 2022 },
    'university_enrollment': { min: 2011, max: 2019 },
    'university_teacher': { min: 2010, max: 2019 },
    'course_count': { min: 2011, max: 2022 }
  }), []);

  const getYearLimits = useMemo(() => {
    return yearLimits[type] || { min: 2010, max: 2022 };
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
  }, [getYearLimits]);

  const handleFilterClick = () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setTitle('');

    setIsHistorical(displayHistorical);

    const yearDisplay = displayHistorical ? `${startYear}-${endYear}` : year;

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
  };

  const handleClearFilters = () => {
    setDisplayHistorical(false);
    setIsHistorical(false);
    setType('university/count');
    const limits = yearLimits['university/count'];
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
  };

  const filterOptions = type === 'university_enrollment' || type === 'course_count'
    ? [{ value: 'modalidade', label: 'Modalidade' }]
    : type === 'university_teacher'
    ? [{ value: 'regimeDeTrabalho', label: 'Regime de Trabalho' }]
    : [];

  const titleMapping = {
    "university/count": "Número de intituições de ensino superior",
    "university_enrollment": "Número de matrículas",
    "university_teacher": "Número de docentes",
    "course_count": "Número de cursos"
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
      label: 'Gerencia ' + gerencia.padStart(2, '0'),
    }));

  const aglomeradoOptions = [...new Set(Object.values(municipios).map(m => m.aglomerado))]
    .flatMap(aglomerado => aglomerado.split(',').map(a => a.trim()))
    .filter(Boolean)
    .sort((a, b) => parseInt(a) - parseInt(b))
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
            />
          </div>
        </div>
        <div className="selects-wrapper">
          <div className="select-container">
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
              className="select-box"
              styles={customStyles}
              menuPortalTarget={document.body}
              isMulti
              placeholder={displayHistorical ? "Selecione 1 filtro" : "Selecione até 2 filtros"}
            />
          </div>
        </div>
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
      <ApiHigherContainer
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
        <DataTable
          data={data.finalResult ? data.finalResult : data}
          municipioData={data.allResults && data.allResults.length > 0 ? data.allResults : []}
          isHistorical={isHistorical}
          isModalidadeSelected={isModalidadeSelected}
          isRegimeSelected={isRegimeSelected}
          title={title}
        />
      ) : null}
    </div>
  );
}

export default FilterComponent;