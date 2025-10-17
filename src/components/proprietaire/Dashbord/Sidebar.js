import React, { useState } from 'react';
import {
  HomeOutlined,
  AppstoreOutlined,
  GiftOutlined,
  MessageOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
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
          <span className="menu-label">Annonces</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "reservations" ? 'active' : ''}`}
          onClick={() => handleMenuClick("reservations")}
        >
          <span className="menu-icon">
            <GiftOutlined />
          </span>
          <span className="menu-label">Offres</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "clients" ? 'active' : ''}`}
          onClick={() => handleMenuClick("clients")}
        >
          <span className="menu-icon">
            <MessageOutlined />
          </span>
          <span className="menu-label">Demandes Clients</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "revenus" ? 'active' : ''}`}
          onClick={() => handleMenuClick("revenus")}
        >
          <span className="menu-icon">
            <PhoneOutlined />
          </span>
          <span className="menu-label">Contact Agence</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "analytics" ? 'active' : ''}`}
          onClick={() => handleMenuClick("analytics")}
        >
          <span className="menu-icon">
            <CreditCardOutlined />
          </span>
          <span className="menu-label">Payment</span>
        </li>

        <li
          className={`menu-item ${activeMenu === "parametres" ? 'active' : ''}`}
          onClick={() => handleMenuClick("parametres")}
        >
          <span className="menu-icon">
            <UserOutlined />
          </span>
          <span className="menu-label">Profil</span>
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