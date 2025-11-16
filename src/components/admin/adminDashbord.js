// DashboardAdmin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logout from "../connexion/Logout";
import "./DashboardAdmin.css";
import "./AjouterOffres .css";
import "./Utilisateur.css";
import "./Annonce.css";
import "./parametre.css";
import axios from "axios";

function DashboardAdmin() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [offres, setOffres] = useState([]);
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
    const fetchData = async () => {
      try {
        // Charger les statistiques générales
        const statsResponse = await fetch("http://localhost:5000/api/stats");
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Charger les activités
        const activitiesResponse = await fetch("http://localhost:5000/api/activities");
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);

        // Charger les utilisateurs
        const usersResponse = await axios.get("http://localhost:5000/api/utilisateurs");
        setUtilisateurs(usersResponse.data);

        // Charger les annonces
        await fetchAnnonces();
        
        // Charger les offres
        await fetchOffres();

        // Vérifier l'utilisateur connecté
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } else {
          navigate("/");
        }

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setLoading(false);
      }
    };

    fetchData();
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

  const handleProfileClick = () => {
    console.log('Profil utilisateur cliqué');
    // Ici vous pouvez ajouter la navigation vers la page profil
    window.location.href = "/edit-profile-Admin";
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
      fetchAnnonces();
    }
  };

  // Supprimer une annonce
  const handleDeleteAnn = (idAnnonce) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement l'annonce.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/annoncesDelite/${idAnnonce}`)
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Supprimée !",
              text: res.data.message || "Annonce supprimée avec succès.",
              timer: 2000,
              showConfirmButton: false,
            });
            setAnnonces((prev) =>
              prev.filter((a) => a.idAnnonce !== idAnnonce)
            );
          })
          .catch((err) => {
            console.error("Erreur suppression :", err);
            const errorMsg =
              err.response?.data?.message ||
              "Une erreur est survenue lors de la suppression.";

            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: errorMsg,
            });
          });
      }
    });
  };

  // Get toutes les offres
  const fetchOffres = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/offres`);
      setOffres(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des offres :", error);
    }
  };

  // Modifier une offre
  const handleEdit = (idOff) => {
    navigate(`/dashboard/offres/modifier/${idOff}`);
  };

  // Fonction pour mettre à jour le profil
  

  const handleDeleteOff = async (idOff) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement cette offre.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:5000/api/offresSupp/${idOff}`);

          Swal.fire({
            icon: "success",
            title: "Supprimée !",
            text: response.data.message || "Offre supprimée avec succès.",
            timer: 2000,
            showConfirmButton: false,
          });

          fetchOffres();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);

          const message =
            error.response?.data?.message ||
            "Une erreur est survenue lors de la suppression.";

          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: message,
          });
        }
      }
    });
  };

  const goToAjouter = () => {
    navigate("/dashboard/offres/ajouter");
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
    if (!utilisateurs || !Array.isArray(utilisateurs)) {
      return {
        total: 0,
        admin: 0,
        client: 0,
        agence: 0,
        proprietaire: 0,
      };
    }

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
      component: <DashboardOverview 
        stats={stats} 
        activities={activities} 
        user={user}
        handleProfileClick={() => navigate("/edit-profile-Admin")} 
      />
    },
    {
      id: "annonces",
      title: "Gestion des Annonces",
      icon: "fas fa-newspaper",
      component: <GestionAnnonces
        annonces={annonces}
        handleStatusChange={handleStatusChange}
        handleDeleteAnn={handleDeleteAnn}
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
      component: <GestionOffres 
        handleEdit={handleEdit} 
        handleDeleteOff={handleDeleteOff} 
        offre={offres} 
        goToAjouter={goToAjouter} 
      />
    }, 
    {
      id: "parametres",
      title: "Paramètres",
      icon: "fas fa-cog",
      component: <Parametres 
        user={user}    />
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
          <div className="logo-container">
            <div className="logo-icon">
              <i className="fas fa-home"></i>
            </div>
            {isSidebarOpen && (
              <div className="logo-text">
                <h2>DariTIN</h2>
                <span className="logo-subtitle">Admin Panel</span>
              </div>
            )}
          </div>
          <button
            className="toggle-sidebar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className={`fas fa-chevron-${isSidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            <div className="avatar-container">
              <i className="fas fa-user-shield"></i>
              <div className="status-indicator online"></div>
            </div>
          </div>
          {isSidebarOpen && (
            <div className="user-details">
              <h3>{user.nom} {user.prénom}</h3>
              <p className="user-email">{user.email}</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <div className="nav-icon">
                <i className={item.icon}></i>
              </div>
              {isSidebarOpen && (
                <div className="nav-content">
                  <span className="nav-title">{item.title}</span>
                  <i className="fas fa-chevron-right nav-arrow"></i>
                </div>
              )}
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
            <p>Bienvenue dans votre espace d'administration</p>
          </div>

          <div className="header-right">
            <div className="header-actions">
              <div className="user-menu">
                
                <div className="user-info-small">
                  <button className="profile-btn" onClick={handleProfileClick}>
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
                  </button>
                </div>
              </div>
            </div>
          </div>


          
        </header>

        <div className="content-wrapper">
          <div className="content-area">
            {ActiveComponent}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Tableau de Bord
function DashboardOverview({ stats, activities, user,   handleProfileClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  if (!stats) {
    return <p>Chargement des statistiques...</p>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = activities ? activities.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = activities ? Math.ceil(activities.length / itemsPerPage) : 0;

  const statsList = [
    { title: "Utilisateurs", value: stats.utilisateurs || 0, icon: "fas fa-users", color: "#3B82F6" },
    { title: "Annonces", value: stats.annonces || 0, icon: "fas fa-newspaper", color: "#10B981" },
    { title: "Offres Actives", value: stats.offres || 0, icon: "fas fa-tags", color: "#EF4444" },
  ];

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

  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        {statsList.map((stat, index) => (
          <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-icon" style={{
              backgroundColor: `${stat.color}20`,
              border: `2px solid ${stat.color}30`
            }}>
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

        {!activities || activities.length === 0 ? (
          <p>Aucune activité récente.</p>
        ) : (
          <div className="activity-list">
            {currentActivities.map((act, index) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant Gestion des Annonces
function GestionAnnonces({ annonces, handleStatusChange, handleDeleteAnn, loading, onRefresh }) {
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    status: "all"
  });
  const [filteredAnnonces, setFilteredAnnonces] = useState([]);

  useEffect(() => {
    if (!annonces) return;

    const filtered = annonces.filter(annonce => {
      const matchesSearch = filters.search === '' ||
        annonce.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
        annonce.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        annonce.nomUtilisateur?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesMinPrice = filters.minPrice === '' ||
        (annonce.prix && annonce.prix >= parseFloat(filters.minPrice));

      const matchesMaxPrice = filters.maxPrice === '' ||
        (annonce.prix && annonce.prix <= parseFloat(filters.maxPrice));

      const matchesStatus = filters.status === 'all' ||
        getStatusText(annonce.statu).toLowerCase() === filters.status;

      return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStatus;
    });

    setFilteredAnnonces(filtered);
  }, [annonces, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      status: "all"
    });
  };

  const hasActiveFilters = filters.search || filters.minPrice || filters.maxPrice || filters.status !== "all";
  const displayedAnnonces = hasActiveFilters ? filteredAnnonces : annonces;

  const calculateStats = () => {
    if (!annonces || annonces.length === 0) {
      return { total: 0, active: 0, inactive: 0, users: 0 };
    }

    let active = 0;
    let inactive = 0;

    annonces.forEach((annonce) => {
      const statu = annonce.statu ? String(annonce.statu).toLowerCase().trim() : 'inactive';

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

    return { total, active, inactive, users };
  };

  const stats = calculateStats();

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
      
        </div>
        <div className="gestion-annonces-loading">
          <div className="gestion-annonces-spinner"></div>
          <p>Chargement des annonces...</p>
          <p>Veuillez patienter pendant que nous récupérons les données.</p>
        </div>
      </div>
    );
  }

  if (!annonces || annonces.length === 0) {
    return (
      <div className="gestion-annonces-container">
        <div className="gestion-annonces-empty">
          <div className="gestion-annonces-empty-icon">📰</div>
          <h3>Aucune annonce trouvée</h3>
          <p>Aucune annonce n'est actuellement enregistrée dans le système.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-annonces-container">
      {/* En-tête */}
      <div className="gestion-annonces-header">
   
        <button onClick={onRefresh} className="btn-refresh">
          <i className="fas fa-sync-alt"></i>
          Actualiser
        </button>
      </div>

      {/* Section de recherche et filtres */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>
            <i className="fas fa-search"></i>
            Rechercher des annonces
          </h3>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-clear-filters">
              <i className="fas fa-times"></i>
              Effacer les filtres
            </button>
          )}
        </div>

        <div className="filters-grid">
          {/* Recherche par texte */}
          <div className="filter-group">
            <label htmlFor="search" className="filter-label">
              <i className="fas fa-search"></i>
              Recherche
            </label>
            <input
              id="search"
              type="text"
              placeholder="Rechercher par titre, description ou utilisateur..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Filtre prix minimum */}
          <div className="filter-group">
            <label htmlFor="minPrice" className="filter-label">
              <i className="fas fa-dollar-sign"></i>
              Prix minimum
            </label>
            <input
              id="minPrice"
              type="number"
              placeholder="Prix min..."
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>

          {/* Filtre prix maximum */}
          <div className="filter-group">
            <label htmlFor="maxPrice" className="filter-label">
              <i className="fas fa-dollar-sign"></i>
              Prix maximum
            </label>
            <input
              id="maxPrice"
              type="number"
              placeholder="Prix max..."
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>

          {/* Filtre statut */}
          <div className="filter-group">
            <label htmlFor="status" className="filter-label">
              <i className="fas fa-filter"></i>
              Statut
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actives seulement</option>
              <option value="inactive">Inactives seulement</option>
            </select>
          </div>
        </div>

        {/* Résultats du filtrage */}
        {hasActiveFilters && (
          <div className="filter-results">
            <div className="results-info">
              <span className="results-count">
                {filteredAnnonces.length} annonce(s) trouvée(s)
              </span>
              {filteredAnnonces.length === 0 && (
                <span className="no-results">
                  Aucune annonce ne correspond aux critères de recherche
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cartes de statistiques */}
      <div className="gestion-annonces-stats">
        <div className="stat-card-annonces total">
          <div className="stat-icon">
            <i className="fas fa-newspaper"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-annonces">{stats.total}</div>
            <div className="stat-label-annonces">Total des annonces</div>
          </div>
        </div>
        <div className="stat-card-annonces active">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-annonces">{stats.active}</div>
            <div className="stat-label-annonces">Annonces actives</div>
          </div>
        </div>
        <div className="stat-card-annonces inactive">
          <div className="stat-icon">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-annonces">{stats.inactive}</div>
            <div className="stat-label-annonces">Annonces inactives</div>
          </div>
        </div>
        <div className="stat-card-annonces users">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-annonces">{stats.users}</div>
            <div className="stat-label-annonces">Utilisateurs</div>
          </div>
        </div>
      </div>

      {/* Section des annonces */}
      <div className="annonces-section">
        <div className="section-header">
          <h3>
            <i className="fas fa-list"></i>
            Liste des annonces ({annonces.length})
          </h3>
          {hasActiveFilters && (
            <span className="filtered-count">
              {filteredAnnonces.length} résultat(s) filtré(s)
            </span>
          )}
        </div>

        {/* Tableau des annonces */}
        <div className="gestion-annonces-table-container">
          <table className="table-annonces">
            <thead>
              <tr>
                <th>
                  <i className="fas fa-image"></i>
                  Image
                </th>
                <th>
                  <i className="fas fa-heading"></i>
                  Titre
                </th>
                <th>
                  <i className="fas fa-align-left"></i>
                  Description
                </th>
                <th>
                  <i className="fas fa-tag"></i>
                  Prix
                </th>
                <th>
                  <i className="fas fa-circle"></i>
                  Statut
                </th>
                <th>
                  <i className="fas fa-user"></i>
                  Utilisateur
                </th>
                <th>
                  <i className="fas fa-cog"></i>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedAnnonces.map((annonce) => (
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
                        <i className="fas fa-camera"></i>
                      </div>
                    )}
                  </td>

                  <td className="annonce-titre">{annonce.titre}</td>
                  <td>
                    <div className="description-truncate" title={annonce.description}>
                      {annonce.description}
                    </div>
                  </td>
                  <td className="annonce-prix">
                    <strong>{annonce.prix} DT</strong>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(annonce.statu)}>
                      <span className="status-icon">{getStatusIcon(annonce.statu)}</span>
                      {getStatusText(annonce.statu)}
                    </span>
                  </td>
                  <td className="annonce-utilisateur">{annonce.nomUtilisateur || "Inconnu"}</td>

                  <td>
                    <div className="actions-container">
                      <select
                        className="status-select"
                        value={getStatusText(annonce.statu).toLowerCase()}
                        onChange={(e) => {
                          handleStatusChange(annonce.idAnnonce, e.target.value);
                        }}
                      >
                        <option value="active">🟢 Active</option>
                        <option value="inactive">🔴 Inactive</option>
                      </select>

                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteAnn(annonce.idAnnonce)}
                        title="Supprimer l'annonce"
                      >
                        <i className="fas fa-trash"></i>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucun résultat après filtrage */}
        {hasActiveFilters && filteredAnnonces.length === 0 && (
          <div className="no-filter-results">
            <div className="no-results-icon">
              <i className="fas fa-search"></i>
            </div>
            <h4>Aucun résultat trouvé</h4>
            <p>Essayez de modifier vos critères de recherche</p>
            <button onClick={clearFilters} className="btn-primary">
              Afficher toutes les annonces
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// Composant Gestion des Utilisateurs
function GestionUtilisateurs({ utilisateurs, handleRoleChange, userStats, getRoleBadgeClass, loading }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Valeurs par défaut pour éviter les erreurs
  const stats = userStats || {
    total: 0,
    admin: 0,
    client: 0,
    agence: 0,
    proprietaire: 0
  };

  // Filtrer les utilisateurs selon la recherche
  const filteredUsers = utilisateurs?.filter(user => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.nom?.toLowerCase().includes(searchLower) ||
      user.prénom?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  }) || [];

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
{/* Barre de recherche */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="    Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <div className="search-results-info">
          {searchTerm && (
            <span>
              {filteredUsers.length} utilisateur(s) trouvé(s) sur {utilisateurs.length}
            </span>
          )}
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="gestion-utilisateurs-table-container">
        {filteredUsers.length === 0 ? (
          <div className="no-results-message">
            <i className="fas fa-search" style={{ fontSize: '48px', color: '#bdc3c7', marginBottom: '16px' }}></i>
            <h3 style={{ color: '#7f8c8d', marginBottom: '8px' }}>Aucun résultat trouvé</h3>
            <p style={{ color: '#95a5a6' }}>
              Aucun utilisateur ne correspond à "{searchTerm}"
            </p>
          </div>
        ) : (
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
              {filteredUsers.map((user) => (
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
        )}
      </div>
    </div>
  );
}
// Composant Offres d'Annonce
function GestionOffres({ handleEdit, handleDeleteOff, offre, goToAjouter }) {
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: ""
  });
  const [filteredOffres, setFilteredOffres] = useState([]);

  // Filtrer les offres
  useEffect(() => {
    const filtered = offre.filter(offreItem => {
      const matchesSearch = filters.search === '' ||
        offreItem.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
        offreItem.description?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesMinPrice = filters.minPrice === '' ||
        (offreItem.prix && offreItem.prix >= parseFloat(filters.minPrice));

      const matchesMaxPrice = filters.maxPrice === '' ||
        (offreItem.prix && offreItem.prix <= parseFloat(filters.maxPrice));

      return matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    setFilteredOffres(filtered);
  }, [offre, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: ""
    });
  };

  const hasActiveFilters = filters.search || filters.minPrice || filters.maxPrice;
  const displayedOffres = hasActiveFilters ? filteredOffres : offre;

  return (
    <div className="section-content">
      {/* En-tête avec bouton d'ajout */}
      <div className="offres-header">
        <h2>Gestion des Offres</h2>
        <button onClick={goToAjouter} className="btn-primary">
          <i className="fas fa-plus"></i>
          Ajouter une Offre
        </button>
      </div>

      {/* Section de recherche et filtres */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>
            <i className="fas fa-search"></i>
            Rechercher des offres
          </h3>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-clear-filters">
              <i className="fas fa-times"></i>
              Effacer les filtres
            </button>
          )}
        </div>

        <div className="filters-grid">
          {/* Recherche par texte */}
          <div className="filter-group">
            <label htmlFor="search" className="filter-label">
              <i className="fas fa-search"></i>
              Recherche
            </label>
            <input
              id="search"
              type="text"
              placeholder="Rechercher par titre ou description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Filtre prix minimum */}
          <div className="filter-group">
            <label htmlFor="minPrice" className="filter-label">
              <i className="fas fa-dollar-sign"></i>
              Prix minimum
            </label>
            <input
              id="minPrice"
              type="number"
              placeholder="Prix min..."
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>

          {/* Filtre prix maximum */}
          <div className="filter-group">
            <label htmlFor="maxPrice" className="filter-label">
              <i className="fas fa-dollar-sign"></i>
              Prix maximum
            </label>
            <input
              id="maxPrice"
              type="number"
              placeholder="Prix max..."
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>
        </div>

        {/* Résultats du filtrage */}
        {hasActiveFilters && (
          <div className="filter-results">
            <div className="results-info">
              <span className="results-count">
                {filteredOffres.length} offre(s) trouvée(s)
              </span>
              {filteredOffres.length === 0 && (
                <span className="no-results">
                  Aucune offre ne correspond aux critères de recherche
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section des offres */}
      <div className="offres-section">
        <div className="section-header">
          <h3>
            <i className="fas fa-tags"></i>
            Toutes les offres ({offre.length})
          </h3>
          {hasActiveFilters && (
            <span className="filtered-count">
              {filteredOffres.length} résultat(s) filtré(s)
            </span>
          )}
        </div>

        {offre.length === 0 ? (
          <div className="no-offres">
            <div className="no-offres-icon">
              <i className="fas fa-tags"></i>
            </div>
            <h3>Aucune offre disponible</h3>
            <p>Commencez par ajouter votre première offre</p>
            <button onClick={goToAjouter} className="btn-primary">
              <i className="fas fa-plus"></i>
              Ajouter une offre
            </button>
          </div>
        ) : (
          <>
            <div className="offres-grid">
              {displayedOffres.map((offreItem) => (
                <div key={offreItem.idOff} className="offre-card">
                  <div className="offre-header">
                    <h3>{offreItem.titre}</h3>
                    <span className="offre-price">{offreItem.prix} TND</span>
                  </div>

                  <div className="offre-description">
                    <p>{offreItem.description}</p>
                  </div>

                  <div className="offre-details">
                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <span>Durée: {offreItem.dureeOffre} mois</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Date fin: {offreItem.date_fin?.split("T")[0]}</span>
                    </div>
                  </div>

                  <div className="offre-actions">
                    <button
                      onClick={() => handleEdit(offreItem.idOff)}
                      className="btn-edit"
                    >
                      <i className="fas fa-edit"></i>
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteOff(offreItem.idOff)}
                      className="btn-delete"
                    >
                      <i className="fas fa-trash"></i>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Message si aucun résultat après filtrage */}
            {hasActiveFilters && filteredOffres.length === 0 && (
              <div className="no-filter-results">
                <div className="no-results-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h4>Aucun résultat trouvé</h4>
                <p>Essayez de modifier vos critères de recherche</p>
                <button onClick={clearFilters} className="btn-primary">
                  Afficher toutes les offres
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


function Parametres({ user }) {
  // Données utilisateur sécurisées
  const safeUser = user || {
    nom: "",
    prénom: "",
    email: "",
    téléphone: "",
    role: "Utilisateur"
  };

  const [activeTab, setActiveTab] = useState("annonces");
  const [formData, setFormData] = useState({
   

    // Notifications
    notifications: true,
    newsletter: false,

    // Apparence
    theme: "light",

    // Annonces
    annonceStatut: "active",
    region: "all",
    autoBoost: false,
    alertMessages: true,
    alertExpiration: true,
    weeklyStats: false,
    imageQuality: "high",
    layout: "grid",
    sortBy: "date",
    autoRenew: false,
    vacationMode: false,
    annonceLimit: 10
  });

  const [updateStatus, setUpdateStatus] = useState({ loading: false, success: false, error: null });

  // Stats simulées pour les annonces
  const [userStats] = useState({
    activeAnnonces: 12,
    totalViews: 2450,
    responseRate: "78%"
  });

  const tabs = [
    { id: "annonces", label: "Annonces", icon: "fas fa-newspaper" },
    { id: "Langage", label: "Langage", icon: "fas fa-shield-alt" },
    { id: "apparence", label: "Apparence", icon: "fas fa-palette" }
  ];

  // Mettre à jour formData quand user change
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nom: user.nom || "",
        prénom: user.prénom || "",
        email: user.email || "",
        telephone: user.telephone || "",
        motDePasse: user.motDePasse || "",
      }));
    }
  }, [user]);

  const handleSave = async () => {
    setUpdateStatus({ loading: true, success: false, error: null });

   
  };

  return (
    <div className="parametres-container">

      <div className="header-content">

        <p>Personnalisez votre expérience selon vos préférences</p>
      </div>
      <div className="parametres-content">
        {/* Navigation verticale moderne */}
        <div className="parametres-nav">
          <div className="nav-header">
            <i className="fas fa-sliders-h"></i>
            <span>Catégories</span>
          </div>
          <div className="nav-items">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="nav-icon">
                  <i className={tab.icon}></i>
                </div>
                <span className="nav-label">{tab.label}</span>
                <div className="nav-indicator"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="parametres-main">
          <div className="content-card">

           
            {/* Section Annonces */}
            {activeTab === "annonces" && (
              <div className="settings-section">
                
              </div>
            )}
            {/* Section Annonces */}
            {activeTab === "Langage" && (
              <div className="settings-section">
               <h1>Langage hahaha</h1>
              </div>
            )}

            

            
            {/* Section Apparence */}
            {activeTab === "apparence" && (
              <div className="settings-section">
                <div className="section-header">
                  <div className="header-icon theme">
                    <i className="fas fa-palette"></i>
                  </div>
                  <div>
                    <h2>Apparence</h2>
                    <p>Personnalisez l'apparence de votre interface</p>
                  </div>
                </div>

                <div className="theme-selector">
                  <div className="theme-options">
                    <div
                      className={`theme-card ${formData.theme === "light" ? "active" : ""}`}
                      onClick={() => setFormData({ ...formData, theme: "light" })}
                    >
                      <div className="theme-preview light-theme">
                        <div className="preview-header"></div>
                        <div className="preview-sidebar"></div>
                        <div className="preview-content"></div>
                      </div>
                      <div className="theme-info">
                        <i className="fas fa-sun"></i>
                        <span>Clair</span>
                      </div>
                    </div>

                    <div
                      className={`theme-card ${formData.theme === "dark" ? "active" : ""}`}
                      onClick={() => setFormData({ ...formData, theme: "dark" })}
                    >
                      <div className="theme-preview dark-theme">
                        <div className="preview-header"></div>
                        <div className="preview-sidebar"></div>
                        <div className="preview-content"></div>
                      </div>
                      <div className="theme-info">
                        <i className="fas fa-moon"></i>
                        <span>Sombre</span>
                      </div>
                    </div>

                    <div
                      className={`theme-card ${formData.theme === "auto" ? "active" : ""}`}
                      onClick={() => setFormData({ ...formData, theme: "auto" })}
                    >
                      <div className="theme-preview auto-theme">
                        <div className="preview-header"></div>
                        <div className="preview-sidebar"></div>
                        <div className="preview-content"></div>
                      </div>
                      <div className="theme-info">
                        <i className="fas fa-adjust"></i>
                        <span>Auto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;