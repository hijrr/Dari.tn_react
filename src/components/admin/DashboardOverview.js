// src/components/admin/DashboardOverview.jsx
import React, { useState } from "react";
import LoadingSpinner from "./common/LoadingSpinner";

const DashboardOverview = ({ stats, activities, user, loading, handleProfileClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (loading) {
    return <LoadingSpinner message="Chargement du tableau de bord..." />;
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
      case "annonce": return "fas fa-newspaper";
      case "offre": return "fas fa-tags";
      case "paiement": return "fas fa-dollar-sign";
      default: return "fas fa-info-circle";
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
};

export default DashboardOverview;