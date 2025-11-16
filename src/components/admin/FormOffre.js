import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function FormOffre() {
  const navigate = useNavigate();
  const { idOff } = useParams();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // États du formulaire
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    date_fin: "",
    dureeOffre: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const mode = idOff ? "modifier" : "ajouter";

  // Charger l'offre si on est en modification
  useEffect(() => {
    if (idOff) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/offres/${idOff}`)
        .then(res => {
          const off = res.data;
          setFormData({
            titre: off.titre || "",
            description: off.description || "",
            prix: off.prix || "",
            date_fin: off.date_fin?.split("T")[0] || "",
            dureeOffre: off.dureeOffre || ""
          });
        })
        .catch(err => {
          console.error(err);
          setErrors({ submit: "Erreur lors du chargement de l'offre" });
        })
        .finally(() => setLoading(false));
    }
  }, [idOff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est obligatoire";
    } else if (formData.titre.length < 3) {
      newErrors.titre = "Le titre doit contenir au moins 3 caractères";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est obligatoire";
    } else if (formData.description.length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères";
    }

    if (!formData.prix || parseFloat(formData.prix) <= 0) {
      newErrors.prix = "Le prix doit être supérieur à 0";
    }

    if (!formData.dureeOffre || parseInt(formData.dureeOffre) <= 0) {
      newErrors.dureeOffre = "La durée doit être supérieure à 0";
    }

    if (!formData.date_fin) {
      newErrors.date_fin = "La date de fin est obligatoire";
    } else {
      const selectedDate = new Date(formData.date_fin);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.date_fin = "La date de fin doit être dans le futur";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      if (mode === "modifier") {
        await axios.put(`http://localhost:5000/api/offresModff/${idOff}`, formData);
      } else {
        await axios.post(`http://localhost:5000/api/offres/${user.userId}`, formData);
      }
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur:", err);
      setErrors({ 
        submit: err.response?.data?.message || "Erreur lors de l'opération." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const calculateEndDate = (duration) => {
    if (duration && !isNaN(duration)) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + parseInt(duration));
      return endDate.toISOString().split('T')[0];
    }
    return '';
  };

  const handleDurationChange = (e) => {
    const duration = e.target.value;
    setFormData(prev => ({
      ...prev,
      dureeOffre: duration,
      date_fin: calculateEndDate(duration)
    }));
  };

  if (loading && mode === "modifier") {
    return (
      <div className="form-offre-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Styles CSS intégrés */}
      <style>
        {`
          .form-offre-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .form-offre-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 100%;
            max-width: 700px;
            margin: 20px 0;
          }

          .offre-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f5f9;
          }

          .header-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, ${mode === "modifier" ? "#F59E0B" : "#3B82F6"} 0%, ${mode === "modifier" ? "#D97706" : "#1D4ED8"} 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
          }

          .header-content h1 {
            margin: 0;
            color: #1f2937;
            font-size: 1.8rem;
            font-weight: 700;
          }

          .header-content p {
            margin: 5px 0 0 0;
            color: #6b7280;
            font-size: 1rem;
          }

          .offre-form {
            display: flex;
            flex-direction: column;
            gap: 25px;
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-group.full-width {
            grid-column: 1 / -1;
          }

          .form-label {
            font-weight: 600;
            color: #374151;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .form-input, .form-select, .form-textarea {
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: white;
          }

          .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: #3B82F6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .form-input.error, .form-select.error, .form-textarea.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          }

          .form-textarea {
            resize: vertical;
            min-height: 120px;
            font-family: inherit;
          }

          .price-input-container {
            position: relative;
          }

          .currency-symbol {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #6b7280;
            font-weight: 600;
          }

          .error-text {
            color: #ef4444;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 5px;
            font-weight: 500;
          }

          .submit-error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
          }

          .char-count {
            font-size: 0.8rem;
            color: #9ca3af;
            text-align: right;
            margin-top: 4px;
          }

          .form-actions {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }

          .btn-primary, .btn-secondary {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 140px;
            justify-content: center;
          }

          .btn-primary {
            background: linear-gradient(135deg, ${mode === "modifier" ? "#F59E0B" : "#3B82F6"} 0%, ${mode === "modifier" ? "#D97706" : "#1D4ED8"} 100%);
            color: white;
            box-shadow: 0 2px 4px rgba(${mode === "modifier" ? "245, 158, 11" : "59, 130, 246"}, 0.3);
          }

          .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(${mode === "modifier" ? "245, 158, 11" : "59, 130, 246"}, 0.4);
          }

          .btn-primary:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .btn-secondary {
            background: #6b7280;
            color: white;
          }

          .btn-secondary:hover:not(:disabled) {
            background: #4b5563;
            transform: translateY(-1px);
          }

          .btn-secondary:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .loading-spinner-small {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            color: #6b7280;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #3B82F6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .form-offre-container {
              padding: 10px;
            }
            
            .form-offre-card {
              padding: 20px;
              margin: 10px 0;
            }
            
            .offre-header {
              flex-direction: column;
              text-align: center;
              gap: 15px;
            }
            
            .form-grid {
              grid-template-columns: 1fr;
            }
            
            .form-actions {
              flex-direction: column;
            }
            
            .btn-primary, .btn-secondary {
              min-width: auto;
              width: 100%;
            }
          }

          @media (max-width: 480px) {
            .header-content h1 {
              font-size: 1.5rem;
            }
            
            .form-input, .form-select, .form-textarea {
              padding: 10px 12px;
            }
          }
        `}
      </style>

      {/* Contenu du composant */}
      <div className="form-offre-container">
        <div className="form-offre-card">
          <div className="offre-header">
            <div className="header-icon">
              <i className={`fas ${mode === "modifier" ? "fa-edit" : "fa-plus"}`}></i>
            </div>
            <div className="header-content">
              <h1>{mode === "modifier" ? "Modifier l'offre" : "Ajouter une nouvelle offre"}</h1>
              <p>
                {mode === "modifier" 
                  ? "Modifiez les informations de l'offre existante" 
                  : "Remplissez les informations de votre nouvelle offre"
                }
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="offre-form">
            {errors.submit && (
              <div className="submit-error">
                <i className="fas fa-exclamation-circle"></i>
                {errors.submit}
              </div>
            )}

            <div className="form-grid">
              {/* Titre */}
              <div className="form-group">
                <label htmlFor="titre" className="form-label">
                  <i className="fas fa-heading"></i>
                  Titre de l'offre *
                </label>
                <input
                  id="titre"
                  name="titre"
                  type="text"
                  value={formData.titre}
                  onChange={handleChange}
                  className={`form-input ${errors.titre ? 'error' : ''}`}
                  placeholder="Ex: Offre Premium 3 mois"
                  maxLength="100"
                />
                {errors.titre && (
                  <span className="error-text">
                    <i className="fas fa-exclamation-triangle"></i>
                    {errors.titre}
                  </span>
                )}
                <div className="char-count">
                  {formData.titre.length}/100 caractères
                </div>
              </div>

              {/* Prix */}
              <div className="form-group">
                <label htmlFor="prix" className="form-label">
                  <i className="fas fa-dollar-sign"></i>
                  Prix (TND) *
                </label>
                <div className="price-input-container">
                  <input
                    id="prix"
                    name="prix"
                    type="number"
                    value={formData.prix}
                    onChange={handleChange}
                    className={`form-input ${errors.prix ? 'error' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <span className="currency-symbol">TND</span>
                </div>
                {errors.prix && (
                  <span className="error-text">
                    <i className="fas fa-exclamation-triangle"></i>
                    {errors.prix}
                  </span>
                )}
              </div>

              {/* Durée */}
              <div className="form-group">
                <label htmlFor="dureeOffre" className="form-label">
                  <i className="fas fa-clock"></i>
                  Durée (mois) *
                </label>
                <select
                  id="dureeOffre"
                  name="dureeOffre"
                  value={formData.dureeOffre}
                  onChange={handleDurationChange}
                  className={`form-select ${errors.dureeOffre ? 'error' : ''}`}
                >
                  <option value="">Sélectionnez la durée</option>
                  <option value="1">1 mois</option>
                  <option value="3">3 mois</option>
                  <option value="6">6 mois</option>
                  <option value="12">12 mois</option>
                  <option value="24">24 mois</option>
                </select>
                {errors.dureeOffre && (
                  <span className="error-text">
                    <i className="fas fa-exclamation-triangle"></i>
                    {errors.dureeOffre}
                  </span>
                )}
              </div>

              {/* Date de fin */}
              <div className="form-group">
                <label htmlFor="date_fin" className="form-label">
                  <i className="fas fa-calendar-alt"></i>
                  Date de fin *
                </label>
                <input
                  id="date_fin"
                  name="date_fin"
                  type="date"
                  value={formData.date_fin}
                  onChange={handleChange}
                  className={`form-input ${errors.date_fin ? 'error' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date_fin && (
                  <span className="error-text">
                    <i className="fas fa-exclamation-triangle"></i>
                    {errors.date_fin}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">
                <i className="fas fa-align-left"></i>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Décrivez les avantages et caractéristiques de cette offre..."
                rows="5"
                maxLength="500"
              />
              {errors.description && (
                <span className="error-text">
                  <i className="fas fa-exclamation-triangle"></i>
                  {errors.description}
                </span>
              )}
              <div className="char-count">
                {formData.description.length}/500 caractères
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                disabled={loading}
              >
                <i className="fas fa-times"></i>
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    {mode === "modifier" ? "Modification..." : "Ajout en cours..."}
                  </>
                ) : (
                  <>
                    <i className={`fas ${mode === "modifier" ? "fa-edit" : "fa-plus"}`}></i>
                    {mode === "modifier" ? "Modifier l'offre" : "Ajouter l'offre"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default FormOffre;