import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/login", { email, motDePasse });
      const user = res.data;

      if (!user || !user.userId) {
        alert("Email ou mot de passe incorrect");
        return;
      }

      // Stocker l'utilisateur
      localStorage.setItem("user", JSON.stringify(user));

      // 🔹 Redirection immédiate selon le rôle
      if (user.role === "admin") navigate("/dashboard-admin");
      else if (user.role === "client") navigate("/dashboard-client");
      else if (user.role === "agence") navigate("/dashboard-admin");
      else if (user.role === "proprietaire") navigate("/dashboard-admin");
      else navigate("/"); // fallback

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur serveur");
    } finally {
      setIsLoading(false);
    }
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
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Pas de compte ? 
            <Link to="/register" className="register-link">Créez votre compte</Link>
          </p>
          
          
        </div>
      </div>
    </div>
  );
}

export default Login;