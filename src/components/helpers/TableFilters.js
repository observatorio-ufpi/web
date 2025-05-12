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
      <div className="filter-form">
        <Select
          className="filter-item"
          value={selectedMunicipioState}
          onChange={setSelectedMunicipio}
          options={municipioOptions}
          placeholder="Município"
          isClearable
          isSearchable
        />

        <Select
          className="filter-item filter-item-territorio"
          value={territorioState}
          onChange={setTerritorioDeDesenvolvimentoMunicipio}
          options={Object.keys(Regioes).map(key => ({ value: key, label: Regioes[key] }))}
          placeholder="Território de Desenvolvimento"
          isClearable
          isSearchable
        />

        <Select
          className="filter-item"
          value={faixaState}
          onChange={setFaixaPopulacionalMunicipio}
          options={Object.keys(FaixaPopulacional).map(key => ({ value: key, label: FaixaPopulacional[key] }))}
          placeholder="Faixa Populacional"
          isClearable
          isSearchable
        />

        <Select
          className="filter-item"
          value={aglomeradoState}
          onChange={setAglomeradoMunicipio}
          options={aglomeradoOptions}
          placeholder="Aglomerado"
          isClearable
        />

        <Select
          className="filter-item"
          value={gerenciaState}
          onChange={setGerenciaRegionalMunicipio}
          options={gerenciaOptions}
          placeholder="Gerência"
          isClearable
        />

        <Select
          className="filter-item"
          value={anoInicialState}
          onChange={setAnoInicial}
          options={anoOptions}
          placeholder="Ano Inicial"
          isClearable
        />

        <Select
          className="filter-item"
          value={anoFinalState}
          onChange={setAnoFinal}
          options={anoOptions}
          placeholder="Ano Final"
          isClearable
        />
      </div>

      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{ alignSelf: 'flex-end' }}
      >
        Filtrar
      </Button>
    </div>
  );
};

export default FilterComponent;
