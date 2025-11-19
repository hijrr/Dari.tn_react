import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Footer from '../footer';
import AnnonceCard from './AnnonceCard';
import SearchBar from './SearchBar';
import './Acceuil.css';

const Accueil = () => {
  const user = localStorage.getItem('user'); 
  const isLoggedIn = !!user;

  const [annonces, setAnnonces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const annoncesPerPage = 3;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');

  const types = ['Tous', 'chambre', 'Appartement', 'Villa', 'Studio'];

  useEffect(() => {
    fetch("http://localhost:5000/getAnnoncesActif")
      .then(res => res.json())
      .then(data => setAnnonces(data))
      .catch(err => console.error("Erreur fetch :", err));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  const filteredAnnonces = annonces.filter(annonce => {
    const localisation = annonce.localisation ? annonce.localisation.toLowerCase() : '';
    const type = annonce.type ? annonce.type.toLowerCase() : '';

    const matchesSearch =
      localisation.includes(searchTerm.toLowerCase()) ||
      type.includes(searchTerm.toLowerCase()) ||
      annonce.prix.toString().includes(searchTerm);

    const matchesType = selectedType === 'Tous' || type === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  const indexOfLastAnnonce = currentPage * annoncesPerPage;
  const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
  const currentAnnonces = filteredAnnonces.slice(indexOfFirstAnnonce, indexOfLastAnnonce);

  const handleSearch = (term) => setSearchTerm(term);
  const handleTypeFilter = (type) => setSelectedType(type);

  const totalPages = Math.ceil(filteredAnnonces.length / annoncesPerPage);

  return (
    <div className="acc-main">
      <Header />

      <section className="acc-hero">
        <div className="acc-hero-content">
          <h1 className="acc-hero-title">Trouvez Votre Hébergement Idéal</h1>
          <p className="acc-hero-subtitle">Découvrez les meilleures annonces de location en Tunisie</p>
        </div>
      </section>

      <section className="acc-filters">
        <div className="acc-container">
          <SearchBar onSearch={handleSearch} />

          <div className="acc-type-filters">
            {types.map(type => (
              <button
                key={type}
                className={`acc-filter-btn ${selectedType === type ? 'acc-active' : ''}`}
                onClick={() => handleTypeFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="acc-annonces">
        <div className="acc-container">
          <div className="acc-section-header">
            <h2 className="acc-section-title">Les Annonces Récentes</h2>
            <p className="acc-section-subtitle">
              {filteredAnnonces.length} annonce{filteredAnnonces.length !== 1 ? 's' : ''} trouvée{filteredAnnonces.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredAnnonces.length === 0 ? (
            <div className="acc-no-results">
              <h3>Aucune annonce trouvée</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="acc-grid">
              {currentAnnonces.map(annonce => (
                <AnnonceCard
                  key={annonce.idAnnonce}
                  annonce={annonce}
                  onCardClick={() => console.log('Carte cliquée:', annonce.idAnnonce)}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="acc-pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? "acc-active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Accueil;
