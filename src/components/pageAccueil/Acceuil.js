import React, { useState,useEffect } from 'react';
import Header from '../Header';
import AnnonceCard from './AnnonceCard';
import SearchBar from './SearchBar';
import './Acceuil.css';

const Accueil = () => {
  const [annonces, setAnnonces] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/getAnnonces") // URL de ton backend
      .then(res => res.json())
      .then(data => setAnnonces(data))
      .catch(err => console.error("Erreur fetch :", err));
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');

  const types = ['Tous', 'chambre', 'Appartement', 'Villa', 'Studio'];

  const filteredAnnonces = annonces.filter(annonce => {
    const localisation = annonce.localisation ? annonce.localisation.toLowerCase() : '';
  const type = annonce.type ? annonce.type.toLowerCase() : '';

   const matchesSearch = localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     type.toLowerCase().includes(searchTerm.toLowerCase())||
                     annonce.prix.toString().includes(searchTerm);
    const matchesType = selectedType === 'Tous' || type === selectedType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  return (
    <div className="accueil">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Trouvez Votre Hébergement Idéal</h1>
          <p className="hero-subtitle">Découvrez les meilleures annonces de location en Tunisie</p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="filters-section">
        <div className="container">
          <SearchBar onSearch={handleSearch} />
          
          <div className="type-filters">
            {types.map(type => (
              <button
                key={type}
                className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                onClick={() => handleTypeFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Annonces Section */}
      <section className="annonces-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Les Annonces Récentes</h2>
            <p className="section-subtitle">
              {filteredAnnonces.length} annonce{filteredAnnonces.length !== 1 ? 's' : ''} trouvée{filteredAnnonces.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredAnnonces.length === 0 ? (
            <div className="no-results">
              <h3>Aucune annonce trouvée</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="annonces-grid">
              {filteredAnnonces.map(annonce => (
                <AnnonceCard 
                  key={annonce.idAnnonce} 
                  annonce={annonce}
                  onCardClick={() => console.log('Carte cliquée:', annonce.idAnnonce)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Location Tunisie</h3>
              <p>Votre plateforme de confiance pour trouver le logement parfait</p>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: contact@locationtunisie.com</p>
              <p>Tél: +216 12 345 678</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Location Tunisie. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Accueil;