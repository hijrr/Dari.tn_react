import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./detailAnnonce.css";
import Header from "../../Header";
import ShowMap from "./ShowMap";
import Footer from "../../footer"
import ChatBox from "../chatClient/ChatBox";

const DetailAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [etatDemande, setEtatDemande] = useState(null);
const [showChat, setShowChat] = useState(false);



//changer le button quand l'acceptation se fait
useEffect(() => {
  const fetchEtat = async () => {
    if (!user || !annonce) return;

    const res = await axios.get(
      `http://localhost:5000/api/demandes/etat?userId=${user.userId}&annonceId=${annonce.idAnnonce}`
    );
    setEtatDemande(res.data.etat);
  };

  fetchEtat();
}, [user, annonce]);

  // --- Charger l'utilisateur connecté ---
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.userId) return;
    setUser(storedUser);
  }, []);

  // --- Charger annonce et vérifier favoris ---
  useEffect(() => {
    if (!user) return;

    const fetchAnnonce = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`http://localhost:5000/api/Annonces/${id}`);
        setAnnonce(res.data);

        // Vérifier si déjà en favoris
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
  const addToFavorites = async () => {
    if (!user || !user.userId || !annonce) return;

    try {
      const res = await axios.post("http://localhost:5000/api/favoris", {
        idAnnonce: annonce.idAnnonce,
        userId: user.userId
      });
      setFavoriteId(res.data.idFav);
      setIsFavorite(true);
      Swal.fire("✅ Ajouté !", "Annonce ajoutée aux favoris.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Erreur", "Impossible d'ajouter aux favoris.", "error");
    }
  };

  // --- Retirer des favoris ---
  const removeFromFavorites = async () => {
    if (!favoriteId) return;

    try {
      await axios.delete(`http://localhost:5000/api/favoris/${favoriteId}`);
      setFavoriteId(null);
      setIsFavorite(false);
      Swal.fire("🗑️ Retiré", "Annonce retirée des favoris.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Erreur", "Impossible de retirer des favoris.", "error");
    }
  };

  const handleSendRequest = async () => {
  if (!user || !user.userId) {
    Swal.fire("Erreur", "Vous devez être connecté pour envoyer une demande.", "error");
    return;
  }

  const result = await Swal.fire({
    title: "Confirmer l'envoi",
    text: "Voulez-vous envoyer une demande de contact pour cette annonce ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Envoyer",
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    try {
      // Ajouter demande dans demandeloc
      const demandeRes = await axios.post("http://localhost:5000/api/demandeloc", {
        annonceId: annonce.idAnnonce,
        userId: user.userId,
        dateDem: new Date(),
        statut: "en attente"
      });

      // Ajouter notification pour le propriétaire
      await axios.post("http://localhost:5000/api/notifications", {
        titre: "Nouvelle demande de location",
        message: `Une nouvelle demande a été envoyée pour votre annonce "${annonce.titre}".`,
        typeNotification: "demande",
        userId: annonce.userId,
        messageId: demandeRes.data.idDem
      });

      Swal.fire("✅ Demande envoyée", "Votre demande a été transmise au propriétaire.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Impossible d'envoyer la demande.", "error");
    }
  }
};

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND" }).format(price);
  };

  if (loading)
    return (
      <div>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de l'annonce...</p>
        </div>
      </div>
    );

  if (error)
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

  if (!annonce)
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

  const imageUrl = annonce.image?.startsWith("http") ? annonce.image : `http://localhost:5000${annonce.image || "/uploads/default.jpg"}`;
  const profileImageUrl = annonce.profileImage?.startsWith("http") ? annonce.profileImage : `http://localhost:5000${annonce.profileImage || "/images/default-avatar.png"}`;

  return (
    <div>
      <Header />
      <div className="detail-page">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-arrow">←</span> Retour
          </button>
          <div className="header-actions">
            <button className={`favorite-btn ${isFavorite ? "active" : ""}`} onClick={isFavorite ? removeFromFavorites : addToFavorites}>
              {isFavorite ? "❤️ Retirer des favoris" : "🤍 Ajouter aux favoris"}
            </button>
          </div>
        </div>

        <div className="detail-container">
          <div className="image-section">
            <img src={imageUrl} alt={annonce.titre} className="detail-img" onError={(e) => (e.target.src = "/images/default-property.jpg")} />
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
                  <img src={profileImageUrl} alt={`${annonce.nom} ${annonce.prénom}`} onError={(e) => (e.target.src = "/images/default-avatar.png")} />
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
{etatDemande === "accepte" ? (
  <div >
  <button className="btn btn-success action-btn"onClick={() => setShowChat(!showChat)}>Contacter</button>
    {showChat && <ChatBox user={user} proprietaireId={annonce.userId} />}  </div>
) : (
              <button className="btn btn-primary" onClick={handleSendRequest}>📩 Envoyer une demande</button>)}
              <button
                style={{ padding: "10px 20px", borderRadius: "8px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", marginTop: "10px" }}
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? "Fermer la carte" : "Voir sur carte"}
              </button>
              {showMap && <div style={{ marginTop: "20px" }}><ShowMap localisation={annonce.localisation} /></div>}
            </div>
          </div>
        </div>

        
      </div>
       <Footer/>
    </div>
  );
};

export default DetailAnnonce;
