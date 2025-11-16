import React, { useState, useEffect } from "react";
import "./editProfile.css";
import Header from "../../Header";
import Footer from "../../footer"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // sera chargé depuis la base
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
          alert("Utilisateur non connecté !");
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/utilisateur/connecte/${storedUser.userId}`
        );
        setUser(res.data);

        // Pré-remplir le formulaire avec les infos existantes
        setFormData({
          nom: res.data.nom || "",
          prénom: res.data.prénom || "",
          email: res.data.email || "",
         motDePasse: res.data.motDePasse|| "",
          telephone: res.data.telephone || "",
        });
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
        alert("Impossible de charger les données du profil !");
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

  // --- Sauvegarder les modifications avec contrôle de saisie ---
const handleSave = async () => {
  const { nom, prénom, email, motDePasse, telephone } = formData;

  // --- Vérifications ---
  if (!nom.trim() || !prénom.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Champs manquants',
      text: 'Le nom et le prénom sont obligatoires !',
    });
    return;
  }

  // Email valide
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: 'error',
      title: 'Email invalide',
      text: 'Veuillez saisir un email valide !',
    });
    return;
  }

  // Mot de passe min 8 caractères
  if (motDePasse && motDePasse.length < 8) {
    Swal.fire({
      icon: 'error',
      title: 'Mot de passe trop court',
      text: 'Le mot de passe doit contenir au moins 8 caractères !',
    });
    return;
  }

  // Téléphone : exactement 8 chiffres
  const telRegex = /^\d{8}$/;
  if (!telRegex.test(telephone)) {
    Swal.fire({
      icon: 'error',
      title: 'Téléphone invalide',
      text: 'Le numéro de téléphone doit contenir exactement 8 chiffres !',
    });
    return;
  }

  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Utilisateur non connecté',
        text: 'Vous devez être connecté pour modifier le profil.',
      });
      return;
    }

    await axios.put(
      `http://localhost:5000/api/user/${storedUser.userId}`,
      formData
    );

    Swal.fire({
      icon: 'success',
      title: 'Profil mis à jour',
      text: 'Vos informations ont été sauvegardées avec succès !',
    }).then(() => {
      navigate("/profile");
    });

  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la mise à jour du profil.',
    });
  }
};

  const handleCancel = () => {
    navigate("/profile");
  };

  if (!user) return <p>Chargement du profil...</p>;

  // --- Afficher image ---
  const imageUrl = user.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : `http://localhost:5000${user.profileImage}`
    : "/uploads/default-avatar.png";

  return (
    <div className="edit-profile-page">
      <Header />

      <div className="edit-profile-container">
        <div className="edit-profile-content">
          {/* --- En-tête --- */}
          <div className="edit-profile-header">
            <button className="back-btn" onClick={handleCancel}>
              ← Retour
            </button>
            <h1 className="edit-profile-title">MODIFIER LE PROFIL</h1>
          </div>

          {/* --- Image de profil --- */}
          <div className="profile-image-section">
            <div className="profile-image-display">
              <img
                src={imageUrl}
                alt="Profile"
                className="profile-image"
                onError={(e) => {
                  e.target.src = "/uploads/default-avatar.png";
                }}
              />
            </div>
            <p className="image-note">
              L'image de profil ne peut pas être modifiée ici
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
       <Footer/>
    </div>
  );
};

export default EditProfile;
