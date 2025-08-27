import { Button, Typography, Box } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Select } from '../../../ui';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import ApiRateContainer from './ApiRateComponent.jsx';
import TableRateComponent from './TableRateComponent.jsx';
import { Loading } from "../../../ui";

function FiltrosRateComponent() {
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

  const handleFilterClick = () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    // Limpar o título antes de definir um novo
    setTitle('');

    setIsHistorical(displayHistorical);
    setFilteredType(type);
    setFilteredYear(year);

    // Improved title generation logic
    const yearDisplay = displayHistorical ? `${startYear}-${endYear}` : year;

    // Para taxas, sempre usar "Piauí" como localização
    const locationName = "Piauí";

    // Adicionar informações sobre os filtros selecionados
    let filterInfo = [];

    // Adicionar filtros adicionais selecionados
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

    // Construir o título completo
    let fullTitle = `${titleMapping[type]} - ${locationName} (${yearDisplay})`;

    // Adicionar informações de filtro se houver
    if (filterInfo.length > 0) {
      fullTitle += ` | ${filterInfo.join(' | ')}`;
    }

    setTitle(type ? fullTitle : '');

    setIsEtapaSelected(selectedFilters.some(filter => filter.value === 'etapa'));
    setIsLocalidadeSelected(selectedFilters.some(filter => filter.value === 'localidade'));
    setIsFaixaEtariaSelected(selectedFilters.some(filter => filter.value === 'faixaEtaria'));
    setIsInstructionLevelSelected(selectedFilters.some(filter => filter.value === 'instruction_level'));
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

  const titleMapping = {
    pop_out_school: "Número de alunos fora da escola",
    adjusted_liquid_frequency: "Frequência líquida ajustada",
    iliteracy_rate: "Taxa de analfabetismo",
    superior_education_conclusion_tax: "Taxa de conclusão do ensino superior",
    basic_education_conclusion: "Taxa de conclusão do ensino básico",
    instruction_level: "Nível de instrução"
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

  const theme = useTheme();

  return (
    <div className="app-container">
      <div className="filter-container">
        <div className="filter-grid">
          {/* Tipo - Primeira coluna, primeira linha */}
          <div className="filter-municipio">
            <label htmlFor="typeSelect" className="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
            <Select
              id="typeSelect"
              value={typeOptions.find(option => option.value === type)}
              onChange={(selectedOption) => {
                setType(selectedOption.value);
                setSelectedFilters([]);
              }}
              options={typeOptions}
              placeholder="Selecione o tipo"
              size="small"
            />
          </div>

          {/* Ano - Segunda e terceira colunas, primeira linha */}
          <div className="filter-territorio">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={displayHistorical}
                  onChange={(e) => {
                    setDisplayHistorical(e.target.checked);
                    setSelectedFilters([]);
                  }}
                  className="cursor-pointer"
                />
                <span className="font-medium text-gray-700">Série Histórica</span>
              </label>
            
              {displayHistorical ? (
                <div className="flex gap-3 flex-1">
                  <div className="flex-1">
                    <label htmlFor="startYearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano Inicial:</label>
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
                      placeholder="Ano Inicial"
                      size="small"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="endYearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano Final:</label>
                    <Select
                      id="endYearSelect"
                      value={yearOptions.find(option => option.value === endYear)}
                      onChange={(selectedOption) => setEndYear(selectedOption.value)}
                      options={yearOptions.filter(option => option.value >= startYear)}
                      placeholder="Ano Final"
                      size="small"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <label htmlFor="yearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano:</label>
                  <Select
                    id="yearSelect"
                    value={yearOptions.find(option => option.value === year)}
                    onChange={(selectedOption) => setYear(selectedOption.value)}
                    options={yearOptions}
                    placeholder="Ano"
                    size="small"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Filtros Múltiplos - Primeira coluna, segunda linha */}
          <div className="filter-faixa">
            <Select
              id="multiFilterSelect"
              value={selectedFilters}
              onChange={(newValue, actionMeta) => {
                if (type === 'instruction_level') {
                  // Para instruction_level, garantir que instruction_level esteja sempre selecionado
                  const instructionLevelFilter = { value: 'instruction_level', label: 'Nível de Instrução (Obrigatório)' };

                  if (newValue.length === 0) {
                    setSelectedFilters([instructionLevelFilter]);
                  } else if (!newValue.some(filter => filter.value === 'instruction_level')) {
                    setSelectedFilters([instructionLevelFilter, ...newValue.slice(-1)]);
                  } else {
                    setSelectedFilters(newValue.slice(-3)); // Máximo 3 filtros
                  }
                } else if (type === 'iliteracy_rate' || type === 'superior_education_conclusion_tax' || type === 'basic_education_conclusion') {
                  // Para os novos tipos, permitir até 2 filtros sem obrigatoriedade
                  if (newValue.length <= 2) {
                    setSelectedFilters(newValue);
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
              isMulti
              placeholder={displayHistorical ? "Selecione 1 filtro" : "Selecione até 2 filtros"}
              size="small"
            />
          </div>

          {/* Instruções - Segunda e terceira colunas, segunda linha */}
          <div className="filter-aglomerado">
            <Box sx={{ 
              width: '100%',
              color: theme.palette.text.secondary,
              fontSize: '0.85em',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              {type === 'pop_out_school'
                ? <span>Para população fora da escola, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí <span style={{ color: '#ff6b6b' }}>e é obrigatório selecionar faixa etaria para consulta</span>.</span>
                : type === 'adjusted_liquid_frequency'
                ? <span>Para frequência líquida ajustada, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí <span style={{ color: '#ff6b6b' }}>e é obrigatório selecionar faixa etaria para consulta</span>.</span>
                : type === 'iliteracy_rate'
                ? <span>Para taxa de analfabetismo, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí. Você pode selecionar faixa etária e/ou localidade como filtros opcionais.</span>
                : type === 'superior_education_conclusion_tax'
                ? <span>Para taxa de conclusão do ensino superior, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí. Você pode selecionar faixa etária e/ou localidade como filtros opcionais.</span>
                : type === 'basic_education_conclusion'
                ? <span>Para taxa de conclusão do ensino básico, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí. Você pode selecionar faixa etária e/ou localidade como filtros opcionais.</span>
                : type === 'instruction_level'
                ? <span>Para nível de instrução, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí <span style={{ color: '#ff6b6b' }}>e é obrigatório selecionar nível de instrução para consulta</span>. Você pode combinar com localidade e/ou faixa etária.</span>
                : <span>Selecione um tipo para ver as informações específicas.</span>}
            </Box>
          </div>

          {/* Botões - Terceira coluna, terceira linha (mais à direita) */}
          <div className="filter-gerencia">
            <div className="flex gap-3 justify-end">
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
        </div>
      </div>

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
          Selecione os filtros desejados e clique em "Filtrar" para montar uma consulta.
        </Typography>
      )}

      {!isLoading && !error && data && title ? (
        <div>
          <h2>{title}</h2>
        </div>
      ) : null}

      <ApiRateContainer
        type={filteredType}
        year={filteredYear || year}
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
        <TableRateComponent
          data={data.finalResult ? data.finalResult : data}
          isEtapaSelected={isEtapaSelected}
          isLocalidadeSelected={isLocalidadeSelected}
          isFaixaEtariaSelected={isFaixaEtariaSelected}
          isInstructionLevelSelected={isInstructionLevelSelected}
          isHistorical={isHistorical}
          type={filteredType}
          year={filteredYear || year}
          title={title}
        />
      ) : null}
    </div>
  );
}

export default FiltrosRateComponent;
