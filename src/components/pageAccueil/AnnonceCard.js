import React from 'react';
import './AnnonceCard.css';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const AnnonceCard = ({ annonce, onCardClick, isLoggedIn }) => {
  const navigate = useNavigate();

  const handleVoirDetails = (e) => {
    e.stopPropagation(); // éviter le click sur toute la carte

    if (isLoggedIn) {
      navigate(`/annonce/${annonce.idAnnonce}`);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Vous devez être connecté pour voir les détails.',
        confirmButtonText: 'Se connecter',
      }).then(() => {
        navigate('/login'); // redirige vers login
      });
    }
  };

  return (
    <div className="annonce-card" onClick={() => onCardClick(annonce.idAnnonce)}>
      <div className="annonce-card-image">
        <img 
          src={annonce.image} 
          alt={`${annonce.type} à ${annonce.localisation}`}
          onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
        />
        <div className="annonce-card-badge">{annonce.type}</div>
      </div>
      
      <div className="annonce-card-content">
        <div className="annonce-card-header">
          <h3 className="annonce-card-title">{annonce.localisation}</h3>
        </div>
        
        <p className="annonce-card-description">
          {annonce.type} confortable situé à {annonce.localisation}
        </p>
        
        <div className="annonce-card-footer">
          <div className="annonce-card-price">
            <span className="annonce-price">{annonce.prix}</span>
            <span className="annonce-devise">DT</span>
            <span className="annonce-duree"> {annonce.duree}</span>
          </div>
          <button className="annonce-reserve-btn" onClick={handleVoirDetails}>
            Voir Détails
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnonceCard;
