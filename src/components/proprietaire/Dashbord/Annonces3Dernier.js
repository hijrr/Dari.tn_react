import React, { useState, useEffect } from "react";
import { EnvironmentOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../Dashbord/Dashboard.css";

const Annonces3Dernier = () => {
  const [annonces, setAnnonces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/get/3dernierAnnonces")
      .then((response) => response.json())
      .then((data) => {
        const annoncesAvecImagesCorrigees = data.map(annonce => ({
          ...annonce,
          image: corrigerUrlImage(annonce.image)
        }));
        setAnnonces(annoncesAvecImagesCorrigees);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des annonces :", error)
      );
  }, []);

  // Fonction pour corriger les URLs d'images
  const corrigerUrlImage = (urlImage) => {
    if (!urlImage) return null;
    
    if (urlImage.startsWith('http')) {
      return urlImage;
    }
    
    if (urlImage.startsWith('/uploadsAnnonce')) {
      return `http://localhost:5000${urlImage}`;
    }
    
    if (urlImage.startsWith('uploadsAnnonce')) {
      return `http://localhost:5000/${urlImage}`;
    }
    
    if (!urlImage.includes('/')) {
      return `http://localhost:5000/uploadsAnnonce/${urlImage}`;
    }
    
    return urlImage;
  };

  // Fonction pour gérer la modification
  const handleModifierClick = (annonceId) => {
    console.log('Redirection vers modification annonce ID:', annonceId);
    navigate(`/modifier-annonce/${annonceId}`);
  };

  // Fonction pour gérer la suppression
  const handleSupprimerClick = (annonceId, annonceTitre) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Voulez-vous vraiment supprimer l'annonce "${annonceTitre}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        supprimerAnnonce(annonceId);
      }
    });
  };

  const supprimerAnnonce = async (annonceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/annonces/${annonceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Supprimé!',
          text: 'L\'annonce a été supprimée avec succès.',
          confirmButtonColor: '#000',
          timer: 3000
        });
        
        // Recharger la liste des annonces
        fetchAnnonces();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors de la suppression de l\'annonce',
        confirmButtonColor: '#000'
      });
    }
  };

  const fetchAnnonces = () => {
    fetch("http://localhost:5000/get/3dernierAnnonces")
      .then((response) => response.json())
      .then((data) => {
        const annoncesAvecImagesCorrigees = data.map(annonce => ({
          ...annonce,
          image: corrigerUrlImage(annonce.image)
        }));
        setAnnonces(annoncesAvecImagesCorrigees);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des annonces :", error)
      );
  };

  // Animation au survol de la carte
  const handleAnnonceHover = (e) => {
    e.currentTarget.style.transform = "translateY(-6px)";
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.12)";
    e.currentTarget.style.borderColor = "var(--color-border-light)";
  };

  const handleAnnonceLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
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

  // Gestion des erreurs de chargement d'image
  const handleImageError = (e) => {
    console.log("Erreur de chargement de l'image:", e.target.src);
    e.target.style.display = "none";
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%;
      height: 200px;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: #666;
      font-size: 14px;
    `;
    placeholder.textContent = 'Image non disponible';
    e.target.parentNode.appendChild(placeholder);
  };

  return (
    <div className="section-container1">
      <nav className="navbar bg-body-tertiary">
        <nav className="navbar bg-body-tertiary">
        </nav>
      </nav>
      
      {/* Titre ajouté */}
      <div className="section-header">
        <h2 className="section-title">
       
          3 Dernières Annonces
        </h2>
        <p className="section-subtitle">
          Vos annonces les plus récentes
        </p>
      </div>
    
      <div className="annonces-grid">
        {annonces.length === 0 ? (
          <div className="no-annonces">
            <p>Aucune annonce récente</p>
          </div>
        ) : (
          annonces.map((annonce) => (
            <div
              key={annonce.idAnnonce}
              className="annonce-card"
              onMouseEnter={handleAnnonceHover}
              onMouseLeave={handleAnnonceLeave}
            >
              <div className="annonce-image">
                {annonce.image ? (
                  <img
                    src={annonce.image}
                    alt={annonce.titre}
                    onError={handleImageError}
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
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    Aucune image
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
                    onClick={() => handleModifierClick(annonce.idAnnonce)}
                  >
                    <EditOutlined /> Modifier
                  </button>

                  <button
                    className="action-button"
                    style={{ color: "var(--color-accent-red)" }}
                    onMouseEnter={handleButtonHover("var(--color-accent-red)")}
                    onMouseLeave={handleButtonLeave("var(--color-accent-red)")}
                    onClick={() => handleSupprimerClick(annonce.idAnnonce, annonce.titre)}
                  >
                    <DeleteOutlined /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Annonces3Dernier;