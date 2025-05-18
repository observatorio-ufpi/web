import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import '../../style/TableFilters.css';
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
}) => {
  // Referência para o portal dos menus dropdown
  const menuPortalTarget = typeof document !== 'undefined' ? document.body : null;

  const [filters, setFilters] = useState({
    nomeMunicipio: selectedMunicipio || '',
    territorioDeDesenvolvimentoMunicipio: territorioDeDesenvolvimentoMunicipio || '',
    faixaPopulacionalMunicipio: faixaPopulacionalMunicipio || '',
    aglomeradoMunicipio: aglomeradoMunicipio || '',
    gerenciaRegionalMunicipio: gerenciaRegionalMunicipio || '',
    anoInicial: 2006, // Ano inicial padrão
    anoFinal: new Date().getFullYear(), // Ano atual como padrão
  });

  // Converter os valores recebidos para o formato do react-select
  const [selectedMunicipioState, setSelectedMunicipio] = useState(
    selectedMunicipio ?
      {
        value: findMunicipioCodigo(selectedMunicipio),
        label: selectedMunicipio
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
    aglomeradoMunicipio ? { value: aglomeradoMunicipio, label: `Aglomerado ${aglomeradoMunicipio}` } : null
  );
  const [gerenciaState, setGerenciaRegionalMunicipio] = useState(
    gerenciaRegionalMunicipio ? { value: gerenciaRegionalMunicipio, label: `Gerência ${gerenciaRegionalMunicipio}` } : null
  );
  const [anoInicialState, setAnoInicial] = useState(
    filters.anoInicial ? { value: filters.anoInicial, label: filters.anoInicial } : null
  );
  const [anoFinalState, setAnoFinal] = useState(
    filters.anoFinal ? { value: filters.anoFinal, label: filters.anoFinal } : null
  );

  useEffect(() => {
    setSelectedMunicipio(
      selectedMunicipio ?
        {
          value: findMunicipioCodigo(selectedMunicipio),
          label: selectedMunicipio
        } :
        null
    );
    setTerritorioDeDesenvolvimentoMunicipio(territorioDeDesenvolvimentoMunicipio ? { value: territorioDeDesenvolvimentoMunicipio, label: Regioes[territorioDeDesenvolvimentoMunicipio] } : null);
    setFaixaPopulacionalMunicipio(faixaPopulacionalMunicipio ? { value: faixaPopulacionalMunicipio, label: FaixaPopulacional[faixaPopulacionalMunicipio] } : null);
    setAglomeradoMunicipio(aglomeradoMunicipio ? { value: aglomeradoMunicipio, label: `Aglomerado ${aglomeradoMunicipio}` } : null);
    setGerenciaRegionalMunicipio(gerenciaRegionalMunicipio ? { value: gerenciaRegionalMunicipio, label: `Gerência ${gerenciaRegionalMunicipio}` } : null);
    setAnoInicial(anoInicial ? { value: anoInicial, label: anoInicial } : null);
    setAnoFinal(anoFinal ? { value: anoFinal, label: anoFinal } : null);
  }, [selectedMunicipio, territorioDeDesenvolvimentoMunicipio, faixaPopulacionalMunicipio, aglomeradoMunicipio, gerenciaRegionalMunicipio, anoInicial, anoFinal]);

  const handleSearch = () => {
    onFilterChange({
      selectedMunicipio: selectedMunicipioState ? municipios[selectedMunicipioState.value]?.nomeMunicipio : null,
      territorioDeDesenvolvimentoMunicipio: territorioState ? territorioState.value : null,
      faixaPopulacionalMunicipio: faixaState ? faixaState.value : null,
      aglomeradoMunicipio: aglomeradoState ? aglomeradoState.value : null,
      gerenciaRegionalMunicipio: gerenciaState ? gerenciaState.value : null,
      anoInicial: anoInicialState ? anoInicialState.value : null,
      anoFinal: anoFinalState ? anoFinalState.value : null,
      loading: true,
    });
  };

  const municipioOptions = Object.keys(municipios).map((codigo) => ({
    value: codigo,
    label: municipios[codigo].nomeMunicipio,
  }));

  const aglomeradoOptions = [...new Set(Object.values(municipios).map(m => m.aglomerado))].map(aglomerado => ({
    value: aglomerado,
    label: `Aglomerado ${aglomerado}`,
  }));

  const gerenciaOptions = [...new Set(Object.values(municipios).map(m => m.gerencia))].map(gerencia => ({
    value: gerencia,
    label: `Gerência ${gerencia}`,
  }));

  const anoOptions = Array.from({ length: new Date().getFullYear() - 2006 }, (_, i) => ({
    value: 2006 + i,
    label: 2006 + i,
  }));

  return (
    <div className="filter-container">
      <div className="filter-grid">
        <div className="filter-item filter-municipio">
          <Select
            value={selectedMunicipioState}
            onChange={setSelectedMunicipio}
            options={municipioOptions}
            placeholder="Município"
            isClearable
            isSearchable
            menuPlacement="bottom"
            menuPortalTarget={menuPortalTarget}
          />
        </div>

        <div className="filter-item filter-territorio">
          <Select
            value={territorioState}
            onChange={setTerritorioDeDesenvolvimentoMunicipio}
            options={Object.keys(Regioes).map(key => ({ value: key, label: Regioes[key] }))}
            placeholder="Território de Desenvolvimento"
            isClearable
            isSearchable
            menuPlacement="bottom"
            menuPortalTarget={menuPortalTarget}
          />
        </div>

        <div className="filter-item filter-faixa">
          <Select
            value={faixaState}
            onChange={setFaixaPopulacionalMunicipio}
            options={Object.keys(FaixaPopulacional).map(key => ({ value: key, label: FaixaPopulacional[key] }))}
            placeholder="Faixa Populacional"
            isClearable
            isSearchable
            menuPlacement="bottom"
            menuPortalTarget={menuPortalTarget}
          />
        </div>

        <div className="filter-item filter-aglomerado">
          <Select
            value={aglomeradoState}
            onChange={setAglomeradoMunicipio}
            options={aglomeradoOptions}
            placeholder="Aglomerado"
            isClearable
            menuPlacement="bottom"
            menuPortalTarget={menuPortalTarget}
          />
        </div>

        <div className="filter-item filter-gerencia">
          <Select
            value={gerenciaState}
            onChange={setGerenciaRegionalMunicipio}
            options={gerenciaOptions}
            placeholder="Gerência"
            isClearable
            menuPlacement="bottom"
            menuPortalTarget={menuPortalTarget}
          />
        </div>

        <div className="filter-item filter-ano-inicial">
          <Select
            value={anoInicialState}
            onChange={setAnoInicial}
            options={anoOptions}
            placeholder="Ano Inicial"
            isClearable
            menuPlacement="bottom"
            menuPortalTarget={menuPortalTarget}
          />
        </div>

        <div className="filter-item filter-ano-final">
          <Select
            value={anoFinalState}
            onChange={setAnoFinal}
            options={anoOptions}
            placeholder="Ano Final"
            isClearable
            menuPlacement="bottom"
            menuPortalTarget={menuPortalTarget}
          />
        </div>

        <div className="filter-button-container">
          <Button
            variant="contained"
            onClick={handleSearch}
            className="filter-button"
            sx={{
              minWidth: { xs: '100%', sm: '100%', md: 'auto' },
              padding: { xs: '6px 20px', sm: '6px 20px', md: '6px 16px' },
              marginTop: { xs: '5px', sm: '0' },
            }}
          >
            Filtrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
