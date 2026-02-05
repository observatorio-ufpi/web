import React from 'react';
import { FaArrowLeft, FaBars, FaFilter, FaInfoCircle, FaTimes, FaDollarSign } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../layouts/EducationLayout';
import { useEducationFilters } from '../../contexts/EducationFilterContext';
import { Select } from '../ui';
import { municipios, Regioes, FaixaPopulacional } from '../../utils/citiesMapping';
import YearRangeFilter from '../helpers/YearRangeFilter';

const EducationFilterSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useSidebar();
  const filters = useEducationFilters();

  const handleVoltar = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const typeOptions = [
    { value: 'enrollment', label: 'Matrículas' },
    { value: 'school/count', label: 'Escolas' },
    { value: 'class', label: 'Turmas' },
    { value: 'teacher', label: 'Professores' },
    { value: 'auxiliar', label: 'Pessoal Auxiliar' },
    { value: 'employees', label: 'Funcionários' }
  ];

  const filterOptions = [
    { value: 'etapa', label: 'Etapa de Ensino' },
    { value: 'localidade', label: 'Localidade' },
    { value: 'dependencia', label: 'Dependência Administrativa' },
    { value: 'municipio', label: 'Município' }
  ];

  const baseFilteredMunicipios = Object.values(municipios).filter((m) => {
    const territorioLabel = filters.territory ? Regioes[filters.territory] : null;
    const faixaLabel = filters.faixaPopulacional ? FaixaPopulacional[filters.faixaPopulacional] : null;

    if (territorioLabel && m.territorioDesenvolvimento !== territorioLabel) return false;
    if (faixaLabel && m.faixaPopulacional !== faixaLabel) return false;
    if (filters.aglomerado && String(m.aglomerado) !== String(filters.aglomerado)) return false;
    if (filters.gerencia) {
      const gerencias = String(m.gerencia).split(',').map((g) => g.trim());
      if (!gerencias.includes(String(filters.gerencia))) return false;
    }
    return true;
  });

  const otherLocalityDisabled = !!filters.city;

  const filteredMunicipioOptions = Object.entries(municipios)
    .filter(([, m]) => baseFilteredMunicipios.includes(m))
    .map(([key, { nomeMunicipio }]) => ({ value: key, label: nomeMunicipio }));

  const filteredTerritorioOptions = Object.entries(Regioes)
    .filter(([, label]) => [...new Set(baseFilteredMunicipios.map((m) => m.territorioDesenvolvimento).filter(Boolean))].includes(label))
    .map(([id, label]) => ({ value: id, label }));

  const filteredFaixaPopulacionalOptions = Object.entries(FaixaPopulacional)
    .filter(([, label]) => [...new Set(baseFilteredMunicipios.map((m) => m.faixaPopulacional).filter(Boolean))].includes(label))
    .map(([id, label]) => ({ value: id, label }));

  const filteredAglomeradoOptions = [...new Set(baseFilteredMunicipios.map((m) => m.aglomerado).filter((a) => a && a !== 'undefined'))]
    .sort((a, b) => Number(a) - Number(b))
    .map((a) => ({ value: a, label: `AG ${a}` }));

  const filteredGerenciaOptions = [...new Set(
    baseFilteredMunicipios
      .map((m) => m.gerencia)
      .filter((g) => g && g !== 'undefined')
      .flatMap((g) => (g.includes(',') ? g.split(',').map((x) => x.trim()) : [g]))
  )]
    .sort((a, b) => Number(a) - Number(b))
    .map((g) => ({ value: g, label: `${g}ª GRE` }));

  return (
    <>
      {/* Botão para abrir/fechar a sidebar */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 h-screen w-64 overflow-y-auto transition-transform duration-300 ease-in-out z-40 shadow-lg sidebar-scroll`}
        style={{
          width: isOpen ? '16rem' : '4rem',
          backgroundColor: '#E8E4E3'
        }}
      >
        {/* Header da Sidebar */}
        <div className="p-6 md:p-6 lg:p-6 xl:p-6 2xl:p-6 p-3 sm:p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center mt-8 mb-4">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logos/logo-opepi-v2.png"
                alt="opepi"
                className="h-14 md:h-14 lg:h-14 xl:h-14 2xl:h-14 h-8 sm:h-10 md:h-14 w-auto mr-3"
              />
              <div className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
                <p className="text-sm text-gray-600 leading-tight">
                  observatório da política educacional piauiense
                </p>
              </div>
            </Link>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Navegação de Filtros */}
        <nav className="p-4 md:p-4 lg:p-4 xl:p-4 2xl:p-4 p-2 sm:p-3 md:p-4 space-y-4">
          {/* Tipo de Dados */}
          <div>
            <label className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Tipo
            </label>
            <Select
              value={typeOptions.find(option => option.value === filters.type)}
              onChange={(selectedOption) => {
                filters.setType(selectedOption.value);
                filters.setSelectedFilters([]);
              }}
              options={typeOptions}
              placeholder="Selecione o tipo"
              size="xs"
            />
          </div>

          {/* Filtros Disponíveis */}
          <div>
            <label className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Filtros
            </label>
            <Select
              value={filters.selectedFilters}
              onChange={(newValue) => {
                const isHistoricalRange = filters.startYear !== filters.endYear;
                if (isHistoricalRange) {
                  filters.setSelectedFilters(newValue.slice(-1));
                } else if (newValue.length <= 2) {
                  filters.setSelectedFilters(newValue);
                } else {
                  filters.setSelectedFilters(newValue.slice(-2));
                }
              }}
              options={filterOptions}
              isMulti
              placeholder="Selecione filtros"
              size="xs"
            />
          </div>

          {/* Período */}
          <div>
            <label className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Período
            </label>
            <YearRangeFilter
              startYear={filters.startYear}
              endYear={filters.endYear}
              onStartChange={filters.setStartYear}
              onEndChange={filters.setEndYear}
              minYear={2007}
              maxYear={2024}
            />
          </div>

          {/* Localização */}
          <div>
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Localização
            </h3>
            <div className="space-y-2">
              {/* Município */}
              <Select
                value={filteredMunicipioOptions.find(option => option.value === filters.city) || null}
                onChange={(selectedOption) => filters.setCity(selectedOption ? selectedOption.value : '')}
                options={filteredMunicipioOptions}
                placeholder="Município"
                size="xs"
                isClearable={true}
              />

              {/* Território */}
              <Select
                value={filteredTerritorioOptions.find(option => option.value === filters.territory) || null}
                onChange={(selectedOption) => {
                  filters.setTerritory(selectedOption ? selectedOption.value : '');
                  filters.setCity('');
                }}
                options={filteredTerritorioOptions}
                placeholder="Território"
                size="xs"
                isClearable={true}
                disabled={otherLocalityDisabled}
              />

              {/* Faixa Populacional */}
              <Select
                value={filteredFaixaPopulacionalOptions.find(option => option.value === filters.faixaPopulacional) || null}
                onChange={(selectedOption) => {
                  filters.setFaixaPopulacional(selectedOption ? selectedOption.value : '');
                  filters.setCity('');
                }}
                options={filteredFaixaPopulacionalOptions}
                placeholder="Faixa Populacional"
                size="xs"
                isClearable={true}
                disabled={otherLocalityDisabled}
              />

              {/* Aglomerado */}
              <Select
                value={filteredAglomeradoOptions.find(option => option.value === filters.aglomerado) || null}
                onChange={(selectedOption) => filters.setAglomerado(selectedOption ? selectedOption.value : '')}
                options={filteredAglomeradoOptions}
                placeholder="Aglomerado - AG"
                size="xs"
                isClearable={true}
                disabled={otherLocalityDisabled}
              />

              {/* Gerência */}
              <Select
                value={filteredGerenciaOptions.find(option => option.value === filters.gerencia) || null}
                onChange={(selectedOption) => filters.setGerencia(selectedOption ? selectedOption.value : '')}
                options={filteredGerenciaOptions}
                placeholder="Gerência - GRE"
                size="xs"
                isClearable={true}
                disabled={otherLocalityDisabled}
              />
            </div>
          </div>

          {/* Alternar para Dados Financeiros */}
          <div className="mt-6">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Alternar para
            </h3>
            <button
              onClick={() => navigate('/dados-financeiros')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-700 hover:bg-yellow-100 hover:text-yellow-700`}
            >
              <FaDollarSign className="mr-3 text-lg flex-shrink-0" />
              <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Dados Financeiros</span>
            </button>
          </div>

          {/* Sobre o Projeto */}
          <div>
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              sobre o projeto
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/quem-somos"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100`}
                >
                  <FaInfoCircle className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Quem somos</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-4 md:p-4 lg:p-4 xl:p-4 2xl:p-4 p-2 sm:p-3 md:p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleVoltar}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <FaArrowLeft className="mr-2 flex-shrink-0" />
            <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>voltar</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default EducationFilterSidebar;
