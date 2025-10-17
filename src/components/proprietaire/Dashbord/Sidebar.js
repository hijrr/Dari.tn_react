import React, { useState } from 'react';
import {
  HomeOutlined,
  AppstoreOutlined,
  ProfileOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import './Dashboard.css';

const Sidebar = ({ onMenuClick }) => {
  const [activeMenu, setActiveMenu] = useState("accueil");

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    if (onMenuClick) {
      onMenuClick(menuId);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-subtitle">DASHBOARD PROPRIÉTAIRE</div>
      </div>
      
      <ul className="sidebar-menu">
        <li
          className={`menu-item ${activeMenu === "accueil" ? 'active' : ''}`}
          onClick={() => handleMenuClick("accueil")}
        >
          <span className="menu-icon">
            <HomeOutlined />
          </span>
          <span className="menu-label">Accueil</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "annonces" ? 'active' : ''}`}
          onClick={() => handleMenuClick("annonces")}
        >
          <span className="menu-icon">
            <AppstoreOutlined />
          </span>
          <span className="menu-label">Mes Annonces</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "reservations" ? 'active' : ''}`}
          onClick={() => handleMenuClick("reservations")}
        >
          <span className="menu-icon">
            <ProfileOutlined />
          </span>
          <span className="menu-label">Réservations</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "clients" ? 'active' : ''}`}
          onClick={() => handleMenuClick("clients")}
        >
          <span className="menu-icon">
            <TeamOutlined />
          </span>
          <span className="menu-label">Clients</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "revenus" ? 'active' : ''}`}
          onClick={() => handleMenuClick("revenus")}
        >
          <span className="menu-icon">
            <DollarOutlined />
          </span>
          <span className="menu-label">Revenus</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "analytics" ? 'active' : ''}`}
          onClick={() => handleMenuClick("analytics")}
        >
          <span className="menu-icon">
            <BarChartOutlined />
          </span>
          <span className="menu-label">Analytics</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "parametres" ? 'active' : ''}`}
          onClick={() => handleMenuClick("parametres")}
        >
          <span className="menu-icon">
            <SettingOutlined />
          </span>
          <span className="menu-label">Paramètres</span>
        </li>
      </ul>

      <div className="sidebar-footer">
        <ul className="user-profile">
          <li className="user-avatar-item">
            <div className="user-avatar">
              <UserOutlined />
            </div>
          </li>
          <li className="user-info-item">
            <ul className="user-details-list">
              <li className="user-name-item">Jean Dupont</li>
              <li className="user-role-item">Propriétaire</li>
            </ul>
          </li>
          <li className="logout-item">
            <LogoutOutlined className="logout-icon" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;