import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import RevenueTableContainer from './components/RevenueTableContainer';
import StateRevenueTableContainer from './components/StateRevenueTableContainer';
import FinancialDataSelection from './components/FinancialDataSelection';
import ChartContainer from './components/ChartContainer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParentComponent from './components/ParentComponent';
import './App.css';

// Componente para determinar qual tipo de layout usar
const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Páginas que devem usar o layout de navegação centralizada
  const isNavigationPage = path === '/' || path === '/dados-financeiros';
  
  // Renderiza o conteúdo com base no tipo de página
  if (isNavigationPage) {
    return (
      <div className="navigation-layout">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dados-financeiros" element={<FinancialDataSelection />} />
        </Routes>
      </div>
    );
  } else {
    // Para páginas de conteúdo, use o layout normal com main-content
    return (
      <main className="main-content">
        <Routes>
          <Route path="/municipios" element={<RevenueTableContainer />} />
          <Route path="/estado" element={<StateRevenueTableContainer />} />
          <Route path="/indicadores" element={<ChartContainer />} />
          <Route path="/dados-educacionais" element={<ParentComponent />} />
        </Routes>
      </main>
    );
  }
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <AppContent />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
