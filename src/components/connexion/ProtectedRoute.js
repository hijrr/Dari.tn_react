import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // pas connecté → vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // connecté mais mauvais rôle → redirection vers son dashboard
  if (roleRequired && user.role !== roleRequired) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/dashboard-admin" replace />;
      case "proprietaire":
        return <Navigate to="/dashboard-proprietaire" replace />;
      case "client":
        return <Navigate to="/dashboard-client" replace />;
      case "agence":
        return <Navigate to="/dashboard-agence" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // bon rôle → autorisé
  return children;
}

export default ProtectedRoute;
