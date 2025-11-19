import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [fpStep, setFpStep] = useState(1);
  const [fpEmail, setFpEmail] = useState("");
  const [fpCode, setFpCode] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/login", { email, motDePasse });
      const user = res.data;

      if (!user || !user.userId) {
        Swal.fire("Erreur", "Email ou mot de passe incorrect", "error");
        return;
      }

      if (!user.isVerified) {
        Swal.fire({
          icon: "warning",
          title: "Email non vérifié",
          html: `Veuillez vérifier votre email avant de vous connecter.<br>
                 <strong>Consultez votre boîte de réception</strong>`,
        });
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") navigate("/dashboard-admin");
      else if (user.role === "client") navigate("/dashboard-client");
      else if (user.role === "agence") navigate("/dashboard-agence");
      else if (user.role === "proprietaire") navigate("/dashboard-proprietaire");
      else navigate("/");

    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", err.response?.data?.message || "Erreur serveur", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Vérifier si l'email existe avant d'envoyer le code
  const sendCode = async () => {
    if (!fpEmail) return Swal.fire("Erreur", "Email requis", "error");

    setIsLoading(true);
    try {
      // Vérifier d'abord si l'email existe
      await axios.get(`http://localhost:5000/api/utilisateur/email/${fpEmail}`);

      // Si l'email existe, envoyer le code
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

      if (err.response?.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Email non trouvé",
          text: "Aucun compte n'est associé à cet email",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: err.response?.data?.message || "Erreur lors de l'envoi du code",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Réinitialiser le mot de passe avec vérification du code
  const verifyCodeAndReset = async () => {
    if (!fpCode || !fpNewPassword || !fpConfirmPassword) {
      return Swal.fire("Erreur", "Tous les champs sont requis", "error");
    }

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

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <i className="fas fa-home"></i>
            <span>DariTN</span>
          </div>
          <h1>Connexion</h1>
          <p>Accédez à votre espace personnel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <div className="input-container">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                placeholder="Mot de passe"
                value={motDePasse}
                onChange={e => setMotDePasse(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <span className="label-default">Se connecter</span>
            <span className="label-loading">Connexion...</span>
          </button>


          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button
              type="button"
              className="forgot-password-btn"
              onClick={() => setForgotPasswordOpen(true)}
            >
              Mot de passe oublié ?
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p>
            Pas de compte ?
            <Link to="/register" className="register-link">Créez votre compte</Link>
          </p>
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

            {/* Étape 2: Code + Nouveau mot de passe */}
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
}

export default Login;