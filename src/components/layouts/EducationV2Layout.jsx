import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import EducationV2Sidebar from '../common/EducationV2Sidebar';
import Footer from '../common/Footer';
import { EducationV2FilterProvider } from '../../contexts/EducationV2FilterContext';

/**
 * Layout da página basica-v2: espelha o EducationLayout, mas com a sidebar
 * de filtros do schema educacao_v2 (dirigida pelo catálogo da API).
 */
const EducationV2Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <EducationV2FilterProvider>
      <div
        className="min-h-screen"
        style={{ backgroundColor: 'var(--background-color)' }}
      >
        <EducationV2Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div
          className={`transition-all duration-300 ${window.innerWidth >= 768 ? '' : 'w-full'}`}
          style={{
            marginLeft:
              window.innerWidth >= 768 ? (isOpen ? '20rem' : '0rem') : '0rem',
          }}
        >
          <main className="min-h-screen p-3 sm:p-4 md:p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </EducationV2FilterProvider>
  );
};

export default EducationV2Layout;
