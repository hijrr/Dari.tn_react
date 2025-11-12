import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
// 🔹 Composants
import Register from './components/connexion/register';
import EditProfile from "./components/utilisateur/editProfile/editProfile";
import Profile from './components/utilisateur/profile/profile.js';
import Login from './components/connexion/Login';
import DashboardAdmin from './components/admin/adminDashbord';
import PageDashbordPrincipal from './components/proprietaire/Dashbord/PageDashbordPrincipal';
import Accueil from './components/pageAccueil';
import ProtectedRoute from "./components/connexion/ProtectedRoute"; 
import DetailAnnonce from"./components/utilisateur/detailAnnonce/DetailAnnonce";
import ListeAnnonces from"./components/utilisateur/listeAnnonces/listeAnnonces";
import AjouterAnnonce from "./components/proprietaire/Annonces/AjouterAnnonce";
import Gannonces from "./components/admin/GAnnonce"; 
import Goffres from "./components/admin/GOffre"; 
import GUser from "./components/admin/GUser"; 
import ModifierAnnonce from"./components/proprietaire/Annonces/ModifierAnnonce.js";

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
 <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/" element={<Accueil />} />
           <Route path="/annonce/:id" element={<DetailAnnonce/>} />
          <Route path="/filter" element={<ListeAnnonces/>} />
          <Route path="/register" element={<Register />} />
           <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
           <Route path="/Gannonces" element={<Gannonces />} />
          <Route path="/Goffres" element={<Goffres />} />
          <Route path="/GUser" element={<GUser />} />
          

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
  path="/dashboard-proprietaire/contactAgence"
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


<Route
            path="/dashboard-client"
            element={
              <ProtectedRoute roleRequired="client">
                <Accueil />
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
          <Route path="/modifier-annonce/:id" element={<ModifierAnnonce />} />
        </Routes>
      </Router>
      
    </div>
  );
}
export default App;
