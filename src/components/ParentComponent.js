import { Button } from '@mui/material'; // Import the new component
import React, { useState } from 'react';
import Select from 'react-select'; // Import react-select
import '../style/RevenueTableContainer.css'; // Importar o CSS para reutilizar estilos
import '../style/TableFilters.css';
import { FaixaPopulacional, municipios, Regioes } from '../utils/citiesMapping';
import ApiContainer from './ApiComponent';
import ApiDataTable from './apiDataTable';

function ParentComponent() {
  const [type, setType] = useState('enrollment');
  const [filteredType, setFilteredType] = useState('enrollment');
  const [isHistorical, setIsHistorical] = useState(false);
  const [startYear, setStartYear] = useState(2007);
  const [endYear, setEndYear] = useState(2020);
  const [year, setYear] = useState(2020);
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
  const [displayHistorical, setDisplayHistorical] = useState(false);

  const handleFilterClick = () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setIsHistorical(displayHistorical);
    setFilteredType(type);
    const yearDisplay = isHistorical ? `${startYear}-${endYear}` : year;
    setTitle(type && titleMapping[type] ? `${titleMapping[type]} - ${city ? municipios[city].nomeMunicipio : territory ? '' : "Piauí"}${territory && city === '' ? ` ${Regioes[territory]}` : ''} (${yearDisplay})` : '');
    setIsEtapaSelected(selectedFilters.some(filter => filter.value === 'etapa'));
    setIsLocalidadeSelected(selectedFilters.some(filter => filter.value === 'localidade'));
    setIsDependenciaSelected(selectedFilters.some(filter => filter.value === 'dependencia'));
    setIsVinculoSelected(selectedFilters.some(filter => filter.value === 'vinculo'));
  };

  const handleClearFilters = () => {
    setDisplayHistorical(false);
    setIsHistorical(false);
    setType('enrollment');
    setFilteredType('enrollment');
    setStartYear(2007);
    setEndYear(2020);
    setYear(2020);
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
  };

  const filteredCities = Object.entries(municipios).filter(([key, { territorioDesenvolvimento, faixaPopulacional: cityFaixaPopulacional }]) => {
    if (territory && faixaPopulacional) {
      return territorioDesenvolvimento === Regioes[territory] && cityFaixaPopulacional === FaixaPopulacional[faixaPopulacional];
    } else if (territory) {
      return territorioDesenvolvimento === Regioes[territory];
    } else if (faixaPopulacional) {
      return cityFaixaPopulacional === FaixaPopulacional[faixaPopulacional];
    } else if (aglomerado) {
      return aglomerado === municipios[city].aglomerado;
    } else if (gerencia) {
      return gerencia === municipios[city].gerencia;
    }
    return true;
  });

  const titleMapping = {
    enrollment: "Número de matrículas",
    "school/count": "Número de escolas",
    class: "Número de turmas",
    teacher: "Número de docentes",
    auxiliar: "Número de auxiliares docentes",
    employees: "Número de funcionários"
  };

  const typeOptions = Object.entries(titleMapping).map(([key, label]) => ({
    value: key,
    label: label,
  }));

  const yearOptions = Array.from({ length: 2022 - 2007 + 1 }, (_, i) => 2007 + i).map((year) => ({
    value: year,
    label: year.toString(),
  }));

  const territoryOptions = Object.entries(Regioes).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const faixaPopulacionalOptions = Object.entries(FaixaPopulacional).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const aglomeradoOptions = [...new Set(Object.values(municipios).map(m => m.aglomerado))].map(aglomerado => ({
    value: aglomerado,
    label: aglomerado,
  }));

  const gerenciaOptions = [...new Set(Object.values(municipios).map(m => m.gerencia))].map(gerencia => ({
    value: gerencia,
    label: gerencia,
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
              onChange={(selectedOption) => setType(selectedOption.value)}
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

        <div className="selects-wrapper">
          <div className="select-container">
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
          <div className="select-container">
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
          <div className="select-container">
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
              onChange={(newValue, actionMeta) => {
                if (displayHistorical) {
                  // If historical series is selected, allow only one filter
                  setSelectedFilters(newValue.slice(-1));
                } else if (newValue.length <= 2) {
                  // If not historical, allow up to 2 filters
                  setSelectedFilters(newValue);
                } else {
                  // Remove the first item and add the new one
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
      <ApiContainer
        type={type}
        year={year}
        isHistorical={isHistorical}
        startYear={startYear}
        endYear={endYear}
        city={city}
        territory={territory}
        faixaPopulacional={faixaPopulacional}
        citiesList={territory || faixaPopulacional ? filteredCities : []}
        onDataFetched={setData}
        onError={setError}
        onLoading={setIsLoading}
        triggerFetch={isLoading}
        selectedFilters={selectedFilters}
      />
      {!isLoading && !error && data && (
        <ApiDataTable
          data={data.finalResult ? data.finalResult : data}
          municipioData={data.allResults && data.allResults.length > 0 ? data.allResults : []}
          isEtapaSelected={isEtapaSelected}
          isLocalidadeSelected={isLocalidadeSelected}
          isDependenciaSelected={isDependenciaSelected}
          isVinculoSelected={isVinculoSelected}
          isHistorical={isHistorical}
          type={filteredType}
        />
      )}
    </div>
  );
}

export default ParentComponent;