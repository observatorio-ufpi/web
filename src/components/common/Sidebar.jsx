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
        } fixed left-0 top-0 h-screen overflow-y-auto transition-transform duration-300 ease-in-out z-40 shadow-lg sidebar-scroll`}
        style={{
          width: isOpen ? '20rem' : '4rem',
          backgroundColor: '#E8E4E3'
        }}
      >
        {/* Header da Sidebar */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center mt-8 mb-2">
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
          {/* Dados Educacionais */}
          <div className="mb-4">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isOpen ? 'block' : 'hidden'} md:block`}>
              Dados Educacionais
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dados-educacionais/basica"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive('/dados-educacionais/basica')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaGraduationCap className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Educação Básica</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dados-educacionais/condicoes-de-oferta"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive('/dados-educacionais/condicoes-de-oferta')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaGraduationCap className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Condições de Oferta</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dados-educacionais/superior"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive('/dados-educacionais/superior')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaGraduationCap className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Educação Superior</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dados-educacionais/taxas"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive('/dados-educacionais/taxas')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaGraduationCap className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Indicadores</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Dados Financeiros */}
          <div className="mb-4">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isOpen ? 'block' : 'hidden'} md:block`}>
              Financiamento da Educação
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/municipios"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive('/municipios')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaDollarSign className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Dados Municipais</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/indicadores"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive('/indicadores')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaDollarSign className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Indicadores Municipais</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/estado"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive('/estado')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaDollarSign className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Dados Estaduais</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/indicadores-estaduais"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive('/indicadores-estaduais')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaDollarSign className="mr-2 text-sm flex-shrink-0" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Indicadores Estaduais</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Sobre o Projeto */}
          <div className="mb-4">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isOpen ? 'block' : 'hidden'} md:block`}>
              sobre o projeto
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/quem-somos"
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive('/quem-somos')
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
                    isActive('/repositorio')
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

export default Sidebar;
