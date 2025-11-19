import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../Header";
import Footer from "../../footer"
import "./listeAnnonces.css";

const ListeAnnonces = () => {
  const [filters, setFilters] = useState({ prix: 5000, type: "", ville: "" });
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const annoncesPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/getAnnoncesActif")
      .then((res) => {
        setAnnonces(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Erreur getAnnonces:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // revenir à la page 1 quand on change un filtre
  };

  const handleReset = () => {
    setFilters({ prix: 5000, type: "", duree: "", ville: "" });
    setCurrentPage(1);
  };

  const filteredAnnonces = annonces.filter((a) => {
    const prix = a.prix ? parseFloat(a.prix) : 0;
    const prixOk = prix <= filters.prix;
    const typeOk = !filters.type || a.type?.toLowerCase() === filters.type.toLowerCase();
    const villeOk =
  !filters.ville ||
  new RegExp(`\\b${filters.ville.toLowerCase()}\\b`).test(
    (a.localisation || a.lieu || "").toLowerCase()
  );
return prixOk && typeOk && villeOk;
  });

  // Pagination
  const indexOfLastAnnonce = currentPage * annoncesPerPage;
  const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
  const currentAnnonces = filteredAnnonces.slice(indexOfFirstAnnonce, indexOfLastAnnonce);

  const types = ["Appartement", "Maison", "Villa", "Studio"];
 const villesTunisie = [
  // Nord
  "Tunis",
  "Ariana",
  "La Marsa",
  "Carthage",
  "Le Bardo",
  "Le Kram",
  "La Goulette",
  "Manouba",
  "Bizerte",
  "Beja",
  "Jendouba",
  "Tabarka",
  
  // Sahel
  "Sousse",
  "Monastir",
  "Mahdia",
  "Hammamet",
  "Nabeul",
  
  // Centre
  "Kairouan",
  "Sidi Bouzid",
  "Kasserine",
  "Siliana", // Sud
  "Sfax",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Tozeur",
  "Kebili",
  "Gafsa",
  "Djerba",
];


  if (loading) return <div className="loading">Chargement des annonces...</div>;

  return (
    <div className="liste-annonces-page">
      <Header />

      <div className="liste-annonces-container">
        <h1 className="filters-title">Filtrer les annonces</h1>

        <div className="simple-filters">
          {/* PRIX */}
          <div className="filter-item">
            <label>Prix max : {filters.prix} dt</label>
            <input
              type="range"
              min="50"
              max="5000"
              value={filters.prix}
              onChange={(e) => handleFilterChange("prix", e.target.value)}
            />
          </div>

          {/* TYPE */}
          <div className="filter-item">
            <label>Type :</label>
            <div className="filter-buttons">
              {types.map((t) => (
                <button
                  key={t}
                  className={filters.type === t ? "active" : ""}
                  onClick={() => handleFilterChange("type", t)}
                >
                  {t}
                </button>
              ))}
              <button onClick={() => handleFilterChange("type", "")}>Tous</button>
            </div>
          </div>

          
          {/* VILLE */}
          <div className="filter-item">
            <label>Ville :</label>
            <div className="filter-buttons">
              {villesTunisie.map((v) => (
                <button
                  key={v}
                  className={filters.ville === v ? "active" : ""}
                  onClick={() => handleFilterChange("ville", v)}
                >
                  {v}
                </button>
              ))}
              <button onClick={() => handleFilterChange("ville", "")}>Toutes</button>
            </div>
          </div>

          <button className="reset-btn" onClick={handleReset}>
            Réinitialiser
          </button>
        </div>

        <h2 className="results-title">
          Résultats : {filteredAnnonces.length} annonce(s)
        </h2>

        <div className="annonces-grid">
         {currentAnnonces.map((a) => {
    const imageUrl = a.image
      ? a.image.startsWith("http")
        ? a.image
        : `http://localhost:5000${a.image}`
      : "/uploads/default.jpg";

    return (
      <div
        key={a.idAnnonce || a.id}
        className="annonce-card"
        data-type={a.type}
      >
        <div className="annonce-img-container">
          <img
            src={imageUrl}
            alt={a.titre}
            className="annonce-img"
            onError={(e) => {
              e.target.src = "/uploads/default.jpg";
            }}
          />
          <span className="annonce-type">{a.type}</span>
        </div>

        <div className="annonce-info">
          <h3 className="annonce-title">{a.titre}</h3>
          <p className="annonce-location">
            <i className="fa-solid fa-location-dot"></i> {a.localisation}
          </p>

          <div className="annonce-price">
            <strong>{a.prix} DT</strong>
            {a.duree && <span className="annonce-duration"> / {a.duree}</span>}
          </div>

          <button
            className="details-btn"
            onClick={() => navigate(`/annonce/${a.idAnnonce}`)}
          >
            Voir détails
          </button>
        </div>
      </div>
    );
          })}

          {currentAnnonces.length === 0 && (
            <div className="no-results">
              <p>Aucune annonce trouvée avec ces critères</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredAnnonces.length / annoncesPerPage) }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
       <Footer/>
    </div>
  );
};

export default ListeAnnonces;
