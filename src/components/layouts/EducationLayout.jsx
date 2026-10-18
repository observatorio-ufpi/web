import React, { useState, createContext, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import EducationCategorySidebar from '../common/EducationCategorySidebar';
import Footer from '../common/Footer';
import { EducationFilterProvider } from '../../contexts/EducationFilterContext';
import useSidebarResponsiva from '../../hooks/useSidebarResponsiva';

// Contexto para compartilhar o estado da sidebar
export const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar deve ser usado dentro de um SidebarProvider');
  }
  return context;
};

const EducationLayout = () => {
  const [isOpen, setIsOpen] = useState(false); // Começa fechada
  const navigate = useNavigate();

  // Abre/fecha a sidebar só quando a largura cruza o breakpoint (ver hook)
  useSidebarResponsiva(setIsOpen);

  // Valor do contexto
  const sidebarValue = {
    isOpen,
    width: isOpen ? '20rem' : '0rem',
    marginLeft: isOpen ? '20rem' : '0rem',
    setIsOpen
  };

  return (
    <EducationFilterProvider>
      <SidebarContext.Provider value={sidebarValue}>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
          <a href="#conteudo" className="pular-para-conteudo">Pular para o conteúdo</a>
          {/* Sidebar fixa */}
          <EducationCategorySidebar />
          
          {/* Conteúdo principal */}
          <div className={`transition-all duration-300 ${window.innerWidth >= 768 ? '' : 'w-full'}`} style={{ marginLeft: window.innerWidth >= 768 ? (isOpen ? '20rem' : '0rem') : '0rem' }}>
            {/* Área de conteúdo */}
            {/* Com a sidebar fechada, o botão ☰ (fixed, top-4/left-4) cobria o topo do conteúdo */}
            <main id="conteudo" tabIndex={-1} className={`min-h-screen p-3 pb-24 sm:p-4 sm:pb-24 md:p-6 md:pb-6 outline-none ${isOpen ? '' : 'md:pt-16'}`}>
              <Outlet />
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
        </div>
      </SidebarContext.Provider>
    </EducationFilterProvider>
  );
};

export default EducationLayout;
