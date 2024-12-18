import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../style/Header.css";
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className="header">
        <div className="logo-text">
          <Link to="/">Observatório</Link>
        </div>

        <button className="mobile-menu-button" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`navbar ${isOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/quem-somos">Quem Somos</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </nav>
      </header>

      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </>
  );
};

export default Header;
