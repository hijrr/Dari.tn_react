import React, { useState } from "react";

function AjouterAnnonce() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [image, setImage] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [statu, setStatu] = useState("ACTIVE");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/annonces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, description, prix, image, localisation, statu, userId })
      });

      const data = await response.json();
      setMessage(data.message || "Erreur !");
      setTitre(""); setDescription(""); setPrix(""); setImage(""); setLocalisation(""); setStatu("ACTIVE"); setUserId("");
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur !");
    }
  };

  return (
    <div>
      <h2>Ajouter une annonce</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre :</label>
          <input type="text" value={titre} onChange={e => setTitre(e.target.value)} required />
        </div>
        <div>
          <label>Description :</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Prix :</label>
          <input type="number" step="0.01" value={prix} onChange={e => setPrix(e.target.value)} />
        </div>
        <div>
          <label>Image URL :</label>
          <input type="text" value={image} onChange={e => setImage(e.target.value)} />
        </div>
        <div>
          <label>Localisation :</label>
          <input type="text" value={localisation} onChange={e => setLocalisation(e.target.value)} />
        </div>
        <div>
          <label>Statut :</label>
          <select value={statu} onChange={e => setStatu(e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <div>
          <label>User ID :</label>
          <input type="number" value={userId} onChange={e => setUserId(e.target.value)} required />
        </div>
        <button type="submit">Ajouter</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AjouterAnnonce;
