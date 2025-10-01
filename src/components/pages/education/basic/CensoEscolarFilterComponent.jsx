import React, { useMemo } from 'react';
import { Button } from '@mui/material';
import { Select } from '../../../ui';
import { municipios } from '../../../../utils/citiesMapping';
import '../../../../style/TableFilters.css';

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
}) {
  const yearOptions = useMemo(() => {
    return Array.from(
      { length: 2024 - 2007 + 1 },
      (_, i) => 2007 + i
    ).map((year) => ({
      value: year,
      label: year.toString(),
    }));
  }, []);

  const cityOptions = Object.entries(municipios).map(([key, { nomeMunicipio }]) => ({
    value: key,
    label: nomeMunicipio,
  }));

  return (
    <div className="filter-container">
      <div className="filter-grid">
        <div className="filter-item filter-municipio">
          <Select
            id="citySelect"
            value={cityOptions.find(option => option.value === city) || null}
            onChange={(selectedOption) => setCity(selectedOption ? selectedOption.value : '')}
            options={cityOptions}
            placeholder="Cidade"
            size="xs"
          />
        </div>

        <div className="filter-item filter-ano-select">
          <div className="historical-checkbox">
            <label>
              <input
                type="checkbox"
                checked={isHistorical}
                onChange={(e) => setIsHistorical(e.target.checked)}
              />
              <span>Série Histórica</span>
            </label>

            {isHistorical ? (
              <div className="flex-row-gap-3">
                <Select
                  id="startYearSelect"
                  value={yearOptions.find(option => option.value === startYear)}
                  onChange={(selectedOption) => setStartYear(selectedOption.value)}
                  options={yearOptions}
                  placeholder="Ano Inicial"
                  size="xs"
                />
                <Select
                  id="endYearSelect"
                  value={yearOptions.find(option => option.value === endYear)}
                  onChange={(selectedOption) => setEndYear(selectedOption.value)}
                  options={yearOptions.filter(option => option.value >= startYear)}
                  placeholder="Ano Final"
                  size="xs"
                />
              </div>
            ) : (
              <Select
                id="yearSelect"
                value={yearOptions.find(option => option.value === year)}
                onChange={(selectedOption) => setYear(selectedOption.value)}
                options={yearOptions}
                placeholder="Ano"
                size="xs"
              />
            )}
          </div>
        </div>

        <div className="filter-item filter-categorias">
          <Select
            id="multiFilterSelect"
            value={selectedFilters}
            onChange={(newValue) => setSelectedFilters(newValue)}
            options={filterOptions}
            isMulti
            placeholder="Selecione as categorias"
            size="xs"
          />
        </div>

        <div className="filter-button-container">
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilterClick}
            className="filter-button"
          >
            Filtrar
          </Button>

          <Button
            variant="contained"
            onClick={handleClearFilters}
            className="filter-button clear-button"
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
