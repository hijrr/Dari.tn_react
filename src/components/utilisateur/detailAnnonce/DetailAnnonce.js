import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./detailAnnonce.css";
import Header from "../../Header";

const DetailAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

    // --- Charger l'utilisateur connecté ---
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.userId) return;
    setUser(storedUser);
  }, []);
  

useEffect(() => {
  if (!user) return;

  const fetchAnnonce = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`http://localhost:5000/api/Annonces/${id}`);
      setAnnonce(res.data);

      // Vérifier favoris
      const favRes = await axios.get(`http://localhost:5000/api/favoris/check`, {
        params: { idAnnonce: res.data.idAnnonce, userId: user.userId }
      });
      if (favRes.data.idFav) {
        setIsFavorite(true);
        setFavoriteId(favRes.data.idFav);
      }
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setError("Impossible de charger l'annonce. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  fetchAnnonce();
}, [id, user]);


 // --- Ajouter aux favoris ---
  const addToFavorites = () => {
    if (!user || !user.userId || !annonce) return;
console.log("Favori à ajouter :", annonce.idAnnonce, user.userId);

    axios.post("http://localhost:5000/api/favoris", {
      idAnnonce: annonce.idAnnonce,
      userId: user.userId,
      
    })
    
    .then(res => {
      setFavoriteId(res.data.idFav);
      setIsFavorite(true);
      alert("✅ Annonce ajoutée aux favoris !");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Erreur lors de l'ajout aux favoris");
    });
  };

  // --- Retirer des favoris ---
  const removeFromFavorites = () => {
    if (!favoriteId) return;

    axios.delete(`http://localhost:5000/api/favoris/${favoriteId}`)
      .then(() => {
        setFavoriteId(null);
        setIsFavorite(false);
        alert("🗑️ Annonce retirée des favoris");
      })
      .catch(err => {
        console.error(err);
        alert("❌ Erreur lors de la suppression des favoris");
      });
  };


  const sendRequest = () => {
    setShowContactModal(true);
  };

  const confirmSendRequest = () => {
    axios.post("http://localhost:5000/envoyerDemande", { idAnnonce: annonce.idAnnonce })
      .then(() => {
        alert("✅ Demande envoyée avec succès !");
        setShowContactModal(false);
      })
      .catch(err => {
        console.error(err);
        alert("❌ Erreur lors de l'envoi de la demande");
      });
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  const getMapUrl = (location) => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de l'annonce...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>{error}</h2>
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div>
        <Header />
        <div className="not-found-container">
          <h2>Annonce introuvable</h2>
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Retour aux annonces
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = annonce.image?.startsWith("http") 
    ? annonce.image 
    : `http://localhost:5000${annonce.image || "/uploads/default.jpg"}`;

  const profileImageUrl = annonce.profileImage?.startsWith("http")
    ? annonce.profileImage
    : `http://localhost:5000${annonce.profileImage || "/images/default-avatar.png"}`;

  return (
    <div>
      <Header />
      <div className="detail-page">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-arrow">←</span>
            Retour
          </button>
          <div className="header-actions">
            <button 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={isFavorite ? removeFromFavorites : addToFavorites}
            >
              {isFavorite ? '❤️' : '🤍'}
              {isFavorite ? ' Retirer des favoris' : ' Ajouter aux favoris'}
            </button>
          </div>
        </div>

        <div className="detail-container">
          <div className="image-section">
            <img 
              src={imageUrl} 
              alt={annonce.titre} 
              className="detail-img"
              onError={(e) => {
                e.target.src = "/images/default-property.jpg";
              }}
            />
            <div className="image-badge">{annonce.type}</div>
          </div>

          <div className="content-section">
            <div className="title-section">
              <h1>{annonce.titre}</h1>
              <div className="price-tag">{formatPrice(annonce.prix)}</div>
            </div>

            <div className="meta-info">
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <span>{annonce.localisation}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span>Publié le {formatDate(annonce.dateCreation)}</span>
              </div>
              {annonce.duree && (
                <div className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  <span>Durée: {annonce.duree}</span>
                </div>
              )}
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p>{annonce.description}</p>
            </div>

            <div className="owner-section">
              <h3>Propriétaire ou Agence</h3>
              <div className="owner-info">
                <div className="owner-avatar">
                  <img
                    src={profileImageUrl}
                    alt={`${annonce.nom} ${annonce.prénom}`}
                    onError={(e) => {
                      e.target.src = "/images/default-avatar.png";
                    }}
                  />
                </div>
                <div className="owner-details">
                  <h4>{annonce.nom} {annonce.prénom}</h4>
                  <div className="contact-info">
                    <span className="phone">📞 {annonce.telephone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={sendRequest}>
                📩 Envoyer une demande
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowMapModal(true)}
              >
                🗺️ Voir sur la carte
              </button>
          
            </div>
          </div>
        </div>

        {/* Modal de contact */}
        {showContactModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Confirmer l'envoi</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowContactModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>Voulez-vous envoyer une demande de contact pour cette annonce ?</p>
                <div className="annonce-preview">
                  <strong>{annonce.titre}</strong>
                  <span>{formatPrice(annonce.prix)}</span>
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  className="btn btn-cancel"
                  onClick={() => setShowContactModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className="btn btn-confirm"
                  onClick={confirmSendRequest}
                >
                  Confirmer l'envoi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de la carte */}
        {showMapModal && (
          <div className="modal-overlay">
            <div className="modal map-modal">
              <div className="modal-header">
                <h3>Localisation - {annonce.localisation}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowMapModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <iframe
                  title="Carte de localisation"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={getMapUrl(annonce.localisation)}
                >
                </iframe>
                <div className="map-address">
                  <strong>Adresse:</strong> {annonce.localisation}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailAnnonce;