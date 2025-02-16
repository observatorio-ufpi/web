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
  const [year, setYear] = useState(2020);
  const [city, setCity] = useState('');
  const [territory, setTerritory] = useState('');
  const [faixaPopulacional, setFaixaPopulacional] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  const handleFilterClick = () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setTitle(type && titleMapping[type] ? `${titleMapping[type]} - ${city ? municipios[city].nomeMunicipio : territory ? '' : "Piauí"}${territory && city === '' ? ` ${Regioes[territory]}` : ''}` : '');
  };

  const handleClearFilters = () => {
    setType('enrollment');
    setYear(2020);
    setCity('');
    setTerritory('');
    setFaixaPopulacional('');
    setData(null);
    setError(null);
    setTitle('');
  };

  const filteredCities = Object.entries(municipios).filter(([key, { territorioDesenvolvimento, faixaPopulacional: cityFaixaPopulacional }]) => {
    if (territory && faixaPopulacional) {
      return territorioDesenvolvimento === Regioes[territory] && cityFaixaPopulacional === FaixaPopulacional[faixaPopulacional];
    } else if (territory) {
      return territorioDesenvolvimento === Regioes[territory];
    } else if (faixaPopulacional) {
      return cityFaixaPopulacional === FaixaPopulacional[faixaPopulacional];
    }
    return true;
  });


  const titleMapping = {
    enrollment: "Número de matrículas",
    "school/count": "Número de escolas",
    class: "Número de turmas",
    teacher: "Número de professores",
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
              onChange={(selectedOption) => setType(selectedOption.value)}
              options={typeOptions}
              className="select-box"
              styles={customStyles}
              menuPortalTarget={document.body}
              placeholder="Selecione o tipo"
            />
        </div>
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
        city={city}
        territory={territory}
        faixaPopulacional={faixaPopulacional}
        citiesList={territory || faixaPopulacional ? filteredCities : []}
        onDataFetched={setData}
        onError={setError}
        onLoading={setIsLoading}
        triggerFetch={isLoading}
      />
      {!isLoading && !error && data && (
        <ApiDataTable
          data={data.finalResult ? data.finalResult : data}
          municipioData={data.allResults && data.allResults.length > 0 ? data.allResults : []}
        />
      )}
    </div>
  );

}

export default ParentComponent;