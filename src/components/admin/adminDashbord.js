// DashboardAdmin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../connexion/Logout";
import "./DashboardAdmin.css";

function DashboardAdmin() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    {
      id: "dashboard",
      title: "Tableau de Bord",
      icon: "fas fa-chart-line",
      component: <DashboardOverview />
    },
    {
      id: "annonces",
      title: "Gestion des Annonces",
      icon: "fas fa-newspaper",
      component: <GestionAnnonces />
    },
    {
      id: "utilisateurs",
      title: "Gestion des Utilisateurs",
      icon: "fas fa-users",
      component: <GestionUtilisateurs />
    },
    {
      id: "offres",
      title: "Offres d'Annonce",
      icon: "fas fa-tags",
      component: <AjouterOffres />
    },
    {
      id: "parametres",
      title: "Paramètres",
      icon: "fas fa-cog",
      component: <Parametres />
    }
  ];

  if (!user) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Chargement...</p>
    </div>
  );

  const ActiveComponent = menuItems.find(item => item.id === activeSection)?.component;

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button 
            className="toggle-sidebar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className={`fas fa-chevron-${isSidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="user-details">
            <h3>{user.nom} {user.prénom}</h3>
            <p>{user.role}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <i className={item.icon}></i>
              {isSidebarOpen && <span>{item.title}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Logout />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="content-header">
          <div className="header-left">
            <h1>{menuItems.find(item => item.id === activeSection)?.title}</h1>
          </div>
          <div className="header-right">
            <div className="notification-bell">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </div>
          </div>
        </header>

        <div className="content-area">
          {ActiveComponent}
        </div>
      </div>
    </div>
  );
}

// Composants pour chaque section
function DashboardOverview() {
  const stats = [
    { title: "Utilisateurs", value: "1,234", icon: "fas fa-users", color: "#3B82F6" },
    { title: "Annonces", value: "567", icon: "fas fa-newspaper", color: "#10B981" },
    { title: "Revenus", value: "$12,456", icon: "fas fa-dollar-sign", color: "#F59E0B" },
    { title: "Offres Actives", value: "24", icon: "fas fa-tags", color: "#EF4444" }
  ];

  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
              <i className={stat.icon} style={{ color: stat.color }}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h2>Activité Récente</h2>
        <div className="activity-list">
          {[1, 2, 3].map(item => (
            <div key={item} className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="activity-content">
                <p>Nouvel utilisateur inscrit</p>
                <span>Il y a 2 heures</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GestionAnnonces() {
  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Gestion des Annonces</h2>
        <button className="btn-primary">
          <i className="fas fa-plus"></i>
          Nouvelle Annonce
        </button>
      </div>
      <div className="content-card">
        <p>Interface de gestion des annonces à implémenter...</p>
      </div>
    </div>
  );
}

function GestionUtilisateurs() {
  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Gestion des Utilisateurs</h2>
        <button className="btn-secondary">
          <i className="fas fa-download"></i>
          Exporter
        </button>
      </div>
      <div className="content-card">
        <p>Interface de gestion des utilisateurs à implémenter...</p>
      </div>
    </div>
  );
}

function AjouterOffres() {
  const offres = [
    { nom: "10 annonces", prix: "$100", popular: false },
    { nom: "25 annonces", prix: "$200", popular: true },
    { nom: "50 annonces", prix: "$350", popular: false }
  ];

  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Offres d'Annonce</h2>
      </div>
      <div className="offres-grid">
        {offres.map((offre, index) => (
          <div key={index} className={`offre-card ${offre.popular ? 'popular' : ''}`}>
            {offre.popular && <div className="popular-badge">Populaire</div>}
            <h3>{offre.nom}</h3>
            <div className="offre-prix">{offre.prix}</div>
            <ul className="offre-features">
              <li><i className="fas fa-check"></i> Publication immédiate</li>
              <li><i className="fas fa-check"></i> Visibilité prioritaire</li>
              <li><i className="fas fa-check"></i> Support 24/7</li>
            </ul>
            <button className="btn-primary">
              <i className="fas fa-shopping-cart"></i>
              Sélectionner
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Parametres() {
  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Paramètres</h2>
      </div>
      <div className="content-card">
        <div className="settings-grid">
          <div className="setting-item">
            <i className="fas fa-bell"></i>
            <div>
              <h4>Notifications</h4>
              <p>Gérer les préférences de notification</p>
            </div>
          </div>
          <div className="setting-item">
            <i className="fas fa-shield-alt"></i>
            <div>
              <h4>Sécurité</h4>
              <p>Paramètres de sécurité du compte</p>
            </div>
          </div>
          <div className="setting-item">
            <i className="fas fa-palette"></i>
            <div>
              <h4>Apparence</h4>
              <p>Personnaliser l'interface</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;