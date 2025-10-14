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

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("accueil");

  const menuItems = [
    { 
      id: "accueil",
      icon: <HomeOutlined />, 
      label: "Accueil"
    },
    { 
      id: "annonces",
      icon: <AppstoreOutlined />, 
      label: "Mes Annonces" 
    },
    { 
      id: "reservations",
      icon: <ProfileOutlined />, 
      label: "Réservations" 
    },
    { 
      id: "clients",
      icon: <TeamOutlined />, 
      label: "Clients" 
    },
    { 
      id: "revenus",
      icon: <DollarOutlined />, 
      label: "Revenus" 
    },
    { 
      id: "analytics",
      icon: <BarChartOutlined />, 
      label: "Analytics" 
    },
    { 
      id: "parametres",
      icon: <SettingOutlined />, 
      label: "Paramètres" 
    }
  ];

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">LocationPro</div>
        <div className="sidebar-subtitle">DASHBOARD PROPRIÉTAIRE</div>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(item.id)}
          >
            <span style={{ fontSize: "16px", opacity: activeMenu === item.id ? "1" : "0.7" }}>
              {item.icon}
            </span>
            {item.label}
          </div>
        ))}
      </div>

      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: '20px',
        borderTop: '1px solid var(--color-border-light)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          padding: '12px',
          borderRadius: '10px',
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
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-purple) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px'
          }}>
            <UserOutlined />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: 'var(--color-primary-dark)' 
            }}>
              Jean Dupont
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--color-primary-light)' 
            }}>
              Propriétaire
            </div>
          </div>
          <LogoutOutlined style={{ 
            color: 'var(--color-primary-light)',
            fontSize: '16px'
          }} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;