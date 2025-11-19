import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Notif from "../utilisateur/notification_client/notifClient";
import './Header.css';

const Header = () => {
  const [user, setUser] = useState(null);

  // Charger les infos du user depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  // Aller au profil
  const handleProfileClick = () => {
    window.location.href = "/profile";
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">

          {/* LOGO */}
          <div className="logo">
            <img src="/images/1200x600wa.png" alt="dari" />
          </div>

          {/* NAVIGATION */}
          <nav className="nav-links">

            <a href="/" className="nav-link active">Accueil</a>

            {/* SI USER CONNECTÉ */}
            {user ? (
              <>
                <a href="/filter" className="nav-link">Annonces</a>

                <div className="header-user-container">

                  {/* PROFIL */}
                  <button className="header-profile-btn" onClick={handleProfileClick}>
                    <img
                      src={
                        user.profileImage
                          ? user.profileImage.startsWith("http")
                            ? user.profileImage
                            : `http://localhost:5000${user.profileImage}`
                          : "/images/default-avatar.png"
                      }
                      alt="Profil"
                      className="header-user-avatar"
                      onError={(e) => {
                        e.target.src = "/images/default-avatar.png";
                      }}
                    />
                    <span className="header-user-name">
                      {user.prénom} {user.nom}
                    </span>
                  </button>

                  {/* NOTIFICATIONS */}
                  <Notif />

                  {/* DÉCONNEXION */}
                  <button className="header-logout-btn" onClick={handleLogout}>
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              /* SI NON CONNECTÉ */
              <Link to="/login">
                <button className="header-login-btn">Connexion</button>
              </Link>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
