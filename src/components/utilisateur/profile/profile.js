import React, { useState, useRef, useEffect } from "react";
import "./profile.css";
import Header from "../../Header";
import axios from "axios";
import { Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null); // sera chargé depuis la base
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // --- États pour favoris (locaux pour la démo) ---
  const [favoris, setFavoris] = useState([
    {
      id: 1,
      type: "Maison S+3",
      prix: "5000t",
      duree: "pour nuit",
      ville: "Sousse-Sahloui",
      tel: "27345675",
      image: "/images/maison1.jpg",
    },
    {
      id: 2,
      type: "Maison S+2",
      prix: "5000t",
      duree: "pour 5 nuits",
      ville: "Sousse-Nrzema",
      tel: "50400123",
      image: "/images/maison2.jpg",
    },
  ]);

  // --- Charger les infos utilisateur ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.userId) {
          alert("Utilisateur non connecté !");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/utilisateur/connecte/${storedUser.userId}`
        );
        console.log(res);
        setUser(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement de l'utilisateur :", err);
        alert("Impossible de charger les données du profil !");
      }
    };

    fetchUser();
  }, []);

  // --- Ouvrir le sélecteur de fichiers ---
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // --- Gérer le changement d'image ---
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide !");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo !");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, profileImage: localUrl }));
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("userId", user.userId); // ✅ on utilise userId (pas id)

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload/profile-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const savedImageUrl = `http://localhost:5000${res.data.imageUrl}`;
      setUser((prev) => ({ ...prev, profileImage: savedImageUrl }));

      // mettre à jour le localStorage
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.profileImage = savedImageUrl;
      localStorage.setItem("user", JSON.stringify(stored));

      alert("Photo de profil mise à jour !");
    } catch (err) {
      console.error("Erreur upload :", err);
      alert("Erreur lors du téléchargement de l'image !");
    } finally {
      URL.revokeObjectURL(localUrl);
    }
  };

  // --- Supprimer un favori ---
  const handleRemoveFavori = (favoriId) => {
    setFavoris((prev) => prev.filter((favori) => favori.id !== favoriId));
  };

  if (!user) return <p>Chargement du profil...</p>;

  // --- URL finale de la photo ---
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
          {/* --- Section Profil --- */}
          <div className="profile-section">
            <h1 className="profile-title">MON PROFIL</h1>

            <div className="profile-image-section">
              <div className="profile-image-container" onClick={handleImageClick}>
                <img
                  src={displayUrl}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => {
                    e.target.src = "/images/default-avatar.png";
                  }}
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
                <span className="info-value">{user.dateInscri}</span>
              </div>
            </div>
          </div>

          {/* --- Section Favoris --- */}
          <div className="favoris-section">
            <h2 className="section-title">Mes Favoris ({favoris.length})</h2>
            <div className="favoris-grid">
              {favoris.map((favori) => (
                <div key={favori.id} className="favori-card">
                  <div className="favori-image">
                    <img
                      src={favori.image}
                      alt={favori.type}
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
                      <div className="favori-prix">
                        {favori.prix} {favori.duree}
                      </div>
                    </div>

                    <div className="favori-details">
                      <div className="favori-ville">
                        <span className="detail-label">Ville :</span>
                        <span className="detail-value">{favori.ville}</span>
                      </div>
                      <div className="favori-tel">
                        <span className="detail-label">Tél :</span>
                        <span className="detail-value">{favori.tel}</span>
                      </div>
                    </div>

                    <div className="favori-actions">
                      <button className="action-btn contact-btn">
                        Contacter
                      </button>
                      <button
                        className="action-btn remove-btn"
                        onClick={() => handleRemoveFavori(favori.id)}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Section Actions --- */}
          <div className="actions-section">
            <div className="action-buttons">
              <Link to="/editprofile">
              <button className="action-btn primary-btn">
                ✏️ Modifier Profil
              </button></Link>
              <button className="action-btn secondary-btn">
                🔔 Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
