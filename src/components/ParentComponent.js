import React, { useState } from 'react';
import { municipios, Regioes } from '../utils/citiesMapping';
import '../style/RevenueTableContainer.css'; // Importar o CSS para reutilizar estilos
import ApiContainer from './ApiComponent';
import ApiDataTable from './apiDataTable'; // Import the new component

function ParentComponent() {
  const [type, setType] = useState('enrollment');
  const [year, setYear] = useState('2020');
  const [city, setCity] = useState('');
  const [territory, setTerritory] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleTerritoryChange = (event) => {
    setTerritory(event.target.value);
    setCity('');
  };

  const handleFilterClick = () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setTitle(type && titleMapping[type] ? `${titleMapping[type]} - ${city ? municipios[city].nomeMunicipio : territory ? '' : "Piauí"}${territory && city === '' ? ` ${Regioes[territory]}` : ''}` : '');
  };

  const filteredCities = territory
    ? Object.entries(municipios).filter(([key, { territorioDesenvolvimento }]) => territorioDesenvolvimento === Regioes[territory])
    : Object.entries(municipios);

  const titleMapping = {
    enrollment: "Matrículas",
    "school/count": "Número de escolas",
    class: "Número de turmas",
    teacher: "Número de professores",
  };

  return (
    <div className="app-container">
      <div className="filters-section">
        <div className="selects-wrapper">
          <div className="select-container">
            <label htmlFor="typeSelect" className="select-label">Tipo:</label>
            <select id="typeSelect" value={type} onChange={handleTypeChange} className="select-box">
              {Object.entries(titleMapping).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="select-container">
            <label htmlFor="yearSelect" className="select-label">Ano:</label>
            <select id="yearSelect" value={year} onChange={handleYearChange} className="select-box">
              {Array.from({ length: 2022 - 2007 + 1 }, (_, i) => 2007 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="select-container">
            <label htmlFor="territorySelect" className="select-label">Território:</label>
            <select id="territorySelect" value={territory} onChange={handleTerritoryChange} className="select-box">
              <option value="">Todos</option>
              {Object.entries(Regioes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          <div className="select-container">
            <label htmlFor="citySelect" className="select-label">Cidade:</label>
            <select id="citySelect" value={city} onChange={handleCityChange} className="select-box">
              <option value="">Todas</option>
              {filteredCities.map(([key, { nomeMunicipio }]) => (
                <option key={key} value={key}>{nomeMunicipio}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleFilterClick} className="filter-button">Filtrar</button>
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

      {!isLoading && !error && data && title ? (
        <div>
          <h2>{title}</h2>
        </div>
      ) : null}
      <ApiContainer
        type={type}
        year={year}
        city={city}
        citiesList={territory ? filteredCities : []}
        onDataFetched={setData}
        onError={setError}
        onLoading={setIsLoading}
        triggerFetch={isLoading}
      />
      {!isLoading && !error && data &&  <ApiDataTable data={data} />}
    </div>
  );

}

export default ParentComponent;