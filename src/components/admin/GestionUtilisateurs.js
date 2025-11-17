// src/components/admin/GestionUtilisateurs.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import LoadingSpinner from "./common/LoadingSpinner";
import "./Utilisateur.css";

const GestionUtilisateurs = ({ utilisateurs, loading, onRoleChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Calcul des statistiques
  const calculateUserStats = () => {
    if (!utilisateurs || !Array.isArray(utilisateurs)) {
      return { total: 0, admin: 0, client: 0, agence: 0, proprietaire: 0 };
    }

    return {
      total: utilisateurs.length,
      admin: utilisateurs.filter(u => u.role === "admin").length,
      client: utilisateurs.filter(u => u.role === "client").length,
      agence: utilisateurs.filter(u => u.role === "agence").length,
      proprietaire: utilisateurs.filter(u => u.role === "proprietaire").length,
    };
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "role-badge role-admin";
      case "client":
        return "role-badge role-client";
      case "agence":
        return "role-badge role-agence";
      case "proprietaire":
        return "role-badge role-proprietaire";
      default:
        return "role-badge";
    }
  };

  // Filtrage des utilisateurs
  const filteredUsers = utilisateurs?.filter(user => {
    if (!searchTerm.trim()) return true;
    const lower = searchTerm.toLowerCase();
    return (
      (user.nom?.toLowerCase().includes(lower)) ||
      (user.prénom?.toLowerCase().includes(lower)) ||
      (user.email?.toLowerCase().includes(lower))
    );
  }) || [];

  const stats = calculateUserStats();

  if (loading) {
    return <LoadingSpinner message="Chargement des utilisateurs..." />;
  }

  if (!utilisateurs || utilisateurs.length === 0) {
    return (
      <div className="gestion-utilisateurs-container">
        <div className="gestion-utilisateurs-empty">
          <div className="gestion-utilisateurs-empty-icon">👥</div>
          <h3>Aucun utilisateur trouvé</h3>
          <p>Aucun utilisateur n'est actuellement enregistré dans le système.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-utilisateurs-container">
      {/* Statistiques */}
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
        <div className="stat-card total">
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
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="gestion-utilisateurs-table-container">
        {filteredUsers.length === 0 ? (
          <div className="no-results-message">
            <i className="fas fa-search"></i>
            <h3>Aucun résultat trouvé</h3>
            <p>Aucun utilisateur ne correspond à "{searchTerm}"</p>
          </div>
        ) : (
          <table className="gestion-utilisateurs-table">
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
                    <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={async (e) => {
                        const newRole = e.target.value;
                        await onRoleChange(user.userId, newRole);
                      }}
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
};

export default GestionUtilisateurs;
