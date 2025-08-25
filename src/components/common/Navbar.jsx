import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Header Secundário - Navegação + CTA */}
      <header className="shadow-sm" style={{ backgroundColor: 'var(--background-color)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Navegação Secundária */}
            <div className="flex items-center space-x-8">
              <nav className="flex space-x-6">
                <a 
                  href="/" 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'text-purple-600 bg-purple-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  homepage
                </a>
                <a 
                  href="/quem-somos" 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/quem-somos') 
                      ? 'text-purple-600 bg-purple-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  quem somos
                </a>
                <a 
                  href="/o-que-fazemos" 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/o-que-fazemos') 
                      ? 'text-purple-600 bg-purple-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  o que fazemos
                </a>
                <a 
                  href="/repositorio" 
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive('/repositorio') 
                      ? 'text-purple-600 bg-purple-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  repositório
                </a>
              </nav>
            </div>
            
            {/* Botão CTA */}
            <Link 
              to="/education-selection"
              className="bg-green-400 hover:bg-green-700 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
            >
              acessar painéis
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
