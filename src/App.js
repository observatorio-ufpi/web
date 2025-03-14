import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./components/navigation/Home";
import RevenueTableContainer from "./components/pages/education/financial/municipality/tables/RevenueTableContainer";
import StateRevenueTableContainer from "./components/pages/education/financial/state/StateRevenueTableContainer";
import FinancialDataSelection from "./components/navigation/FinancialDataSelection";
import ChartContainer from "./components/pages/education/financial/municipality/indicators/ChartContainer";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ParentComponent from "./components/pages/education/ParentComponent";
import "./App.css";

// Componente para determinar qual tipo de layout usar
const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;

  // Páginas que devem usar o layout de navegação centralizada
  const isNavigationPage = path === "/" || path === "/dados-financeiros";

  // Renderiza o conteúdo com base no tipo de página
  if (isNavigationPage) {
    return (
      <div className="navigation-layout">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dados-financeiros"
            element={<FinancialDataSelection />}
          />
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
