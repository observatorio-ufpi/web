import React, { useState } from 'react';
import { FaArrowLeft, FaBars, FaInfoCircle, FaTimes, FaGraduationCap } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../layouts/FinancialLayout';
import FilterComponent from '../helpers/TableFilters';
import { lerFiltrosMunicipaisDaUrl } from '../../utils/financialUrlFilters';

const FinancialCategorySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useSidebar();

  // Se a página abriu por um link com filtros (/municipios?tabela=...), a sidebar
  // já mostra esses filtros preenchidos — quem aplica a consulta é o RevenueTableContainer.
  const [filtrosDaUrl] = useState(() =>
    location.pathname === '/municipios' ? lerFiltrosMunicipaisDaUrl(location.search) : null
  );

  // Estados para os filtros
  const [selectedMunicipio, setSelectedMunicipio] = useState(filtrosDaUrl?.codigoMunicipio || null);
  const [anoInicial, setAnoInicial] = useState(filtrosDaUrl?.anoInicial || 2007);
  const [anoFinal, setAnoFinal] = useState(filtrosDaUrl?.anoFinal || 2024);
  const [selectedTableType, setSelectedTableType] = useState(filtrosDaUrl?.tableType || 'ownRevenues');
  const [selectedStateTableType, setSelectedStateTableType] = useState('tabela1');
  const [selectedStateIndicatorType, setSelectedStateIndicatorType] = useState('revenueComposition');
  const [selectedMunicipalIndicatorType, setSelectedMunicipalIndicatorType] = useState('financasPublicas');
  const [selectedMunicipalSubIndicatorType, setSelectedMunicipalSubIndicatorType] = useState('composicaoReceitas');

  const handleVoltar = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Obter a categoria atual da URL
  const getCurrentCategory = () => {
    if (location.pathname === '/municipios') return 'municipios';
    if (location.pathname === '/estado') return 'estado';
    if (location.pathname === '/indicadores') return 'indicadores';
    if (location.pathname === '/indicadores-estaduais') return 'indicadores-estaduais';
    if (location.pathname === '/comparar') return 'comparar';
    return 'municipios';
  };

  const currentCategory = getCurrentCategory();

  const handleFilterChange = (filters) => {
    setSelectedMunicipio(filters.codigoMunicipio);
    setAnoInicial(filters.anoInicial);
    setAnoFinal(filters.anoFinal);
    if (filters.tableType) {
      setSelectedTableType(filters.tableType);
    }
    if (filters.stateTableType) {
      setSelectedStateTableType(filters.stateTableType);
    }
    if (filters.stateIndicatorType) {
      setSelectedStateIndicatorType(filters.stateIndicatorType);
    }
    if (filters.municipalIndicatorType) {
      setSelectedMunicipalIndicatorType(filters.municipalIndicatorType);
    }
    if (filters.municipalSubIndicatorType) {
      setSelectedMunicipalSubIndicatorType(filters.municipalSubIndicatorType);
    }
    
    // Disparar evento para o RevenueTableContainer
    window.dispatchEvent(new CustomEvent('applyFinancialFilters', {
      detail: filters
    }));
  };

  const categories = [
    { id: 'municipios', label: 'Municípios', path: '/municipios' },
    { id: 'estado', label: 'Estado', path: '/estado' },
    { id: 'indicadores', label: 'Indicadores municipais', path: '/indicadores' },
    { id: 'indicadores-estaduais', label: 'Indicadores estaduais', path: '/indicadores-estaduais' },
    { id: 'comparar', label: 'Comparar municípios', path: '/comparar' }
  ];

  return (
    <>
      {/* Botão para abrir/fechar a sidebar */}
      <button
        onClick={toggleSidebar}
        aria-label="Abrir menu de filtros"
        aria-expanded={isOpen}
        className={`fixed top-4 left-4 z-50 p-2 bg-ink text-white rounded-lg shadow-lg hover:bg-brand-dark transition-colors ${isOpen ? 'hidden' : ''}`}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside
        aria-label="Menu de filtros"
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 h-screen overflow-y-auto transition-transform duration-300 ease-in-out z-40 shadow-lg sidebar-scroll`}
        style={{
          width: isOpen ? '20rem' : '4rem',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E7DED6'
        }}
      >
        {/* Header da Sidebar */}
        <div className="relative p-3 pt-12 border-b border-line">
          <button
            onClick={toggleSidebar}
            className="absolute top-3 right-3 z-50 p-2 bg-ink text-white rounded-lg shadow-lg hover:bg-brand-dark transition-colors"
            aria-label="Fechar menu de filtros"
          >
            <FaTimes />
          </button>
          <div className="flex items-center mt-0 mb-2">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logos/logo-opepi-v2.png"
                alt="opepi"
                className="h-10 w-auto mr-2"
              />
              <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
                <p className="text-xs text-gray-600 leading-tight">
                  observatório da política educacional piauiense
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Navegação */}
        <nav className="p-3">
          {/* Categorias como abas (antes ficavam num select no topo da página) */}
          <nav aria-label="Categorias de dados financeiros" className="mb-4">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F6F3F2] p-1">
              {categories.map((categoria) => {
                const ativa = categoria.id === currentCategory;
                return (
                  <Link
                    key={categoria.id}
                    to={categoria.path}
                    aria-current={ativa ? 'page' : undefined}
                    className={`rounded-lg px-2 py-2 text-center text-xs leading-tight transition-colors duration-150 ${
                      categoria.id === 'comparar' ? 'col-span-2 ' : ''
                    }${
                      ativa
                        ? 'bg-white font-semibold text-ink shadow-sm'
                        : 'font-medium text-muted hover:bg-white/60 hover:text-ink'
                    }`}
                  >
                    {categoria.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Filtros (na comparação, os controles ficam na própria página) */}
          {currentCategory === 'comparar' ? (
            <p className="mb-3 rounded-lg bg-[#F6F3F2] p-3 text-xs leading-relaxed text-texto">
              Escolha o tipo de dado, o ano e os municípios no topo da página.
            </p>
          ) : (
          <div className="mb-3">
            <FilterComponent
              onFilterChange={handleFilterChange}
              selectedMunicipio={selectedMunicipio}
              territorioDeDesenvolvimentoMunicipio={filtrosDaUrl?.territorioDeDesenvolvimentoMunicipio || null}
              faixaPopulacionalMunicipio={filtrosDaUrl?.faixaPopulacionalMunicipio || null}
              aglomeradoMunicipio={filtrosDaUrl?.aglomeradoMunicipio || ""}
              gerenciaRegionalMunicipio={filtrosDaUrl?.gerenciaRegionalMunicipio || ""}
              anoInicial={anoInicial}
              anoFinal={anoFinal}
              filtersExpanded={currentCategory === 'municipios' || currentCategory === 'indicadores'}
              showTableTypeFilter={currentCategory === 'municipios'}
              selectedTableType={selectedTableType}
              showStateTableTypeFilter={currentCategory === 'estado'}
              selectedStateTableType={selectedStateTableType}
              showStateIndicatorTypeFilter={currentCategory === 'indicadores-estaduais'}
              selectedStateIndicatorType={selectedStateIndicatorType}
              showMunicipalIndicatorTypeFilter={currentCategory === 'indicadores'}
              selectedMunicipalIndicatorType={selectedMunicipalIndicatorType}
              selectedMunicipalSubIndicatorType={selectedMunicipalSubIndicatorType}
              showMunicipioFilters={currentCategory === 'municipios' || currentCategory === 'indicadores'}
            />
          </div>
          )}

          {/* Alternar para Dados Educacionais */}
          <div className="mb-3">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isOpen ? 'block' : 'hidden'} md:block`}>
              Alternar para
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => navigate('/dados-educacionais')}
                  className={`w-full flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 text-gray-700 hover:bg-orange-100 hover:text-orange-700`}
                >
                  <FaGraduationCap className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Dados Educacionais</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Sobre o Projeto */}
          <div className="mb-3">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isOpen ? 'block' : 'hidden'} md:block`}>
              sobre o projeto
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/quem-somos"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    location.pathname === '/quem-somos'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaInfoCircle className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Quem somos</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/repositorio"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    location.pathname === '/repositorio'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaInfoCircle className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Repositório</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-3 border-t border-gray-200 mt-auto">
          <button
            onClick={handleVoltar}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-xs font-medium"
          >
            <FaArrowLeft className="mr-2 flex-shrink-0" />
            <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>voltar</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default FinancialCategorySidebar;
