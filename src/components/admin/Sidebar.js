// src/components/admin/Sidebar.jsx
import React from "react";
import Logout from "./../connexion/Logout";

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  activeSection, 
  onSectionChange, 
  user, 
  onLogout 
}) => {
  const menuItems = [
    { id: "dashboard", title: "Tableau de Bord", icon: "fas fa-chart-line" },
    { id: "annonces", title: "Gestion des Annonces", icon: "fas fa-newspaper" },
    { id: "utilisateurs", title: "Gestion des Utilisateurs", icon: "fas fa-users" },
    { id: "offres", title: "Offres d'Annonce", icon: "fas fa-tags" },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <i className="fas fa-home"></i>
          </div>
          {isOpen && (
            <div className="logo-text">
              <h2>DariTIN</h2>
              <span className="logo-subtitle">Admin Panel</span>
            </div>
          )}
        </div>
        <button className="toggle-sidebar" onClick={onToggle}>
          <i className={`fas fa-chevron-${isOpen ? 'left' : 'right'}`}></i>
        </button>
      </div>

      <div className="user-info">
        <div className="user-avatar">
          <div className="avatar-container">
            <i className="fas fa-user-shield"></i>
            <div className="status-indicator online"></div>
          </div>
        </div>
        {isOpen && (
          <div className="user-details">
            <h3>{user.nom} {user.prénom}</h3>
            <p className="user-email">{user.email}</p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <div className="nav-icon">
              <i className={item.icon}></i>
            </div>
            {isOpen && (
              <div className="nav-content">
                <span className="nav-title">{item.title}</span>
                <i className="fas fa-chevron-right nav-arrow"></i>
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Logout onLogout={onLogout} />
      </div>
    </div>
  );
};

export default Sidebar;