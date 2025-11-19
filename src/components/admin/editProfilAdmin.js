import React, { useState, useRef, useEffect } from "react";
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
    prénom: "",
    email: "",
    telephone: "",
    motDePasse: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // --- Modal mot de passe oublié ---
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [fpStep, setFpStep] = useState(1); // étape 1: email, 2: code + nouveau mot de passe
  const [fpEmail, setFpEmail] = useState("");
  const [fpCode, setFpCode] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------
  //   CHARGER UTILISATEUR
  // -------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.userId) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/utilisateur/connecte/${storedUser.userId}`
        );

        setUser(res.data);

        setFormData({
          nom: res.data.nom || "",
          prénom: res.data.prénom || "",
          email: res.data.email || "",
          telephone: res.data.telephone || "",
          motDePasse: res.data.motDePasse || "",
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de charger le profil",
        });
      }
    };

    fetchUser();
  }, [navigate]);

  // -------------------------
  //   VALIDATION PROFIL
  // -------------------------
  const validateProfile = () => {
    const { nom, prénom, telephone } = formData;
    const newErrors = {};

    if (!nom) newErrors.nom = "Nom obligatoire";
    if (!prénom) newErrors.prénom = "Prénom obligatoire";
    if (!telephone) newErrors.telephone = "Téléphone obligatoire";

    const nameRegex = /^[A-Za-zÀ-ÿ]+$/;
    if (nom && !nameRegex.test(nom)) newErrors.nom = "Nom invalide";
    if (prénom && !nameRegex.test(prénom)) newErrors.prénom = "Prénom invalide";

    const phoneRegex = /^[0-9]{8}$/;
    if (telephone && !phoneRegex.test(telephone))
      newErrors.telephone = "Téléphone invalide (8 chiffres)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------
  //   VALIDATION MOT DE PASSE
  // -------------------------
  const validatePassword = () => {
    const { oldPassword, newPassword, confirmNewPassword } = passwordData;
    const pErrors = {};

    if (!oldPassword) pErrors.oldPassword = "Ancien mot de passe obligatoire";

    if (!newPassword)
      pErrors.newPassword = "Nouveau mot de passe obligatoire";
    else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(newPassword))
        pErrors.newPassword = "Min 6 caractères, 1 majuscule, 1 chiffre";
    }

    if (newPassword !== confirmNewPassword)
      pErrors.confirmNewPassword = "Les mots de passe ne correspondent pas";

    setPasswordErrors(pErrors);
    return Object.keys(pErrors).length === 0;
  };

  // -------------------------
  //   SAVE PROFILE
  // -------------------------
  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      await axios.put(
        `http://localhost:5000/api/user/${storedUser.userId}`,
        formData
      );

      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Profil mis à jour",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur modification profil",
      });
    }
  };

  // -------------------------
  //   SAVE PASSWORD
  // -------------------------
  const handleSavePassword = async () => {
  // Validation des champs
  if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
    return Swal.fire("Erreur", "Tous les champs sont requis", "error");
  }

  if (passwordData.newPassword !== passwordData.confirmNewPassword) {
    return Swal.fire("Erreur", "Les mots de passe ne correspondent pas", "error");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(passwordData.newPassword)) {
    return Swal.fire(
      "Erreur",
      "Le mot de passe doit contenir au moins 6 caractères, 1 majuscule et 1 chiffre",
      "error"
    );
  }

  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // ✅ On n’envoie que le mot de passe pour la mise à jour partielle
    await axios.put(`http://localhost:5000/api/user/${storedUser.userId}`, {
      motDePasse: passwordData.newPassword
    });

    Swal.fire({
      icon: "success",
      title: "Succès",
      text: "Mot de passe mis à jour !",
    });

    // Réinitialiser les champs du formulaire
    setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
  } catch (err) {
    console.error("Erreur update mot de passe:", err);
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: err.response?.data?.message || "Impossible de mettre à jour le mot de passe",
    });
  }
};


  // -------------------------
  //   IMAGE UPLOAD
  // -------------------------
  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const formImage = new FormData();
    formImage.append("profileImage", file);
    formImage.append("userId", user.userId);

    const res = await axios.post(
      "http://localhost:5000/api/upload/profile-image",
      formImage,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const savedImageUrl = `http://localhost:5000${res.data.imageUrl}`;
    setUser((prev) => ({ ...prev, profileImage: savedImageUrl }));
  };

  const handleCancel = () => navigate("/dashboard-admin");

  // -------------------------
  // FORGOT PASSWORD FLOW
  // -------------------------
  const sendCode = async () => {
    if (!fpEmail) return Swal.fire("Erreur", "Email requis", "error");

    // ✅ Vérification si l'email correspond à l'utilisateur connecté
    if (fpEmail !== user.email) {
      return Swal.fire(
        "Erreur",
        "L'email ne correspond pas à votre compte connecté",
        "error"
      );
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/user/send-reset-code", { email: fpEmail });
      Swal.fire({
        icon: "success",
        title: "Code envoyé!",
        text: "Un code de vérification a été envoyé à votre email",
        timer: 3000
      });
      setFpStep(2);
    } catch (err) {
      console.error("Erreur envoi code:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: err.response?.data?.message || "Erreur lors de l'envoi du code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCodeAndReset = async () => {
    if (!fpCode || !fpNewPassword || !fpConfirmPassword) {
      return Swal.fire("Erreur", "Tous les champs sont requis", "error");
    }

    // Validation du mot de passe
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(fpNewPassword)) {
      return Swal.fire("Erreur", "Le mot de passe doit contenir au moins 6 caractères, 1 majuscule et 1 chiffre", "error");
    }

    if (fpNewPassword !== fpConfirmPassword) {
      return Swal.fire("Erreur", "Les mots de passe ne correspondent pas", "error");
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/user/reset-password", {
        email: fpEmail,
        code: fpCode,
        newPassword: fpNewPassword,
      });
      
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Votre mot de passe a été réinitialisé avec succès",
      });
      
      setForgotPasswordOpen(false);
      resetForgotPasswordFlow();
    } catch (err) {
      console.error("Erreur réinitialisation:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: err.response?.data?.message || "Code invalide ou expiré",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForgotPasswordFlow = () => {
    setFpStep(1);
    setFpEmail("");
    setFpCode("");
    setFpNewPassword("");
    setFpConfirmPassword("");
    setIsLoading(false);
  };

  if (!user) return <p>Chargement...</p>;

  const displayUrl = user.profileImage?.startsWith("http")
    ? user.profileImage
    : `http://localhost:5000${user.profileImage || "/images/default-avatar.png"}`;

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <div className="edit-profile-content">

          {/* HEADER */}
          <div className="edit-profile-header">
            <button className="back-btn" onClick={handleCancel}>← Retour</button>
            <h1 className="edit-profile-title">MODIFIER LE PROFIL</h1>
          </div>

          {/* IMAGE */}
          <div className="profile-image-section">
            <div className="profile-image-container" onClick={handleImageClick}>
              <img src={displayUrl} alt="Profile" className="profile-image" />
              <div className="image-overlay"><span className="camera-icon">📷</span></div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: "none" }} />
          </div>

          {/* INFO PERSONNELLES */}
          <h2 className="section-title">Informations personnelles</h2>
          <div className="edit-form-section">
            <form className="edit-form">
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className={`form-input ${errors.nom ? "input-error" : ""}`}
                />
                {errors.nom && <p className="error-text">{errors.nom}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input
                  type="text"
                  value={formData.prénom}
                  onChange={(e) => setFormData({ ...formData, prénom: e.target.value })}
                  className={`form-input ${errors.prénom ? "input-error" : ""}`}
                />
                {errors.prénom && <p className="error-text">{errors.prénom}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className={`form-input ${errors.telephone ? "input-error" : ""}`}
                />
                {errors.telephone && <p className="error-text">{errors.telephone}</p>}
              </div>

              <div className="form-actions">
                <button type="button" className="save-btn" onClick={handleSaveProfile}>
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>

          {/* MOT DE PASSE */}
          <h2 className="section-title">Sécurité – Modifier mot de passe</h2>
          <div className="edit-form-section">
            <form className="edit-form">
              <div className="form-group">
                <label>Ancien mot de passe</label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className={`form-input ${passwordErrors.oldPassword ? "input-error" : ""}`}
                />
                {passwordErrors.oldPassword && <p className="error-text">{passwordErrors.oldPassword}</p>}
              </div>

              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className={`form-input ${passwordErrors.newPassword ? "input-error" : ""}`}
                />
                {passwordErrors.newPassword && <p className="error-text">{passwordErrors.newPassword}</p>}
              </div>

              <div className="form-group">
                <label>Confirmer nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                  className={`form-input ${passwordErrors.confirmNewPassword ? "input-error" : ""}`}
                />
                {passwordErrors.confirmNewPassword && <p className="error-text">{passwordErrors.confirmNewPassword}</p>}
              </div>

              <div className="form-actions">
                <button type="button" className="save-btn" onClick={handleSavePassword}>
                  Modifier mot de passe
                </button>
                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={() => setForgotPasswordOpen(true)}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL MOT DE PASSE OUBLIE */}
      {forgotPasswordOpen && (
        <div className="modal-overlay">
          <div className="modal-content fp-modal">
            <h2 className="modal-title">Réinitialiser le mot de passe</h2>
            
            {/* Étape 1: Saisie de l'email */}
            {fpStep === 1 && (
              <div className="fp-step fp-step-email">
                <div className="step-indicator">Étape 1/2</div>
                <p className="step-description">Saisissez votre adresse email pour recevoir un code de vérification</p>
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  value={fpEmail} 
                  onChange={(e) => setFpEmail(e.target.value)}
                  className="modal-input email-input"
                />
                <div className="modal-actions">
                  <button 
                    className={`modal-btn primary ${isLoading ? 'loading' : ''}`} 
                    onClick={sendCode}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Envoi en cours...' : 'Envoyer le code'}
                  </button>
                  <button 
                    className="modal-btn secondary" 
                    onClick={() => {
                      setForgotPasswordOpen(false);
                      resetForgotPasswordFlow();
                    }}
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Étape 2: Code + Nouveau mot de passe (tout en une étape) */}
            {fpStep === 2 && (
              <div className="fp-step fp-step-reset">
                <div className="step-indicator">Étape 2/2</div>
                <p className="step-description">Entrez le code reçu et votre nouveau mot de passe</p>
                
                <div className="code-section">
                  <label>Code de vérification</label>
                  <input 
                    type="text" 
                    placeholder="Code à 6 chiffres" 
                    value={fpCode} 
                    onChange={(e) => setFpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="modal-input code-input"
                    maxLength={6}
                  />
                </div>

                <div className="password-section">
                  <label>Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    placeholder="Nouveau mot de passe" 
                    value={fpNewPassword} 
                    onChange={(e) => setFpNewPassword(e.target.value)}
                    className="modal-input password-input"
                  />
                  <input 
                    type="password" 
                    placeholder="Confirmer le mot de passe" 
                    value={fpConfirmPassword} 
                    onChange={(e) => setFpConfirmPassword(e.target.value)}
                    className="modal-input password-input"
                  />
                </div>

                <div className="password-requirements">
                  Le mot de passe doit contenir au moins 6 caractères, 1 majuscule et 1 chiffre
                </div>

                <div className="modal-actions">
                  <button 
                    className={`modal-btn primary ${isLoading ? 'loading' : ''}`} 
                    onClick={verifyCodeAndReset}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Vérification...' : 'Réinitialiser le mot de passe'}
                  </button>
                  <button 
                    className="modal-btn secondary" 
                    onClick={() => setFpStep(1)}
                    disabled={isLoading}
                  >
                    Retour
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;
          z-index: 1000;
        }
        .fp-modal {
          background: #fff; padding: 30px; border-radius: 12px; width: 420px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border: 2px solid #4CAF50;
        }
        .modal-title {
          text-align: center; margin-bottom: 20px; color: #333;
          font-size: 24px; font-weight: bold;
        }
        .fp-step {
          display: flex; flex-direction: column; gap: 15px;
        }
        .step-indicator {
          background: #4CAF50; color: white; padding: 8px 16px;
          border-radius: 20px; text-align: center; font-weight: bold;
          font-size: 14px; align-self: center;
        }
        .step-description {
          text-align: center; color: #666; margin-bottom: 10px;
          font-size: 14px; line-height: 1.4;
        }
        .code-section, .password-section {
          display: flex; flex-direction: column; gap: 8px;
        }
        .code-section label, .password-section label {
          font-weight: bold; color: #333; font-size: 14px;
        }
        .modal-input {
          padding: 12px; border: 2px solid #ddd; border-radius: 8px;
          font-size: 16px; transition: border-color 0.3s;
        }
        .email-input:focus {
          border-color: #2196F3;
          box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
        }
        .code-input:focus {
          border-color: #FF9800;
          box-shadow: 0 0 5px rgba(255, 152, 0, 0.3);
          font-size: 18px; font-weight: bold; text-align: center;
        }
        .password-input:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
        }
        .modal-actions {
          display: flex; gap: 10px; justify-content: center;
          margin-top: 10px;
        }
        .modal-btn {
          padding: 12px 24px; border: none; border-radius: 8px;
          font-size: 14px; font-weight: bold; cursor: pointer;
          transition: all 0.3s; min-width: 140px;
        }
        .modal-btn:disabled {
          opacity: 0.6; cursor: not-allowed;
        }
        .modal-btn.primary {
          background: #4CAF50; color: white;
        }
        .modal-btn.primary:hover:not(:disabled) {
          background: #45a049; transform: translateY(-2px);
        }
        .modal-btn.secondary {
          background: #f1f1f1; color: #333;
        }
        .modal-btn.secondary:hover:not(:disabled) {
          background: #e0e0e0; transform: translateY(-2px);
        }
        .password-requirements {
          font-size: 12px; color: #888; text-align: center;
          margin-top: 5px; margin-bottom: 10px;
          background: #f9f9f9;
          padding: 8px;
          border-radius: 4px;
          border-left: 3px solid #4CAF50;
        }
        .forgot-password-btn {
          margin-left: 10px; background: none; border: none; 
          color: #4CAF50; text-decoration: underline; cursor: pointer;
          font-size: 14px;
        }
        .forgot-password-btn:hover {
          color: #45a049;
        }
        .error-text { color: red; font-size: 13px; margin-top: 3px; }
        .input-error { border: 2px solid red !important; animation: shake 0.2s; }
        .section-title { font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 10px; }
        @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-3px); } 50% { transform: translateX(3px); } 75% { transform: translateX(-3px); } 100% { transform: translateX(0); } }
        `}
      </style>
    </div>
  );
};

export default EditProfileAdmin;