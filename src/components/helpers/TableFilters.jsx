import { Button, Collapse, Box, Typography } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
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

  const municipioOptions = Object.keys(municipios).map((codigo) => ({
    value: codigo,
    label: municipios[codigo].nomeMunicipio,
  }));

  const aglomeradoOptions = [...new Set(Object.values(municipios).map(m => m.aglomerado).filter(aglomerado => aglomerado && aglomerado !== 'undefined'))]
    .sort((a, b) => a - b) // Ordenar numericamente
    .map(aglomerado => ({
      value: aglomerado,
      label: `AG ${aglomerado}`,
    }));

  const gerenciaOptions = [...new Set(
    Object.values(municipios)
      .map(m => m.gerencia)
      .filter(gerencia => gerencia && gerencia !== 'undefined')
      .flatMap(gerencia => {
        // Se contém vírgula, separar em valores individuais
        if (gerencia.includes(',')) {
          return gerencia.split(',').map(g => g.trim());
        }
        return [gerencia];
      })
  )]
    .sort((a, b) => a - b) // Ordenar numericamente
    .map(gerencia => ({
      value: gerencia,
      label: `${gerencia}ª GRE`,
    }));


  return (
    <div className="flex flex-col gap-4 p-0 m-0">
      {/* Filtros recolhíveis */}
      <Collapse in={filtersExpanded} timeout="auto" unmountOnExit>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Município - Primeira coluna, primeira linha */}
              <div className="md:col-span-1">
                <Select
                  value={selectedMunicipioState}
                  onChange={setSelectedMunicipio}
                  options={municipioOptions}
                  placeholder="Município"
                  size="xs"
                  isClearable
                />
              </div>

              {/* Território - Segunda e terceira colunas, primeira linha */}
              <div className="md:col-span-2">
                <Select
                  value={territorioState}
                  onChange={setTerritorioDeDesenvolvimentoMunicipio}
                  options={Object.keys(Regioes).map(key => ({ value: key, label: Regioes[key] }))}
                  placeholder="Território de Desenvolvimento"
                  size="xs"
                  isClearable
                />
              </div>

              {/* Faixa Populacional - Primeira coluna, segunda linha */}
              <div className="md:col-span-1">
                <Select
                  value={faixaState}
                  onChange={setFaixaPopulacionalMunicipio}
                  options={Object.keys(FaixaPopulacional).map(key => ({ value: key, label: FaixaPopulacional[key] }))}
                  placeholder="Faixa Populacional"
                  size="xs"
                  isClearable
                />
              </div>

              {/* Aglomerado - Segunda coluna, segunda linha */}
              <div className="md:col-span-1">
                <Select
                  value={aglomeradoState}
                  onChange={setAglomeradoMunicipio}
                  options={aglomeradoOptions}
                  placeholder="Aglomerado - AG"
                  size="xs"
                  isClearable
                />
              </div>

              {/* Gerência - Terceira coluna, segunda linha */}
              <div className="md:col-span-1">
                <Select
                  value={gerenciaState}
                  onChange={setGerenciaRegionalMunicipio}
                  options={gerenciaOptions}
                  placeholder="Gerência Regional de Ensino - GRE"
                  size="xs"
                  isSearchable={false}
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

        {/* Botão Filtrar - Todas as colunas, segunda linha */}
        <div className="md:col-span-3 flex justify-end mt-4">
          <Button
            variant="contained"
            onClick={handleSearch}
            className="w-full md:w-auto min-w-[120px] px-4 py-1.5"
          >
            Filtrar
          </Button>
        </div>
      </div>
  );
};

export default FilterComponent;
