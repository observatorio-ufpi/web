import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ApiContainer from './components/ApiComponent';
import ChartContainer from './components/ChartContainer';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ParentComponent from './components/ParentComponent';
import Menu from './components/Menu';
import RevenueTableContainer from './components/RevenueTableContainer';
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/tabelas" element={<RevenueTableContainer />} />
        <Route path="/indicadores" element={<ChartContainer />} />
        <Route path="/api" element={<ApiContainer />} />

        <Route path="/dadosEducacionais" element={<ParentComponent />} />
        <Route path="/dadosFinanceiros" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
