import React from 'react';
import { CheckCircleOutlined, FileTextOutlined, DollarOutlined, PieChartOutlined } from "@ant-design/icons";
import './Dashboard.css';
const StatsCards = () => {
  const statsCards = [
    { 
      title: "Annonces Actives", 
      value: "24", 
      icon: <CheckCircleOutlined />,
      description: "Locations en cours",
      trend: "+12%",
      color: "var(--color-accent-green)"
    },
    { 
      title: "Réservations", 
      value: "18", 
      icon: <FileTextOutlined />,
      description: "Ce mois",
      trend: "+8%",
      color: "var(--color-accent-blue)"
    },
    { 
      title: "Revenus Mensuels", 
      value: "12,450€", 
      icon: <DollarOutlined />,
      description: "Novembre 2024",
      trend: "+18%",
      color: "var(--color-accent-purple)"
    },
    
  ];

  const handleCardHover = (e) => {
    e.currentTarget.style.transform = "translateY(-8px)";
    e.currentTarget.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.12)";
    e.currentTarget.style.borderColor = "var(--color-border-light)";
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.04)";
    e.currentTarget.style.borderColor = "var(--color-background-hover)";
  };

  return (
    <div className="stats-grid">
      {statsCards.map((stat, index) => (
        <div 
          key={index}
          className="stats-card"
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
        >
          <div className="stats-card-header">
            <div className="stats-card-title">{stat.title}</div>
            <div className="stats-card-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
          </div>
          
          <div className="stats-card-value text-gradient">{stat.value}</div>
          
          <div className="stats-card-footer">
            <div className="stats-card-description">{stat.description}</div>
            <div 
              className="stats-card-trend" 
              style={{ 
                color: stat.color,
                backgroundColor: `${stat.color}15`,
                borderColor: `${stat.color}30`
              }}
            >
              {stat.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;