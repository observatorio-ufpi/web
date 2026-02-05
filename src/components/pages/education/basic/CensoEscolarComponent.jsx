import { Button, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useMemo, useState, useRef, useEffect } from 'react';
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
    console.log('handleFilterClick received filterData:', filterData);
    
    setError(null);
    setData(null);
    setTitle('');

    // Extrair os anos do filterData
    const startYear = filterData?.startYear || 2007;
    const endYear = filterData?.endYear || 2024;
    const isHistorical = startYear !== endYear;

    console.log('CensoEscolarComponent - Years:', { startYear, endYear, isHistorical });

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
      // Passar os anos corretamente para o fetchData
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

  // Listener para o evento applyFilters do sidebar
  useEffect(() => {
    const handleApplyFilters = (event) => {
      console.log('applyFilters event received:', event.detail);
      const filterData = event.detail;
      
      // Atualizar os estados primeiro
      const newSelectedFilters = filterData.selectedFilters || selectedFilters;
      const newCity = filterData.city || city;
      const newTerritory = filterData.territory || territory;
      const newFaixaPopulacional = filterData.faixaPopulacional || faixaPopulacional;
      const newAglomerado = filterData.aglomerado || aglomerado;
      const newGerencia = filterData.gerencia || gerencia;
      const startYear = filterData.startYear || 2007;
      const endYear = filterData.endYear || 2024;
      
      // Atualizar os estados
      setSelectedFilters(newSelectedFilters);
      setCity(newCity);
      setTerritory(newTerritory);
      setFaixaPopulacional(newFaixaPopulacional);
      setAglomerado(newAglomerado);
      setGerencia(newGerencia);

      // Agora chamar handleFilterClick com os dados atualizados
      setError(null);
      setData(null);
      setTitle('');

      const isHistorical = startYear !== endYear;
      const yearDisplay = isHistorical ? `${startYear}-${endYear}` : startYear;
      let locationName = 'Piauí';
      if (newCity && municipios[newCity]) {
        locationName = municipios[newCity].nomeMunicipio;
      }

      let filterInfo = [];
      if (newSelectedFilters.length > 0) {
        const filterNames = newSelectedFilters.map((filter) => filter.label);
        filterInfo.push(`Filtros: ${filterNames.join(', ')}`);
      }

      let fullTitle = `Condições de Oferta - Infraestrutura - ${locationName} (${yearDisplay})`;
      if (filterInfo.length > 0) {
        fullTitle += ` | ${filterInfo.join(' | ')}`;
      }
      setTitle(fullTitle);

      if (apiRef.current) {
        setIsLoading(true);
        apiRef.current.fetchData({
          year: startYear,
          isHistorical,
          startYear,
          endYear,
          city: newCity,
          territory: newTerritory,
          faixaPopulacional: newFaixaPopulacional,
          aglomerado: newAglomerado,
          gerencia: newGerencia,
          citiesList,
        });
      }
    };

    window.addEventListener('applyFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFilters', handleApplyFilters);
  }, []);

  // Função para normalizar os dados recebidos da API
  const normalizeData = (fetchedData) => {
    console.log('Raw fetchedData:', fetchedData);

    if (!fetchedData) {
      return { result: [] };
    }

    // Se já é um array, envolver em objeto
    if (Array.isArray(fetchedData)) {
      return { result: fetchedData };
    }

    // Se tem .result direto, retornar como está
    if (fetchedData.result && Array.isArray(fetchedData.result)) {
      return fetchedData;
    }

    // Se tem finalResult e allResults (múltiplas cidades)
    if (fetchedData.finalResult) {
      // Se finalResult é um objeto com .result
      if (fetchedData.finalResult.result && Array.isArray(fetchedData.finalResult.result)) {
        return fetchedData.finalResult;
      }
      // Se finalResult é um array
      if (Array.isArray(fetchedData.finalResult)) {
        return { result: fetchedData.finalResult };
      }
      // Se finalResult é um objeto simples
      if (typeof fetchedData.finalResult === 'object') {
        return { result: [fetchedData.finalResult] };
      }
    }

    // Se chegou aqui, retornar vazio
    return { result: [] };
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

        {/* Ficha Técnica */}
        {!isLoading && !error && data && (
          <Box sx={{ marginTop: 6, padding: 3, backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#333' }}>
              Ficha Técnica
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
              Informações sobre a metodologia, fonte de dados, periodicidade e outras informações técnicas estarão disponíveis aqui.
            </Typography>
          </Box>
        )}

        <ApiContainer
          ref={apiRef}
          type="infraestrutura"
          basePath="censo-escolar"
          onDataFetched={(fetchedData) => {
            console.log('onDataFetched data:', fetchedData);

            // Normalizar os dados
            const normalized = normalizeData(fetchedData);

            console.log('Normalized data:', normalized);
            console.log('Result array length:', normalized.result?.length || 0);

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