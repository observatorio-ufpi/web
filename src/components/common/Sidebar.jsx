import React from 'react';
import { FaArrowLeft, FaBars, FaDollarSign, FaGraduationCap, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../layouts/AppLayout';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useSidebar();

  const isActive = (path) => {
    if (path === '/indicadores') {
      // Para indicadores municipais, só ativa se for exatamente /indicadores ou subrotas que não sejam estaduais
      return location.pathname === '/indicadores' ||
             (location.pathname.startsWith('/indicadores/') && !location.pathname.startsWith('/indicadores-estaduais'));
    }
    return location.pathname.startsWith(path);
  };

  const handleVoltar = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
          {/* Dados Educacionais */}
          <div className="mb-8">
            <h3 className={`text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Dados Educacionais
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dados-educacionais/basica"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dados-educacionais/basica')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaGraduationCap className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Educação Básica</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dados-educacionais/condicoes-de-oferta"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dados-educacionais/condicoes-de-oferta')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaGraduationCap className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Condições de Oferta</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dados-educacionais/superior"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dados-educacionais/superior')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaGraduationCap className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Educação Superior</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dados-educacionais/taxas"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dados-educacionais/taxas')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaGraduationCap className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Indicadores</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Dados Financeiros */}
          <div className="mb-8">
            <h3 className={`text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 ${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>
              Financiamento da Educação
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/municipios"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/municipios')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaDollarSign className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Dados do Município</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/indicadores"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/indicadores')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaDollarSign className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Indicadores Municipais</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/estado"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/estado')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaDollarSign className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Dados do Estado</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/indicadores-estaduais"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/indicadores-estaduais')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaDollarSign className="mr-3 text-lg flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block lg:block xl:block 2xl:block`}>Indicadores Estaduais</span>
                </Link>
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
                    isActive('/quem-somos')
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
                    isActive('/repositorio')
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

export default Sidebar;
