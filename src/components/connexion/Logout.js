// Logout.jsx (mis à jour)
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
      <i className="fas fa-sign-out-alt"></i>
      <span>Déconnexion</span>
    </button>
  );
}

export default Logout;