import React, { useState } from 'react';
import { SearchOutlined, BellOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import './Dashboard.css';
const DashboardHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
        <div className="notification-bell">
          <BellOutlined style={{ fontSize: "20px", color: "var(--color-primary-medium)" }} />
          <div className="notification-dot" />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-background-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
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
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: 'var(--color-primary-dark)' 
            }}>
              Jean D.
            </span>
            <span style={{ 
              fontSize: '12px', 
              color: 'var(--color-primary-light)' 
            }}>
              Propriétaire
            </span>
          </div>
        </div>

        <button className="primary-button">
          <PlusOutlined style={{ fontSize: "16px" }} />
          Nouvelle Annonce
        </button>
      </div>
    </div>
  );
};
export default DashboardHeader;