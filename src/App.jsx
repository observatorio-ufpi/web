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
import RevenueTableContainer from "./components/pages/education/financial/municipality/tables/RevenueTableContainer.jsx";
import StateRevenueTableContainer from "./components/pages/education/financial/state/StateRevenueTableContainer.jsx";
import FinancialDataSelection from "./components/navigation/FinancialDataSelection.jsx";
import EducationSelection from "./components/navigation/EducationSelection.jsx";
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";
import ParentComponent from "./components/pages/education/basic/ParentComponent.jsx";
import FilterComponent from "./components/pages/education/higher/FilterComponent.jsx";
import FiltrosRateComponent from "./components/pages/education/rate/FiltrosRateComponent.jsx";
import ChartContainer from "./components/pages/education/financial/municipality/indicators/ChartContainer.jsx";
import AppLayout from "./components/layouts/AppLayout.jsx";
import theme from "./theme/muiTheme.jsx";
import "./App.css";
import { Typography } from '@mui/material';

// Componente que renderiza o layout baseado na rota
const AppWithLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // Páginas que devem usar o layout da homepage (com Navbar e Footer)
  const isHomePage = path === "/" || path === "/dados-financeiros" || path === "/dados-educacionais";

  return (
    <div>
      {/* Renderiza Navbar apenas para páginas da homepage */}
      {isHomePage && <Navbar />}
      
      {/* Renderiza o conteúdo baseado no tipo de página */}
      {isHomePage ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dados-financeiros"
            element={<FinancialDataSelection />}
          />
          <Route
            path="/dados-educacionais"
            element={<EducationSelection />}
          />
        </Routes>
      ) : (
        <AppLayout />
      )}
      
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
        <Routes>
          {/* Layout da Homepage */}
          <Route path="/" element={<AppWithLayout />}>
            <Route index element={<Home />} />
            <Route path="dados-financeiros" element={<FinancialDataSelection />} />
            <Route path="dados-educacionais" element={<EducationSelection />} />
          </Route>

          {/* Layout da Aplicação (com Sidebar) */}
          <Route path="/" element={<AppLayout />}>
            <Route path="municipios" element={<RevenueTableContainer />} />
            <Route path="estado" element={<StateRevenueTableContainer />} />
            <Route path="indicadores" element={<ChartContainer />} />
            <Route path="dados-educacionais/basica" element={<ParentComponent />} />
            <Route path="dados-educacionais/superior" element={<FilterComponent />} />
            <Route path="dados-educacionais/taxas" element={<FiltrosRateComponent />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
