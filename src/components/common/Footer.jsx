import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-line py-12 print:hidden" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Coluna 1: Redes sociais */}
          <div className="text-center sm:text-left lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">Nossos Contatos</h3>
            <div className="flex justify-center sm:justify-start space-x-4 mb-6">
              <a 
                href="https://www.instagram.com/nuppege" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-dark transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <FaInstagram className="text-2xl cursor-pointer" />
                  <p>@nuppege</p>
                </div>
              </a>
            </div>
            <a href="mailto:opepi@ufpi.edu.br" className="text-brand hover:text-brand-dark transition-colors">opepi@ufpi.edu.br</a>
          </div>

          {/* Coluna 2: Desenvolvimento */}
          <div className="text-center sm:text-left lg:col-span-4">
            <h3 className="font-bold text-lg mb-4">Desenvolvimento</h3>
            <img
              src="/images/logos/desenvolvimento.png"
              alt="Nuppege, UFPI, UESPI e IFPI"
              className="mb-4 mx-auto sm:mx-0 h-16 w-auto max-w-full object-contain"
            />
          </div>

          {/* Coluna 3: Apoio */}
          <div className="text-center sm:text-left lg:col-span-4">
            <h3 className="font-bold text-lg mb-4">Apoio</h3>
            <img
              src="/images/logos/apoio.png"
              alt="FAPEPI, LDE e CNPq"
              className="mb-4 mx-auto sm:mx-0 h-16 w-auto max-w-full object-contain"
            />
          </div>

          {/* Coluna 4: Conheça */}
          <div className="text-center sm:text-left lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">Conheça</h3>
            <ul className="space-y-2">
              {/* "o que fazemos" e "/repositorio" levavam a "Página não encontrada" */}
              <li><Link to="/quem-somos" className="text-gray-600 hover:text-brand transition-colors">quem somos</Link></li>
              <li><Link to="/como-usar" className="text-gray-600 hover:text-brand transition-colors">como usar</Link></li>
              <li><Link to="/glossario" className="text-gray-600 hover:text-brand transition-colors">glossário</Link></li>
              <li><a href="https://repositorio.opepi.pi.gov.br" className="text-gray-600 hover:text-brand transition-colors">repositório</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line mt-8 pt-8 text-center text-gray-600">
          <p>©{new Date().getFullYear()} Observatório da Política Educacional Piauiense, Nuppege. Desenvolvido pela <a href="https://www.ufpi.br" target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-dark transition-colors">UFPI</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 