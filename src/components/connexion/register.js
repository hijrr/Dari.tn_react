import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prénom: "",
    email: "",
    motDePasse: "",
    telephone: "",
    role: "client",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🧠 Gestion des changements d'input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validation côté front avant envoi
  const validateForm = () => {
    const { nom, prénom, email, motDePasse, telephone } = formData;

    if (!nom || !prénom || !email || !motDePasse || !telephone) {
      Swal.fire("Erreur", "Tous les champs sont obligatoires !", "error");
      return false;
    }

    const nameRegex = /^[A-Za-zÀ-ÿ]+$/;
    if (!nameRegex.test(nom) || !nameRegex.test(prénom)) {
      Swal.fire(
        "Erreur",
        "Le nom et le prénom doivent contenir uniquement des lettres.",
        "error"
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire("Erreur", "Veuillez entrer une adresse email valide.", "error");
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(motDePasse)) {
      Swal.fire(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères, une majuscule et un chiffre.",
        "error"
      );
      return false;
    }

    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(telephone)) {
      Swal.fire(
        "Erreur",
        "Le numéro de téléphone doit contenir exactement 8 chiffres.",
        "error"
      );
      return false;
    }

    return true;
  };

  // 🚀 Envoi des données + redirection automatique
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", formData);

      if (response.status === 201) {
        const user = response.data.user || {
          nom: formData.nom,
          prénom: formData.prénom,
          email: formData.email,
          role: formData.role,
        };

        // ✅ Sauvegarde de l'utilisateur connecté
        localStorage.setItem("user", JSON.stringify(user));

        Swal.fire({
          icon: "success",
          title: "Inscription réussie ",
          text: "Bienvenue " + formData.prénom + " !",
          timer: 2000,
          showConfirmButton: false,
        });

        // ✅ Redirection selon le rôle
        setTimeout(() => {
          if (formData.role === "admin") navigate("/dashboard-admin");
          else if (formData.role === "agence") navigate("/dashboard-admin");
          else if (formData.role === "client") navigate("/dashboard-client");
          else if (formData.role === "proprietaire") navigate("/dashboard-admin");
          else navigate("/");
        }, 2000);
      } else {
        Swal.fire("Erreur", response.data.message || "Échec de l'inscription", "error");
      }
    } catch (error) {
      Swal.fire(
        "Erreur",
        error.response?.data?.message || "Erreur lors de l'inscription.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="password-requirements">
              <span>6 caractères minimum, au moins 1 majuscule et 1 chiffre</span>
            </div>
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
          </div>


         

          <button 
            type="submit" 
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Inscription...
              </>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Déjà un compte ? 
            <Link to="/" className="login-link">Connectez-vous ici</Link>
          </p>
          
            
        </div>
      </div>
    </div>
  );
}

export default Register;