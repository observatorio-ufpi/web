import React, { useMemo, useEffect } from 'react';
import { Button } from '@mui/material';
import { Select } from '../../../ui';
import { municipios, Regioes, FaixaPopulacional } from '../../../../utils/citiesMapping';


function CensoEscolarFilterComponent({
  isHistorical,
  setIsHistorical,
  city,
  setCity,
  year,
  setYear,
  startYear,
  setStartYear,
  endYear,
  setEndYear,
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
  const yearOptions = useMemo(() => {
    return Array.from({ length: 2024 - 2007 + 1 }, (_, i) => 2007 + i).map((year) => ({
      value: year,
      label: year.toString(),
    }));
  }, []);

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

  return (
    <div className="flex flex-col gap-4 p-0 m-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {/* Tipo - Primeira coluna, primeira linha */}
        <div className="md:col-span-1">
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

        {/* Ano - Segunda e terceira colunas, primeira linha */}
        <div className="md:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={isHistorical}
                onChange={(e) => setIsHistorical(e.target.checked)}
                className="cursor-pointer"
              />
              <span className="font-medium text-gray-700">Série Histórica</span>
            </label>

            {isHistorical ? (
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                <div className="flex-1">
                  <label htmlFor="startYearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano Inicial:</label>
                  <Select
                    id="startYearSelect"
                    value={yearOptions.find(option => option.value === startYear)}
                    onChange={(selectedOption) => setStartYear(selectedOption.value)}
                    options={yearOptions}
                    placeholder="Ano Inicial"
                    size="xs"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="endYearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano Final:</label>
                  <Select
                    id="endYearSelect"
                    value={yearOptions.find(option => option.value === endYear)}
                    onChange={(selectedOption) => setEndYear(selectedOption.value)}
                    options={yearOptions.filter(option => option.value >= startYear)}
                    placeholder="Ano Final"
                    size="xs"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 w-full">
                <label htmlFor="yearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano:</label>
                <Select
                  id="yearSelect"
                  value={yearOptions.find(option => option.value === year)}
                  onChange={(selectedOption) => setYear(selectedOption.value)}
                  options={yearOptions}
                  placeholder="Ano"
                  size="xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* Território - Primeira coluna, segunda linha */}
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

        {/* Faixa Populacional - Segunda coluna, segunda linha */}
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

        {/* Aglomerado - Terceira coluna, segunda linha */}
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

        {/* Gerência - Primeira coluna, terceira linha */}
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

        {/* Cidade - Segunda coluna, terceira linha */}
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

        {/* Botões - Terceira coluna, terceira linha */}
        <div className="md:col-span-1 flex flex-col justify-end">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilterClick}
              className="w-full sm:w-auto"
            >
              Mostrar Resultados
            </Button>

            <Button
              variant="contained"
              onClick={handleClearFilters}
              className="w-full sm:w-auto"
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
    </div>
  );
}

export default CensoEscolarFilterComponent;