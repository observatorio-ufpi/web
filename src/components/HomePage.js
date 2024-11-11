import React from 'react';
import { Link } from 'react-router-dom';
import '../style/HomePage.css';
import { FaTable, FaChartBar } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="container">
        <Link to="/tabelas" className="box">
          <FaTable size={50} />
          <h3>Acessar Dados</h3>
          <p>Visualize e analise os dados em formato tabular.</p>
        </Link>
        <Link to="/indicadores" className="box">
          <FaChartBar size={50} />
          <h3>Acessar Indicadores</h3>
          <p>Explore os indicadores e métricas relevantes.</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
