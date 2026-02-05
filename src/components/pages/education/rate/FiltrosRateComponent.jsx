import { Button, Typography, Box } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Select } from '../../../ui';
import YearRangeFilter from '../../../helpers/YearRangeFilter';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import ApiRateContainer from './ApiRateComponent.jsx';
import TableRateComponent from './TableRateComponent.jsx';
import { Loading } from "../../../ui";

function FiltrosRateComponent() {
  const theme = useTheme();
  const yearLimits = useMemo(() => ({
    pop_out_school: { min: 2019, max: 2023 },
    adjusted_liquid_frequency: { min: 2019, max: 2023 },
    iliteracy_rate: { min: 2019, max: 2023 },
    superior_education_conclusion_tax: { min: 2019, max: 2023 },
    basic_education_conclusion: { min: 2019, max: 2023 },
    instruction_level: { min: 2016, max: 2023 }
  }), []);

  const [type, setType] = useState('pop_out_school');
  const [filteredType, setFilteredType] = useState('pop_out_school');
  const [isHistorical, setIsHistorical] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isEtapaSelected, setIsEtapaSelected] = useState(false);
  const [isLocalidadeSelected, setIsLocalidadeSelected] = useState(false);
  const [isFaixaEtariaSelected, setIsFaixaEtariaSelected] = useState(false);
  const [isInstructionLevelSelected, setIsInstructionLevelSelected] = useState(false);
  const [displayHistorical, setDisplayHistorical] = useState(false);
  const [year, setYear] = useState(yearLimits.pop_out_school.max);
  const [filteredYear, setFilteredYear] = useState(null);
  const [startYear, setStartYear] = useState(yearLimits.pop_out_school.min);
  const [endYear, setEndYear] = useState(yearLimits.pop_out_school.max);

  // Função para obter os limites de anos
  const getYearLimits = useMemo(() => {
    return yearLimits[type] || { min: 2019, max: 2023 };
  }, [type, yearLimits]);

  // Usar getYearLimits para yearOptions
  const yearOptions = useMemo(() => {
    if (type === 'pop_out_school' || type === 'adjusted_liquid_frequency' ||
        type === 'iliteracy_rate' || type === 'superior_education_conclusion_tax' ||
        type === 'basic_education_conclusion') {
      // Para todos os tipos, apenas os anos específicos disponíveis
      return [2019, 2022, 2023].map((year) => ({
        value: year,
        label: year.toString(),
      }));
    } else if (type === 'instruction_level') {
      // Para instruction_level, apenas os anos específicos disponíveis
      return [2016, 2017, 2018, 2019, 2022, 2023].map((year) => ({
        value: year,
        label: year.toString(),
      }));
    }

    return Array.from(
      { length: getYearLimits.max - getYearLimits.min + 1 },
      (_, i) => getYearLimits.min + i
    ).map((year) => ({
      value: year,
      label: year.toString(),
    }));
  }, [getYearLimits, type]);

  // Atualizar os anos quando os limites mudarem
  useEffect(() => {
    if (type === 'pop_out_school' || type === 'adjusted_liquid_frequency' ||
        type === 'iliteracy_rate' || type === 'superior_education_conclusion_tax' ||
        type === 'basic_education_conclusion') {
      setYear(2023); // Ano mais recente disponível
      setStartYear(2019);
      setEndYear(2023);
    } else if (type === 'instruction_level') {
      setYear(2023); // Ano mais recente disponível
      setStartYear(2016);
      setEndYear(2023);
    } else {
      setYear(getYearLimits.max);
      setStartYear(getYearLimits.min);
      setEndYear(getYearLimits.max);
    }
  }, [getYearLimits, type]);

  // Adicionar este useEffect para ajustar filtros específicos para cada tipo
  useEffect(() => {
    // Ajustar filtros específicos para cada tipo
    if (type === 'pop_out_school' || type === 'adjusted_liquid_frequency') {
      // Garantir que faixa etária esteja selecionada
      const faixaEtariaFilter = { value: 'faixaEtaria', label: 'Faixa Etária (Obrigatório)' };
      if (!selectedFilters.some(filter => filter.value === 'faixaEtaria')) {
        setSelectedFilters([faixaEtariaFilter]);
      }
    } else if (type === 'instruction_level') {
      // Garantir que nível de instrução esteja selecionado
      const instructionLevelFilter = { value: 'instruction_level', label: 'Nível de Instrução (Obrigatório)' };
      if (!selectedFilters.some(filter => filter.value === 'instruction_level')) {
        setSelectedFilters([instructionLevelFilter]);
      }
    }
    // Para os outros novos tipos, não há filtros obrigatórios
  }, [type, selectedFilters]);

  // Listener para o evento applyFilters do sidebar
  useEffect(() => {
    const handleApplyFilters = (event) => {
      console.log('applyFilters event received in FiltrosRateComponent:', event.detail);
      const filterData = event.detail;
      
      console.log('Valores do evento:');
      console.log('  filterData.startYear:', filterData.startYear);
      console.log('  filterData.endYear:', filterData.endYear);
      console.log('  filterData.type:', filterData.type);
      
      // Atualizar estado local com os valores do evento
      if (filterData.type) {
        setType(filterData.type);
      }
      if (filterData.selectedFilters) {
        setSelectedFilters(filterData.selectedFilters);
      }
      
      // Chamar com os valores do evento
      if (filterData.startYear !== undefined && filterData.endYear !== undefined) {
        applyFiltersWithValues(filterData.startYear, filterData.endYear, filterData.type || type);
      }
    };

    window.addEventListener('applyFilters', handleApplyFilters);
    return () => window.removeEventListener('applyFilters', handleApplyFilters);
  }, [type]);

  // Listener para o evento clearFilters do sidebar
  useEffect(() => {
    const handleClearFiltersEvent = (event) => {
      console.log('clearFilters event received in FiltrosRateComponent');
      handleClearFilters();
    };

    window.addEventListener('clearFilters', handleClearFiltersEvent);
    return () => window.removeEventListener('clearFilters', handleClearFiltersEvent);
  }, []);

  const titleMapping = {
    pop_out_school: "Número de alunos fora da escola",
    adjusted_liquid_frequency: "Frequência líquida ajustada",
    iliteracy_rate: "Taxa de analfabetismo",
    superior_education_conclusion_tax: "Taxa de conclusão do ensino superior",
    basic_education_conclusion: "Taxa de conclusão do ensino básico",
    instruction_level: "Nível de instrução"
  };

  const buildTitle = (typeValue, startYearValue, endYearValue) => {
    const yearDisplay = startYearValue !== endYearValue ? `${startYearValue}-${endYearValue}` : startYearValue;
    const locationName = "Piauí";
    let filterInfo = [];

    if (selectedFilters.length > 0) {
      const filterNames = selectedFilters.map(filter => {
        switch(filter.value) {
          case 'etapa': return 'Etapa de Ensino';
          case 'localidade': return 'Localidade';
          case 'faixaEtaria': return 'Faixa Etária';
          case 'instruction_level': return 'Nível de Instrução';
          default: return filter.value;
        }
      });
      filterInfo.push(`Filtros: ${filterNames.join(', ')}`);
    }

    let fullTitle = `${titleMapping[typeValue]} - ${locationName} (${yearDisplay})`;
    if (filterInfo.length > 0) {
      fullTitle += ` | ${filterInfo.join(' | ')}`;
    }
    return fullTitle;
  };

  const applyFiltersWithValues = (startYearValue, endYearValue, typeValue) => {
    const isHistoricalRange = startYearValue !== endYearValue;
    
    console.log('FiltrosRateComponent - applyFiltersWithValues:');
    console.log('  startYear:', startYearValue);
    console.log('  endYear:', endYearValue);
    console.log('  isHistorical:', isHistoricalRange);
    
    setIsLoading(true);
    setError(null);
    setData(null);
    setStartYear(startYearValue);
    setEndYear(endYearValue);
    setYear(startYearValue);
    setIsHistorical(isHistoricalRange);
    setDisplayHistorical(isHistoricalRange);
    setFilteredType(typeValue);
    setFilteredYear(startYearValue);
    
    const newTitle = buildTitle(typeValue, startYearValue, endYearValue);
    setTitle(newTitle);
    
    setIsEtapaSelected(selectedFilters.some(filter => filter.value === 'etapa'));
    setIsLocalidadeSelected(selectedFilters.some(filter => filter.value === 'localidade'));
    setIsFaixaEtariaSelected(selectedFilters.some(filter => filter.value === 'faixaEtaria'));
    setIsInstructionLevelSelected(selectedFilters.some(filter => filter.value === 'instruction_level'));
  };

  const handleFilterClick = () => {
    applyFiltersWithValues(startYear, endYear, type);
  };

  const handleClearFilters = () => {
    setDisplayHistorical(false);
    setIsHistorical(false);
    setType('pop_out_school');
    setFilteredType('pop_out_school');
    const limits = yearLimits['pop_out_school'];
    setStartYear(limits.min);
    setEndYear(limits.max);
    setYear(limits.max);
    setFilteredYear(null);
    setData(null);
    setError(null);
    setTitle('');
    setSelectedFilters([]);
    setIsEtapaSelected(false);
    setIsLocalidadeSelected(false);
    setIsFaixaEtariaSelected(false);
    setIsInstructionLevelSelected(false);
  };

  const typeOptions = Object.entries(titleMapping).map(([key, label]) => ({
    value: key,
    label: label,
  }));

  const customStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const filterOptions = type === 'pop_out_school' || type === 'adjusted_liquid_frequency'
    ? [{ value: 'faixaEtaria', label: 'Faixa Etária (Obrigatório)' }]
    : type === 'iliteracy_rate' || type === 'superior_education_conclusion_tax' || type === 'basic_education_conclusion'
    ? [
        { value: 'localidade', label: 'Localidade' },
        { value: 'faixaEtaria', label: 'Faixa Etária' }
      ]
    : type === 'instruction_level'
    ? [
        { value: 'instruction_level', label: 'Nível de Instrução (Obrigatório)' },
        { value: 'localidade', label: 'Localidade' },
        { value: 'faixaEtaria', label: 'Faixa Etária' }
      ]
    : [];

  return (
    <div className="app-container">
      <div className="flex flex-col gap-4 p-0 m-0">
        
          <hr className="divider" />

          {isLoading && (
            <Loading />
          )}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

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
              Selecione os filtros desejados na lateral e clique em "Filtrar" para montar uma consulta.
            </Typography>
          )}

          {!isLoading && !error && data && title ? (
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
                {title}
              </Typography>
            </Box>
          ) : null}

          <ApiRateContainer
            type={type}
            year={year}
            isHistorical={isHistorical}
            startYear={startYear}
            endYear={endYear}
            onDataFetched={setData}
            onError={setError}
            onLoading={setIsLoading}
            triggerFetch={isLoading}
            selectedFilters={selectedFilters}
          />

          {!isLoading && !error && data && title ? (
            <>
              <TableRateComponent
                data={data.finalResult ? data.finalResult : data}
                isEtapaSelected={false}
                isLocalidadeSelected={false}
                isFaixaEtariaSelected={false}
                isInstructionLevelSelected={false}
                isHistorical={isHistorical}
                type={type}
                year={year}
                title={title}
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
    </div>
  );
}

export default FiltrosRateComponent;
