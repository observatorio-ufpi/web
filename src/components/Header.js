import React from 'react';
import "../style/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-text"><a href="/">Observatório</a></div>
      <nav className="navbar">
        <ul>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#quem-somos">Quem Somos</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
