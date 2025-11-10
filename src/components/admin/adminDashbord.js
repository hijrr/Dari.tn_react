// DashboardAdmin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../connexion/Logout";
import "./DashboardAdmin.css";

import axios from "axios";

function DashboardAdmin() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
 
  const [stats, setStats] = useState({
    utilisateurs: 0,
    annonces: 0,
    offres: 0
  });
  const [activities, setActivities] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [annoncesLoading, setAnnoncesLoading] = useState(true);

  useEffect(() => {
    // Charger les statistiques générales
    fetch("http://localhost:5000/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) =>
        console.error("Erreur lors de la récupération des statistiques :", err)
      );

    // Charger les activités
    fetch("http://localhost:5000/api/activities")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) =>
        console.error("Erreur lors du chargement des activités :", err)
      );

    // Charger les utilisateurs
    axios
      .get("http://localhost:5000/api/utilisateurs")
      .then((res) => {
        setUtilisateurs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setLoading(false);
      });

    // Charger les annonces
    fetchAnnonces();

    // Vérifier l'utilisateur connecté
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Fonction pour charger les annonces
  const fetchAnnonces = () => {
    setAnnoncesLoading(true);
    axios
      .get("http://localhost:5000/GAnnonces")
      .then((res) => {
        console.log("Annonces chargées:", res.data);
        setAnnonces(res.data);
        setAnnoncesLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des annonces :", err);
        setAnnoncesLoading(false);
      });
  };

  // Modifier le statut d'une annonce
  const handleStatusChange = async (idAnnonce, nouveauStatut) => {
    try {
      console.log("Modification statut:", idAnnonce, nouveauStatut);
      
      // Mise à jour optimiste immédiate
      setAnnonces(prev =>
        prev.map(a => 
          a.idAnnonce === idAnnonce ? { ...a, statu: nouveauStatut } : a
        )
      );

      const response = await axios.put(`http://localhost:5000/annonces/${idAnnonce}`, { 
        statu: nouveauStatut 
      });
      
      console.log("Réponse serveur:", response.data);
     
      
    } catch (err) {
      console.error("Erreur modification statut :", err);
      
      // Recharger les données originales en cas d'erreur
      fetchAnnonces();
    }
  };

  // Supprimer une annonce
  const handleDelete = (idAnnonce) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
      axios
        .delete(`http://localhost:5000/annonces/${idAnnonce}`)
        .then(() => {
          setAnnonces(prev => prev.filter(a => a.idAnnonce !== idAnnonce));
         
        })
        .catch(err => {
          console.error("Erreur suppression :", err);
         
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleRoleChange = (userId, newRole) => {
    axios
      .put(`http://localhost:5000/api/utilisateurs/${userId}/role`, {
        role: newRole,
      })
      .then(() => {
        setUtilisateurs((prev) =>
          prev.map((user) =>
            user.userId === userId ? { ...user, role: newRole } : user
          )
        );
       
      })
      .catch((err) => {
        console.error("Erreur lors de la modification du rôle :", err);
       
      });
  };

  // Calcul des statistiques des utilisateurs
  const calculateUserStats = () => {
    return {
      total: utilisateurs.length,
      admin: utilisateurs.filter(user => user.role === 'admin').length,
      client: utilisateurs.filter(user => user.role === 'client').length,
      agence: utilisateurs.filter(user => user.role === 'agence').length,
      proprietaire: utilisateurs.filter(user => user.role === 'proprietaire').length,
    };
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge role-admin';
      case 'client': return 'role-badge role-client';
      case 'agence': return 'role-badge role-agence';
      case 'proprietaire': return 'role-badge role-proprietaire';
      default: return 'role-badge';
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      title: "Tableau de Bord",
      icon: "fas fa-chart-line",
      component: <DashboardOverview stats={stats} activities={activities} user={user}
      handleProfileClick={() => navigate("/profile")}/>
    },
    {
      id: "annonces",
      title: "Gestion des Annonces",
      icon: "fas fa-newspaper",
      component: <GestionAnnonces
        annonces={annonces}
        handleStatusChange={handleStatusChange}
        handleDelete={handleDelete}
        loading={annoncesLoading}
        onRefresh={fetchAnnonces}
      />
    },
    {
      id: "utilisateurs",
      title: "Gestion des Utilisateurs",
      icon: "fas fa-users",
      component: <GestionUtilisateurs
        utilisateurs={utilisateurs}
        handleRoleChange={handleRoleChange}
        userStats={calculateUserStats()}
        getRoleBadgeClass={getRoleBadgeClass}
        loading={loading}
      />
    },
    {
      id: "offres",
      title: "Offres d'Annonce",
      icon: "fas fa-tags",
      component: <AjouterOffres />
    },
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
          <h2>DariTN</h2>
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
          <Logout onLogout={handleLogout} />
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

const getIcon = (type) => {
  switch (type) {
    case "annonce":
      return "fas fa-newspaper";
    case "offre":
      return "fas fa-tags";
    case "paiement":
      return "fas fa-dollar-sign";
    default:
      return "fas fa-info-circle";
  }
};

// Composant Tableau de Bord
function DashboardOverview({ stats, activities, user, handleProfileClick }) {
  if (!stats) {
    return <p>Chargement des statistiques...</p>;
  }

  const statsList = [
    { title: "Utilisateurs", value: stats.utilisateurs || 0, icon: "fas fa-users", color: "#3B82F6" },
    { title: "Annonces", value: stats.annonces || 0, icon: "fas fa-newspaper", color: "#10B981" },
    { title: "Offres Actives", value: stats.offres || 0, icon: "fas fa-tags", color: "#EF4444" }
  ];

  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        {statsList.map((stat, index) => (
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
        {/* <button className="profile-btn" onClick={handleProfileClick}>
                    <img
                      src={
                        user.profileImage
                          ? user.profileImage.startsWith("http")
                            ? user.profileImage
                            : `http://localhost:5000${user.profileImage}`
                          : "/images/default-avatar.png"
                      }
                      alt="Profil"
                      className="user-avatar-img"
                      onError={(e) => {
                        e.target.src = "/images/default-avatar.png";
                      }}
                    />
                    <span className="user-name">
                      {user.prénom} {user.nom}
                    </span>
                  </button> */}
      </div>

      <div className="recent-activity">
        <h2>Activité Récente</h2>

        {activities.length === 0 ? (
          <p>Aucune activité récente.</p>
        ) : (
          <div className="activity-list">
            {activities.map((act, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <i className={getIcon(act.type)}></i>
                </div>
                <div className="activity-content">
                  <p>
                    {act.type === "annonce" && `Nouvelle annonce : ${act.nom}`}
                    {act.type === "offre" && `Nouvelle offre : ${act.nom}`}
                    {act.type === "paiement" && `${act.nom}`}
                  </p>
                  <span>{new Date(act.date).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant Gestion des Annonces
function GestionAnnonces({ annonces, handleStatusChange, handleDelete, loading, onRefresh }) {
  // Calcul robuste des statistiques
  const calculateStats = () => {
    if (!annonces || annonces.length === 0) {
      return { total: 0, active: 0, inactive: 0, users: 0 };
    }

    let active = 0;
    let inactive = 0;
    
    annonces.forEach((annonce) => {
      const statu = annonce.statu ? String(annonce.statu).toLowerCase().trim() : 'inactive';
      
      // Logique améliorée pour détecter les statuts
      if (statu === 'active' || statu === 'actif' || statu === 'activé' || 
          statu === 'en ligne' || statu === 'publié' || statu === 'publiée' ||
          statu === '1' || statu === 'true' || statu === 'vrai') {
        active++;
      } else {
        inactive++;
      }
    });

    const total = annonces.length;
    const users = [...new Set(annonces.map(annonce => annonce.nomUtilisateur))].length;

    console.log("Stats calculées:", { total, active, inactive, users });
    
    return { total, active, inactive, users };
  };

  const stats = calculateStats();

  // Fonction pour obtenir la classe du badge de statut
  const getStatusBadgeClass = (status) => {
    if (!status) return 'status-badge status-inactive';
    
    const statusLower = status.toLowerCase().trim();
    if (statusLower === 'active' || statusLower === 'actif' || statusLower === 'activé' || 
        statusLower === 'en ligne' || statusLower === 'publié' || statusLower === 'publiée' ||
        statusLower === '1' || statusLower === 'true' || statusLower === 'vrai') {
      return 'status-badge status-active';
    } else {
      return 'status-badge status-inactive';
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status) => {
    if (!status) return '🔴';
    
    const statusLower = status.toLowerCase().trim();
    if (statusLower === 'active' || statusLower === 'actif' || statusLower === 'activé' || 
        statusLower === 'en ligne' || statusLower === 'publié' || statusLower === 'publiée' ||
        statusLower === '1' || statusLower === 'true' || statusLower === 'vrai') {
      return '🟢';
    } else {
      return '🔴';
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status) => {
    if (!status) return 'Inactive';
    
    const statusLower = status.toLowerCase().trim();
    if (statusLower === 'active' || statusLower === 'actif' || statusLower === 'activé' || 
        statusLower === 'en ligne' || statusLower === 'publié' || statusLower === 'publiée' ||
        statusLower === '1' || statusLower === 'true' || statusLower === 'vrai') {
      return 'Active';
    } else {
      return 'Inactive';
    }
  };

  if (loading) {
    return (
      <div className="gestion-annonces-container">
        <div className="gestion-annonces-header">
          <h2>Gestion des Annonces</h2>
        </div>
        <div className="gestion-annonces-loading">
          <div className="gestion-annonces-spinner"></div>
          <p style={{fontSize: '18px', color: '#2c3e50', fontWeight: '600'}}>
            Chargement des annonces...
          </p>
          <p style={{color: '#7f8c8d', marginTop: '10px'}}>
            Veuillez patienter pendant que nous récupérons les données.
          </p>
        </div>
      </div>
    );
  }

  if (annonces.length === 0) {
    return (
      <div className="gestion-annonces-container">
       
        <div className="gestion-annonces-empty">
          <div className="gestion-annonces-empty-icon">📰</div>
          <h3 style={{margin: '0 0 10px 0', color: '#2c3e50'}}>Aucune annonce trouvée</h3>
          <p style={{margin: '0', fontSize: '16px'}}>
            Aucune annonce n'est actuellement enregistrée dans le système.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-annonces-container">
      

      {/* Cartes de statistiques */}
      <div className="gestion-annonces-stats">
        <div className="stat-card-annonces total">
          <div className="stat-label-annonces">📊 Total des annonces</div>
          <div className="stat-number-annonces">{stats.total}</div>
        </div>
        <div className="stat-card-annonces active">
          <div className="stat-label-annonces">🟢 Annonces actives</div>
          <div className="stat-number-annonces">{stats.active}</div>
        </div>
        <div className="stat-card-annonces inactive">
          <div className="stat-label-annonces">🔴 Annonces inactives</div>
          <div className="stat-number-annonces">{stats.inactive}</div>
        </div>
       
      </div>

      {/* Tableau des annonces */}
      <div className="gestion-annonces-table-container">
        <table className="table-annonces">
          <thead>
            <tr>
              <th>🖼️ Image</th>
              <th>📝 Titre</th>
              <th>📄 Description</th>
              <th>💰 Prix</th>
              <th>🎯 Statut</th>
              <th>👤 Utilisateur</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {annonces.map((annonce) => (
              <tr key={annonce.idAnnonce}>
                {/* Image de l'annonce */}
                <td>
                  {annonce.image ? (
                    <img 
                      src={annonce.image} 
                      alt={annonce.titre} 
                      className="annonce-image"
                    />
                  ) : (
                    <div className="no-image">
                      <span>📷</span>
                    </div>
                  )}
                </td>

                <td>{annonce.titre}</td>
                <td>
                  <div className="description-truncate" title={annonce.description}>
                    {annonce.description}
                  </div>
                </td>
                <td>
                  <strong>{annonce.prix} DT</strong>
                </td>
                <td>
                  <span className={getStatusBadgeClass(annonce.statu)}>
                    {getStatusIcon(annonce.statu)} {getStatusText(annonce.statu)}
                  </span>
                </td>
                <td>{annonce.nomUtilisateur || "Inconnu"}</td>

                <td>
                  <div className="actions-container">
                    <select
                      className="status-select"
                      value={getStatusText(annonce.statu).toLowerCase()}
                      onChange={(e) => {
                        console.log("Changement statut:", annonce.idAnnonce, e.target.value);
                        handleStatusChange(annonce.idAnnonce, e.target.value);
                      }}
                    >
                      <option value="active">🟢 Active</option>
                      <option value="inactive">🔴 Inactive</option>
                    </select>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(annonce.idAnnonce)}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Composant Gestion des Utilisateurs
function GestionUtilisateurs({ utilisateurs, handleRoleChange, userStats, getRoleBadgeClass, loading }) {
  // Valeurs par défaut pour éviter les erreurs
  const stats = userStats || {
    total: 0,
    admin: 0,
    client: 0,
    agence: 0,
    proprietaire: 0
  };

  if (loading) {
    return (
      <div className="gestion-utilisateurs-container">
        <div className="gestion-utilisateurs-header">
        </div>
        <div className="gestion-utilisateurs-loading">
          <div className="gestion-utilisateurs-spinner"></div>
          <p style={{ fontSize: '18px', color: '#2c3e50', fontWeight: '600' }}>
            Chargement des utilisateurs...
          </p>
          <p style={{ color: '#7f8c8d', marginTop: '10px' }}>
            Veuillez patienter pendant que nous récupérons les données.
          </p>
        </div>
      </div>
    );
  }

  if (!utilisateurs || utilisateurs.length === 0) {
    return (
      <div className="gestion-utilisateurs-container">
        <div className="gestion-utilisateurs-header">
          <h2>Gestion des Utilisateurs</h2>
        </div>
        <div className="gestion-utilisateurs-empty">
          <div className="gestion-utilisateurs-empty-icon">👥</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Aucun utilisateur trouvé</h3>
          <p style={{ margin: '0', fontSize: '16px' }}>
            Aucun utilisateur n'est actuellement enregistré dans le système.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-utilisateurs-container">
    {/* Cartes de statistiques */}
      <div className="gestion-utilisateurs-stats">
        <div className="stat-card admin">
          <div className="stat-label">👑 Administrateurs</div>
          <div className="stat-number">{stats.admin}</div>
        </div>
        <div className="stat-card client">
          <div className="stat-label">👥 Clients</div>
          <div className="stat-number">{stats.client}</div>
        </div>
        <div className="stat-card agence">
          <div className="stat-label">🏢 Agences</div>
          <div className="stat-number">{stats.agence}</div>
        </div>
        <div className="stat-card proprietaire">
          <div className="stat-label">🏠 Propriétaires</div>
          <div className="stat-number">{stats.proprietaire}</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#f39c12' }}>
          <div className="stat-label">📊 Total</div>
          <div className="stat-number">{stats.total}</div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="gestion-utilisateurs-table-container">
        <table border="0" cellPadding="8" className="gestion-utilisateurs-table">
          <thead>
            <tr>
              <th>👤 Nom</th>
              <th>👤 Prénom</th>
              <th>📧 Email</th>
              <th>📞 Téléphone</th>
              <th>🎯 Rôle actuel</th>
              <th>⚙️ Changer le rôle</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((user) => (
              <tr key={user.userId}>
                <td>{user.nom}</td>
                <td>{user.prénom}</td>
                <td>{user.email}</td>
                <td>{user.telephone}</td>
                <td>
                  <span className={getRoleBadgeClass(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.userId, e.target.value)
                    }
                  >
                    <option value="admin">👑 Admin</option>
                    <option value="client">👥 Client</option>
                    <option value="agence">🏢 Agence</option>
                    <option value="proprietaire">🏠 Propriétaire</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Composant Offres d'Annonce
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

export default DashboardAdmin;