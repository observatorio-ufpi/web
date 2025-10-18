import { Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useMemo, useState, useRef } from 'react';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import { municipios, Regioes, FaixaPopulacional } from '../../../../utils/citiesMapping';
import { Loading } from '../../../ui';
import ApiContainer from './ApiComponent.jsx';
import CensoEscolarDataTable from './CensoEscolarDataTable.jsx';
import CensoEscolarFilterComponent from './CensoEscolarFilterComponent.jsx';

function CensoEscolarComponent() {
  const theme = useTheme();
  const apiRef = useRef();

  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [territory, setTerritory] = useState('');
  const [faixaPopulacional, setFaixaPopulacional] = useState('');
  const [aglomerado, setAglomerado] = useState('');
  const [gerencia, setGerencia] = useState('');


  const citiesList = useMemo(() => Object.entries(municipios)
    .filter(([, m]) => {
      if (territory) {
        const territoryLabel = Regioes ? Regioes[territory] : null;
        if (territoryLabel && m.territorioDesenvolvimento !== territoryLabel) return false;
      }
      if (faixaPopulacional) {
        const faixaLabel = FaixaPopulacional ? FaixaPopulacional[faixaPopulacional] : null;
        if (faixaLabel && m.faixaPopulacional !== faixaLabel) return false;
      }
      if (aglomerado && String(m.aglomerado) !== String(aglomerado)) return false;
      if (gerencia) {
        const gerencias = String(m.gerencia).split(',').map(g => g.trim());
        if (!gerencias.includes(String(gerencia))) return false;
      }
      return true;
    })
    .map(([key, value]) => [key, value]), [territory, faixaPopulacional, aglomerado, gerencia]);

  const filterOptions = [
    { value: 'local_funcionamento', label: 'Local de Funcionamento' },
    { value: 'infraestrutura_basica', label: 'Infraestrutura Básica' },
    { value: 'espacos_pedagogicos', label: 'Espaços Pedagógicos' },
    { value: 'equipamentos', label: 'Equipamentos' },
    { value: 'materiais', label: 'Materiais' },
  ];

  const handleFilterClick = (filterData) => {
    setError(null);
    setData(null);
    setTitle('');

    // Se filterData foi passado, usa os dados do range slider
    const startYear = filterData?.startYear || 2007;
    const endYear = filterData?.endYear || 2024;
    const isHistorical = startYear !== endYear;
    
    const yearDisplay = isHistorical ? `${startYear}-${endYear}` : startYear;
    let locationName = 'Piauí';
    if (city && municipios[city]) {
      locationName = municipios[city].nomeMunicipio;
    }

    let filterInfo = [];
    if (selectedFilters.length > 0) {
      const filterNames = selectedFilters.map((filter) => filter.label);
      filterInfo.push(`Filtros: ${filterNames.join(', ')}`);
    }

    let fullTitle = `Condições de Oferta - Infraestrutura - ${locationName} (${yearDisplay})`;
    if (filterInfo.length > 0) {
      fullTitle += ` | ${filterInfo.join(' | ')}`;
    }
    setTitle(fullTitle);

    if (apiRef.current) {
      apiRef.current.fetchData({
        year: startYear,
        isHistorical,
        startYear,
        endYear,
        city,
        territory,
        faixaPopulacional,
        aglomerado,
        gerencia,
        citiesList,
      });
    }
  };

  const handleClearFilters = () => {
    setCity('');
    setData(null);
    setError(null);
    setTitle('');
    setSelectedFilters([]);
    setTerritory('');
    setFaixaPopulacional('');
    setAglomerado('');
    setGerencia('');
  };

  return (
    <div className="app-container">
      <div className="filters-section">
        <CensoEscolarFilterComponent
          city={city}
          setCity={setCity}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          handleFilterClick={handleFilterClick}
          handleClearFilters={handleClearFilters}
          filterOptions={filterOptions}
          territory={territory}
          setTerritory={setTerritory}
          faixaPopulacional={faixaPopulacional}
          setFaixaPopulacional={setFaixaPopulacional}
          aglomerado={aglomerado}
          setAglomerado={setAglomerado}
          gerencia={gerencia}
          setGerencia={setGerencia}
        />
      </div>

      {isLoading && <Loading />}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <hr className="divider" />

      <div className="data-section">
        {!isLoading && !error && !data && (
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '20px auto',
              maxWidth: '400px',
              color: theme.palette.primary.main,
            }}
          >
            Selecione os filtros desejados e clique em "Mostrar Resultados" para montar uma consulta.
          </Typography>
        )}

        {!isLoading && !error && data && <CensoEscolarDataTable data={data} title={title} />}

        <ApiContainer
          ref={apiRef}
          type="infraestrutura"
          basePath="censo-escolar"
          onDataFetched={(fetchedData) => {
            console.log('onDataFetched data:', fetchedData);
            let normalized = null;

            if (!fetchedData) {
              normalized = { result: [] };
            } else if (Array.isArray(fetchedData)) {
              normalized = { result: fetchedData };
            } else if (fetchedData.finalResult && fetchedData.allResults) {
              if (fetchedData.finalResult && fetchedData.finalResult.result) {
                normalized = fetchedData.finalResult;
              } else {
                normalized = { result: Array.isArray(fetchedData.finalResult) ? fetchedData.finalResult : [fetchedData.finalResult] };
              }
            } else if (fetchedData.result) {
              normalized = fetchedData;
            } else if (fetchedData.finalResult) {
              normalized = Array.isArray(fetchedData.finalResult) ? { result: fetchedData.finalResult } : { result: [fetchedData.finalResult] };
            } else {
              const maybeResult = fetchedData.result || fetchedData.data || null;
              if (Array.isArray(maybeResult)) normalized = { result: maybeResult };
              else normalized = { result: [] };
            }

            if (!Array.isArray(normalized.result)) normalized.result = [];

            setData(normalized);
            setIsLoading(false);
          }}
          onError={(errMsg) => {
            setError(errMsg);
            setIsLoading(false);
          }}
          onLoading={setIsLoading}
          selectedFilters={selectedFilters}
        />
      </div>
    </div>
  );
}

export default CensoEscolarComponent;
