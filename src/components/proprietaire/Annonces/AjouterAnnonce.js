import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./ajouterAn.css";

const validTypes = ["appartement", "maison", "studio", "bureau", "villa"];

function AjouterAnnonce() {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    image: "",
    localisation: "",
    type: "",
    duree: ""
  });

  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.userId) setUserId(storedUser.userId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validation en temps réel
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "titre":
        if (!value.trim()) {
          newErrors.titre = "Le titre est obligatoire";
        } else if (value.length < 3) {
          newErrors.titre = "Le titre doit contenir au moins 3 caractères";
        } else if (value.length > 100) {
          newErrors.titre = "Le titre ne doit pas dépasser 100 caractères";
        } else {
          delete newErrors.titre;
        }
        break;

      case "description":
        if (!value.trim()) {
          newErrors.description = "La description est obligatoire";
        } else if (value.length < 10) {
          newErrors.description = "La description doit contenir au moins 10 caractères";
        } else if (value.length > 1000) {
          newErrors.description = "La description ne doit pas dépasser 1000 caractères";
        } else {
          delete newErrors.description;
        }
        break;

      case "prix":
        if (!value) {
          newErrors.prix = "Le prix est obligatoire";
        } else if (isNaN(value) || value <= 0) {
          newErrors.prix = "Le prix doit être un nombre positif";
        } else if (value > 1000000) {
          newErrors.prix = "Le prix ne doit pas dépasser 1 000 000";
        } else {
          delete newErrors.prix;
        }
        break;

      case "image":
        if (value && !isValidUrl(value)) {
          newErrors.image = "Le lien de l'image n'est pas valide";
        } else {
          delete newErrors.image;
        }
        break;

      case "localisation":
        if (!value.trim()) {
          newErrors.localisation = "La localisation est obligatoire";
        } else if (value.length < 3) {
          newErrors.localisation = "La localisation doit contenir au moins 3 caractères";
        } else {
          delete newErrors.localisation;
        }
        break;

      case "type":
        if (!value) {
          newErrors.type = "Le type est obligatoire";
        } else if (!validTypes.includes(value.toLowerCase())) {
          newErrors.type = `Le type doit être parmi: ${validTypes.join(", ")}`;
        } else {
          delete newErrors.type;
        }
        break;

      case "duree":
        if (!value.trim()) {
          newErrors.duree = "La durée est obligatoire";
        } else {
          delete newErrors.duree;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateForm = () => {
    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Veuillez vous connecter pour ajouter une annonce',
        confirmButtonColor: '#000'
      });
      return false;
    }

    const fieldNames = ["titre", "description", "prix", "image", "localisation", "type", "duree"];
    let isValid = true;

    fieldNames.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:5000/api/annonces", { ...formData, userId });
      
      await Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Annonce ajoutée avec succès!',
        confirmButtonColor: '#000',
        timer: 3000
      });

      setFormData({
        titre: "", description: "", prix: "", image: "",
        localisation: "", type: "", duree: ""
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Erreur lors de l'ajout de l'annonce",
        confirmButtonColor: '#000'
      });
    }
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  return (
    <div className="annonce-container">
      <div className="annonce-card">
        <h2 className="annonce-title">
          <span className="icon">🏠</span> Ajouter une Annonce
        </h2>
        <form onSubmit={handleSubmit} className="annonce-form">
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon">📝</span>
              <input 
                name="titre" 
                placeholder="Titre de l'annonce" 
                value={formData.titre} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.titre ? 'error' : ''}`}
              />
            </div>
            {errors.titre && <span className="error-message">{errors.titre}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon textarea-icon">📄</span>
              <textarea 
                name="description" 
                placeholder="Description détaillée" 
                value={formData.description} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
              />
            </div>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">💰</span>
                <input 
                  name="prix" 
                  placeholder="Prix (€)" 
                  type="number" 
                  value={formData.prix} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.prix ? 'error' : ''}`}
                />
              </div>
              {errors.prix && <span className="error-message">{errors.prix}</span>}
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">⏱️</span>
                <input 
                  name="duree" 
                  placeholder="Durée" 
                  value={formData.duree} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.duree ? 'error' : ''}`}
                />
              </div>
              {errors.duree && <span className="error-message">{errors.duree}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon">🖼️</span>
              <input 
                name="image" 
                placeholder="Lien de l'image (URL)" 
                value={formData.image} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.image ? 'error' : ''}`}
              />
            </div>
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">📍</span>
                <input 
                  name="localisation" 
                  placeholder="Localisation" 
                  value={formData.localisation} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.localisation ? 'error' : ''}`}
                />
              </div>
              {errors.localisation && <span className="error-message">{errors.localisation}</span>}
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">🏷️</span>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-select ${errors.type ? 'error' : ''}`}
                >
                  <option value="">Type de bien</option>
                  {validTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.type && <span className="error-message">{errors.type}</span>}
            </div>
          </div>
          
          <button type="submit" className="submit-button">
            <span className="button-icon">➕</span> Publier l'annonce
          </button>
        </form>
      </div>
    </div>
  );
}

export default AjouterAnnonce;