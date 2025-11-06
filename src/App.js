import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
// 🔹 Composants
import Register from './components/connexion/register';
import Login from './components/connexion/Login';
import DashboardAdmin from './components/admin/adminDashbord';
import PageDashbordPrincipal from './components/proprietaire/Dashbord/PageDashbordPrincipal';
import Accueil from './components/pageAccueil';
import ProtectedRoute from "./components/connexion/ProtectedRoute"; 
import AjouterAnnonce from "./components/proprietaire/Annonces/AjouterAnnonce";
function App() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    axios.get("http://localhost:5000/clients")
      .then(res => setClients(res.data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* 🌍 Pages publiques */}
          <Route path="/" element={<Accueil />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* 🔒 Pages protégées selon rôle */}
          <Route
            path="/dashboard-admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard-proprietaire"
            element={
              <ProtectedRoute roleRequired="proprietaire">
                <PageDashbordPrincipal />
              </ProtectedRoute>
            }
          />

<Route
  path="/dashboard-proprietaire/ajouter-annonce"
  element={
    <ProtectedRoute roleRequired="proprietaire">
      <AjouterAnnonce />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard-proprietaire/offres"
  element={
    <ProtectedRoute roleRequired="proprietaire">
      <AjouterAnnonce />
    </ProtectedRoute>
  }
/>



          
          {/* 🔹 Exemple si tu ajoutes plus tard */}
          {/* 
          <Route
            path="/dashboard-client"
            element={
              <ProtectedRoute roleRequired="client">
                <DashboardClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-agence"
            element={
              <ProtectedRoute roleRequired="agence">
                <DashboardAgence />
              </ProtectedRoute>
            }
          />
          */}
        </Routes>
      </Router>
      
    </div>
  );
}
export default App;
