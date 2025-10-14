import React from 'react';
import { FilterOutlined, EnvironmentOutlined, StarFilled, EyeFilled, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import './Dashboard.css';

const AnnoncesGrid = () => {
  const annonces = [
    {
      id: 1,
      titre: "Villa Moderne avec Piscine",
      lieu: "Marseille",
      prix: "250€",
      periode: "nuit",
      statut: "Active",
      vues: 124,
      reservations: 12,
      note: 4.8,
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=250&fit=crop",
      chambres: 4,
      superficie: "120m²"
    },
    {
      id: 2,
      titre: "Appartement Design Centre-ville",
      lieu: "Paris 5ème",
      prix: "180€",
      periode: "nuit",
      statut: "En attente",
      vues: 89,
      reservations: 8,
      note: 4.6,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
      chambres: 2,
      superficie: "65m²"
    },
    {
      id: 3,
      titre: "Chalet Montagne Vue Exceptionnelle",
      lieu: "Chamonix",
      prix: "320€",
      periode: "nuit",
      statut: "Active",
      vues: 156,
      reservations: 15,
      note: 4.9,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
      chambres: 3,
      superficie: "95m²"
    },
  
  ];

  const handleAnnonceHover = (e) => {
    e.currentTarget.style.transform = "translateY(-6px)";
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.12)";
    e.currentTarget.style.borderColor = "var(--color-border-light)";
  };

  const handleAnnonceLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.04)";
    e.currentTarget.style.borderColor = "var(--color-background-hover)";
  };

  const handleButtonHover = (color) => (e) => {
    e.target.style.backgroundColor = color;
    e.target.style.color = "#fff";
    e.target.style.borderColor = color;
  };

  const handleButtonLeave = (color) => (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = color;
    e.target.style.borderColor = "var(--color-border-light)";
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">🏠 Dernières Annonces</h2>
          <p className="section-subtitle">
            {annonces.length} annonces actives • Gérer vos propriétés
          </p>
        </div>
  
      </div>
      
      <div className="annonces-grid">
        {annonces.map((annonce) => (
          <div 
            key={annonce.id}
            className="annonce-card"
            onMouseEnter={handleAnnonceHover}
            onMouseLeave={handleAnnonceLeave}
          >
            <div 
              className="annonce-image"
              style={{ backgroundImage: `url(${annonce.image})` }}
            >
              <div 
                className="annonce-status"
                style={{
                  color: annonce.statut === "Active" ? "var(--color-accent-green)" : "var(--color-accent-orange)",
                  backgroundColor: annonce.statut === "Active" ? "var(--color-accent-green)15" : "var(--color-accent-orange)15",
                  border: `1px solid ${annonce.statut === "Active" ? "var(--color-accent-green)30" : "var(--color-accent-orange)30"}`
                }}
              >
                {annonce.statut}
              </div>
            </div>

            <div className="annonce-content">
              <div style={{ marginBottom: "20px" }}>
                <div className="annonce-title">{annonce.titre}</div>
                <div className="annonce-location">
                  <EnvironmentOutlined />
                  {annonce.lieu}
                </div>
              </div>

              <div className="annonce-details-grid">
                <div className="detail-item">
                  <div className="detail-label">CHAMBRES</div>
                  <div className="detail-value">{annonce.chambres}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">SUPERFICIE</div>
                  <div className="detail-value">{annonce.superficie}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">VUES</div>
                  <div className="detail-value">{annonce.vues}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">RÉSERVATIONS</div>
                  <div className="detail-value">{annonce.reservations}</div>
                </div>
              </div>

              <div className="annonce-price-rating">
                <div>
                  <div className="annonce-price">
                    {annonce.prix}
                    <span className="price-period">/{annonce.periode}</span>
                  </div>
                </div>
                <div className="annonce-rating">
                  <StarFilled style={{ color: "var(--color-accent-orange)", fontSize: "16px" }} />
                  <span className="rating-value">{annonce.note}</span>
                  <span className="rating-max">/5</span>
                </div>
              </div>

              <div className="annonce-actions">
            
                
                <button 
                  className="action-button"
                  style={{ color: "var(--color-accent-orange)" }}
                  onMouseEnter={handleButtonHover("var(--color-accent-orange)")}
                  onMouseLeave={handleButtonLeave("var(--color-accent-orange)")}
                >
                  <EditOutlined />
                  Modifier
                </button>
                
                <button 
                  className="action-button"
                  style={{ color: "var(--color-accent-red)" }}
                  onMouseEnter={handleButtonHover("var(--color-accent-red)")}
                  onMouseLeave={handleButtonLeave("var(--color-accent-red)")}
                >
                  <DeleteOutlined />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnoncesGrid;