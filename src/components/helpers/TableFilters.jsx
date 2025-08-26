import { Button, Grid, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Select } from '../ui';
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

  const gerenciaOptions = [...new Set(Object.values(municipios).map(m => m.gerenciaRegional))].map(gerencia => ({
    value: gerencia,
    label: `Gerência ${gerencia}`,
  }));

  const anoOptions = Array.from({ length: 18 }, (_, i) => 2006 + i).map(ano => ({
    value: ano,
    label: ano,
  }));

  return (
    <Box sx={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          marginTop: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gridTemplateRows: 'auto auto auto',
          gap: 2,
        }}
      >
        {/* Município - Primeira coluna, primeira linha */}
        <Grid item sx={{ gridColumn: 1, gridRow: 1 }}>
          <Select
            value={selectedMunicipioState}
            onChange={setSelectedMunicipio}
            options={municipioOptions}
            placeholder="Município"
            size="small"
          />
        </Grid>

        {/* Território - Segunda e terceira colunas, primeira linha */}
        <Grid item sx={{ gridColumn: { xs: 1, md: '2 / span 2' }, gridRow: 1 }}>
          <Select
            value={territorioState}
            onChange={setTerritorioDeDesenvolvimentoMunicipio}
            options={Object.keys(Regioes).map(key => ({ value: key, label: Regioes[key] }))}
            placeholder="Território de Desenvolvimento"
            size="small"
          />
        </Grid>

        {/* Faixa Populacional - Primeira coluna, segunda linha */}
        <Grid item sx={{ gridColumn: 1, gridRow: 2 }}>
          <Select
            value={faixaState}
            onChange={setFaixaPopulacionalMunicipio}
            options={Object.keys(FaixaPopulacional).map(key => ({ value: key, label: FaixaPopulacional[key] }))}
            placeholder="Faixa Populacional"
            size="small"
          />
        </Grid>

        {/* Aglomerado - Segunda coluna, segunda linha */}
        <Grid item sx={{ gridColumn: 2, gridRow: 2 }}>
          <Select
            value={aglomeradoState}
            onChange={setAglomeradoMunicipio}
            options={aglomeradoOptions}
            placeholder="Aglomerado"
            size="small"
          />
        </Grid>

        {/* Gerência - Terceira coluna, segunda linha */}
        <Grid item sx={{ gridColumn: 3, gridRow: 2 }}>
          <Select
            value={gerenciaState}
            onChange={setGerenciaRegionalMunicipio}
            options={gerenciaOptions}
            placeholder="Gerência"
            size="small"
          />
        </Grid>

        {/* Ano Inicial - Primeira coluna, terceira linha */}
        <Grid item sx={{ gridColumn: 1, gridRow: 3 }}>
          <Select
            value={anoInicialState}
            onChange={setAnoInicial}
            options={anoOptions}
            placeholder="Ano Inicial"
            size="small"
          />
        </Grid>

        {/* Ano Final - Segunda coluna, terceira linha */}
        <Grid item sx={{ gridColumn: 2, gridRow: 3 }}>
          <Select
            value={anoFinalState}
            onChange={setAnoFinal}
            options={anoOptions}
            size="small"
          />
        </Grid>

        {/* Botão Filtrar - Terceira coluna, terceira linha */}
        <Grid item sx={{ 
          gridColumn: 3, 
          gridRow: 3, 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'flex-end' 
        }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              minWidth: '120px',
              minWidth: { xs: '100%', sm: '100%', md: 'auto' },
              padding: { xs: '6px 20px', sm: '6px 20px', md: '6px 16px' },
              marginTop: { xs: '5px', sm: '0' },
            }}
          >
            Filtrar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterComponent;
