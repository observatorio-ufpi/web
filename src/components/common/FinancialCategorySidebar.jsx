import React, { useState } from 'react';
import { FaArrowLeft, FaBars, FaInfoCircle, FaTimes, FaGraduationCap } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../layouts/FinancialLayout';
import FilterComponent from '../helpers/TableFilters';

const FinancialCategorySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useSidebar();
  
  // Estados para os filtros
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [anoInicial, setAnoInicial] = useState(2007);
  const [anoFinal, setAnoFinal] = useState(2024);
  const [selectedTableType, setSelectedTableType] = useState('ownRevenues');
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
    { id: 'municipios', label: 'Dados Municipais', path: '/municipios' },
    { id: 'estado', label: 'Dados Estaduais', path: '/estado' },
    { id: 'indicadores', label: 'Indicadores - Município', path: '/indicadores' },
    { id: 'indicadores-estaduais', label: 'Indicadores - Estado', path: '/indicadores-estaduais' }
  ];

  return (
    <>
      {/* Botão para abrir/fechar a sidebar */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors ${isOpen ? 'hidden' : ''}`}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 h-screen overflow-y-auto transition-transform duration-300 ease-in-out z-40 shadow-lg sidebar-scroll`}
        style={{
          width: isOpen ? '20rem' : '4rem',
          backgroundColor: '#E8E4E3'
        }}
      >
        {/* Header da Sidebar */}
        <div className="relative p-3 pt-12 border-b border-gray-200">
          <button
            onClick={toggleSidebar}
            className="absolute top-3 right-3 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
            aria-label="Fechar sidebar"
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

        <hr className="border-gray-300" />

        {/* Navegação */}
        <nav className="p-3">
          {/* Categoria Selecionada */}
          <div className="mb-3">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ${isOpen ? 'block' : 'hidden'} md:block`}>
              Categoria
            </h3>
            <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
              <p className="text-xs font-medium text-gray-800 mb-2">
                {categories.find(c => c.id === currentCategory)?.label}
              </p>
            </div>
          </div>
          {/* Filtros */}
          <div className="mb-3">
            <FilterComponent
              onFilterChange={handleFilterChange}
              selectedMunicipio={selectedMunicipio}
              territorioDeDesenvolvimentoMunicipio={null}
              faixaPopulacionalMunicipio={null}
              aglomeradoMunicipio=""
              gerenciaRegionalMunicipio=""
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
