import React, { useState } from 'react';
import '../style/RevenueTableContainer.css'; // Importar o CSS para reutilizar estilos
import ApiContainer from './ApiComponent';
import ApiDataTable from './apiDataTable'; // Import the new component


function ParentComponent() {
  const [type, setType] = useState('enrollment');
  const [year, setYear] = useState('2020');
  const [data, setData] = useState(null);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <div className='app-container'>
      <div className="filters-section">
        <div className="selects-wrapper">
          <div className="select-container">
            <label htmlFor="typeSelect" className="select-label">Tipo:</label>
            <select id="typeSelect" value={type} onChange={handleTypeChange} className="select-box">
              <option value="enrollment">Matrículas</option>
              <option value="school/count">Número de escolas</option>
              {/* Adicione outras opções conforme necessário */}
            </select>
          </div>

          <div className="select-container">
            <label htmlFor="yearSelect" className="select-label">Ano:</label>
            <select id="yearSelect" value={year} onChange={handleYearChange} className="select-box">
              {Array.from({ length: 2022 - 2006 + 1 }, (_, i) => 2006 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <ApiContainer type={type} year={year} onDataFetched={setData} />
      {data && <ApiDataTable data={data} />}
    </div>
  );
}

export default ParentComponent;