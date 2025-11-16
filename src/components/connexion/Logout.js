// Logout.jsx
import { useNavigate } from "react-router-dom";
import "./../admin/DashboardAdmin.css";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <div className="logout-button-content">
        <div className="logout-icon">
          <i className="fas fa-sign-out-alt"></i>
        </div>
        <span className="logout-text">Déconnexion</span>
      </div>
      <div className="logout-hover-effect"></div>
    </button>
  );
}

export default Logout;