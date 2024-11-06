import { Button } from '@mui/material';
import React, { useState } from 'react';
import Select from 'react-select';
import '../style/TableFilters.css';
import { FaixaPopulacional, municipios, Regioes } from '../utils/municipios.mapping';

const FilterComponent = ({ onFilterChange }) => {
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [territorioDeDesenvolvimentoMunicipio, setTerritorioDeDesenvolvimentoMunicipio] = useState(null);
  const [faixaPopulacionalMunicipio, setFaixaPopulacionalMunicipio] = useState(null);
  const [aglomeradoMunicipio, setAglomeradoMunicipio] = useState(null);
  const [gerenciaRegionalMunicipio, setGerenciaRegionalMunicipio] = useState(null);

  const handleSearch = () => {
    onFilterChange({
      selectedMunicipio: selectedMunicipio ? selectedMunicipio.label : null,
      territorioDeDesenvolvimentoMunicipio: territorioDeDesenvolvimentoMunicipio ? territorioDeDesenvolvimentoMunicipio.value : null,
      faixaPopulacionalMunicipio: faixaPopulacionalMunicipio ? faixaPopulacionalMunicipio.value : null,
      aglomeradoMunicipio: aglomeradoMunicipio ? aglomeradoMunicipio.value : null,
      gerenciaRegionalMunicipio: gerenciaRegionalMunicipio ? gerenciaRegionalMunicipio.value : null,
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

  return (
    <div className="filter-container">
      <div className="filter-form">
        <Select
          className="filter-item"
          value={selectedMunicipio}
          onChange={setSelectedMunicipio}
          options={municipioOptions}
          placeholder="Município"
          isClearable
          isSearchable
        />

        <Select
          className="filter-item"
          value={territorioDeDesenvolvimentoMunicipio}
          onChange={setTerritorioDeDesenvolvimentoMunicipio}
          options={Object.keys(Regioes).map(key => ({ value: key, label: Regioes[key] }))}
          placeholder="Território de Desenvolvimento"
          isClearable
          isSearchable
        />

        <Select
          className="filter-item"
          value={faixaPopulacionalMunicipio}
          onChange={setFaixaPopulacionalMunicipio}
          options={Object.keys(FaixaPopulacional).map(key => ({ value: key, label: FaixaPopulacional[key] }))}
          placeholder="Faixa Populacional"
          isClearable
          isSearchable
        />

        <Select
          className="filter-item"
          value={aglomeradoMunicipio}
          onChange={setAglomeradoMunicipio}
          options={aglomeradoOptions}
          placeholder="Aglomerado"
          isClearable
        />

        <Select
          className="filter-item"
          value={gerenciaRegionalMunicipio}
          onChange={setGerenciaRegionalMunicipio}
          options={gerenciaOptions}
          placeholder="Gerência"
          isClearable
        />
      </div>
      <Button
        className="filter-button"
        variant="contained"
        color="primary"
        onClick={handleSearch}
      >
        Filtrar
      </Button>
    </div>
  );
};

export default FilterComponent;
