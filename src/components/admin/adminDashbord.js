// DashboardAdmin.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardOverview from "./DashboardOverview";
import GestionAnnonces from "./GestionAnnonces";
import GestionUtilisateurs from "./GestionUtilisateurs";
import GestionOffres from "./GestionOffres";
import "./DashboardAdmin.css";
import "./AjouterOffres .css";
import "./Utilisateur.css";
import "./Annonce.css";
import axios from "axios";

function DashboardAdmin() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Données
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [offres, setOffres] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);

  // États de chargement
  const [loading, setLoading] = useState({
    dashboard: true,
    annonces: false,
    offres: false,
    utilisateurs: false
  });

  const navigate = useNavigate();

  // Vérifier l'utilisateur
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else navigate("/");
  }, [navigate]);

  // Charger les annonces
  const fetchAnnonces = useCallback(async () => {
    setLoading(prev => ({ ...prev, annonces: true }));
    try {
      const res = await axios.get("http://localhost:5000/GAnnonces");
      setAnnonces(res.data);
    } catch (err) {
      console.error("Erreur annonces :", err);
    } finally {
      setLoading(prev => ({ ...prev, annonces: false }));
    }
  }, []);

  // Charger les autres sections
  const fetchOffres = useCallback(async () => {
    setLoading(prev => ({ ...prev, offres: true }));
    try {
      const res = await axios.get("http://localhost:5000/api/offres");
      setOffres(res.data);
    } catch (err) {
      console.error("Erreur offres :", err);
    } finally {
      setLoading(prev => ({ ...prev, offres: false }));
    }
  }, []);

  const fetchUtilisateurs = useCallback(async () => {
    setLoading(prev => ({ ...prev, utilisateurs: true }));
    try {
      const res = await axios.get("http://localhost:5000/api/utilisateurs");
      setUtilisateurs(res.data);
    } catch (err) {
      console.error("Erreur utilisateurs :", err);
    } finally {
      setLoading(prev => ({ ...prev, utilisateurs: false }));
    }
  }, []);

  // Dashboard
  const fetchDashboardData = useCallback(async () => {
    setLoading(prev => ({ ...prev, dashboard: true }));
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        fetch("http://localhost:5000/api/stats").then(r => r.json()),
        fetch("http://localhost:5000/api/activities").then(r => r.json())
      ]);
      setStats(statsRes);
      setActivities(activitiesRes);
    } catch (err) {
      console.error("Erreur dashboard :", err);
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
    await fetchAnnonces();
  }, [fetchAnnonces]);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user, fetchDashboardData]);

  useEffect(() => {
    switch (activeSection) {
      case "annonces": fetchAnnonces(); break;
      case "offres": fetchOffres(); break;
      case "utilisateurs": fetchUtilisateurs(); break;
      default: break;
    }
  }, [activeSection, fetchAnnonces, fetchOffres, fetchUtilisateurs]);

  const handleProfileClick = () => navigate("/edit-profile-Admin");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/utilisateurs/${userId}/role`,
        { role: newRole },
        { headers: { "Content-Type": "application/json" } }
      );
      Swal.fire("Succès", res.data.message, "success");
      fetchUtilisateurs();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Impossible de mettre à jour le rôle";
      Swal.fire("Erreur", errorMsg, "error");
    }
  };

  const handleAnnonceStatusChange = async (idAnnonce, nouveauStatut) => {
    try {
      setAnnonces(prev => prev.map(a =>
        a.idAnnonce === idAnnonce ? { ...a, statu: nouveauStatut } : a
      ));
      await axios.put(`http://localhost:5000/annonces/${idAnnonce}`, { statu: nouveauStatut });
      Swal.fire("Succès", "Le statut a été mis à jour.", "success");
    } catch (err) {
      console.error("Erreur modification statut :", err);
      fetchAnnonces();
      Swal.fire("Erreur", "Impossible de mettre à jour le statut.", "error");
    }
  };

  const handleDeleteAnnonce = async (idAnnonce) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement l'annonce.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:5000/annoncesDelite/${idAnnonce}`);
        Swal.fire("Supprimée !", res.data.message || "Annonce supprimée.", "success");
        setAnnonces(prev => prev.filter(a => a.idAnnonce !== idAnnonce));
      } catch (err) {
        console.error("Erreur suppression :", err);
        const errorMsg = err.response?.data?.message || "Impossible de supprimer l'annonce.";
        Swal.fire("Erreur", errorMsg, "error");
      }
    }
  };

  
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
            "Impossible de supprimer cette offre avant la date fin.";

          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: message,
          });
        }
      }
    });
  };

  // Menu
  const menuItems = [
    {
      id: "dashboard",
      title: "Tableau de Bord",
      icon: "fas fa-chart-line",
      component: <DashboardOverview
        stats={stats}
        activities={activities}
        user={user}
        loading={loading.dashboard}
        handleProfileClick={handleProfileClick}
      />
    },
    {
      id: "annonces",
      title: "Gestion des Annonces",
      icon: "fas fa-newspaper",
      component: <GestionAnnonces
        annonces={annonces}
        loading={loading.annonces}
        onStatusChange={handleAnnonceStatusChange}
        onDelete={handleDeleteAnnonce}
        onRefresh={fetchAnnonces}
      />
    },
    {
      id: "utilisateurs",
      title: "Gestion des Utilisateurs",
      icon: "fas fa-users",
      component: <GestionUtilisateurs
        utilisateurs={utilisateurs}
        loading={loading.utilisateurs}
        onRoleChange={handleRoleChange}
      />
    },
    {
      id: "offres",
      title: "Offres d'Annonce",
      icon: "fas fa-tags",
      component: <GestionOffres
        offre={offres}
        loading={loading.offres}
        onEdit={handleEdit}
        onDelete={handleDeleteOff}
      />
    }
  ];

  const getActiveComponent = () => {
    const activeItem = menuItems.find(item => item.id === activeSection);
    return activeItem ? activeItem.component : null;
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        user={user}
        onLogout={handleLogout}
      />

      <div className="main-content">
        <Header
          activeSection={activeSection}
          user={user}
          onProfileClick={handleProfileClick}
        />

        <div className="content-wrapper">
          <div className="content-area">
            {getActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
