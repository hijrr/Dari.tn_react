// GestionAnnonces.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import LoadingSpinner from "./common/LoadingSpinner";
import "./Annonce.css";
import { useNavigate } from "react-router-dom";


const GestionAnnonces = ({ annonces, loading, onStatusChange, onDelete, onRefresh }) => {
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    status: "all"
  });
  const [filteredAnnonces, setFilteredAnnonces] = useState([]);
  const navigate = useNavigate();

  // Filtrage
  useEffect(() => {
    if (!annonces) return;

    const filtered = annonces.filter(a => {
      const matchesSearch =
        !filters.search ||
        a.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.nomUtilisateur?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesMinPrice = !filters.minPrice || (a.prix && a.prix >= parseFloat(filters.minPrice));
      const matchesMaxPrice = !filters.maxPrice || (a.prix && a.prix <= parseFloat(filters.maxPrice));

      const matchesStatus =
        filters.status === "all" || getStatusText(a.statu) === filters.status;

      return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStatus;
    });

    setFilteredAnnonces(filtered);
  }, [annonces, filters]);

  const hasActiveFilters =
    filters.search || filters.minPrice || filters.maxPrice || filters.status !== "all";

  const getStatusText = (status) => {
    const s = status ? String(status).toLowerCase().trim() : "inactive";
    return ["active", "actif", "activé", "en ligne", "publié", "publiée", "1", "true", "vrai"].includes(s)
      ? "active"
      : "inactive";
  };

  const getStatusBadgeClass = (status) =>
    getStatusText(status) === "active" ? "ga-status-badge ga-status-active" : "ga-status-badge ga-status-inactive";

  const getStatusIcon = (status) => (getStatusText(status) === "active" ? "🟢" : "🔴");

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters({ search: "", minPrice: "", maxPrice: "", status: "all" });

  const displayedAnnonces = hasActiveFilters ? filteredAnnonces : annonces;

  if (loading) return <LoadingSpinner message="Chargement des annonces..." />;

  if (!annonces || annonces.length === 0)
    return (
      <div className="ga-empty-state">
        <div className="ga-empty-icon">📰</div>
        <h3>Aucune annonce trouvée</h3>
        <p>Aucune annonce n'est actuellement enregistrée.</p>
      </div>
    );

  return (
    <div className="ga-container">
      {/* Header */}
      <div className="ga-header">
        <button onClick={onRefresh} className="ga-btn-refresh">
          <i className="fas fa-sync-alt"></i> Actualiser
        </button>
      </div>

      {/* Section filtres */}
      <div className="ga-filters-section">
        <div className="ga-filters-header">
          <h3><i className="fas fa-search"></i> Rechercher des annonces</h3>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ga-btn-clear-filters">
              <i className="fas fa-times"></i> Effacer les filtres
            </button>
          )}
        </div>

        <div className="ga-filters-grid">
          <div className="ga-filter-group">
            <label htmlFor="search" className="ga-filter-label">Recherche</label>
            <input
              id="search"
              type="text"
              placeholder="Titre, description ou utilisateur..."
              value={filters.search}
              onChange={e => handleFilterChange("search", e.target.value)}
              className="ga-filter-input"
            />
          </div>

          <div className="ga-filter-group">
            <label htmlFor="minPrice" className="ga-filter-label">Prix min</label>
            <input
              id="minPrice"
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={e => handleFilterChange("minPrice", e.target.value)}
              className="ga-filter-input"
            />
          </div>

          <div className="ga-filter-group">
            <label htmlFor="maxPrice" className="ga-filter-label">Prix max</label>
            <input
              id="maxPrice"
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={e => handleFilterChange("maxPrice", e.target.value)}
              className="ga-filter-input"
            />
          </div>

          <div className="ga-filter-group">
            <label htmlFor="status" className="ga-filter-label">Statut</label>
            <select
              id="status"
              value={filters.status}
              onChange={e => handleFilterChange("status", e.target.value)}
              className="ga-filter-select"
            >
              <option value="all">Tous</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section annonces */}
      <div className="ga-annonces-section">
        <table className="ga-table-annonces">
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Utilisateur</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {displayedAnnonces.map(a => (
              <tr
                key={a.idAnnonce}
                className="ga-row-click"
                onClick={() => navigate(`/annonces/${a.idAnnonce}`)}
              >
                <td>
                  {a.image
                    ? <img src={a.image} alt={a.titre} className="ga-annonce-image" />
                    : <div className="ga-no-image"><i className="fas fa-camera"></i></div>
                  }
                </td>

                <td className="ga-annonce-titre">{a.titre}</td>
                <td className="ga-description-truncate">{a.description}</td>
                <td className="ga-annonce-prix">{a.prix} DT</td>
                <td>
                  <span className={getStatusBadgeClass(a.statu)}>
                    <span className="ga-status-icon">{getStatusIcon(a.statu)}</span>
                    {getStatusText(a.statu)}
                  </span>
                </td>
                <td className="ga-annonce-utilisateur">{a.nomUtilisateur || "Inconnu"}</td>

                <td
                  className="ga-actions-container"
                  onClick={(e) => e.stopPropagation()} // IMPORTANT !!
                >
                  <select
                    className="ga-status-select"
                    value={getStatusText(a.statu)}
                    onChange={e => onStatusChange(a.idAnnonce, e.target.value)}
                  >
                    <option value="active">🟢 Active</option>
                    <option value="inactive">🔴 Inactive</option>
                  </select>

                  <button
                    onClick={() => onDelete(a.idAnnonce)}
                    className="ga-btn-delete"
                  >
                    <i className="fas fa-trash"></i> Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default GestionAnnonces;