import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import "./ajouterAn.css";

const validTypes = ["appartement", "maison", "studio", "bureau", "villa"];

function ModifierAnnonce() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [originalImage, setOriginalImage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.userId) {
      setUserId(storedUser.userId);
      fetchAnnonce();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Veuillez vous connecter pour modifier une annonce',
        confirmButtonColor: '#000'
      }).then(() => navigate('/login'));
    }
  }, [id]);

  // Récupérer les données de l'annonce
  const fetchAnnonce = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/annonces/${id}`);
      const annonce = response.data;
      
      console.log('Annonce récupérée:', annonce);
      
      setFormData({
        titre: annonce.titre || "",
        description: annonce.description || "",
        prix: annonce.prix || "",
        image: annonce.image || "",
        localisation: annonce.localisation || "",
        type: annonce.type || "",
        duree: annonce.duree || ""
      });

      if (annonce.image) {
        // Corriger l'URL de l'image si nécessaire
        const imageUrl = corrigerUrlImage(annonce.image);
        setPreviewImage(imageUrl);
        setOriginalImage(imageUrl);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Erreur récupération annonce:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger l\'annonce',
        confirmButtonColor: '#000'
      }).then(() => navigate('/mes-annonces'));
    }
  };

  // Fonction pour corriger les URLs d'images
  const corrigerUrlImage = (urlImage) => {
    if (!urlImage) return null;
    
    if (urlImage.startsWith('http')) {
      return urlImage;
    }
    
    if (urlImage.startsWith('/uploadsAnnonce')) {
      return `http://localhost:5000${urlImage}`;
    }
    
    if (urlImage.startsWith('uploadsAnnonce')) {
      return `http://localhost:5000/${urlImage}`;
    }
    
    if (!urlImage.includes('/')) {
      return `http://localhost:5000/uploadsAnnonce/${urlImage}`;
    }
    
    return urlImage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Gestion de l'upload de fichier
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Format invalide',
        text: 'Veuillez sélectionner une image (JPEG, PNG, etc.)',
        confirmButtonColor: '#000'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Fichier trop lourd',
        text: 'L\'image ne doit pas dépasser 5MB',
        confirmButtonColor: '#000'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('annonceImage', file);

      const response = await axios.post(
        'http://localhost:5000/api/upload/annonce-image', 
        uploadFormData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        }
      );

      setFormData(prev => ({
        ...prev,
        image: response.data.imageUrl
      }));

      Swal.fire({
        icon: 'success',
        title: 'Image uploadée!',
        text: 'L\'image a été uploadée avec succès',
        confirmButtonColor: '#000',
        timer: 2000
      });

    } catch (error) {
      console.error('Erreur upload détaillée:', error);
      let errorMessage = 'Erreur lors de l\'upload de l\'image';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage = 'Impossible de se connecter au serveur';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage,
        confirmButtonColor: '#000'
      });
      setPreviewImage(originalImage);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: "" }));
    setPreviewImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        if (!value) {
          newErrors.image = "L'image est obligatoire";
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

  const validateForm = () => {
    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Veuillez vous connecter pour modifier une annonce',
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
      console.log('Envoi des données de modification:', formData);
      
      const response = await axios.put(`http://localhost:5000/api/annonces/${id}`, { 
        ...formData, 
        userId 
      });
      
      console.log('Réponse modification annonce:', response.data);
      
      await Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Annonce modifiée avec succès!',
        confirmButtonColor: '#000',
        timer: 3000
      });

      navigate('/mes-annonces');
    } catch (err) {
      console.error('Erreur modification annonce:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.message || "Erreur lors de la modification de l'annonce",
        confirmButtonColor: '#000'
      });
    }
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Annuler les modifications?',
      text: 'Les changements non sauvegardés seront perdus',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Continuer l\'édition'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/dashboard-proprietaire');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="annonce-container">
        <div className="annonce-card">
          <div className="loading-text">Chargement de l'annonce...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="annonce-container">
      <div className="annonce-card">
        <h2 className="annonce-title">
          <span className="icon">✏️</span> Modifier l'Annonce
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
                  placeholder="Durée (ex: 1 an, 6 mois)" 
                  value={formData.duree} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.duree ? 'error' : ''}`}
                />
              </div>
              {errors.duree && <span className="error-message">{errors.duree}</span>}
            </div>
          </div>
          
          {/* Section Upload d'image */}
          <div className="form-group">
            <label className="upload-label">Image de l'annonce</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            {previewImage ? (
              <div className="image-preview-container">
                <img src={previewImage} alt="Preview" className="image-preview" />
                <button type="button" onClick={removeImage} className="remove-image-btn">
                  ✕ Supprimer
                </button>
               
              </div>
            ) : (
              <div 
                className={`upload-area ${errors.image ? 'error' : ''}`}
                onClick={triggerFileInput}
              >
                <div className="upload-content">
                  <span className="upload-icon">🖼️</span>
                  <div className="upload-text">
                    <p>Cliquez pour uploader une image</p>
                    <small>JPEG, PNG, GIF (max 5MB)</small>
                  </div>
                </div>
              </div>
            )}
            {isUploading && <div className="uploading-text">Upload en cours...</div>}
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
          
          <div className="form-buttons">
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-button"
            >
              <span className="button-icon">↶</span> Annuler
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isUploading}
            >
              <span className="button-icon">💾</span> 
              {isUploading ? 'Upload en cours...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifierAnnonce;