import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/clients")
      .then(res => setClients(res.data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Liste des clients</h1>
      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
      <ul>
        {clients.map(client => (
          <li key={client.id}>{client.nom} - {client.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
