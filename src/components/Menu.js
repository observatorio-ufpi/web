import React from 'react';
import { FaBook } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { Link } from 'react-router-dom';
import '../style/HomePage.css';

const Menu = () => {
  return (
    <div className="homepage">
      <div className="container">

        <Link to="/dadosEducacionais" className="box">
          <FaBook size={50} />
          <h3>Acessar Dados Educacionais</h3>
          <p>Dados sobre a educação no Piauí.</p>
        </Link>
        <Link to="/dadosFinanceiros" className="box">
          <GrMoney size={50} />
          <h3>Acessar Dados Financeiros</h3>
          <p>Dados financeiros do Piauí.</p>
        </Link>
      </div>
    </div>

  );
};

export default Menu;
