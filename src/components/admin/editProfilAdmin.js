import React, { useState, useRef,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditProfileAdmin = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
  });

  // --- Charger les infos utilisateur depuis la base ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // On récupère l’utilisateur connecté du localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.userId) {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Utilisateur non connecté !",
            confirmButtonText: "OK"
          }).then(() => {
            navigate("/login");
          });
          return;
        }
        const resUser = await axios.get(
        `http://localhost:5000/api/utilisateur/connecte/${storedUser.userId}`
      );
      setUser(resUser.data);
        const res = await axios.get(
          `http://localhost:5000/api/utilisateur/connecte/${storedUser.userId}`
        );
        setUser(res.data);

        // Pré-remplir le formulaire avec les infos existantes
        setFormData({
          nom: res.data.nom || "",
          prénom: res.data.prénom || "",
          email: res.data.email || "",
          motDePasse: res.data.motDePasse || "",
          telephone: res.data.telephone || "",
        });
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de charger les données du profil !",
          confirmButtonText: "OK"
        });
      }
    };

    fetchUser();
  }, [navigate]);

  // --- Gérer les changements dans les champs ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Sauvegarder les modifications ---
  const handleSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.userId) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Utilisateur non connecté !",
          confirmButtonText: "OK"
        }).then(() => {
          window.location.href = "/login"; // redirige vers login
        });
        return;
      }

      await axios.put(
        `http://localhost:5000/api/user/${storedUser.userId}`,
        formData
      );

      Swal.fire({
        icon: "success",              // type de l'alerte
        title: "Succès",               // titre
        text: "Profil mis à jour avec succès !", // texte
        confirmButtonText: "OK"        // texte du bouton
      });
      navigate("/dashboard-admin");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      Swal.fire({
        icon: "error",                // type de l'alerte
        title: "Erreur",               // titre
        text: "Erreur lors de la mise à jour du profil !", // texte
        confirmButtonText: "OK"        // texte du bouton
      });
    }
  };
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
    formData.append("userId", user.userId);

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
  const handleCancel = () => {
    navigate("/dashboard-admin");
  };

  if (!user) return <p>Chargement du profil...</p>;

  // --- Afficher image ---
  const imageUrl = user.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : `http://localhost:5000${user.profileImage}`
    : "/uploads/default-avatar.png";

    const displayUrl = user.profileImage?.startsWith("http")
    ? user.profileImage
    : user.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : "/images/default-avatar.png";

  return (
    <div className="edit-profile-page">


      <div className="edit-profile-container">
        <div className="edit-profile-content">
          {/* --- En-tête --- */}
          <div className="edit-profile-header">
            <button className="back-btn" onClick={handleCancel}>
              ← Retour
            </button>
            <h1 className="edit-profile-title">MODIFIER LE PROFIL</h1>
          </div>

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

          {/* --- Formulaire --- */}
          <div className="edit-form-section">
            <form className="edit-form">
              <div className="form-group">
                <label htmlFor="nom" className="form-label">
                  Nom
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Entrez votre nom complet"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Prénom
                </label>
                <input
                  type="text"
                  id="prénom"
                  name="prénom"
                  value={formData.prénom}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Entrez votre adresse email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Adresse Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Entrez votre adresse email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  mot de passe
                </label>
                <input
                  type="password"
                  id="motDePasse"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Entrez votre adresse email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="telephone" className="form-label">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Entrez votre numéro de téléphone"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Annuler
                </button>
                <button type="button" className="save-btn" onClick={handleSave}>
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfileAdmin;
