import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { abrirBuscaGlobal } from './BuscaGlobal';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Header Secundário - Navegação + CTA */}
      <header className="shadow-sm print:hidden" style={{ backgroundColor: 'var(--background-color)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Opepi */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/images/logos/logo-opepi.png" 
                  alt="Opepi Logo" 
                  className="h-8 md:h-10"
                />
              </Link>
            </div>

            {/* Navegação Desktop - Ocultada em telas pequenas */}
            <div className="hidden lg:flex flex-1 justify-center">
              <nav className="flex space-x-6">
                <Link 
                  to="/" 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'text-brand bg-areia' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  homepage
                </Link>
                <Link 
                  to="/quem-somos" 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/quem-somos') 
                      ? 'text-brand bg-areia' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  quem somos
                </Link>
                <Link 
                  to="/como-usar" 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/como-usar') 
                      ? 'text-brand bg-areia' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  como usar
                </Link>
                <Link 
                  to="https://repositorio.opepi.pi.gov.br" 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('https://repositorio.opepi.pi.gov.br') 
                      ? 'text-brand bg-areia' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  repositório
                </Link>
              </nav>
            </div>
            
            {/* Botão CTA - Ocultado em telas pequenas */}
            {/* Busca geral (Ctrl+K) — na home a busca grande do topo já cumpre esse papel */}
            {!isActive('/') && (
            <button
              type="button"
              onClick={abrirBuscaGlobal}
              title="Buscar município, tabela ou termo (atalho: Ctrl+K)"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-areia hover:text-gray-900 lg:flex"
            >
              <FaSearch aria-hidden="true" className="text-[12px]" />
              buscar
            </button>
            )}

            <div className="hidden lg:block">
              <Link 
                to="/dados-educacionais/basica"
                className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
              >
                acessar painéis
                <span>→</span>
              </Link>
            </div>

            {/* Botão Mobile Menu */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Dropdown Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    abrirBuscaGlobal();
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FaSearch aria-hidden="true" className="text-xs" /> buscar
                </button>
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'text-brand bg-areia' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  homepage
                </Link>
                <Link 
                  to="/quem-somos" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/quem-somos') 
                      ? 'text-brand bg-areia' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  quem somos
                </Link>
                <Link 
                  to="/como-usar" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/como-usar') 
                      ? 'text-brand bg-areia' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  como usar
                </Link>
                <Link 
                  to="/o-que-fazemos" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/o-que-fazemos') 
                      ? 'text-brand bg-areia' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  o que fazemos
                </Link>
                <Link 
                  to="/repositorio" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/repositorio') 
                      ? 'text-brand bg-areia' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  repositório
                </Link>
                <Link 
                  to="/dados-educacionais/basica"
                  className="mt-4 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  acessar painéis →
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
