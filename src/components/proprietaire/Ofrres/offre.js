import React, { useState, useEffect } from 'react';
import './style.css';

const Offres = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffres = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/getOffres');
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        setError('Aucune offre trouvée');
        setOffres([]);
      } else {
        setOffres(data);
      }
      
    } catch (err) {
      console.error('Erreur API:', err);
      setError('Erreur de connexion au serveur');
      setOffres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  const handleSouscription = (offre) => {
    const titreOffre = offre?.titre || 'cette offre';
    alert(`Redirection vers la page de paiement pour l'offre ${titreOffre}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const formatPrix = (prix) => {
    if (prix === 0 || prix === '0' || !prix) return 'Gratuit';
    return `${prix} DT`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des offres...</p>
      </div>
    );
  }

  if (error && offres.length === 0) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>{error}</h2>
        <button onClick={fetchOffres} className="btn-retry">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="offres-page">
      <div className="offres-container">
        {/* Header */}
        <div className="offres-header">
          <h1 className="offres-title">Nos Offres Immobilières</h1>
          <p className="offres-subtitle">
            Des solutions adaptées à vos besoins de gestion de propriété
          </p>
        </div>

        {/* Grille horizontale des offres */}
        <div className="offres-horizontal">
          {offres.map((offre) => {
            const titre = offre?.titre || 'Offre';
            const description = offre?.description || '';
            const prix = offre?.prix || 0;
            const dateDebut = offre?.dateCreation || '';
            const dateFin = offre?.date_fin || '';

            return (
              <div key={offre.idOff} className="offer-card">
                {/* Header avec badge */}
                <div className="offer-header">
                 
                  <h3 className="offer-title">{titre}</h3>
                  <div className="offer-price">
                    <span className="price-amount">{formatPrix(prix)}</span>
                    {prix > 0 && <span className="price-period">/mois</span>}
                  </div>
                </div>

                {/* Description */}
                {description && (
                  <div className="offer-description">
                    <p>{description}</p>
                  </div>
                )}

                {/* Timeline */}
                <div className="offer-timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-label">Date de début</span>
                      <span className="timeline-date">{formatDate(dateDebut)}</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-label">Date de fin</span>
                      <span className="timeline-date">{formatDate(dateFin)}</span>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="offer-separator"></div>

                {/* CTA Button */}
                <button 
                  className="offer-cta"
                  onClick={() => handleSouscription(offre)}
                >
                  {prix === 0 ? 'Commencer gratuitement' : 'Choisir cette offre'}
                  <span className="cta-arrow">→</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Offres;