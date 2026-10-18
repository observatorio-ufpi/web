import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Home from "./components/navigation/Home.jsx";
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";
import EducationLayout from "./components/layouts/EducationLayout.jsx";
import EducationV2Layout from "./components/layouts/EducationV2Layout.jsx";
import FinancialLayout from "./components/layouts/FinancialLayout.jsx";
import AppLayout from "./components/layouts/AppLayout.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import TituloDaPagina from "./components/common/TituloDaPagina.jsx";
import theme from "./theme/muiTheme.jsx";
import "./App.css";
import { Loading } from "./components/ui";
import { Typography } from '@mui/material';

// Páginas carregadas sob demanda (lazy) — ver <Suspense> no App
const QuemSomos = lazy(() => import("./components/navigation/QuemSomos.jsx"));
const MunicipalFinancialPage = lazy(() => import("./components/pages/education/financial/MunicipalFinancialPage.jsx"));
const StateFinancialPage = lazy(() => import("./components/pages/education/financial/StateFinancialPage.jsx"));
const MunicipalIndicatorsPage = lazy(() => import("./components/pages/education/financial/MunicipalIndicatorsPage.jsx"));
const StateIndicatorsPage = lazy(() => import("./components/pages/education/financial/StateIndicatorsPage.jsx"));
const FinancialDataSelection = lazy(() => import("./components/navigation/FinancialDataSelection.jsx"));
const EducationSelection = lazy(() => import("./components/navigation/EducationSelection.jsx"));
const BasicEducationPage = lazy(() => import("./components/pages/education/basic/BasicEducationPage.jsx"));
const CondicoesOfertaPage = lazy(() => import("./components/pages/education/basic/CondicoesOfertaPage.jsx"));
const HigherEducationPage = lazy(() => import("./components/pages/education/higher/HigherEducationPage.jsx"));
const RateIndicatorsPage = lazy(() => import("./components/pages/education/rate/RateIndicatorsPage.jsx"));
const BasicEducationV2Page = lazy(() => import("./components/pages/education/basic-v2/BasicEducationV2Page.jsx"));
const PaginaNaoEncontrada = lazy(() => import("./components/navigation/PaginaNaoEncontrada.jsx"));
const ComoUsar = lazy(() => import("./components/navigation/ComoUsar.jsx"));
const Glossario = lazy(() => import("./components/navigation/Glossario.jsx"));
const MunicipalityProfilePage = lazy(() => import("./components/pages/education/financial/municipality/profile/MunicipalityProfilePage.jsx"));
const ComparisonPage = lazy(() => import("./components/pages/education/financial/municipality/comparison/ComparisonPage.jsx"));
const RankingPage = lazy(() => import("./components/pages/education/financial/municipality/ranking/RankingPage.jsx"));

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
        <TituloDaPagina />
        {/* Páginas carregadas sob demanda (lazy): cada uma baixa o próprio código
            só quando é aberta — antes o site inteiro vinha num arquivo único de ~3,8 MB */}
        <Suspense fallback={<Loading />}>
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

          {/* Educação Básica v2 (schema educacao_v2) - rota paralela de teste */}
          <Route path="/" element={<EducationV2Layout />}>
            <Route path="dados-educacionais/basica-v2" element={<BasicEducationV2Page />} />
          </Route>

          {/* Layout da Financeiro (com Sidebar de Categorias) - Rotas aninhadas */}
          <Route path="/" element={<FinancialLayout />}>
            <Route path="municipios" element={<MunicipalFinancialPage />} />
            <Route path="estado" element={<StateFinancialPage />} />
            <Route path="indicadores" element={<MunicipalIndicatorsPage />} />
            <Route path="indicadores-estaduais" element={<StateIndicatorsPage />} />
            <Route path="comparar" element={<ComparisonPage />} />
            <Route path="ranking" element={<RankingPage />} />
          </Route>

          {/* Layout antigo mantido para compatibilidade */}
          <Route path="/" element={<AppLayout />}>
          </Route>

          <Route
            path="/como-usar"
            element={
              <>
                <Navbar />
                <ComoUsar />
                <Footer />
              </>
            }
          />

          <Route
            path="/glossario"
            element={
              <>
                <Navbar />
                <Glossario />
                <Footer />
              </>
            }
          />

          {/* Perfil do município: principais números de todas as tabelas financeiras */}
          <Route
            path="/municipio/:codigo"
            element={
              <>
                <Navbar />
                <MunicipalityProfilePage />
                <Footer />
              </>
            }
          />

          {/* Endereço desconhecido: antes a tela ficava em branco */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <PaginaNaoEncontrada />
                <Footer />
              </>
            }
          />
        </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
