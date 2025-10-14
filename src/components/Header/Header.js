import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <img src="/images/1200x600wa.png" alt="dari" />

          </div>
          
        

          <nav className="nav">
            <a href="#accueil" className="nav-link active">Accueil</a>
            <a href="#annonces" className="nav-link">Annonces</a>
            <a href="#contact" className="nav-link">Contact</a>
            <button className="login-btn">Connexion</button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;