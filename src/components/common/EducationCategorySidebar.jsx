import React, { useMemo, useState } from 'react';
import { FaArrowLeft, FaBars, FaInfoCircle, FaTimes, FaDollarSign } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../layouts/EducationLayout';
import { Select } from '../ui';
import { Button } from '@mui/material';
import { municipios, Regioes, FaixaPopulacional } from '../../utils/citiesMapping';
import YearRangeFilter from '../helpers/YearRangeFilter';
import { useEducationFilters } from '../../contexts/EducationFilterContext';

const EducationCategorySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useSidebar();
  const filters = useEducationFilters();
  
  // Estado local para o tipo selecionado por categoria
  const [selectedTypeByCategory, setSelectedTypeByCategory] = useState({
    basica: 'enrollment',
    superior: 'university/count',
    taxas: 'pop_out_school',
    condicoes: null
  });

  const handleVoltar = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Obter a categoria atual da URL
  const getCurrentCategory = () => {
    if (location.pathname.includes('/basica')) return 'basica';
    if (location.pathname.includes('/condicoes-de-oferta')) return 'condicoes';
    if (location.pathname.includes('/superior')) return 'superior';
    if (location.pathname.includes('/taxas')) return 'taxas';
    return 'basica';
  };

  const currentCategory = getCurrentCategory();

  const categories = [
    { id: 'basica', label: 'Educação Básica', path: '/dados-educacionais/basica' },
    { id: 'condicoes', label: 'Condições de Oferta', path: '/dados-educacionais/condicoes-de-oferta' },
    { id: 'superior', label: 'Educação Superior', path: '/dados-educacionais/superior' },
    { id: 'taxas', label: 'Indicadores', path: '/dados-educacionais/taxas' }
  ];

  // Mapear filtros por categoria
  const filtersByCategory = {
    basica: [
      { value: 'enrollment', label: 'Matrículas' },
      { value: 'school/count', label: 'Escolas' },
      { value: 'class', label: 'Turmas' },
      { value: 'teacher', label: 'Professores' },
      { value: 'auxiliar', label: 'Pessoal Auxiliar' },
      { value: 'employees', label: 'Funcionários' }
    ],
    superior: [
      { value: 'university/count', label: 'Número de instituições' },
      { value: 'university_enrollment', label: 'Matrículas' },
      { value: 'university_teacher', label: 'Docentes' },
      { value: 'course_count', label: 'Cursos' }
    ],
    taxas: [
      { value: 'pop_out_school', label: 'Alunos fora da escola' },
      { value: 'adjusted_liquid_frequency', label: 'Frequência líquida' },
      { value: 'iliteracy_rate', label: 'Taxa de analfabetismo' },
      { value: 'superior_education_conclusion_tax', label: 'Taxa de conclusão (superior)' },
      { value: 'basic_education_conclusion', label: 'Taxa de conclusão (básico)' },
      { value: 'instruction_level', label: 'Nível de instrução' }
    ],
    condicoes: []
  };

  // Filtros de localização comuns
  const baseFilteredMunicipios = useMemo(() => {
    return Object.values(municipios).filter((m) => {
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
  }, [filters.territory, filters.faixaPopulacional, filters.aglomerado, filters.gerencia]);

  const otherLocalityDisabled = !!filters.city;

  const filteredMunicipioOptions = useMemo(() => {
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

        {/* Navegação */}
        <nav className="p-6 md:p-6 lg:p-6 xl:p-6 xl:p-6 2xl:p-6 p-3 sm:p-4 md:p-6 space-y-6">
          {/* Categoria Atual */}
          <div>
            <h3 className={`text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Categoria
            </h3>
            <div className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              <p className="text-sm font-medium text-gray-800">
                {categories.find(c => c.id === currentCategory)?.label}
              </p>
            </div>
          </div>

          {/* Tipo de Dado */}
          {currentCategory !== 'condicoes' && (
            <div>
              <label className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
                Tipo
              </label>
              <Select
                value={filtersByCategory[currentCategory]?.find(opt => opt.value === selectedTypeByCategory[currentCategory]) || null}
                onChange={(selectedOption) => {
                  setSelectedTypeByCategory({
                    ...selectedTypeByCategory,
                    [currentCategory]: selectedOption.value
                  });
                  if (filters.setType) filters.setType(selectedOption.value);
                }}
                options={filtersByCategory[currentCategory] || []}
                placeholder="Selecione o tipo"
                size="xs"
              />
            </div>
          )}

          {/* Filtros Múltiplos */}
          <div>
            <label className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Filtros
            </label>
            {currentCategory === 'basica' && (
              <Select
                value={filters.selectedFilters}
                onChange={(newValue) => {
                  const isHistoricalRange = filters.startYear !== filters.endYear;
                  if (isHistoricalRange) {
                    filters.setSelectedFilters?.(newValue.slice(-1));
                  } else if (newValue.length <= 2) {
                    filters.setSelectedFilters?.(newValue);
                  } else {
                    filters.setSelectedFilters?.(newValue.slice(-2));
                  }
                }}
                options={[
                  { value: 'etapa', label: 'Etapa de Ensino' },
                  { value: 'localidade', label: 'Localidade' },
                  { value: 'dependencia', label: 'Dependência Administrativa' },
                  { value: 'municipio', label: 'Município' }
                ]}
                isMulti
                placeholder="Selecione filtros"
                size="xs"
              />
            )}
            {currentCategory === 'superior' && (
              <Select
                value={filters.selectedFilters}
                onChange={(newValue) => {
                  filters.setSelectedFilters?.(newValue);
                }}
                options={[
                  { value: 'modalidade', label: 'Modalidade' },
                  { value: 'categoriaAdministrativa', label: 'Categoria Administrativa' },
                  { value: 'faixaEtariaSuperior', label: 'Faixa Etária' },
                  { value: 'organizacaoAcademica', label: 'Organização Acadêmica' },
                  { value: 'instituicaoEnsino', label: 'Instituição de Ensino' },
                  { value: 'municipio', label: 'Município' }
                ]}
                isMulti
                placeholder="Selecione filtros"
                size="xs"
              />
            )}
            {currentCategory === 'condicoes' && (
              <Select
                value={filters.selectedFilters}
                onChange={(newValue) => {
                  filters.setSelectedFilters?.(newValue);
                }}
                options={[
                  { value: 'local_funcionamento', label: 'Local de Funcionamento' },
                  { value: 'infraestrutura_basica', label: 'Infraestrutura Básica' },
                  { value: 'espacos_pedagogicos', label: 'Espaços Pedagógicos' },
                  { value: 'equipamentos', label: 'Equipamentos' },
                  { value: 'materiais', label: 'Materiais' }
                ]}
                isMulti
                placeholder="Selecione aspectos"
                size="xs"
              />
            )}
          </div>

          {/* Período */}
          <div>
            <label className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Período
            </label>
            <YearRangeFilter
              startYear={filters.startYear || 2007}
              endYear={filters.endYear || 2024}
              onStartYearChange={(year) => filters.setStartYear?.(year)}
              onEndYearChange={(year) => filters.setEndYear?.(year)}
              minYear={2007}
              maxYear={2024}
            />
          </div>

          {/* Localização */}
          {(currentCategory === 'basica' || currentCategory === 'superior' || currentCategory === 'condicoes') && (
            <div>
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
                Localização
              </h3>
              <div className="space-y-2">
                {/* Município */}
                <Select
                  value={filteredMunicipioOptions.find(option => option.value === filters.city) || null}
                  onChange={(selectedOption) => filters.setCity?.(selectedOption ? selectedOption.value : '')}
                  options={filteredMunicipioOptions}
                  placeholder="Município"
                  size="xs"
                  isClearable={true}
                />

                {/* Território */}
                <Select
                  value={filteredTerritorioOptions.find(option => option.value === filters.territory) || null}
                  onChange={(selectedOption) => {
                    filters.setTerritory?.(selectedOption ? selectedOption.value : '');
                    filters.setCity?.('');
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
                    filters.setFaixaPopulacional?.(selectedOption ? selectedOption.value : '');
                    filters.setCity?.('');
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
                  onChange={(selectedOption) => filters.setAglomerado?.(selectedOption ? selectedOption.value : '')}
                  options={filteredAglomeradoOptions}
                  placeholder="Aglomerado - AG"
                  size="xs"
                  isClearable={true}
                  disabled={otherLocalityDisabled}
                />

                {/* Gerência */}
                <Select
                  value={filteredGerenciaOptions.find(option => option.value === filters.gerencia) || null}
                  onChange={(selectedOption) => filters.setGerencia?.(selectedOption ? selectedOption.value : '')}
                  options={filteredGerenciaOptions}
                  placeholder="Gerência - GRE"
                  size="xs"
                  isClearable={true}
                  disabled={otherLocalityDisabled}
                />
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="contained"
              fullWidth
              size="small"
              onClick={() => {
                // Disparar a busca com o tipo selecionado localmente
                const selectedType = selectedTypeByCategory[currentCategory];
                window.dispatchEvent(new CustomEvent('applyFilters', { 
                  detail: {
                    ...filters,
                    type: selectedType
                  } 
                }));
              }}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem'
              }}
            >
              Mostrar resultados
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={() => {
                // Limpar todos os filtros
                const defaultType = filtersByCategory[currentCategory]?.[0]?.value || 'enrollment';
                setSelectedTypeByCategory({
                  ...selectedTypeByCategory,
                  [currentCategory]: defaultType
                });
                filters.setType?.(defaultType);
                filters.setSelectedFilters?.([]);
                filters.setCity?.('');
                filters.setTerritory?.('');
                filters.setFaixaPopulacional?.('');
                filters.setAglomerado?.('');
                filters.setGerencia?.('');
                filters.setStartYear?.(2007);
                filters.setEndYear?.(2024);
                
                // Disparar evento de limpeza para componentes específicos
                window.dispatchEvent(new CustomEvent('clearFilters'));
              }}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                backgroundColor: '#f0f0f0',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                }
              }}
            >
              Limpar
            </Button>
          </div>

          {/* Alternar para Dados Financeiros */}
          <div>
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
          <div className="mb-8">
            <h3 className={`text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              sobre o projeto
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/quem-somos"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/quem-somos'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaInfoCircle className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Quem somos</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/repositorio"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/repositorio'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaInfoCircle className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Repositório</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-6 md:p-6 lg:p-6 xl:p-6 2xl:p-6 p-3 sm:p-4 md:p-6 border-t border-gray-200 mt-auto">
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

export default EducationCategorySidebar;
