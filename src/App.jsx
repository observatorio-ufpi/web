import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Home from "./components/navigation/Home.jsx";
import QuemSomos from "./components/navigation/QuemSomos.jsx";
import MunicipalFinancialPage from "./components/pages/education/financial/MunicipalFinancialPage.jsx";
import StateFinancialPage from "./components/pages/education/financial/StateFinancialPage.jsx";
import MunicipalIndicatorsPage from "./components/pages/education/financial/MunicipalIndicatorsPage.jsx";
import StateIndicatorsPage from "./components/pages/education/financial/StateIndicatorsPage.jsx";
import FinancialDataSelection from "./components/navigation/FinancialDataSelection.jsx";
import EducationSelection from "./components/navigation/EducationSelection.jsx";
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";
import BasicEducationPage from "./components/pages/education/basic/BasicEducationPage.jsx";
import CondicoesOfertaPage from "./components/pages/education/basic/CondicoesOfertaPage.jsx";
import HigherEducationPage from "./components/pages/education/higher/HigherEducationPage.jsx";
import RateIndicatorsPage from "./components/pages/education/rate/RateIndicatorsPage.jsx";
import EducationLayout from "./components/layouts/EducationLayout.jsx";
import FinancialLayout from "./components/layouts/FinancialLayout.jsx";
import AppLayout from "./components/layouts/AppLayout.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import theme from "./theme/muiTheme.jsx";
import "./App.css";
import { Typography } from '@mui/material';

// Componente que renderiza o layout baseado na rota
const AppWithLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // Páginas que devem usar o layout da homepage (com Navbar e Footer)
  const isHomePage = path === "/" || path === "/dados-financeiros" || path === "/dados-educacionais" || path === "/quem-somos";

  // Função para renderizar o componente correto baseado na rota
  const renderContent = () => {
    switch (path) {
      case "/":
        return <Home />;
      case "/quem-somos":
        return <QuemSomos />;
      case "/dados-financeiros":
        return <FinancialDataSelection />;
      case "/dados-educacionais":
        return <EducationSelection />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      {/* Renderiza Navbar apenas para páginas da homepage */}
      {isHomePage && <Navbar />}
      
      {/* Renderiza o conteúdo baseado na rota */}
      {renderContent()}
      
      {/* Renderiza Footer apenas para páginas da homepage */}
      {isHomePage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Layout da Homepage (com Navbar e Footer) */}
          <Route path="/" element={<AppWithLayout />} />
          <Route path="/quem-somos" element={<AppWithLayout />} />
          <Route path="/dados-financeiros" element={<AppWithLayout />} />
          <Route path="/dados-educacionais" element={<AppWithLayout />} />

          {/* Layout da Educação (com Sidebar de Categorias) - Rotas aninhadas */}
          <Route path="/" element={<EducationLayout />}>
            <Route path="dados-educacionais/basica" element={<BasicEducationPage />} />
            <Route path="dados-educacionais/condicoes-de-oferta" element={<CondicoesOfertaPage />} />
            <Route path="dados-educacionais/superior" element={<HigherEducationPage />} />
            <Route path="dados-educacionais/taxas" element={<RateIndicatorsPage />} />
          </Route>

          {/* Layout da Financeiro (com Sidebar de Categorias) - Rotas aninhadas */}
          <Route path="/" element={<FinancialLayout />}>
            <Route path="municipios" element={<MunicipalFinancialPage />} />
            <Route path="estado" element={<StateFinancialPage />} />
            <Route path="indicadores" element={<MunicipalIndicatorsPage />} />
            <Route path="indicadores-estaduais" element={<StateIndicatorsPage />} />
          </Route>

          {/* Layout antigo mantido para compatibilidade */}
          <Route path="/" element={<AppLayout />}>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
