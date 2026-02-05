import React, { useState, createContext, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import EducationCategorySidebar from '../common/EducationCategorySidebar';
import Footer from '../common/Footer';
import { EducationFilterProvider } from '../../contexts/EducationFilterContext';

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

  // Ajusta o estado inicial baseado no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsOpen(true); // Abre em telas grandes
      } else {
        setIsOpen(false); // Fecha em telas pequenas
      }
    };

    // Executa na primeira vez
    handleResize();

    // Escuta mudanças de tamanho
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Valor do contexto
  const sidebarValue = {
    isOpen,
    width: isOpen ? '16rem' : '0rem',
    marginLeft: isOpen ? '16rem' : '0rem',
    setIsOpen
  };

  return (
    <EducationFilterProvider>
      <SidebarContext.Provider value={sidebarValue}>
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
          {/* Sidebar fixa */}
          <EducationCategorySidebar />
          
          {/* Conteúdo principal */}
          <div className={`transition-all duration-300 ${window.innerWidth >= 768 ? '' : 'w-full'}`} style={{ marginLeft: window.innerWidth >= 768 ? (isOpen ? '16rem' : '0rem') : '0rem' }}>
            {/* Área de conteúdo */}
            <main className="min-h-screen p-3 sm:p-4 md:p-6">
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
