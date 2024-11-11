import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ChartContainer from './components/ChartContainer';
import Header from './components/Header';
import HomePage from './components/HomePage';
import RevenueTableContainer from './components/RevenueTableContainer';
import ApiContainer from './components/ApiComponent';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tabelas" element={<RevenueTableContainer />} />
        <Route path="/indicadores" element={<ChartContainer />} />
        <Route path="/api" element={<ApiContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
