import { Button } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import ApiRateContainer from './ApiRateComponent';
import TableRateComponent from './TableRateComponent';

function FiltrosRateComponent() {
  const yearLimits = useMemo(() => ({
    pop_out_school: { min: 2019, max: 2023 },
    liquid_enrollment_ratio: { min: 2007, max: 2015 },
    gloss_enrollment_ratio: { min: 2007, max: 2015 },
    rate_school_new: { min: 2019, max: 2023 }
  }), []);

  const [type, setType] = useState('liquid_enrollment_ratio');
  const [filteredType, setFilteredType] = useState('liquid_enrollment_ratio');
  const [isHistorical, setIsHistorical] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isEtapaSelected, setIsEtapaSelected] = useState(false);
  const [isLocalidadeSelected, setIsLocalidadeSelected] = useState(false);
  const [isFaixaEtariaSelected, setIsFaixaEtariaSelected] = useState(false);
  const [displayHistorical, setDisplayHistorical] = useState(false);
  const [year, setYear] = useState(yearLimits.liquid_enrollment_ratio.max);
  const [filteredYear, setFilteredYear] = useState(null);
  const [startYear, setStartYear] = useState(yearLimits.liquid_enrollment_ratio.min);
  const [endYear, setEndYear] = useState(yearLimits.liquid_enrollment_ratio.max);

  // Função para obter os limites de anos
  const getYearLimits = useMemo(() => {
    return yearLimits[type] || { min: 2007, max: 2015 };
  }, [type, yearLimits]);

  // Usar getYearLimits para yearOptions
  const yearOptions = useMemo(() => {
    if (type === 'pop_out_school') {
      // Para pop_out_school, apenas os anos específicos disponíveis
      return [2019, 2022, 2023].map((year) => ({
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
    if (type === 'pop_out_school') {
      setYear(2023); // Ano mais recente disponível
      setStartYear(2019);
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
    if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
      // Garantir que etapa esteja selecionada
      const etapaFilter = { value: 'etapa', label: 'Etapa de Ensino (Obrigatório)' };
      if (!selectedFilters.some(filter => filter.value === 'etapa')) {
        setSelectedFilters([etapaFilter]);
      }
    } else if (type === 'rate_school_new') {
      // Garantir que faixa etária esteja selecionada
      const faixaEtariaFilter = { value: 'faixaEtaria', label: 'Faixa Etária (Obrigatório)' };
      if (!selectedFilters.some(filter => filter.value === 'faixaEtaria')) {
        setSelectedFilters([faixaEtariaFilter]);
      }
    } else if (type === 'pop_out_school') {
      // Garantir que faixa etária esteja selecionada
      const faixaEtariaFilter = { value: 'faixaEtaria', label: 'Faixa Etária (Obrigatório)' };
      if (!selectedFilters.some(filter => filter.value === 'faixaEtaria')) {
        setSelectedFilters([faixaEtariaFilter]);
      }
    }
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
  };

  const handleClearFilters = () => {
    setDisplayHistorical(false);
    setIsHistorical(false);
    setType('liquid_enrollment_ratio');
    setFilteredType('liquid_enrollment_ratio');
    const limits = yearLimits['liquid_enrollment_ratio'];
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
  };

  const titleMapping = {
    pop_out_school: "Número de alunos fora da escola",
    liquid_enrollment_ratio: "Taxa de matrículas líquidas",
    gloss_enrollment_ratio: "Taxa de matrículas brutas",
    rate_school_new: "Taxa de atendimento educacional"
  };

  const typeOptions = Object.entries(titleMapping).map(([key, label]) => ({
    value: key,
    label: label,
  }));

  const customStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const filterOptions = type === 'pop_out_school'
    ? [{ value: 'faixaEtaria', label: 'Faixa Etária (Obrigatório)' }]
    : type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio'
    ? [
        { value: 'localidade', label: 'Localidade' },
        { value: 'etapa', label: 'Etapa (Obrigatório)' }
      ]
    : type === 'rate_school_new'
    ? [{ value: 'faixaEtaria', label: 'Faixa Etária (Obrigatório)' }]
    : [];

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

        <div className="selects-wrapper">
          <div className="select-container">
            <Select
              id="multiFilterSelect"
              value={selectedFilters}
              onChange={(newValue, actionMeta) => {
                if (type === 'liquid_enrollment_ratio' || type === 'gloss_enrollment_ratio') {
                  const etapaFilter = { value: 'etapa', label: 'Etapa de Ensino (Obrigatório)' };

                  if (newValue.length === 0) {
                    setSelectedFilters([etapaFilter]);
                  } else if (!newValue.some(filter => filter.value === 'etapa')) {
                    setSelectedFilters([etapaFilter, ...newValue.slice(-1)]);
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
              className="select-box"
              styles={customStyles}
              menuPortalTarget={document.body}
              isMulti
              placeholder={displayHistorical ? "Selecione 1 filtro" : "Selecione até 2 filtros"}
            />
          </div>
        </div>

        <div className="info-message" style={{
          width: '100%',
          color: '#666',
          fontSize: '0.85em',
          marginTop: '5px',
          marginBottom: '10px',
          maxWidth: '100%'
        }}>
          {type === 'pop_out_school'
            ? <span>Para população fora da escola, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí <span style={{ color: '#ff6b6b' }}>e é obrigatório selecionar faixa etaria para consulta</span>.</span>
            : type === 'rate_school_new'
            ? <span>Para taxa de atendimento educacional, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí <span style={{ color: '#ff6b6b' }}>e é obrigatório selecionar faixa etaria para consulta</span>.</span>
            : <span>Para taxa de matrículas {type === 'liquid_enrollment_ratio' ? 'líquidas' : 'brutas'}, os dados estão disponíveis apenas para consulta consolidada do estado do Piauí <span style={{ color: '#ff6b6b' }}>e é obrigatório selecionar etapa para consulta</span>.</span>}
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
