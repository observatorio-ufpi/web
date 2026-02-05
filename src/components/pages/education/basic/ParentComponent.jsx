import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import { FaixaPopulacional, municipios, Regioes } from '../../../../utils/citiesMapping';
import { Loading } from '../../../ui';
import ApiContainer from './ApiComponent.jsx';
import ApiDataTable from './apiDataTable.jsx';
import { useEducationFilters } from '../../../../contexts/EducationFilterContext';

function ParentComponent() {
  const apiRef = useRef();
  const filters = useEducationFilters();
  
  const validBasicEducationTypes = ['enrollment', 'school/count', 'class', 'teacher', 'auxiliar', 'employees'];
  
  const yearLimits = useMemo(() => ({
    enrollment: { min: 2007, max: 2024 },
    'school/count': { min: 2007, max: 2024 },
    class: { min: 2007, max: 2024 },
    teacher: { min: 2021, max: 2024 },
    auxiliar: { min: 2007, max: 2024 },
    employees: { min: 2007, max: 2024 }
  }), []);

  // Garantir que o tipo é válido para educação básica
  const validType = validBasicEducationTypes.includes(filters.type) ? filters.type : 'enrollment';

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [isEtapaSelected, setIsEtapaSelected] = useState(false);
  const [isLocalidadeSelected, setIsLocalidadeSelected] = useState(false);
  const [isDependenciaSelected, setIsDependenciaSelected] = useState(false);
  const [isMunicipioSelected, setIsMunicipioSelected] = useState(false);
  const [showConsolidated, setShowConsolidated] = useState(false);
  const [municipalityPage, setMunicipalityPage] = useState(1);
  const [municipalityLimit, setMunicipalityLimit] = useState(20);
  const [municipalityPagination, setMunicipalityPagination] = useState(null);
  const municipalityPageRef = useRef(1);
  const municipalityLimitRef = useRef(20);

  const getYearLimits = useMemo(() => {
    return yearLimits[validType] || { min: 2007, max: 2022 };
  }, [validType, yearLimits]);

  const handleFilterClick = () => {
    setError(null);
    setData(null);
    setIsLoading(true);

    const isHistoricalRange = filters.startYear !== filters.endYear;
    const yearDisplay = isHistoricalRange ? `${filters.startYear}-${filters.endYear}` : filters.startYear;
    let locationName = "Piauí";
    
    if (filters.city) {
      const selectedCity = municipios[filters.city];
      if (selectedCity) {
        locationName = selectedCity.nomeMunicipio;
      }
    } else if (filters.territory || filters.faixaPopulacional || filters.aglomerado || filters.gerencia) {
      locationName = "Piauí (seleção)";
    }

    const titleMapping = {
      enrollment: "Número de matrículas",
      "school/count": "Número de escolas",
      class: "Número de turmas",
      teacher: "Número de docentes",
      employees: "Número de funcionários"
    };

    const baseTitle = titleMapping[validType] || validType;
    const filterNames = filters.selectedFilters.map(f => f.label).join(', ');
    const filterPart = filterNames ? ` por ${filterNames}` : '';
    const newTitle = `${baseTitle} em ${locationName} (${yearDisplay})${filterPart}`;

    setTitle(newTitle);
    setIsEtapaSelected(filters.selectedFilters.some(f => f.value === 'etapa'));
    setIsLocalidadeSelected(filters.selectedFilters.some(f => f.value === 'localidade'));
    setIsDependenciaSelected(filters.selectedFilters.some(f => f.value === 'dependencia'));
    setIsMunicipioSelected(filters.selectedFilters.some(f => f.value === 'municipio'));

    const filteredCities = Object.entries(municipios).filter(([, {
      territorioDesenvolvimento,
      faixaPopulacional: cityFaixaPopulacional,
      aglomerado: cityAglomerado,
      gerencia: cityGerencia
    }]) => {
      const matchesTerritory = !filters.territory || territorioDesenvolvimento === Regioes[filters.territory];
      const matchesFaixaPopulacional = !filters.faixaPopulacional || cityFaixaPopulacional === FaixaPopulacional[filters.faixaPopulacional];
      const matchesAglomerado = !filters.aglomerado || cityAglomerado === filters.aglomerado;
      const matchesGerencia = !filters.gerencia || cityGerencia.split(',').map(g => g.trim()).includes(filters.gerencia);

      return matchesTerritory && matchesFaixaPopulacional && matchesAglomerado && matchesGerencia;
    });

    const paginationParams = isMunicipioSelected && !filters.city
      ? { municipalityPage: municipalityPageRef.current, municipalityLimit: municipalityLimitRef.current }
      : {};

    if (apiRef.current) {
      apiRef.current.fetchData({
        type: validType,
        year: filters.startYear,
        startYear: filters.startYear,
        endYear: filters.endYear,
        isHistorical: filters.startYear !== filters.endYear,
        city: filters.city,
        territory: filters.territory,
        faixaPopulacional: filters.faixaPopulacional,
        aglomerado: filters.aglomerado,
        gerencia: filters.gerencia,
        citiesList: filters.territory || filters.faixaPopulacional || filters.aglomerado || filters.gerencia ? filteredCities : [],
        ...paginationParams,
        selectedFilters: filters.selectedFilters,
      });
    }
  };

  // Auto-trigger filter when context values change
  useEffect(() => {
    if (validType || filters.selectedFilters.length > 0 || filters.city) {
      handleFilterClick();
    }
  }, [validType, filters.selectedFilters, filters.city, filters.territory, filters.faixaPopulacional, filters.aglomerado, filters.gerencia, filters.startYear, filters.endYear]);

  const theme = useTheme();

  return (
    <div className="app-container">
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
          Selecione os filtros desejados na barra lateral para montar uma consulta.
        </Typography>
      )}

      {!isLoading && !error && data && title ? (
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
            {title}
          </Typography>
        </Box>
      ) : null}
      
      <ApiContainer
        ref={apiRef}
        type={filters.type}
        onDataFetched={(result) => {
          if (result && result.pagination) {
            setMunicipalityPagination(result.pagination);
          } else {
            setMunicipalityPagination(null);
          }
          setData(result);
        }}
        onError={setError}
        onLoading={setIsLoading}
        selectedFilters={filters.selectedFilters}
      />
      
      {!isLoading && !error && data && title ? (
        <>
          <ApiDataTable
            data={data.finalResult ? data.finalResult : data}
            municipioData={data.allResults && data.allResults.length > 0 ? data.allResults : []}
            isEtapaSelected={isEtapaSelected}
            isLocalidadeSelected={isLocalidadeSelected}
            isDependenciaSelected={isDependenciaSelected}
            isMunicipioSelected={isMunicipioSelected}
            isHistorical={filters.startYear !== filters.endYear}
            type={filters.type}
            year={filters.startYear}
            title={title}
            showConsolidated={showConsolidated}
            municipalityPagination={municipalityPagination}
            onMunicipalityPageChange={(newPage) => {
              municipalityPageRef.current = newPage;
              setMunicipalityPage(newPage);
              handleFilterClick();
            }}
            onMunicipalityLimitChange={(newLimit) => {
              municipalityLimitRef.current = newLimit;
              municipalityPageRef.current = 1;
              setMunicipalityLimit(newLimit);
              setMunicipalityPage(1);
              handleFilterClick();
            }}
            fetchAllDataConfig={isMunicipioSelected ? {
              type: filters.type,
              year: filters.startYear,
              isHistorical: filters.startYear !== filters.endYear,
              startYear: filters.startYear,
              endYear: filters.endYear,
              city: filters.city,
              selectedFilters: filters.selectedFilters
            } : null}
          />

          {/* Ficha Técnica */}
          <Box sx={{ marginTop: 6, padding: 3, backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#333' }}>
              Ficha Técnica
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
              Informações sobre a metodologia, fonte de dados, periodicidade e outras informações técnicas estarão disponíveis aqui.
            </Typography>
          </Box>
        </>
      ) : null}
    </div>
  );
}

export default ParentComponent;
