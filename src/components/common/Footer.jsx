import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-12" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Coluna 1: Redes sociais */}
          <div className="text-center sm:text-left">
            <div className="flex justify-center sm:justify-start space-x-4 mb-6">
              <FaFacebook className="text-purple-600 text-2xl cursor-pointer hover:text-purple-700 transition-colors" />
              <FaInstagram className="text-purple-600 text-2xl cursor-pointer hover:text-purple-700 transition-colors" />
              <FaYoutube className="text-purple-600 text-2xl cursor-pointer hover:text-purple-700 transition-colors" />
            </div>
            <p className="text-gray-600">email@email.com</p>
          </div>

          {/* Coluna 2: Desenvolvimento */}
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4">Desenvolvimento</h3>
            <div className="mb-4 flex justify-center sm:justify-start">
              <img
                src="/images/logos/nuppege.png"
                alt="nuppege"
                className="h-8"
              />
            </div>
          </div>

          {/* Coluna 3: Apoio */}
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4">Apoio</h3>
            <div className="mb-4 flex justify-center sm:justify-start">
              <img
                src="/images/logos/fapepi.png"
                alt="FAPEPI"
                className="h-16 md:h-20"
              />
            </div>
          </div>

          {/* Coluna 4: Conheça */}
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4">Conheça</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">quem somos</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">o que fazemos</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">repositório</a></li>
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