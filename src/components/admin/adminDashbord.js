import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../connexion/Logout";
import './DashboardAdmin.css';

function DashboardAdmin() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Données statistiques simulées
  const [stats, setStats] = useState({
    totalProperties: 1247,
    activeListings: 892,
    pendingApprovals: 23,
    totalUsers: 4567,
    monthlyRevenue: 125400,
    visits: 12458
  });

  // Dernières activités
  const [recentActivities] = useState([
    { id: 1, user: "Jean Dupont", action: "a ajouté une nouvelle propriété", time: "2 min", type: "add" },
    { id: 2, user: "Marie Martin", action: "a modifié son profil", time: "5 min", type: "update" },
    { id: 3, user: "Admin System", action: "a approuvé 3 propriétés", time: "10 min", type: "approve" },
    { id: 4, user: "Pierre Lambert", action: "s'est inscrit", time: "15 min", type: "register" },
    { id: 5, user: "Sarah Cohen", action: "a réservé une visite", time: "25 min", type: "booking" }
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!user) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Chargement du tableau de bord...</p>
    </div>
  );

  return (
    <div className="dashboard-admin">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-home"></i>
            {sidebarOpen && <span>DariTN Admin</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <i className="fas fa-chart-line"></i>
            {sidebarOpen && <span>Tableau de bord</span>}
          </button>
          
          <button 
            className={`nav-item ${activeTab === "properties" ? "active" : ""}`}
            onClick={() => setActiveTab("properties")}
          >
            <i className="fas fa-building"></i>
            {sidebarOpen && <span>Propriétés</span>}
          </button>
          
          <button 
            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <i className="fas fa-users"></i>
            {sidebarOpen && <span>Utilisateurs</span>}
          </button>
          
          <button 
            className={`nav-item ${activeTab === "approvals" ? "active" : ""}`}
            onClick={() => setActiveTab("approvals")}
          >
            <i className="fas fa-check-circle"></i>
            {sidebarOpen && <span>Approbations</span>}
            {sidebarOpen && <span className="badge">23</span>}
          </button>
          
          <button 
            className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <i className="fas fa-chart-bar"></i>
            {sidebarOpen && <span>Rapports</span>}
          </button>
          
          <button 
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <i className="fas fa-cog"></i>
            {sidebarOpen && <span>Paramètres</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <Logout />
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Tableau de Bord Administrateur</h1>
            <p>Bienvenue de retour, {user.prénom} !</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {user.nom.charAt(0)}{user.prénom.charAt(0)}
              </div>
              <div className="user-details">
                <span className="user-name">{user.nom} {user.prénom}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
            <div className="header-actions">
              <button className="icon-btn">
                <i className="fas fa-bell"></i>
                <span className="notification-badge">3</span>
              </button>
              <button className="icon-btn">
                <i className="fas fa-envelope"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon properties">
              <i className="fas fa-building"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalProperties.toLocaleString()}</h3>
              <p>Propriétés totales</p>
              <span className="stat-trend positive">+12%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon listings">
              <i className="fas fa-home"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.activeListings.toLocaleString()}</h3>
              <p>Annonces actives</p>
              <span className="stat-trend positive">+8%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card">
              <div className="stat-icon approvals">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.pendingApprovals}</h3>
                <p>En attente</p>
                <span className="stat-trend negative">+5</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <i className="fas fa-euro-sign"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.monthlyRevenue.toLocaleString()} €</h3>
              <p>Revenu mensuel</p>
              <span className="stat-trend positive">+15%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon users">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers.toLocaleString()}</h3>
              <p>Utilisateurs</p>
              <span className="stat-trend positive">+24%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon visits">
              <i className="fas fa-eye"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.visits.toLocaleString()}</h3>
              <p>Visites ce mois</p>
              <span className="stat-trend positive">+18%</span>
            </div>
          </div>
        </div>

        {/* Charts and Activities */}
        <div className="content-grid">
          {/* Recent Activities */}
          <div className="activity-card">
            <div className="card-header">
              <h3>Activités récentes</h3>
              <button className="view-all">Voir tout</button>
            </div>
            <div className="activity-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    <i className={`fas fa-${
                      activity.type === 'add' ? 'plus' :
                      activity.type === 'update' ? 'edit' :
                      activity.type === 'approve' ? 'check' :
                      activity.type === 'register' ? 'user-plus' : 'calendar'
                    }`}></i>
                  </div>
                  <div className="activity-content">
                    <p><strong>{activity.user}</strong> {activity.action}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="actions-card">
            <div className="card-header">
              <h3>Actions rapides</h3>
            </div>
            <div className="actions-grid">
              <button className="action-btn">
                <i className="fas fa-plus-circle"></i>
                <span>Nouvelle propriété</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-user-cog"></i>
                <span>Gérer utilisateurs</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-chart-pie"></i>
                <span>Voir rapports</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-cog"></i>
                <span>Paramètres</span>
              </button>
            </div>
          </div>

          {/* User Info Card */}
          <div className="user-card">
            <div className="card-header">
              <h3>Votre profil</h3>
            </div>
            <div className="user-profile">
              <div className="profile-avatar large">
                {user.nom.charAt(0)}{user.prénom.charAt(0)}
              </div>
              <div className="profile-info">
                <h4>{user.nom} {user.prénom}</h4>
                <p className="profile-role">{user.role}</p>
                <p className="profile-email">{user.email}</p>
                <p className="profile-phone">{user.telephone}</p>
              </div>
              <div className="profile-actions">
                <button className="btn-primary">
                  <i className="fas fa-edit"></i>
                  Modifier le profil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;