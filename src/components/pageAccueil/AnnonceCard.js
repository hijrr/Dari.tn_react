import React from 'react';
import './AnnonceCard.css';

const AnnonceCard = ({ annonce, onCardClick }) => {
  const renderStars = (note) => {
    return '⭐'.repeat(Math.floor(note)) + '☆'.repeat(5 - Math.floor(note));
  };

  return (
    <div className="annonce-card" onClick={() => onCardClick(annonce.id)}>
      <div className="card-image">
        <img 
          src={annonce.image} 
          alt={`${annonce.type} à ${annonce.localisation}`}
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
        />
        <div className="card-badge">{annonce.type}</div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{annonce.localisation}</h3>
        </div>
        
        <p className="card-description">
          {annonce.type} confortable situé à {annonce.localisation}
        </p>
        
        <div className="card-footer">
          <div className="card-price">
            <span className="price">{annonce.prix}</span>
            <span className="devise">DT</span>
            <span className="duree"> {annonce.duree}</span>
          </div>
          <button className="reserve-btn">Réserver</button>
        </div>
      </div>
    </div>
  );
};

export default AnnonceCard;