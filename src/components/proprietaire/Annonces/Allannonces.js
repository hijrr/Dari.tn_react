import React, { useState, useEffect } from "react";
import { EnvironmentOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../Dashbord/Dashboard.css";
const Allannonces= () => {
  const [annonces, setAnnonces] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/getAnnonces")
      .then((response) => response.json())
      .then((data) => setAnnonces(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des annonces :", error)
      );
  }, []);
  // Animation au survol de la carte
  const handleAnnonceHover = (e) => {
    e.currentTarget.style.transform = "translateY(-6px)";
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.12)";
    e.currentTarget.style.borderColor = "var(--color-border-light)";
  };

  const handleAnnonceLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.04)";
    e.currentTarget.style.borderColor = "var(--color-background-hover)";
  };

  // Animation sur les boutons
  const handleButtonHover = (color) => (e) => {
    e.target.style.backgroundColor = color;
    e.target.style.color = "#fff";
    e.target.style.borderColor = color;
  };

  const handleButtonLeave = (color) => (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = color;
    e.target.style.borderColor = "var(--color-border-light)";
  };

  return (
  
    <div className="section-container1">
     <nav class="navbar bg-body-tertiary">
 <nav className="navbar bg-body-tertiary">

</nav>

</nav>
       <div className="container-fluid d-flex align-items-center" style={{ height: "60px" }}>
 <form className="d-flex mx-auto" role="search">
  <input 
    className="form-control me-2" 
    type="search" 
    placeholder="Rechercher une annonce" 
    aria-label="Search" 
    style={{width: "500px", maxWidth: "350px"}}
  />
  <button className="btn btn-outline-success d-flex align-items-center" type="submit">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search me-1" viewBox="0 0 16 16">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
    Search
  </button>
</form>
  </div>
      <div className="annonces-grid">
        {annonces.map((annonce) => (
          <div
            key={annonce.idAnnonce}
            className="annonce-card"
            onMouseEnter={handleAnnonceHover}
            onMouseLeave={handleAnnonceLeave}
          >
            <div className="annonce-image">
              {annonce.image ? (
                <img
                  src={annonce.image} // Base64 directement
                  alt={annonce.titre}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                  }}
                >
                  Image non disponible
                </div>
              )}

              <div
                className="annonce-status"
                style={{
                  color: annonce.statu === "ACTIVE" ? "var(--color-accent-green)" : "var(--color-accent-orange)",
                  backgroundColor: annonce.statu === "ACTIVE" ? "var(--color-accent-green)15" : "var(--color-accent-orange)15",
                  border: `1px solid ${annonce.statu === "ACTIVE" ? "var(--color-accent-green)30" : "var(--color-accent-orange)30"}`,
                }}
              >
                {annonce.statu}
              </div>
            </div>

            <div className="annonce-content">
              <div style={{ marginBottom: "10px" }}>
                <div className="annonce-title">{annonce.titre}</div>
                <div className="annonce-location">
                  <EnvironmentOutlined /> {annonce.localisation}
                </div>
              </div>

              {annonce.description && (
                <p className="annonce-description">
                  {annonce.description.length > 100
                    ? `${annonce.description.substring(0, 100)}...`
                    : annonce.description}
                </p>
              )}

              <div className="annonce-price-rating">
                <div className="annonce-price">
                  {annonce.prix} TND /jour
                </div>
              </div>

              <div className="annonce-actions">
                <button
                  className="action-button"
                  style={{ color: "var(--color-accent-orange)" }}
                  onMouseEnter={handleButtonHover("var(--color-accent-orange)")}
                  onMouseLeave={handleButtonLeave("var(--color-accent-orange)")}
                >
                  <EditOutlined /> Modifier
                </button>

                <button
                  className="action-button"
                  style={{ color: "var(--color-accent-red)" }}
                  onMouseEnter={handleButtonHover("var(--color-accent-red)")}
                  onMouseLeave={handleButtonLeave("var(--color-accent-red)")}
                >
                  <DeleteOutlined /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Allannonces;
