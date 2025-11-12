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
    fetch("http://localhost:5000/getAnnonces")
      .then(res => res.json())
      .then(data => setAnnonces(data))
      .catch(err => console.error("Erreur fetch :", err));
  }, []);

  // Reset current page when search or type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  // Filtrage par recherche et type
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

  // Pagination
  const indexOfLastAnnonce = currentPage * annoncesPerPage;
  const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
  const currentAnnonces = filteredAnnonces.slice(indexOfFirstAnnonce, indexOfLastAnnonce);

  // Handlers
  const handleSearch = (term) => setSearchTerm(term);
  const handleTypeFilter = (type) => setSelectedType(type);

  const totalPages = Math.ceil(filteredAnnonces.length / annoncesPerPage);

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
              {currentAnnonces.map(annonce => (
                <AnnonceCard
  key={annonce.idAnnonce}
  annonce={annonce}
  onCardClick={() => console.log('Carte cliquée:', annonce.idAnnonce)}
  isLoggedIn={isLoggedIn} // user = état de connexion (ex: context ou localStorage)
 />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? "active" : ""}
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
