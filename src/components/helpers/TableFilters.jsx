import { Button, Collapse, Box, Typography } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import React, { useEffect, useState, useMemo } from 'react';
import { Select } from '../ui';
import YearRangeSlider from '../ui/YearRangeSlider';
import { FaixaPopulacional, municipios, Regioes } from '../../utils/municipios.mapping';

const findMunicipioCodigo = (nomeMunicipio) => {
  return Object.keys(municipios).find(
    codigo => municipios[codigo].nomeMunicipio === nomeMunicipio
  );
};

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

  // Estado para o range slider
  const [yearRange, setYearRange] = useState([2007, 2024]);

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
    setYearRange([anoInicial || 2007, anoFinal || 2024]);
  }, [selectedMunicipio, territorioDeDesenvolvimentoMunicipio, faixaPopulacionalMunicipio, aglomeradoMunicipio, gerenciaRegionalMunicipio, anoInicial, anoFinal]);

  const handleSearch = () => {
    onFilterChange({
      codigoMunicipio: selectedMunicipioState ? selectedMunicipioState.value : null,
      territorioDeDesenvolvimentoMunicipio: territorioState ? territorioState.value : null,
      faixaPopulacionalMunicipio: faixaState ? faixaState.value : null,
      aglomeradoMunicipio: aglomeradoState ? aglomeradoState.value : null,
      gerenciaRegionalMunicipio: gerenciaState ? gerenciaState.value : null,
      anoInicial: yearRange[0],
      anoFinal: yearRange[1],
      loading: true,
    });
  };

  const handleClearFilters = () => {
    setSelectedMunicipio(null);
    setTerritorioDeDesenvolvimentoMunicipio(null);
    setFaixaPopulacionalMunicipio(null);
    setAglomeradoMunicipio(null);
    setGerenciaRegionalMunicipio(null);
    setYearRange([2007, 2024]);
    
    onFilterChange({
      codigoMunicipio: null,
      territorioDeDesenvolvimentoMunicipio: null,
      faixaPopulacionalMunicipio: null,
      aglomeradoMunicipio: null,
      gerenciaRegionalMunicipio: null,
      anoInicial: 2007,
      anoFinal: 2024,
      loading: false,
    });
  };



  return (
    <div className="flex flex-col gap-4 p-0 m-0">
      {/* Filtros recolhíveis */}
      <Collapse in={filtersExpanded} timeout="auto" unmountOnExit>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Território - Segunda e terceira colunas, primeira linha */}
              <div className="md:col-span-1">
                <Select
                  value={territorioState}
                  onChange={setTerritorioDeDesenvolvimentoMunicipio}
                  options={filteredTerritorioOptions}
                  placeholder="Território de Desenvolvimento"
                  size="xs"
                  isClearable
                  disabled={otherLocalityDisabled}
                />
              </div>

              {/* Faixa Populacional - Primeira coluna, segunda linha */}
              <div className="md:col-span-1">
                <Select
                  value={faixaState}
                  onChange={setFaixaPopulacionalMunicipio}
                  options={filteredFaixaPopulacionalOptions}
                  placeholder="Faixa Populacional"
                  size="xs"
                  isClearable
                  disabled={otherLocalityDisabled}
                />
              </div>

              {/* Aglomerado - Segunda coluna, segunda linha */}
              <div className="md:col-span-1">
                <Select
                  value={aglomeradoState}
                  onChange={setAglomeradoMunicipio}
                  options={filteredAglomeradoOptions}
                  placeholder="Aglomerado - AG"
                  size="xs"
                  isClearable
                  disabled={otherLocalityDisabled}
                />
              </div>

              {/* Gerência - Terceira coluna, segunda linha */}
              <div className="md:col-span-1">
                <Select
                  value={gerenciaState}
                  onChange={setGerenciaRegionalMunicipio}
                  options={filteredGerenciaOptions}
                  placeholder="Gerência Regional de Ensino - GRE"
                  size="xs"
                  isSearchable={false}
                  isClearable
                  disabled={otherLocalityDisabled}
                />
              </div>

              {/* Município - Primeira coluna, primeira linha */}
              <div className="md:col-span-1">
                <Select
                  value={selectedMunicipioState}
                  onChange={setSelectedMunicipio}
                  options={filteredMunicipioOptions}
                  placeholder="Município"
                  size="xs"
                  isClearable
                />
              </div>
            </div>
          </div>
      </Collapse>

        {/* Período - Todas as colunas, primeira linha */}
        <div className="md:col-span-3">
          <YearRangeSlider
            minYear={2007}
            maxYear={2024}
            value={yearRange}
            onChange={setYearRange}
          />
        </div>

        {/* Botões Filtrar e Limpar - Todas as colunas, segunda linha */}
        <div className="md:col-span-3 flex justify-end gap-3 mt-4">
          <Button
            variant="contained"
            onClick={handleSearch}
            className="w-full md:w-auto min-w-[120px] px-4 py-1.5"
          >
            Mostrar resultados
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            className="w-full md:w-auto min-w-[120px] px-4 py-1.5"
            sx={{
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
  );
};

export default FilterComponent;
