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
    
    // Disparar evento para o RevenueTableContainer
    window.dispatchEvent(new CustomEvent('applyFinancialFilters', {
      detail: filters
    }));
  };

  const categories = [
    { id: 'municipios', label: 'Dados por Município', path: '/municipios' },
    { id: 'estado', label: 'Dados por Estado', path: '/estado' },
    { id: 'indicadores', label: 'Indicadores - Município', path: '/indicadores' },
    { id: 'indicadores-estaduais', label: 'Indicadores - Estado', path: '/indicadores-estaduais' }
  ];

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
        <nav className="p-6 md:p-6 lg:p-6 xl:p-6 xl:p-6 2xl:p-6 p-3 sm:p-4 md:p-6">
          {/* Categoria Selecionada */}
          <div className="mb-8">
            <h3 className={`text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Categoria
            </h3>
            <div className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              <p className="text-sm font-medium text-gray-800 mb-4">
                {categories.find(c => c.id === currentCategory)?.label}
              </p>
            </div>
          </div>
          {/* Filtros */}
          <div className="mb-8">
            <FilterComponent
              onFilterChange={handleFilterChange}
              selectedMunicipio={selectedMunicipio}
              territorioDeDesenvolvimentoMunicipio={null}
              faixaPopulacionalMunicipio={null}
              aglomeradoMunicipio=""
              gerenciaRegionalMunicipio=""
              anoInicial={anoInicial}
              anoFinal={anoFinal}
              filtersExpanded={true}
              showTableTypeFilter={currentCategory === 'municipios'}
              selectedTableType={selectedTableType}
            />
          </div>

          {/* Alternar para Dados Educacionais */}
          <div className="mb-8">
            <h3 className={`text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Alternar para
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/dados-educacionais')}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-700 hover:bg-orange-100 hover:text-orange-700`}
                >
                  <FaGraduationCap className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Dados Educacionais</span>
                </button>
              </li>
            </ul>
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

export default FinancialCategorySidebar;
