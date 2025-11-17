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
        <header className="content-header">
            <div className="header-left">
                <h1>{currentSection?.title}</h1>
                <p>Bienvenue dans votre espace d'administration</p>
            </div>

            <div className="header-right">
                <div className="header-actions">
                    <div className="user-menu">
                        {/* Notifications */}
                        <Notifications userId={user.userId} />
                        
                        {/* Profil utilisateur */}
                        <div className="user-info-small">
                            <button className="profile-btn" onClick={onProfileClick}>
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
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;