import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './profilprop.css';

const ProfilProp = () => {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.userId) {
          alert("Utilisateur non connecté !");
          return;
        }

        const resUser = await axios.get(
          `http://localhost:5000/api/utilisateur/connecte/${storedUser.userId}`
        );
        setUser(resUser.data);
      } catch (err) {
        console.error("Erreur chargement profil :", err);
        alert("Impossible de charger le profil !");
      }
    };

    fetchUser();
  }, []);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input reference is null");
    }
  };

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

    if (!user || !user.userId) {
      alert("Utilisateur non trouvé !");
      return;
    }

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

      alert("Photo de profil mise à jour !");
    } catch (err) {
      console.error("Erreur upload :", err);
      alert("Erreur lors du téléchargement de l'image !");
    } finally {
      URL.revokeObjectURL(localUrl);
    }
  };

  if (!user) return <p>Chargement du profil...</p>;

  const displayUrl = user.profileImage?.startsWith("http")
    ? user.profileImage
    : user.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : "/images/default-avatar.png";

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-content">
          
          {/* Section Image */}
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

          {/* Section Informations */}
          <div className="profile-info-section">
            <h1 className="profile-title">MON PROFIL</h1>

            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Nom Complet</span>
                <span className="info-value">{user.nom} {user.prénom}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Téléphone</span>
                <span className="info-value">{user.telephone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date d'inscription</span>
                <span className="info-value">{user.dateInscri}</span>
              </div>
            </div>

            <div className="actions-section">
              <div className="action-buttons">
                <Link to="/editprofileprop">
                  <button className="action-btn primary-btn">✏️ Modifier Profil</button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilProp;