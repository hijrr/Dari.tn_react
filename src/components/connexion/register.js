import React, { useState } from "react";
import axios from "axios";
import './Register.css';
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prénom: "",
    email: "",
    motDePasse: "",
    confirmMotDePasse: "",
    telephone: "",
    role: "client",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const { nom, prénom, email, motDePasse, confirmMotDePasse, telephone } = formData;
    const newErrors = {};

    if (!nom) newErrors.nom = "Nom obligatoire";
    if (!prénom) newErrors.prénom = "Prénom obligatoire";
    if (!email) newErrors.email = "Email obligatoire";
    if (!motDePasse) newErrors.motDePasse = "Mot de passe obligatoire";
    if (!confirmMotDePasse) newErrors.confirmMotDePasse = "Confirmation obligatoire";
    if (!telephone) newErrors.telephone = "Téléphone obligatoire";

    const nameRegex = /^[A-Za-zÀ-ÿ]+$/;
    if (nom && !nameRegex.test(nom)) newErrors.nom = "Le nom doit contenir uniquement des lettres";
    if (prénom && !nameRegex.test(prénom)) newErrors.prénom = "Le prénom doit contenir uniquement des lettres";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) newErrors.email = "Email invalide";

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (motDePasse && !passwordRegex.test(motDePasse)) newErrors.motDePasse = "6 caractères min, 1 majuscule et 1 chiffre";

    if (motDePasse && confirmMotDePasse && motDePasse !== confirmMotDePasse)
      newErrors.confirmMotDePasse = "Les mots de passe ne correspondent pas";

    const phoneRegex = /^[0-9]{8}$/;
    if (telephone && !phoneRegex.test(telephone)) newErrors.telephone = "Le numéro doit contenir exactement 8 chiffres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/register", formData);
      if (response.status === 201) {
        setIsRegistered(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="logo">
              <i className="fas fa-home"></i>
              <span>DariTN</span>
            </div>
            <h1>Inscription réussie !</h1>
            <p>
              Merci pour votre inscription, {formData.prénom}. <br />
              Vérifiez votre email pour activer votre compte avant de vous connecter.
            </p>
            <p>Redirection vers la page de connexion...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <i className="fas fa-home"></i>
            <span>DariTN</span>
          </div>
          <h1>Inscription</h1>
          <p>Créez votre compte en quelques secondes</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="input-group">
              <div className="input-container">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              {errors.nom && <span className="error">{errors.nom}</span>}
            </div>

            <div className="input-group">
              <div className="input-container">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  name="prénom"
                  placeholder="Prénom"
                  value={formData.prénom}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              {errors.prénom && <span className="error">{errors.prénom}</span>}
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="motDePasse"
                placeholder="Mot de passe"
                value={formData.motDePasse}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            {errors.motDePasse && <span className="error">{errors.motDePasse}</span>}
            <div className="password-requirements">
              <span>6 caractères minimum, au moins 1 majuscule et 1 chiffre</span>
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="confirmMotDePasse"
                placeholder="Confirmer le mot de passe"
                value={formData.confirmMotDePasse}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            {errors.confirmMotDePasse && <span className="error">{errors.confirmMotDePasse}</span>}
          </div>

          <div className="input-group">
            <div className="input-container">
              <i className="fas fa-phone input-icon"></i>
              <input
                type="text"
                name="telephone"
                placeholder="Numéro de téléphone"
                value={formData.telephone}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            {errors.telephone && <span className="error">{errors.telephone}</span>}
          </div>

          <button
            type="submit"
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Déjà un compte ?
            <a href="/login" className="login-link"> Connectez-vous ici</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
