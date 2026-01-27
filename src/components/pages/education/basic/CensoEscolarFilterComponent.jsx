import React, { useMemo, useEffect, useState } from "react";
import { Button, Collapse } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Select } from "../../../ui";
import YearRangeSlider from "../../../ui/YearRangeSlider";
import {
  municipios,
  Regioes,
  FaixaPopulacional,
} from "../../../../utils/citiesMapping";

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
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [yearRange, setYearRange] = useState([2007, 2024]);

  const cityOptions = Object.entries(municipios).map(
    ([key, { nomeMunicipio }]) => ({
      value: key,
      label: nomeMunicipio,
    }),
  );

  const baseFilteredMunicipios = useMemo(() => {
    const territoryLabel = territory ? Regioes[territory] : null;
    const faixaLabel = faixaPopulacional
      ? FaixaPopulacional[faixaPopulacional]
      : null;

    return Object.values(municipios).filter((m) => {
      if (territoryLabel && m.territorioDesenvolvimento !== territoryLabel)
        return false;
      if (faixaLabel && m.faixaPopulacional !== faixaLabel) return false;
      if (aglomerado && String(m.aglomerado) !== String(aglomerado))
        return false;
      if (gerencia) {
        const gerencias = String(m.gerencia)
          .split(",")
          .map((g) => g.trim());
        if (!gerencias.includes(String(gerencia))) return false;
      }
      return true;
    });
  }, [territory, faixaPopulacional, aglomerado, gerencia]);

  const filteredCityOptions = useMemo(() => {
    return Object.entries(municipios)
      .filter(([, m]) => baseFilteredMunicipios.includes(m))
      .map(([key, { nomeMunicipio }]) => ({
        value: key,
        label: nomeMunicipio,
      }));
  }, [baseFilteredMunicipios]);

  const filteredTerritorioOptions = useMemo(() => {
    const uniqueLabels = [
      ...new Set(
        baseFilteredMunicipios
          .map((m) => m.territorioDesenvolvimento)
          .filter(Boolean),
      ),
    ];
    return Object.entries(Regioes)
      .filter(([, label]) => uniqueLabels.includes(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const filteredFaixaPopulacionalOptions = useMemo(() => {
    const uniqueLabels = [
      ...new Set(
        baseFilteredMunicipios.map((m) => m.faixaPopulacional).filter(Boolean),
      ),
    ];
    return Object.entries(FaixaPopulacional)
      .filter(([, label]) => uniqueLabels.includes(label))
      .map(([id, label]) => ({ value: id, label }));
  }, [baseFilteredMunicipios]);

  const filteredAglomeradoOptions = useMemo(() => {
    return [
      ...new Set(
        baseFilteredMunicipios
          .map((m) => m.aglomerado)
          .filter((a) => a && a !== "undefined"),
      ),
    ]
      .sort((a, b) => Number(a) - Number(b))
      .map((a) => ({ value: a, label: `AG ${a}` }));
  }, [baseFilteredMunicipios]);

  const filteredGerenciaOptions = useMemo(() => {
    return [
      ...new Set(
        baseFilteredMunicipios
          .map((m) => m.gerencia)
          .filter((g) => g && g !== "undefined")
          .flatMap((g) =>
            g.includes(",") ? g.split(",").map((x) => x.trim()) : [g],
          ),
      ),
    ]
      .sort((a, b) => Number(a) - Number(b))
      .map((g) => ({ value: g, label: `${g}ª GRE` }));
  }, [baseFilteredMunicipios]);

  const otherLocalityDisabled = !!city;

  const useClearInvalidFilter = (value, setter, options) => {
    useEffect(() => {
      if (value && options.length > 0) {
        const exists = options.some((opt) => opt.value === value);
        if (!exists) {
          setter("");
        }
      }
    }, [value, setter, options]);
  };

  useClearInvalidFilter(city, setCity, filteredCityOptions);
  useClearInvalidFilter(territory, setTerritory, filteredTerritorioOptions);
  useClearInvalidFilter(
    faixaPopulacional,
    setFaixaPopulacional,
    filteredFaixaPopulacionalOptions,
  );
  useClearInvalidFilter(aglomerado, setAglomerado, filteredAglomeradoOptions);
  useClearInvalidFilter(gerencia, setGerencia, filteredGerenciaOptions);

  useEffect(() => {
    if (city) {
      setTerritory("");
      setFaixaPopulacional("");
      setAglomerado("");
      setGerencia("");
    }
  }, [city]);

  const handleFilterClickWithYears = () => {
    const startYr = yearRange[0];
    const endYr = yearRange[1];
    console.log("handleFilterClickWithYears - yearRange:", yearRange);
    console.log(
      "handleFilterClickWithYears - startYear:",
      startYr,
      "endYear:",
      endYr,
    );
    handleFilterClick({
      selectedFilters,
      city,
      territory,
      faixaPopulacional,
      aglomerado,
      gerencia,
      startYear: startYr,
      endYear: endYr,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-0 m-0">
      {/* Tipo + Botão Mais Filtros - Primeira linha */}
      <div className="flex flex-col lg:flex-row items-end gap-4">
        <div className="w-full lg:flex-1">
          <label
            htmlFor="multiFilterSelect"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo:
          </label>
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
      </div>

      {/* Filtros visivel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200">
        {/* Território */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Território:
          </label>
          <Select
            id="territorySelect"
            value={
              territory ? { value: territory, label: Regioes[territory] } : null
            }
            onChange={(selectedOption) =>
              setTerritory(selectedOption ? selectedOption.value : "")
            }
            options={filteredTerritorioOptions}
            placeholder="Território de Desenvolvimento"
            size="xs"
            isClearable
            disabled={otherLocalityDisabled}
          />
        </div>

        {/* Faixa Populacional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faixa Populacional:
          </label>
          <Select
            id="faixaPopulacionalSelect"
            value={
              faixaPopulacional
                ? {
                    value: faixaPopulacional,
                    label: FaixaPopulacional[faixaPopulacional],
                  }
                : null
            }
            onChange={(selectedOption) =>
              setFaixaPopulacional(selectedOption ? selectedOption.value : "")
            }
            options={filteredFaixaPopulacionalOptions}
            placeholder="Faixa Populacional"
            size="xs"
            isClearable
            disabled={otherLocalityDisabled}
          />
        </div>

        {/* Aglomerado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aglomerado:
          </label>
          <Select
            id="aglomeradoSelect"
            value={
              aglomerado
                ? { value: aglomerado, label: `AG ${aglomerado}` }
                : null
            }
            onChange={(selectedOption) =>
              setAglomerado(selectedOption ? selectedOption.value : "")
            }
            options={filteredAglomeradoOptions}
            placeholder="Aglomerado - AG"
            size="xs"
            isClearable
            disabled={otherLocalityDisabled}
          />
        </div>

        {/* Gerência */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gerência:
          </label>
          <Select
            id="gerenciaSelect"
            value={
              gerencia ? { value: gerencia, label: `${gerencia}ª GRE` } : null
            }
            onChange={(selectedOption) =>
              setGerencia(selectedOption ? selectedOption.value : "")
            }
            options={filteredGerenciaOptions}
            placeholder="Gerência Regional de Ensino - GRE"
            size="xs"
            isClearable
            disabled={otherLocalityDisabled}
          />
        </div>

        {/* Município */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Município:
          </label>
          <Select
            id="citySelect"
            value={
              (filteredCityOptions.length > 0
                ? filteredCityOptions
                : cityOptions
              ).find((option) => option.value === city) || null
            }
            onChange={(selectedOption) =>
              setCity(selectedOption ? selectedOption.value : "")
            }
            options={
              filteredCityOptions.length > 0 ? filteredCityOptions : cityOptions
            }
            placeholder="Município"
            size="xs"
            isClearable
          />
        </div>
      </div>

      {/* Período - Seleção de Anos (Substituindo o Slider) */}
      <div className="py-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            De:
          </label>
          <Select
            id="startYearSelect"
            value={{ value: yearRange[0], label: String(yearRange[0]) }}
            options={Array.from({ length: 2024 - 2007 + 1 }, (_, i) => ({
              value: 2007 + i,
              label: String(2007 + i),
            }))}
            onChange={(opt) => setYearRange([opt.value, yearRange[1]])}
            size="xs"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Até:
          </label>
          <Select
            id="endYearSelect"
            value={{ value: yearRange[1], label: String(yearRange[1]) }}
            options={Array.from({ length: 2024 - 2007 + 1 }, (_, i) => ({
              value: 2007 + i,
              label: String(2007 + i),
            }))}
            onChange={(opt) => setYearRange([yearRange[0], opt.value])}
            size="xs"
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilterClickWithYears}
          className="w-full sm:w-auto"
        >
          Mostrar Resultados
        </Button>

        <Button
          variant="contained"
          onClick={handleClearFilters}
          className="w-full sm:w-auto"
          sx={{
            backgroundColor: "#f0f0f0",
            color: "#000",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          Limpar
        </Button>
      </div>
    </div>
  );
}

export default CensoEscolarFilterComponent;
