import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./AnnonceDetail.css";

const AnnonceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [nouveauStatut, setNouveauStatut] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/annonces/${id}`);
        setAnnonce(res.data);
        setNouveauStatut(res.data.statu);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de charger l'annonce.",
          timer: 3000
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnnonce();
  }, [id]);

  const handleAnnonceStatusChange = async () => {
    try {
      await axios.put(`http://localhost:5000/annonces/${id}`, { statu: nouveauStatut });
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Le statut a été mis à jour avec succès.",
        timer: 2000,
        showConfirmButton: false
      });
      navigate("/dashboard-admin");
    } catch (err) {
      console.error("Erreur modification statut :", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de mettre à jour le statut.",
        timer: 3000
      });
    }
  };

  const handleRetour = () => {
    navigate("/dashboard-admin");
  };

  if (loading) {
    return (
      <div className="annonce-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des détails de l'annonce...</p>
        </div>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="annonce-detail-container">
        <div className="loading-container">
          <i className="fas fa-exclamation-triangle" style={{fontSize: '3rem', color: '#ef4444', marginBottom: '1rem'}}></i>
          <p>Annonce non trouvée</p>
          <button className="btn btn-outline" onClick={handleRetour}>
            <i className="fas fa-arrow-left"></i>
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE": return "status-badge status-active";
      case "INACTIVE": return "status-badge status-inactive";
      case "ARCHIVE": return "status-badge status-archive";
      default: return "status-badge status-inactive";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE": return "Active";
      case "INACTIVE": return "Inactive";
      case "ARCHIVE": return "Archivée";
      default: return "Inconnu";
    }
  };

  return (
    <div className="annonce-detail-container">
      <div className="annonce-detail-card">
        {/* Header */}
        <div className="annonce-header">
          <h1 className="annonce-title">{annonce.titre}</h1>
          <div className="annonce-meta">
            <span className={getStatusBadgeClass(annonce.statu)}>
              {getStatusText(annonce.statu)}
            </span>
            <span>•</span>
            <span>ID: {annonce.idAnnonce || id}</span>
          </div>
        </div>

        {/* Image */}
        <div className="annonce-image-container">
          {annonce.image ? (
            <img 
              src={annonce.image} 
              alt={annonce.titre} 
              className="annonce-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="image-placeholder" style={{display: annonce.image ? 'none' : 'flex'}}>
            <div style={{textAlign: 'center'}}>
              <i className="fas fa-home"></i>
              <p>Image non disponible</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="annonce-details">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Prix</span>
              <span className="detail-value price">{annonce.prix} €</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Type</span>
              <span className="detail-value">{annonce.type || "Non spécifié"}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Localisation</span>
              <span className="detail-value">{annonce.localisation || "Non spécifiée"}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Catégorie</span>
              <span className="detail-value">{annonce.categorie || "Non spécifiée"}</span>
            </div>
          </div>

          {/* Description */}
          {annonce.description && (
            <div className="description-section">
              <div className="description-label">Description</div>
              <div className="description-text">
                {annonce.description}
              </div>
            </div>
          )}

          {/* Status Modification */}
          <div className="status-section">
            <div className="status-header">
              <i className="fas fa-cog"></i>
              <h3>Modifier le statut</h3>
            </div>
            <div className="status-form">
              <select 
                value={nouveauStatut} 
                onChange={(e) => setNouveauStatut(e.target.value)}
                className="status-select"
              >
                <option value="INACTIVE">Inactive</option>
                <option value="ACTIVE">Active</option>
              </select>
              <button 
                onClick={handleAnnonceStatusChange} 
                className="btn btn-primary"
              >
                <i className="fas fa-save"></i>
                Appliquer le statut
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions-section">
          <button onClick={handleAnnonceStatusChange} className="btn btn-primary">
            <i className="fas fa-save"></i>
            Modifier et retourner
          </button>
          <button onClick={handleRetour} className="btn btn-outline">
            <i className="fas fa-arrow-left"></i>
            Retour au dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnonceDetail;