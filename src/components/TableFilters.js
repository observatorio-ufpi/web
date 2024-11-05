import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import Select from 'react-select';
import '../style/TableFilters.css'; // Importa o arquivo CSS
import { FaixaPopulacional, municipios, Regioes } from '../utils/municipios.mapping'; // Ajuste o caminho conforme necessário

const FilterComponent = ({ onFilterChange }) => {
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [territorioDeDesenvolvimentoMunicipio, setTerritorioDeDesenvolvimentoMunicipio] = useState(null);
  const [faixaPopulacionalMunicipio, setFaixaPopulacionalMunicipio] = useState(null);
  const [aglomeradoMunicipio, setAglomeradoMunicipio] = useState('');
  const [gerenciaRegionalMunicipio, setGerenciaMunicipio] = useState('');

  const handleSearch = () => {
    onFilterChange({
      selectedMunicipio: selectedMunicipio ? selectedMunicipio.label : null,
      territorioDeDesenvolvimentoMunicipio: territorioDeDesenvolvimentoMunicipio ? territorioDeDesenvolvimentoMunicipio.value : null,
      faixaPopulacionalMunicipio: faixaPopulacionalMunicipio ? faixaPopulacionalMunicipio.value : null,
      aglomeradoMunicipio,
      gerenciaRegionalMunicipio,
      loading: true,
    });
  };

  const municipioOptions = Object.keys(municipios).map((codigo) => ({
    value: codigo,
    label: municipios[codigo].nomeMunicipio,
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

        <TextField
          className="filter-item"
          value={aglomeradoMunicipio}
          onChange={(e) => setAglomeradoMunicipio(e.target.value)}
          label="Aglomerado"
          variant="outlined"
          size="small"
        />

        <TextField
          className="filter-item"
          value={gerenciaRegionalMunicipio}
          onChange={(e) => setGerenciaMunicipio(e.target.value)}
          label="Gerência"
          variant="outlined"
          size="small"
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
