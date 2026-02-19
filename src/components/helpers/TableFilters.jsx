import { Button, Collapse, Box, Typography } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import React, { useEffect, useState, useMemo } from 'react';
import { Select } from '../ui';
import YearRangeFilter from './YearRangeFilter';
import { FaixaPopulacional, municipios, Regioes } from '../../utils/municipios.mapping';

const findMunicipioCodigo = (nomeMunicipio) => {
  return Object.keys(municipios).find(
    codigo => municipios[codigo].nomeMunicipio === nomeMunicipio
  );
};

// Opções de tipos de tabela para dados municipais
const tableTypeOptions = [
  { value: 'ownRevenues', label: 'Receita de impostos próprios' },
  { value: 'constitutionalTransfersRevenue', label: 'Receita de transferências constitucionais e legais' },
  { value: 'municipalTaxesRevenues', label: 'Receita Líquida de Impostos do Município' },
  { value: 'additionalEducationRevenue', label: 'Receitas adicionais da educação no Município' },
  { value: 'municipalFundebFundefComposition', label: 'Composição do Fundeb no Município' },
  { value: 'complementationFundebFundef', label: 'Composição da complementação do Fundeb' },
  { value: 'constitutionalLimitMde', label: 'Limite constitucional em MDE no Município' },
  { value: 'expensesBasicEducationFundeb', label: 'Despesas com profissionais da Educação básica do Fundeb' },
  { value: 'basicEducationMinimalPotential', label: 'Receita Potencial Mínima vinculada à Educação Básica (RPEB)' },
];

// Opções de tipos de tabela para dados estaduais
const stateTableTypeOptions = [
  { value: 'tabela1', label: 'Receita bruta de impostos próprios do Piauí' },
  { value: 'tabela2', label: 'Receita líquida de impostos próprios do Piauí' },
  { value: 'tabela3', label: 'Receita bruta de transferências constitucionais' },
  { value: 'tabela4', label: 'Receita líquida de transferências constitucionais' },
  { value: 'tabela5', label: 'Receita líquida resultante de impostos e transferências' },
  { value: 'tabela6', label: 'Receitas adicionais para financiamento do ensino' },
  { value: 'tabela7', label: 'Composição do Fundeb no Piauí' },
  { value: 'tabela8', label: 'Composição da complementação do Fundeb' },
  { value: 'tabela9', label: 'Limite constitucional em MDE no Piauí' },
  { value: 'tabela10', label: 'Despesas com profissionais da educação básica (Fundeb)' },
  { value: 'tabela11', label: 'Despesas em MDE por área de atuação' },
  { value: 'tabela12', label: 'Receita Potencial Mínima vinculada à Educação Básica (RPEB)' },
  { value: 'tabela13', label: 'Protocolo Complementar' },
];

// Opções de tipos de indicadores estaduais
const stateIndicatorTypeOptions = [
  { value: 'revenueComposition', label: 'Composição das Receitas' },
  { value: 'fundeb', label: 'Fundeb' },
  { value: 'mde', label: 'Manutenção e Desenvolvimento do Ensino (MDE)' },
  { value: 'educationExpense', label: 'Despesas com Educação' },
  { value: 'additionalRevenue', label: 'Receitas Adicionais' },
  { value: 'rpeb', label: 'Composição da Receita Potencial de Educação (RPEB)' },
];

// Opções de tipos de indicadores municipais
const municipalIndicatorTypeOptions = [
  { value: 'constitutionalLimitMde', label: 'Percentual aplicado em MDE' },
  { value: 'expensesBasicEducationFundeb', label: 'Percentual do Fundeb nos profissionais' },
  { value: 'revenueComposition', label: 'Composição das Receitas' },
  { value: 'financingCapacity', label: 'Capacidade de Financiamento' },
  { value: 'rpebComposition', label: 'Composição da RPEB' },
  { value: 'resourcesApplicationControl', label: 'Controle da Aplicação de Recursos' },
  { value: 'educationExpenseComposition', label: 'Composição das Despesas em Educação' },
];

const FilterComponent = ({
  onFilterChange,
  selectedMunicipio,
  territorioDeDesenvolvimentoMunicipio,
  faixaPopulacionalMunicipio,
  aglomeradoMunicipio,
  gerenciaRegionalMunicipio,
  anoInicial,
  anoFinal,
  filtersExpanded = false,
  showTableTypeFilter = false,
  showStateTableTypeFilter = false,
  showStateIndicatorTypeFilter = false,
  showMunicipalIndicatorTypeFilter = false,
  selectedTableType = 'ownRevenues',
  selectedStateTableType = 'tabela1',
  selectedStateIndicatorType = 'revenueComposition',
  selectedMunicipalIndicatorType = 'constitutionalLimitMde',
  showMunicipioFilters = true,
}) => {
  // Referência para o portal dos menus dropdown
  const menuPortalTarget = typeof document !== 'undefined' ? document.body : null;

  const [filters, setFilters] = useState({
    nomeMunicipio: selectedMunicipio || '',
    territorioDeDesenvolvimentoMunicipio: territorioDeDesenvolvimentoMunicipio || '',
    faixaPopulacionalMunicipio: faixaPopulacionalMunicipio || '',
    aglomeradoMunicipio: aglomeradoMunicipio || '',
    gerenciaRegionalMunicipio: gerenciaRegionalMunicipio || '',
    anoInicial: 2007, // Ano inicial padrão
    anoFinal: 2024, // Ano final padrão
  });

  // Converter os valores recebidos para o formato do react-select
  const [selectedMunicipioState, setSelectedMunicipio] = useState(
    selectedMunicipio ?
      {
        value: selectedMunicipio, // selectedMunicipio já é o código agora
        label: municipios[selectedMunicipio]?.nomeMunicipio || selectedMunicipio
      } :
      null
  );
  const [territorioState, setTerritorioDeDesenvolvimentoMunicipio] = useState(
    territorioDeDesenvolvimentoMunicipio ? { value: territorioDeDesenvolvimentoMunicipio, label: Regioes[territorioDeDesenvolvimentoMunicipio] } : null
  );
  const [faixaState, setFaixaPopulacionalMunicipio] = useState(
    faixaPopulacionalMunicipio ? { value: faixaPopulacionalMunicipio, label: FaixaPopulacional[faixaPopulacionalMunicipio] } : null
  );
  const [aglomeradoState, setAglomeradoMunicipio] = useState(
    aglomeradoMunicipio && aglomeradoMunicipio !== 'undefined' ? { value: aglomeradoMunicipio, label: `AG ${aglomeradoMunicipio}` } : null
  );
  const [gerenciaState, setGerenciaRegionalMunicipio] = useState(
    gerenciaRegionalMunicipio && gerenciaRegionalMunicipio !== 'undefined' ? { value: gerenciaRegionalMunicipio, label: `${gerenciaRegionalMunicipio}ª GRE` } : null
  );

  // Estado para o tipo de tabela (municipal)
  const [tableTypeState, setTableTypeState] = useState(
    selectedTableType ? 
      tableTypeOptions.find(opt => opt.value === selectedTableType) || tableTypeOptions[0]
      : tableTypeOptions[0]
  );

  // Estado para o tipo de tabela (estadual)
  const [stateTableTypeState, setStateTableTypeState] = useState(
    selectedStateTableType ? 
      stateTableTypeOptions.find(opt => opt.value === selectedStateTableType) || stateTableTypeOptions[0]
      : stateTableTypeOptions[0]
  );

  // Estado para o tipo de indicador (estadual)
  const [stateIndicatorTypeState, setStateIndicatorTypeState] = useState(
    selectedStateIndicatorType ? 
      stateIndicatorTypeOptions.find(opt => opt.value === selectedStateIndicatorType) || stateIndicatorTypeOptions[0]
      : stateIndicatorTypeOptions[0]
  );

  // Estado para o tipo de indicador (municipal)
  const [municipalIndicatorTypeState, setMunicipalIndicatorTypeState] = useState(
    selectedMunicipalIndicatorType ? 
      municipalIndicatorTypeOptions.find(opt => opt.value === selectedMunicipalIndicatorType) || municipalIndicatorTypeOptions[0]
      : municipalIndicatorTypeOptions[0]
  );

  // Lógica de filtros dependentes - baseado nos filtros de localização
  const baseFilteredMunicipios = useMemo(() => {
    const territorioLabel = territorioState ? Regioes[territorioState.value] : null;
    const faixaLabel = faixaState ? FaixaPopulacional[faixaState.value] : null;

    return Object.values(municipios).filter((m) => {
      if (territorioLabel && m.territorioDesenvolvimento !== territorioLabel) return false;
      if (faixaLabel && m.faixaPopulacional !== faixaLabel) return false;
      if (aglomeradoState && String(m.aglomerado) !== String(aglomeradoState.value)) return false;
      if (gerenciaState) {
        const gerencias = String(m.gerencia).split(',').map((g) => g.trim());
        if (!gerencias.includes(String(gerenciaState.value))) return false;
      }
      return true;
    });
  }, [territorioState, faixaState, aglomeradoState, gerenciaState]);

  // Desabilitar outros filtros quando município específico é selecionado
  const otherLocalityDisabled = !!selectedMunicipioState;

  // Opções filtradas baseadas nos filtros de localização
  const filteredMunicipioOptions = useMemo(() => {
    return Object.entries(municipios)
      .filter(([, m]) => baseFilteredMunicipios.includes(m))
      .map(([key, { nomeMunicipio }]) => ({ value: key, label: nomeMunicipio }));
  }, [baseFilteredMunicipios]);

  const filteredTerritorioOptions = useMemo(() => {
    const uniqueLabels = [...new Set(baseFilteredMunicipios.map((m) => m.territorioDesenvolvimento).filter(Boolean))];
    return Object.entries(Regioes)
      .filter(([, label]) => uniqueLabels.includes(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const filteredFaixaPopulacionalOptions = useMemo(() => {
    const uniqueLabels = [...new Set(baseFilteredMunicipios.map((m) => m.faixaPopulacional).filter(Boolean))];
    return Object.entries(FaixaPopulacional)
      .filter(([, label]) => uniqueLabels.includes(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const filteredAglomeradoOptions = useMemo(() => {
    return [...new Set(baseFilteredMunicipios.map((m) => m.aglomerado).filter((a) => a && a !== 'undefined'))]
      .sort((a, b) => Number(a) - Number(b))
      .map((a) => ({ value: a, label: `AG ${a}` }));
  }, [baseFilteredMunicipios]);

  const filteredGerenciaOptions = useMemo(() => {
    return [...new Set(
      baseFilteredMunicipios
        .map((m) => m.gerencia)
        .filter((g) => g && g !== 'undefined')
        .flatMap((g) => (g.includes(',') ? g.split(',').map((x) => x.trim()) : [g]))
    )]
      .sort((a, b) => Number(a) - Number(b))
      .map((g) => ({ value: g, label: `${g}ª GRE` }));
  }, [baseFilteredMunicipios]);

  // Função para limpar filtros inválidos quando as opções mudam
  const useClearInvalidFilter = (value, setter, options) => {
    useEffect(() => {
      if (value && options.length > 0) {
        const exists = options.some((opt) => opt.value === value);
        if (!exists) {
          setter(null);
        }
      }
    }, [value, setter, options]);
  };

  // Aplicar limpeza de filtros inválidos
  useClearInvalidFilter(selectedMunicipioState?.value, setSelectedMunicipio, filteredMunicipioOptions);
  useClearInvalidFilter(territorioState?.value, setTerritorioDeDesenvolvimentoMunicipio, filteredTerritorioOptions);
  useClearInvalidFilter(faixaState?.value, setFaixaPopulacionalMunicipio, filteredFaixaPopulacionalOptions);
  useClearInvalidFilter(aglomeradoState?.value, setAglomeradoMunicipio, filteredAglomeradoOptions);
  useClearInvalidFilter(gerenciaState?.value, setGerenciaRegionalMunicipio, filteredGerenciaOptions);

  // Limpar filtros de localização quando um município específico é selecionado
  useEffect(() => {
    if (selectedMunicipioState) {
      setTerritorioDeDesenvolvimentoMunicipio(null);
      setFaixaPopulacionalMunicipio(null);
      setAglomeradoMunicipio(null);
      setGerenciaRegionalMunicipio(null);
    }
  }, [selectedMunicipioState]);

  useEffect(() => {
    setSelectedMunicipio(
      selectedMunicipio ?
        {
          value: selectedMunicipio, // selectedMunicipio já é o código agora
          label: municipios[selectedMunicipio]?.nomeMunicipio || selectedMunicipio
        } :
        null
    );
    setTerritorioDeDesenvolvimentoMunicipio(territorioDeDesenvolvimentoMunicipio ? { value: territorioDeDesenvolvimentoMunicipio, label: Regioes[territorioDeDesenvolvimentoMunicipio] } : null);
    setFaixaPopulacionalMunicipio(faixaPopulacionalMunicipio ? { value: faixaPopulacionalMunicipio, label: FaixaPopulacional[faixaPopulacionalMunicipio] } : null);
    setAglomeradoMunicipio(aglomeradoMunicipio && aglomeradoMunicipio !== 'undefined' ? { value: aglomeradoMunicipio, label: `AG ${aglomeradoMunicipio}` } : null);
    setGerenciaRegionalMunicipio(gerenciaRegionalMunicipio && gerenciaRegionalMunicipio !== 'undefined' ? { value: gerenciaRegionalMunicipio, label: `${gerenciaRegionalMunicipio}ª GRE` } : null);
  }, [selectedMunicipio, territorioDeDesenvolvimentoMunicipio, faixaPopulacionalMunicipio, aglomeradoMunicipio, gerenciaRegionalMunicipio, anoInicial, anoFinal]);

  const handleSearch = () => {
    onFilterChange({
      codigoMunicipio: selectedMunicipioState ? selectedMunicipioState.value : null,
      nomeMunicipio: selectedMunicipioState ? selectedMunicipioState.label : null,
      territorioDeDesenvolvimentoMunicipio: territorioState ? territorioState.value : null,
      faixaPopulacionalMunicipio: faixaState ? faixaState.value : null,
      aglomeradoMunicipio: aglomeradoState ? aglomeradoState.value : null,
      gerenciaRegionalMunicipio: gerenciaState ? gerenciaState.value : null,
      anoInicial: filters.anoInicial,
      anoFinal: filters.anoFinal,
      tableType: tableTypeState ? tableTypeState.value : 'ownRevenues',
      stateTableType: stateTableTypeState ? stateTableTypeState.value : 'tabela1',
      stateIndicatorType: stateIndicatorTypeState ? stateIndicatorTypeState.value : 'revenueComposition',
      municipalIndicatorType: municipalIndicatorTypeState ? municipalIndicatorTypeState.value : 'constitutionalLimitMde',
      loading: true,
    });
  };

  const handleClearFilters = () => {
    setSelectedMunicipio(null);
    setTerritorioDeDesenvolvimentoMunicipio(null);
    setFaixaPopulacionalMunicipio(null);
    setAglomeradoMunicipio(null);
    setGerenciaRegionalMunicipio(null);
    setFilters({...filters, anoInicial: 2007, anoFinal: 2024});
    setTableTypeState(tableTypeOptions[0]); // Reset para o primeiro tipo (ownRevenues)
    setStateTableTypeState(stateTableTypeOptions[0]); // Reset para o primeiro tipo estadual (tabela1)
    setStateIndicatorTypeState(stateIndicatorTypeOptions[0]); // Reset para o primeiro tipo de indicador estadual
    setMunicipalIndicatorTypeState(municipalIndicatorTypeOptions[0]); // Reset para o primeiro tipo de indicador municipal
    
    onFilterChange({
      codigoMunicipio: null,
      nomeMunicipio: null,
      territorioDeDesenvolvimentoMunicipio: null,
      faixaPopulacionalMunicipio: null,
      aglomeradoMunicipio: null,
      gerenciaRegionalMunicipio: null,
      anoInicial: 2007,
      anoFinal: 2024,
      tableType: 'ownRevenues',
      stateTableType: 'tabela1',
      stateIndicatorType: 'revenueComposition',
      municipalIndicatorType: 'constitutionalLimitMde',
      loading: false,
    });
  };



  return (
    <div className="flex flex-col gap-4 p-0 m-0 w-full">
      {/* Header de Filtros */}
      <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3 mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
      </div>

      {/* Filtros recolhíveis */}
      <div className="flex flex-col gap-3 w-full">
        {/* Filtros de Município - Exibidos apenas quando showMunicipioFilters é true */}
        {showMunicipioFilters && (
          <>
            {/* Município - Sempre visível */}
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-600 mb-1">Município</label>
              <Select
                value={selectedMunicipioState}
                onChange={setSelectedMunicipio}
                options={filteredMunicipioOptions}
                placeholder="Selecione..."
                size="xs"
                isClearable
              />
            </div>

            {/* Collapser para filtros de localização */}
            <Collapse in={filtersExpanded} timeout="auto" unmountOnExit>
              <div className="flex flex-col gap-3 w-full border-t pt-3">
                {/* Território */}
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Território</label>
                  <Select
                    value={territorioState}
                    onChange={setTerritorioDeDesenvolvimentoMunicipio}
                    options={filteredTerritorioOptions}
                    placeholder="Selecione..."
                    size="xs"
                    isClearable
                    disabled={otherLocalityDisabled}
                  />
                </div>

                {/* Faixa Populacional */}
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Faixa Populacional</label>
                  <Select
                    value={faixaState}
                    onChange={setFaixaPopulacionalMunicipio}
                    options={filteredFaixaPopulacionalOptions}
                    placeholder="Selecione..."
                    size="xs"
                    isClearable
                    disabled={otherLocalityDisabled}
                  />
                </div>

                {/* Aglomerado */}
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Aglomerado</label>
                  <Select
                    value={aglomeradoState}
                    onChange={setAglomeradoMunicipio}
                    options={filteredAglomeradoOptions}
                    placeholder="Selecione..."
                    size="xs"
                    isClearable
                    disabled={otherLocalityDisabled}
                  />
                </div>

                {/* Gerência */}
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Gerência Regional</label>
                  <Select
                    value={gerenciaState}
                    onChange={setGerenciaRegionalMunicipio}
                    options={filteredGerenciaOptions}
                    placeholder="Selecione..."
                    size="xs"
                    isSearchable={false}
                    isClearable
                    disabled={otherLocalityDisabled}
                  />
                </div>
              </div>
            </Collapse>
          </>
        )}

        {/* Tipo de Dados Municipal - Exibido apenas quando showTableTypeFilter é true */}
        {showTableTypeFilter && (
          <div className="w-full border-t pt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Dados</label>
            <Select
              value={tableTypeState}
              onChange={setTableTypeState}
              options={tableTypeOptions}
              placeholder="Selecione o tipo..."
              size="xs"
            />
          </div>
        )}

        {/* Tipo de Dados Estadual - Exibido apenas quando showStateTableTypeFilter é true */}
        {showStateTableTypeFilter && (
          <div className="w-full border-t pt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Dados</label>
            <Select
              value={stateTableTypeState}
              onChange={setStateTableTypeState}
              options={stateTableTypeOptions}
              placeholder="Selecione o tipo..."
              size="xs"
            />
          </div>
        )}

        {/* Tipo de Indicador Estadual - Exibido apenas quando showStateIndicatorTypeFilter é true */}
        {showStateIndicatorTypeFilter && (
          <div className="w-full border-t pt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Indicador</label>
            <Select
              value={stateIndicatorTypeState}
              onChange={setStateIndicatorTypeState}
              options={stateIndicatorTypeOptions}
              placeholder="Selecione o indicador..."
              size="xs"
            />
          </div>
        )}

        {/* Tipo de Indicador Municipal - Exibido apenas quando showMunicipalIndicatorTypeFilter é true */}
        {showMunicipalIndicatorTypeFilter && (
          <div className="w-full border-t pt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Indicador</label>
            <Select
              value={municipalIndicatorTypeState}
              onChange={setMunicipalIndicatorTypeState}
              options={municipalIndicatorTypeOptions}
              placeholder="Selecione o indicador..."
              size="xs"
            />
          </div>
        )}

        {/* Período */}
        <div className="w-full border-t pt-3">
          <label className="block text-xs font-medium text-gray-600 mb-2">Período</label>
          <YearRangeFilter
            startYear={filters.anoInicial}
            endYear={filters.anoFinal}
            onStartYearChange={(year) => setFilters({...filters, anoInicial: year})}
            onEndYearChange={(year) => setFilters({...filters, anoFinal: year})}
            minYear={2007}
            maxYear={2024}
          />
        </div>

        {/* Botões */}
        <div className="flex flex-col gap-2 w-full pt-3 border-t">
          <Button
            variant="contained"
            onClick={handleSearch}
            fullWidth
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem'
            }}
          >
            Mostrar resultados
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            fullWidth
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
              backgroundColor: '#f0f0f0',
              color: '#000',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              }
            }}
          >
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
