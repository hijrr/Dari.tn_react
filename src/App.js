//import React from "react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Register from './components/connexion/register';
import Login from './components/connexion/Login';
import DashboardAdmin from './components/admin/adminDashbord';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageDashbordPrincipal from'./components/proprietaire/Dashbord/PageDashbordPrincipal';
import Accueil from './components/pageAccueil';
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
      {/* <Accueil />

   

    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />

        <Route path="/dashboard-client" element={<DashboardClient />} />
        <Route path="/dashboard-agence" element={<DashboardAgence />} />
        <Route path="/dashboard-proprietaire" element={<DashboardProprietaire />} /> 
      </Routes>
    </Router>*/}
   <PageDashbordPrincipal/>
     </div>
  );
}

export default App;
