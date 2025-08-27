import { Button, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Select } from '../../../ui';
import '../../../../style/RevenueTableContainer.css';
import '../../../../style/TableFilters.css';
import { FaixaPopulacional, municipios, Regioes } from '../../../../utils/citiesMapping';
import ApiHigherContainer from './ApiHigherComponent.jsx';
import DataTable from './DataTable.jsx';
import { useTheme } from '@mui/material/styles';
import { Loading } from "../../../ui";

function FilterComponent() {
  const [type, setType] = useState('university/count');
  const [isHistorical, setIsHistorical] = useState(false);
  const [city, setCity] = useState('');
  const [territory, setTerritory] = useState('');
  const [faixaPopulacional, setFaixaPopulacional] = useState('');
  const [aglomerado, setAglomerado] = useState('');
  const [gerencia, setGerencia] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [displayHistorical, setDisplayHistorical] = useState(false);
  const [isModalidadeSelected, setIsModalidadeSelected] = useState(false);
  const [isRegimeSelected, setIsRegimeSelected] = useState(false);
  const [isFormacaoDocenteSelected, setIsFormacaoDocenteSelected] = useState(false);
  const [isCategoriaAdministrativaSelected, setIsCategoriaAdministrativaSelected] = useState(false);
  const [isFaixaEtariaSuperiorSelected, setIsFaixaEtariaSuperiorSelected] = useState(false);
  const [isOrganizacaoAcademicaSelected, setIsOrganizacaoAcademicaSelected] = useState(false);


  const yearLimits = useMemo(() => ({
    'university/count': { min: 2020, max: 2023 },
    'university_enrollment': { min: 2020, max: 2023 },
    'university_teacher': { min: 2020, max: 2023 },
    'course_count': { min: 2020, max: 2023 }
  }), []);

  const getYearLimits = useMemo(() => {
    return yearLimits[type] || { min: 2000, max: 2023 };
  }, [type, yearLimits]);

  const yearOptions = useMemo(() => {
    return Array.from(
      { length: getYearLimits.max - getYearLimits.min + 1 },
      (_, i) => getYearLimits.min + i
    ).map((year) => ({
      value: year,
      label: year.toString(),
    }));
  }, [getYearLimits]);

  const [startYear, setStartYear] = useState(yearLimits['university/count'].min);
  const [endYear, setEndYear] = useState(yearLimits['university/count'].max);
  const [year, setYear] = useState(yearLimits['university/count'].max);

  useEffect(() => {
    setYear(getYearLimits.max);
    setStartYear(getYearLimits.min);
    setEndYear(getYearLimits.max);
  }, [getYearLimits]);

  const handleFilterClick = () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setTitle('');

    setIsHistorical(displayHistorical);

    const yearDisplay = displayHistorical ? `${startYear}-${endYear}` : year;

    let locationName = "Piauí";
    if (city) {
      const selectedCity = municipios[city];
      if (selectedCity) {
        locationName = selectedCity.nomeMunicipio;
      }
    }

    let filterInfo = [];

    // Adicionar território se selecionado
    if (territory) {
      filterInfo.push(`Território: ${Regioes[territory]}`);
    }

    // Adicionar faixa populacional se selecionada
    if (faixaPopulacional) {
      filterInfo.push(`Faixa Populacional: ${FaixaPopulacional[faixaPopulacional]}`);
    }

    // Adicionar aglomerado se selecionado
    if (aglomerado) {
      filterInfo.push(`Aglomerado: ${aglomerado}`);
    }

    // Adicionar gerência se selecionada
    if (gerencia) {
      filterInfo.push(`Gerência: ${gerencia}`);
    }

    if (selectedFilters.length > 0) {
      const filterNames = selectedFilters.map(filter => {
        switch(filter.value) {
          case 'modalidade': return 'Modalidade';
          case 'regimeDeTrabalho': return 'Regime de Trabalho';
          case 'formacaoDocente': return 'Formação Docente';
          case 'categoriaAdministrativa': return 'Categoria Administrativa';
          case 'faixaEtariaSuperior': return 'Faixa Etária';
          case 'organizacaoAcademica': return 'Organização Acadêmica';
          default: return filter.value;
        }
      });
      filterInfo.push(`Filtros: ${filterNames.join(', ')}`);
    }

    let fullTitle = `${titleMapping[type]} - ${locationName} (${yearDisplay})`;

    if (filterInfo.length > 0) {
      fullTitle += ` | ${filterInfo.join(' | ')}`;
    }

    setTitle(type ? fullTitle : '');

    setIsModalidadeSelected(selectedFilters.some(filter => filter.value === 'modalidade'));
    setIsRegimeSelected(selectedFilters.some(filter => filter.value === 'regimeDeTrabalho'));
    setIsFormacaoDocenteSelected(selectedFilters.some(filter => filter.value === 'formacaoDocente'));
    setIsCategoriaAdministrativaSelected(selectedFilters.some(filter => filter.value === 'categoriaAdministrativa'));
    setIsFaixaEtariaSuperiorSelected(selectedFilters.some(filter => filter.value === 'faixaEtariaSuperior'));
    setIsOrganizacaoAcademicaSelected(selectedFilters.some(filter => filter.value === 'organizacaoAcademica'));
  };

  const handleClearFilters = () => {
    setDisplayHistorical(false);
    setIsHistorical(false);
    setType('university/count');
    const limits = yearLimits['university/count'];
    setStartYear(limits.min);
    setEndYear(limits.max);
    setYear(limits.max);
    setCity('');
    setTerritory('');
    setFaixaPopulacional('');
    setAglomerado('');
    setGerencia('');
    setData(null);
    setError(null);
    setTitle('');
    setSelectedFilters([]);
  };

  const filterOptions = type === 'university_enrollment'
    ? [{ value: 'modalidade', label: 'Modalidade' }, { value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'faixaEtariaSuperior', label: 'Faixa Etária' },
       { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}]
    : type === 'university_teacher'
    ? [{ value: 'regimeDeTrabalho', label: 'Regime de Trabalho' }, { value: 'formacaoDocente', label: 'Formação Docente' }, { value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}]
    : type === 'course_count'
    ?[{ value: 'modalidade', label: 'Modalidade' }, { value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}]
    : [{ value: 'categoriaAdministrativa', label: 'Categoria Administrativa' }, { value: 'organizacaoAcademica', label: 'Organização Acadêmica'}];

  const titleMapping = {
    "university/count": "Número de intituições de ensino superior",
    "university_enrollment": "Número de matrículas",
    "university_teacher": "Número de docentes",
    "course_count": "Número de cursos"
  };

  const filteredCities = Object.entries(municipios).filter(([key, {
    territorioDesenvolvimento,
    faixaPopulacional: cityFaixaPopulacional,
    aglomerado: cityAglomerado,
    gerencia: cityGerencia
  }]) => {
    // Verifica todas as condições selecionadas
    const matchesTerritory = !territory || territorioDesenvolvimento === Regioes[territory];
    const matchesFaixaPopulacional = !faixaPopulacional || cityFaixaPopulacional === FaixaPopulacional[faixaPopulacional];
    const matchesAglomerado = !aglomerado || cityAglomerado === aglomerado;
    const matchesGerencia = !gerencia || cityGerencia === gerencia;

    // Retorna true apenas se TODAS as condições selecionadas são atendidas
    return matchesTerritory && matchesFaixaPopulacional && matchesAglomerado && matchesGerencia;
  });

  const typeOptions = Object.entries(titleMapping).map(([key, label]) => ({
    value: key,
    label: label,
  }));

  const territoryOptions = Object.entries(Regioes).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const faixaPopulacionalOptions = Object.entries(FaixaPopulacional).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const gerenciaOptions = [...new Set(Object.values(municipios).map(m => m.gerencia))]
    .flatMap(gerencia => gerencia.split(',').map(g => g.trim()))
    .filter(Boolean)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(gerencia => ({
      value: gerencia,
      label: 'Gerencia ' + gerencia.padStart(2, '0'),
    }));

  const aglomeradoOptions = [...new Set(Object.values(municipios).map(m => m.aglomerado))]
    .flatMap(aglomerado => aglomerado.split(',').map(a => a.trim()))
    .filter(Boolean)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(aglomerado => ({
      value: aglomerado,
      label: 'Aglomerado ' + aglomerado.padStart(2, '0'),
    }));

  const cityOptions = filteredCities.map(([key, { nomeMunicipio }]) => ({
    value: key,
    label: nomeMunicipio,
  }));

  const customStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const theme = useTheme();

  return (
    <div className="app-container">
      <div className="filter-container">
        <div className="filter-grid">
          {/* Tipo - Primeira coluna, primeira linha */}
          <div className="filter-municipio">
            <label htmlFor="typeSelect" className="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
            <Select
              id="typeSelect"
              value={typeOptions.find(option => option.value === type)}
              onChange={(selectedOption) => {
                setType(selectedOption.value);
                setSelectedFilters([]);
                // Se mudou para docentes, garantir que não há filtros selecionados
                if (selectedOption.value === 'university_teacher') {
                  setSelectedFilters([]);
                }
              }}
              options={typeOptions}
              placeholder="Selecione o tipo"
              size="small"
            />
          </div>

          {/* Ano - Segunda e terceira colunas, primeira linha */}
          <div className="filter-territorio">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={displayHistorical}
                  onChange={(e) => {
                    setDisplayHistorical(e.target.checked);
                    setSelectedFilters([]);
                    // Se é docentes e mudou para série histórica, garantir apenas um filtro
                    if (type === 'university_teacher') {
                      setSelectedFilters([]);
                    }
                  }}
                  className="cursor-pointer"
                />
                <span className="font-medium text-gray-700">Série Histórica</span>
              </label>
            
              {displayHistorical ? (
                <div className="flex gap-3 flex-1">
                  <div className="flex-1">
                    <label htmlFor="startYearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano Inicial:</label>
                    <Select
                      id="startYearSelect"
                      value={yearOptions.find(option => option.value === startYear)}
                      onChange={(selectedOption) => {
                        setStartYear(selectedOption.value);
                        if (selectedOption.value > endYear) {
                          setEndYear(selectedOption.value);
                        }
                      }}
                      options={yearOptions}
                      placeholder="Ano Inicial"
                      size="small"
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
                      size="small"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <label htmlFor="yearSelect" className="block text-sm font-medium text-gray-700 mb-1">Ano:</label>
                  <Select
                    id="yearSelect"
                    value={yearOptions.find(option => option.value === year)}
                    onChange={(selectedOption) => setYear(selectedOption.value)}
                    options={yearOptions}
                    placeholder="Ano"
                    size="small"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Território - Primeira coluna, segunda linha */}
          <div className="filter-faixa">
            <Select
              id="territorySelect"
              value={territoryOptions.find(option => option.value === territory) || null}
              onChange={(selectedOption) => {
                setTerritory(selectedOption ? selectedOption.value : '');
                setCity('');
              }}
              options={territoryOptions}
              placeholder="Território de Desenvolvimento"
              size="small"
            />
          </div>

          {/* Faixa Populacional - Segunda coluna, segunda linha */}
          <div className="filter-aglomerado">
            <Select
              id="faixaPopulacionalSelect"
              value={faixaPopulacionalOptions.find(option => option.value === faixaPopulacional) || null}
              onChange={(selectedOption) => {
                setFaixaPopulacional(selectedOption ? selectedOption.value : '');
                setCity('');
              }}
              options={faixaPopulacionalOptions}
              placeholder="Faixa Populacional"
              size="small"
            />
          </div>

          {/* Aglomerado - Terceira coluna, segunda linha */}
          <div className="filter-gerencia">
            <Select
              id="aglomeradoSelect"
              value={aglomeradoOptions.find(option => option.value === aglomerado) || null}
              onChange={(selectedOption) => setAglomerado(selectedOption ? selectedOption.value : '')}
              options={aglomeradoOptions}
              placeholder="Aglomerado"
              size="small"
            />
          </div>

          {/* Gerência - Primeira coluna, terceira linha */}
          <div className="filter-ano-inicial">
            <Select
              id="gerenciaSelect"
              value={gerenciaOptions.find(option => option.value === gerencia) || null}
              onChange={(selectedOption) => setGerencia(selectedOption ? selectedOption.value : '')}
              options={gerenciaOptions}
              placeholder="Gerencia"
              size="small"
            />
          </div>

          {/* Cidade - Segunda coluna, terceira linha */}
          <div className="filter-ano-final">
            <Select
              id="citySelect"
              value={cityOptions.find(option => option.value === city) || null}
              onChange={(selectedOption) => setCity(selectedOption ? selectedOption.value : '')}
              options={cityOptions}
              placeholder="Cidade"
              size="small"
            />
          </div>

          {/* Filtros Múltiplos - Terceira coluna, terceira linha */}
          <div className="filter-button-container">
            <div className="mb-3">
              <Select
                id="multiFilterSelect"
                value={selectedFilters}
                onChange={(newValue) => {
                  // Para docentes (university_teacher), permitir apenas um filtro por vez
                  if (type === 'university_teacher') {
                    setSelectedFilters(newValue.slice(-1)); // Manter apenas o último selecionado
                    return;
                  }

                  // Validação para impedir combinação de regime + formação docente (para outros tipos)
                  const hasRegime = newValue.some(filter => filter.value === 'regimeDeTrabalho');
                  const hasFormacao = newValue.some(filter => filter.value === 'formacaoDocente');

                  if (hasRegime && hasFormacao) {
                    // Se está tentando adicionar os dois, manter apenas o último selecionado
                    const lastSelected = newValue[newValue.length - 1];
                    if (lastSelected.value === 'regimeDeTrabalho') {
                      // Removeu formação docente, manter regime
                      setSelectedFilters(newValue.filter(f => f.value !== 'formacaoDocente'));
                    } else {
                      // Removeu regime, manter formação docente
                      setSelectedFilters(newValue.filter(f => f.value !== 'regimeDeTrabalho'));
                    }
                    return;
                  }

                  if (displayHistorical) {
                    setSelectedFilters(newValue.slice(-1));
                  } else if (newValue.length <= 2) {
                    setSelectedFilters(newValue);
                  } else {
                    setSelectedFilters(newValue.slice(-2));
                  }
                }}
                options={filterOptions}
                isMulti
                placeholder={
                  type === 'university_teacher'
                    ? "Selecione 1 filtro (docentes)"
                    : displayHistorical
                      ? "Selecione 1 filtro"
                      : "Selecione até 2 filtros"
                }
                size="small"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleFilterClick}
                className="filter-button"
              >
                Filtrar
              </Button>

              <Button
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#000',
                }}
                variant="contained"
                onClick={handleClearFilters}
                className="filter-button"
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {isLoading && (
        <Loading />
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
            </div>
          )}

      {!isLoading && !error && !data && (
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            margin: '20px auto',
            maxWidth: '400px',
            color: theme.palette.primary.main
          }}
        >
          Selecione os filtros desejados e clique em "Filtrar" para montar uma consulta.
        </Typography>
      )}

      {!isLoading && !error && data && title ? (
        <div>
          <h2>{title}</h2>
        </div>
      ) : null}
      <ApiHigherContainer
        type={type}
        year={year}
        isHistorical={isHistorical}
        startYear={startYear}
        endYear={endYear}
        city={city}
        territory={territory}
        faixaPopulacional={faixaPopulacional}
        aglomerado={aglomerado}
        gerencia={gerencia}
        citiesList={territory || faixaPopulacional || aglomerado || gerencia ? filteredCities : []}
        onDataFetched={setData}
        onError={setError}
        onLoading={setIsLoading}
        triggerFetch={isLoading}
        selectedFilters={selectedFilters}
      />
      {!isLoading && !error && data && title ? (
        <DataTable
          data={data.finalResult ? data.finalResult : data}
          municipioData={data.allResults && data.allResults.length > 0 ? data.allResults : []}
          isHistorical={isHistorical}
          isModalidadeSelected={isModalidadeSelected}
          isRegimeSelected={isRegimeSelected}
          isFormacaoDocenteSelected={isFormacaoDocenteSelected}
          isCategoriaAdministrativaSelected={isCategoriaAdministrativaSelected}
          isFaixaEtariaSuperiorSelected={isFaixaEtariaSuperiorSelected}
          isOrganizacaoAcademicaSelected={isOrganizacaoAcademicaSelected}
          title={title}
        />
      ) : null}
    </div>
  );
}

export default FilterComponent;