import React, { useMemo, useEffect, useState } from 'react';
import { Button, Collapse, Box } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Select } from '../../../ui';
import YearRangeSlider from '../../../ui/YearRangeSlider';
import { municipios, Regioes, FaixaPopulacional } from '../../../../utils/citiesMapping';


function CensoEscolarFilterComponent({
  city,
  setCity,
  selectedFilters,
  setSelectedFilters,
  handleFilterClick,
  handleClearFilters,
  filterOptions,
  faixaPopulacional,
  setFaixaPopulacional,
  aglomerado,
  setAglomerado,
  gerencia,
  setGerencia,
  territory,
  setTerritory,
}) {
  // Estado para controlar se os filtros estão expandidos
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Estado para o range slider
  const [yearRange, setYearRange] = useState([2007, 2024]);

  const cityOptions = Object.entries(municipios).map(([key, { nomeMunicipio }]) => ({
    value: key,
    label: nomeMunicipio,
  }));

  const baseFilteredMunicipios = useMemo(() => {
    const territoryLabel = territory ? Regioes[territory] : null;
    const faixaLabel = faixaPopulacional ? FaixaPopulacional[faixaPopulacional] : null;

    return Object.values(municipios).filter((m) => {
      if (territoryLabel && m.territorioDesenvolvimento !== territoryLabel) return false;
      if (faixaLabel && m.faixaPopulacional !== faixaLabel) return false;
      if (aglomerado && String(m.aglomerado) !== String(aglomerado)) return false;
      if (gerencia) {
        const gerencias = String(m.gerencia).split(',').map((g) => g.trim());
        if (!gerencias.includes(String(gerencia))) return false;
      }
      return true;
    });
  }, [territory, faixaPopulacional, aglomerado, gerencia]);

  const filteredCityOptions = useMemo(() => {
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

  const otherLocalityDisabled = !!city;

  const useClearInvalidFilter = (value, setter, options) => {
    useEffect(() => {
      if (value && options.length > 0) {
        const exists = options.some((opt) => opt.value === value);
        if (!exists) {
          setter('');
        }
      }
    }, [value, setter, options]);
  };

  useClearInvalidFilter(city, setCity, filteredCityOptions);
  useClearInvalidFilter(territory, setTerritory, filteredTerritorioOptions);
  useClearInvalidFilter(faixaPopulacional, setFaixaPopulacional, filteredFaixaPopulacionalOptions);
  useClearInvalidFilter(aglomerado, setAglomerado, filteredAglomeradoOptions);
  useClearInvalidFilter(gerencia, setGerencia, filteredGerenciaOptions);

  // Limpar filtros de localização quando um município específico é selecionado
  useEffect(() => {
    if (city) {
      setTerritory('');
      setFaixaPopulacional('');
      setAglomerado('');
      setGerencia('');
    }
  }, [city]);

  // Função para lidar com o clique do filtro incluindo os anos do range slider
  const handleFilterClickWithYears = () => {
    handleFilterClick({
      selectedFilters,
      city,
      territory,
      faixaPopulacional,
      aglomerado,
      gerencia,
      startYear: yearRange[0],
      endYear: yearRange[1],
    });
  };

  return (
    <div className="flex flex-col gap-4 p-0 m-0">
        {/* Tipo + Botão Mais Filtros - Primeira linha */}
        <div className="md:col-span-3">
          <div className="flex flex-col lg:flex-row items-end gap-4">
            <div className="w-full lg:flex-1">
              <label htmlFor="multiFilterSelect" className="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
              <Select
                id="multiFilterSelect"
                value={selectedFilters}
                onChange={(newValue) => setSelectedFilters(newValue)}
                options={filterOptions}
                isMulti
                placeholder="Aspectos da Infraestrutura"
                size="xs"
              />
            </div>

            {/* Botão de toggle para filtros adicionais */}
            <div className="w-full lg:w-auto">
              <Button
                variant="outlined"
                size="small"
                startIcon={filtersExpanded ? <ExpandLess /> : <ExpandMore />}
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                sx={{
                  minWidth: 'auto',
                  padding: '8px 16px',
                  whiteSpace: 'nowrap',
                  height: 'fit-content',
                  width: { xs: '100%', lg: 'auto' }
                }}
              >
                {filtersExpanded ? 'Menos Filtros' : 'Mais Filtros'}
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros recolhíveis */}
        <Collapse in={filtersExpanded} timeout="auto" unmountOnExit>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Território - Primeira coluna, primeira linha */}
              <div className="md:col-span-1">
                <Select
                  id="territorySelect"
                  value={territory ? { value: territory, label: Regioes[territory] } : null}
                  onChange={(selectedOption) => setTerritory(selectedOption ? selectedOption.value : '')}
                  options={filteredTerritorioOptions}
                  placeholder="Território de Desenvolvimento"
                  size="xs"
                  isClearable
                  disabled={otherLocalityDisabled}
                />
              </div>

              {/* Faixa Populacional - Segunda coluna, primeira linha */}
              <div className="md:col-span-1">
                <Select
                  id="faixaPopulacionalSelect"
                  value={faixaPopulacional ? { value: faixaPopulacional, label: FaixaPopulacional[faixaPopulacional] } : null}
                  onChange={(selectedOption) => setFaixaPopulacional(selectedOption ? selectedOption.value : '')}
                  options={filteredFaixaPopulacionalOptions}
                  placeholder="Faixa Populacional"
                  size="xs"
                  isClearable
                  disabled={otherLocalityDisabled}
                />
              </div>

              {/* Aglomerado - Terceira coluna, primeira linha */}
              <div className="md:col-span-1">
                <Select
                  id="aglomeradoSelect"
                  value={aglomerado ? { value: aglomerado, label: `AG ${aglomerado}` } : null}
                  onChange={(selectedOption) => setAglomerado(selectedOption ? selectedOption.value : '')}
                  options={filteredAglomeradoOptions}
                  placeholder="Aglomerado - AG"
                  size="xs"
                  isClearable
                  disabled={otherLocalityDisabled}
                />
              </div>

              {/* Gerência - Primeira coluna, segunda linha */}
              <div className="md:col-span-1">
                <Select
                  id="gerenciaSelect"
                  value={gerencia ? { value: gerencia, label: `${gerencia}ª GRE` } : null}
                  onChange={(selectedOption) => setGerencia(selectedOption ? selectedOption.value : '')}
                  options={filteredGerenciaOptions}
                  placeholder="Gerência Regional de Ensino - GRE"
                  size="xs"
                  isClearable
                  disabled={otherLocalityDisabled}
                />
              </div>

              {/* Cidade - Segunda e terceira colunas, segunda linha */}
              <div className="md:col-span-1">
                <Select
                  id="citySelect"
                  value={(filteredCityOptions.length > 0 ? filteredCityOptions : cityOptions).find(option => option.value === city) || null}
                  onChange={(selectedOption) => setCity(selectedOption ? selectedOption.value : '')}
                  options={filteredCityOptions.length > 0 ? filteredCityOptions : cityOptions}
                  placeholder="Município"
                  size="xs"
                  isClearable
                />
              </div>
            </div>
          </div>
        </Collapse>

        {/* Período - Todas as colunas, terceira linha */}
        <div className="md:col-span-3">
          <YearRangeSlider
            minYear={2007}
            maxYear={2024}
            value={yearRange}
            onChange={setYearRange}
          />
        </div>

        {/* Botões - Todas as colunas, quarta linha */}
        <div className="md:col-span-3 flex justify-end mt-4">
          <div className="flex gap-3">
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilterClickWithYears}
              className="w-full md:w-auto min-w-[120px] px-4 py-1.5"
            >
              Mostrar Resultados
            </Button>

            <Button
              variant="contained"
              onClick={handleClearFilters}
              className="w-full md:w-auto min-w-[120px] px-4 py-1.5"
              sx={{
                backgroundColor: '#f0f0f0',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            >
              Limpar
            </Button>
          </div>
        </div>
      </div>
  );
}

export default CensoEscolarFilterComponent;
