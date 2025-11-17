import React, { useState, useRef, useEffect } from "react";
import "./profile.css";
import Header from "../../Header";
import Footer from "../../footer";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [favoris, setFavoris] = useState([]); 

  // --- Charger l'utilisateur ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.userId) {
          Swal.fire({
            icon: 'warning',
            title: 'Non connecté',
            text: 'Veuillez vous connecter pour accéder à votre profil !',
          });
          return;
        }

        const resUser = await axios.get(
          `http://localhost:5000/api/utilisateur/connecte/${storedUser.userId}`
        );
        setUser(resUser.data);
      } catch (err) {
        console.error("Erreur chargement profil :", err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Impossible de charger le profil !",
        });
      }
    };
    fetchUser();
  }, []);

  // --- Charger les favoris ---
  useEffect(() => {
    const fetchFavoris = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.userId) return;

        const resFavoris = await axios.get(
          `http://localhost:5000/api/favoris/${storedUser.userId}`
        );
        setFavoris(resFavoris.data);
      } catch (err) {
        console.error("Erreur chargement favoris :", err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Impossible de charger les favoris !",
        });
      }
    };
    fetchFavoris();
  }, []);

  // --- Ouvrir sélecteur fichiers ---
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // --- Changer image ---
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: 'error',
        title: 'Fichier invalide',
        text: "Veuillez sélectionner une image valide !",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Taille trop grande',
        text: "L'image ne doit pas dépasser 5 Mo !",
      });
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, profileImage: localUrl }));
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("userId", user.userId);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload/profile-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const savedImageUrl = `http://localhost:5000${res.data.imageUrl}`;
      setUser((prev) => ({ ...prev, profileImage: savedImageUrl }));

      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.profileImage = savedImageUrl;
      localStorage.setItem("user", JSON.stringify(stored));

      Swal.fire({
        icon: 'success',
        title: 'Image mise à jour',
        text: "Votre photo de profil a été mise à jour avec succès !",
      });
    } catch (err) {
      console.error("Erreur upload :", err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Erreur lors du téléchargement de l'image !",
      });
    } finally {
      URL.revokeObjectURL(localUrl);
    }
  };

  // --- Supprimer favori ---
  const handleRemoveFavori = async (idFav) => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Supprimer le favori',
        text: "Voulez-vous vraiment retirer ce favori ?",
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      });

      if (!result.isConfirmed) return;

      await axios.delete(`http://localhost:5000/api/favoris/${idFav}`);
      setFavoris((prev) => prev.filter((favori) => favori.idFav !== idFav));

      Swal.fire({
        icon: 'success',
        title: 'Favori retiré',
        text: 'Le favori a été supprimé avec succès !'
      });
    } catch (err) {
      console.error("Erreur suppression favori :", err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Impossible de retirer le favori !",
      });
    }
  };
  const handleCancel = () => {
    navigate("/");
  };

  if (!user) return <p>Chargement du profil...</p>;

  const displayUrl = user.profileImage?.startsWith("http")
    ? user.profileImage
    : user.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : "/images/default-avatar.png";

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-container">
        <div className="profile-content">
          {/* Section Profil */}
          <button className="back-btn" onClick={handleCancel}>
              ← Retour
            </button>
          <div className="profile-section">
            <h1 className="profile-title">MON PROFIL</h1>

            <div className="profile-image-section">
              <div className="profile-image-container" onClick={handleImageClick}>
                <img
                  src={displayUrl}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => { e.target.src = "/images/default-avatar.png"; }}
                />
                <div className="image-overlay">
                  <span className="camera-icon">📷</span>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              <p className="image-hint">
                Cliquez sur la photo pour changer votre image de profil
              </p>
            </div>

            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Nom Complet :</span>
                <span className="info-value">{user.nom} {user.prénom}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email :</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Téléphone :</span>
                <span className="info-value">{user.telephone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date d'inscription :</span>
                <span className="info-value">{new Date(user.dateInscri).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          </div>

          {/* Section Favoris */}
          <div className="favoris-section">
            <h2 className="section-title">Mes Favoris ({favoris.length})</h2>
            <div className="favoris-grid">
              {favoris.map((favori) => (
                <div key={favori.idAnnonce} className="favori-card">
                  <div className="favori-image">
                    <img
                      src={favori.image}
                      alt={favori.titre || favori.type}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="favori-image-placeholder">🏠</div>
                  </div>

                  <div className="favori-content">
                    <div className="favori-header">
                      <h3 className="favori-type">{favori.type}</h3>
                      <div className="favori-prix">{favori.prix}</div>
                    </div>

                    <div className="favori-details">
                      <div className="favori-ville">
                        <span className="detail-label">Ville :</span>
                        <span className="detail-value">{favori.localisation}</span>
                      </div>
                    
                    </div>

                    <div className="favori-actions">
                      
                      <button className="action-btn contact-btn" onClick={() => navigate(`/annonce/${favori.idAnnonce}`)}>Voir Détails</button>
                      <button
                        className="action-btn remove-btn"
                        onClick={() => handleRemoveFavori(favori.idFav)}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Actions */}
          <div className="actions-section">
            <div className="action-buttons">
              <Link to="/editprofile">
                <button className="action-btn primary-btn">✏️ Modifier Profil</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
       <Footer/>
    </div>
   
  );
};

export default Profile;
