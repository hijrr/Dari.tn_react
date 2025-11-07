import React, { useState, useEffect } from "react"; // 🧠 باش نجم نستعمل useState و useEffect
import axios from "axios"; // 🌐 باش نبعث طلبات HTTP للسيرفر (API)
import { CheckCircleOutlined, PauseCircleOutlined, UserOutlined, CreditCardOutlined } from "@ant-design/icons";
import './Dashboard.css';
const StatsCards = () => {
const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.userId;

const [activecount, setactivecount] = useState(0);
const [inactivecount, setinactivecount] = useState(0);
const [demandecount, setdemandecount] = useState(0);
const [paimenteffecute, setpaimenteffecute] = useState(0);

useEffect(() => {
  // ✅ Correction : utiliser les backticks ``
  axios.get(`http://localhost:5000/get/NombreAnnoncesActives/${userId}`)
    .then(res => setactivecount(res.data.nombreAnnonceActive)) // ✅ Correction : res.data directement car l'API retourne le nombre
    .catch(err => console.error(err));
}, [userId]); // ✅ Ajouter userId comme dépendance
  useEffect(() => {
  axios.get(`http://localhost:5000/get/NombreAnnoncesInactives/${userId}`)
    .then(res => setinactivecount(res.data.nombreAnnonceINActive ))
    .catch(err => console.error(err));
}, [userId]);
 useEffect(() => {
  axios.get(`http://localhost:5000/get/NombrdemandeClients/${userId}`)
    .then(res => setdemandecount(res.data.nombdemandesclinets))
    .catch(err => console.error(err));
}, [userId]);
 useEffect(() => {
  axios.get(`http://localhost:5000/get/nombrepaimenteffecute/${userId}`)
    .then(res => setpaimenteffecute(res.data.nombrepaimenteffecute))
    .catch(err => console.error(err));
}, [userId]);


  const statsCards = [
    { 
      title: "Annonces Actives", 
      value: activecount, 
      icon: <CheckCircleOutlined />,
      color: "var(--color-accent-green)",
      description: "Locations en cours"
    },
    { 
      title: "Annonces Inactives", 
      value: inactivecount, 
      icon: <PauseCircleOutlined />,
      color: "var(--color-accent-red)",
      description: "En attente ou suspendues"
    },
    { 
      title: "Demandes Clients", 
      value: demandecount, 
      icon: <UserOutlined />,
      color: "var(--color-accent-blue)",
      description: "Réservations ce mois"
    },
    { 
      title: "Paiements effectués", 
      value: paimenteffecute, 
      icon: <CreditCardOutlined />,
      color: "var(--color-accent-purple)",
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;