import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import RevenueTableContainer from './components/RevenueTableContainer';
import MDEChartComponent from './components/MdeChartComponent';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tabelas" element={<RevenueTableContainer />} />
        <Route path="/indicadores" element={<MDEChartComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
