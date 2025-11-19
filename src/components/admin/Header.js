// src/components/admin/Header.jsx
import React from "react";
import Notifications from "./notif"; // Correction du nom du fichier

const Header = ({ activeSection, user, onProfileClick }) => {
    const menuItems = [
        { id: "dashboard", title: "Tableau de Bord" },
        { id: "annonces", title: "Gestion des Annonces" },
        { id: "utilisateurs", title: "Gestion des Utilisateurs" },
        { id: "offres", title: "Offres d'Annonce" },
    ];

    const currentSection = menuItems.find(item => item.id === activeSection);

    return (
        <header className="dashHeader">
            <div className="dashHeader-left">
                <h1 className="dashHeader-title">{currentSection?.title}</h1>
                <p className="dashHeader-subtitle">Bienvenue dans votre espace d'administration</p>
            </div>

            <div className="dashHeader-right">
                <div className="dashHeader-actions">
                    <div className="dashHeader-userMenu">

                        {/* Notifications */}
                        <Notifications userId={user.userId} />

                        {/* Profil utilisateur */}
                        <div className="dashHeader-userBox">
                            <button className="dashHeader-profileBtn" onClick={onProfileClick}>
                                <img
                                    src={
                                        user.profileImage
                                            ? user.profileImage.startsWith("http")
                                                ? user.profileImage
                                                : `http://localhost:5000${user.profileImage}`
                                            : "/images/default-avatar.png"
                                    }
                                    alt="Profil"
                                    className="dashHeader-avatar"
                                    onError={(e) => { e.target.src = "/images/default-avatar.png"; }}
                                />
                                <span className="dashHeader-username">
                                    {user.prénom} {user.nom}
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <style>
                {`
        
        /* ---- HEADER GLOBAL ---- */
.dashHeader {
  width: 100%;
  padding: 18px 25px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ---- LEFT SIDE ---- */
.dashHeader-left {
  display: flex;
  flex-direction: column;
}

.dashHeader-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #2f2f2f;
}

.dashHeader-subtitle {
  font-size: 0.95rem;
  color: #777;
  margin-top: 4px;
}

/* ---- RIGHT SIDE ---- */
.dashHeader-right {
  display: flex;
  align-items: center;
}

.dashHeader-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

/* ---- USER MENU ---- */
.dashHeader-userMenu {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* ---- USER BOX ---- */
.dashHeader-userBox {
  display: flex;
  align-items: center;
}

/* --- Profile button --- */
.dashHeader-profileBtn {
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

/* ---- Avatar ---- */
.dashHeader-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #667eea;
}

/* ---- Username ---- */
.dashHeader-username {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

        `}</style>
        </header>

    );
};

export default Header;