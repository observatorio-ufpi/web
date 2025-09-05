import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

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
      <header className="shadow-sm" style={{ backgroundColor: 'var(--background-color)' }}>
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
                      ? 'text-purple-600 bg-purple-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  homepage
                </Link>
                <Link 
                  to="/quem-somos" 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/quem-somos') 
                      ? 'text-purple-600 bg-purple-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  quem somos
                </Link>
                <Link 
                  to="/repositorio" 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/repositorio') 
                      ? 'text-purple-600 bg-purple-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  repositório
                </Link>
              </nav>
            </div>
            
            {/* Botão CTA - Ocultado em telas pequenas */}
            <div className="hidden lg:block">
              <Link 
                to="/dados-educacionais/basica"
                className="bg-green-400 hover:bg-green-700 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
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
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'text-purple-600 bg-purple-100' 
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
                      ? 'text-purple-600 bg-purple-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  quem somos
                </Link>
                <Link 
                  to="/o-que-fazemos" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/o-que-fazemos') 
                      ? 'text-purple-600 bg-purple-100' 
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
                      ? 'text-purple-600 bg-purple-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  repositório
                </Link>
                <Link 
                  to="/dados-educacionais/basica"
                  className="mt-4 bg-green-400 hover:bg-green-700 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-center"
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
