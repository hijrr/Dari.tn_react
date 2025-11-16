import React, { useState } from 'react';
import { SearchOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import NotificationBell from '../notification/NotificationBell'; // Import du composant notification
import './Dashboard.css';

const DashboardHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const prenom = user?.prénom;
  const nom = user?.nom;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchFocus = (e) => {
    e.target.style.borderColor = "var(--color-accent-blue)";
    e.target.style.boxShadow = "0 4px 16px rgba(59, 130, 246, 0.15)";
  };

  const handleSearchBlur = (e) => {
    e.target.style.borderColor = "var(--color-border-light)";
    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
  };

  return (
    <div className="dashboard-header">
      <div className="search-container">
        <SearchOutlined className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher une annonce, un client, une réservation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Remplacement de l'ancienne cloche par le composant NotificationBell */}
        <NotificationBell />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-purple) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px'
          }}>
            <UserOutlined />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
              {nom + ' ' + prenom}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-primary-light)' }}>
              Propriétaire
            </span>
          </div>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/dashboard-proprietaire/ajouter-annonce")}
        >
          <PlusOutlined style={{ fontSize: "16px" }} />
          Nouvelle Annonce
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;