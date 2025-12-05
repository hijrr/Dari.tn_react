// src/components/admin/GestionOffres.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./common/LoadingSpinner";
import "./DashboardAdmin.css";

const GestionOffres = ({ offre, onEdit, onDelete, onAdd, loading }) => {
    const [filters, setFilters] = useState({ search: "", minPrice: "", maxPrice: "" });
    const [filteredOffres, setFilteredOffres] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const filtered = offre.filter(offreItem => {
            const matchesSearch =
                filters.search === "" ||
                offreItem.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
                offreItem.description?.toLowerCase().includes(filters.search.toLowerCase());

            const matchesMinPrice =
                filters.minPrice === "" || (offreItem.prix && offreItem.prix >= parseFloat(filters.minPrice));

            const matchesMaxPrice =
                filters.maxPrice === "" || (offreItem.prix && offreItem.prix <= parseFloat(filters.maxPrice));

            return matchesSearch && matchesMinPrice && matchesMaxPrice;
        });

        setFilteredOffres(filtered);
    }, [offre, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => setFilters({ search: "", minPrice: "", maxPrice: "" });

    const hasActiveFilters = filters.search || filters.minPrice || filters.maxPrice;
    const displayedOffres = hasActiveFilters ? filteredOffres : offre;

    if (loading) return <LoadingSpinner message="Chargement des offres..." />;

    const isExpired = dateFin => new Date(dateFin) < new Date();
    const goToAjouter = () => {
        navigate("/dashboard/offres/ajouter");
    };
    // Définir la couleur selon le prix
    const getPriceClass = prix => {
        if (prix < 100) return "price-low";
        if (prix < 500) return "price-medium";
        return "price-high";
    };

    return (
        <div className="section-content">
            <div className="offres-header">
                <h2>Gestion des Offres</h2>
                <button onClick={goToAjouter} className="btn-primary">
                    <i className="fas fa-plus"></i>
                    Ajouter une Offre
                </button>
            </div>

            {/* Filtres */}
            <div className="filters-section">
                <div className="filters-header">
                    <h3><i className="fas fa-search"></i> Rechercher des offres</h3>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="btn-clear-filters">
                            <i className="fas fa-times"></i> Effacer les filtres
                        </button>
                    )}
                </div>

                <div className="filters-grid">
                    <input
                        type="text"
                        placeholder="Titre ou description..."
                        value={filters.search}
                        onChange={e => handleFilterChange("search", e.target.value)}
                        className="filter-input"
                    />
                    <input
                        type="number"
                        placeholder="Prix min"
                        value={filters.minPrice}
                        onChange={e => handleFilterChange("minPrice", e.target.value)}
                        className="filter-input"
                        min="0"
                    />
                    <input
                        type="number"
                        placeholder="Prix max"
                        value={filters.maxPrice}
                        onChange={e => handleFilterChange("maxPrice", e.target.value)}
                        className="filter-input"
                        min="0"
                    />
                </div>
            </div>

            {/* Offres */}
            <div className="offres-section">
                <div className="section-header">
                    <h3><i className="fas fa-tags"></i> Toutes les offres ({offre.length})</h3>
                    {hasActiveFilters && <span className="filtered-count">{filteredOffres.length} résultat(s)</span>}
                </div>

                {offre.length === 0 ? (
                    <div className="no-offres">
                        <div className="no-offres-icon"><i className="fas fa-tags"></i></div>
                        <h3>Aucune offre disponible</h3>
                        <button onClick={goToAjouter} className="btn-primary">
                            <i className="fas fa-plus"></i> Ajouter une offre
                        </button>
                        
                    </div>
                ) : (
                    <div className="offres-grid">
                        {displayedOffres.map(offreItem => (
                            <div key={offreItem.idOff} className="offre-card">
                                <div className="offre-header">
                                    <h3>{offreItem.titre}</h3>
                                    <span className={`offre-status ${isExpired(offreItem.date_fin) ? "expired" : "active"}`}>
                                        {isExpired(offreItem.date_fin) ? "Expirée" : "Active"}
                                    </span>
                                </div>

                                <div className="offre-description">
                                    <p>{offreItem.description}</p>
                                </div>

                                <div className="offre-details">
                                    <div className={`detail-item ${getPriceClass(offreItem.prix)}`}>
                                        <i className="fas fa-dollar-sign"></i> {offreItem.prix} TND
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-clock"></i> {offreItem.nb_annonces} annonces
                                    </div>
                                    <div className="detail-item">
                                        <i className="fas fa-calendar-alt"></i> Fin: {offreItem.date_fin?.split("T")[0]}
                                    </div>
                                </div>

                                <div className="offre-actions">
                                    <button onClick={() => onEdit(offreItem.idOff)} className="btn-edit">
                                        <i className="fas fa-edit"></i> Modifier
                                    </button>
                                    <button onClick={() => onDelete(offreItem.idOff)} className="btn-delete">
                                        <i className="fas fa-trash"></i> Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionOffres;
