import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);

  // Charger les infos du user depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/"; // redirige vers l'accueil
  };
// Fonction pour le bouton profil
  const handleProfileClick = () => {
    console.log('Profil utilisateur cliqué');
    // Ici vous pouvez ajouter la navigation vers la page profil
     window.location.href = "/profile";
  };
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <img src="/images/1200x600wa.png" alt="dari" />
          </div>

          <nav className="nav">
            <a href="/" className="nav-link active">Accueil</a>
            <a href="#annonces" className="nav-link">Annonces</a>
            <a href="#contact" className="nav-link">Contact</a>

            {user ? 
            (
            <div className="user-container">

                <button className="profile-btn" onClick={handleProfileClick}>
                   <img
    src={
      user.profileImage
        ? user.profileImage.startsWith("http")
          ? user.profileImage
          : `http://localhost:5000${user.profileImage}`
        : "/images/default-avatar.png"
    }
    alt="Profil"
    className="user-avatar-img"
    onError={(e) => {
      e.target.src = "/images/default-avatar.png";
    }}
  />
                  <span className="user-name">
                    {user.prénom} {user.nom}
                  </span>
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="login-btn">Connexion</button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
