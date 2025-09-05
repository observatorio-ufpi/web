import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-12" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Coluna 1: Redes sociais */}
          <div className="text-center sm:text-left lg:col-span-2">
            <div className="flex justify-center sm:justify-start space-x-4 mb-6">
              <FaFacebook className="text-purple-600 text-2xl cursor-pointer hover:text-purple-700 transition-colors" />
              <FaInstagram className="text-purple-600 text-2xl cursor-pointer hover:text-purple-700 transition-colors" />
              <FaYoutube className="text-purple-600 text-2xl cursor-pointer hover:text-purple-700 transition-colors" />
            </div>
            <p className="text-gray-600">email@email.com</p>
          </div>

          {/* Coluna 2: Desenvolvimento */}
          <div className="text-center sm:text-left lg:col-span-4">
            <h3 className="font-bold text-lg mb-4">Desenvolvimento</h3>
            <div className="mb-4 grid grid-cols-2 gap-4 justify-items-center sm:justify-items-start">
              <img
                src="/images/logos/nuppege.png"
                alt="nuppege"
                className="h-8"
              />
              <img
                src="/images/logos/logo_ufpi.png"
                alt="UFPI"
                className="h-18"
              />
              <img
                src="/images/logos/uespi_logo.webp"
                alt="UESPI"
                className="h-18"
              />
              <img
                src="/images/logos/logo_ifpi.png"
                alt="IFPI"
                className="h-18"
              />
            </div>
          </div>

          {/* Coluna 3: Apoio */}
          <div className="text-center sm:text-left lg:col-span-4">
            <h3 className="font-bold text-lg mb-4">Apoio</h3>
            <div className="mb-4 grid grid-cols-2 gap-4 justify-items-center sm:justify-items-start">
              <img
                src="/images/logos/fapepi.png"
                alt="FAPEPI"
                className="h-12 md:h-16"
              />
              <img
                src="/images/logos/logo_lde.png"
                alt="LDE"
                className="h-8"
              />
              <img
                src="/images/logos/logo_cnpq.png"
                alt="CNPQ"
                className="h-10"
              />
              <img
                src="/images/logos/logo_ufpr.png"
                alt="UFPR"
                className="h-12"
              />
              <img
                src="/images/logos/logo_ufg.png"
                alt="UFG"
                className="h-20"
              />
            </div>
          </div>

          {/* Coluna 4: Conheça */}
          <div className="text-center sm:text-left lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">Conheça</h3>
            <ul className="space-y-2">
              <li><Link to="/quem-somos" className="text-gray-600 hover:text-gray-900 transition-colors">quem somos</Link></li>
              <li><Link to="/o-que-fazemos" className="text-gray-600 hover:text-gray-900 transition-colors">o que fazemos</Link></li>
              <li><Link to="/repositorio" className="text-gray-600 hover:text-gray-900 transition-colors">repositório</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>©2025 Observatório da política educacional piauiense, Nuppege. Desenvolvido por <a href="https://www.ufpi.br" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-900 transition-colors">UFPI</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 