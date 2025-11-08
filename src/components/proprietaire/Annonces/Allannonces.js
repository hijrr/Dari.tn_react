import React, { useState, useEffect } from "react";
import { EnvironmentOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../Dashbord/Dashboard.css";
const Allannonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnonces();
  }, []);
  const handleModifierClick1 = (annonceId) => {
    console.log('Redirection vers modification annonce ID:', annonceId);
    navigate(`/modifier-annonce/${annonceId}`);
  };

  const fetchAnnonces = () => {
    fetch(`http://localhost:5000/getAnnonces`)
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

  // CORRECTION : Fonction pour corriger les URLs d'images
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

  // FONCTION MODIFIER : Redirection vers la page de modification
  const handleModifierClick = (annonceId) => {
    navigate(`/modifier-annonce/${annonceId}`);
  };

  // FONCTION SUPPRIMER : Suppression d'une annonce
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
                {/* BOUTON MODIFIER - CORRIGÉ */}
              
  <button
    className="action-button"
    style={{ color: "var(--color-accent-orange)" }}
    onMouseEnter={handleButtonHover("var(--color-accent-orange)")}
    onMouseLeave={handleButtonLeave("var(--color-accent-orange)")}
    onClick={() => handleModifierClick(annonce.idAnnonce)}
  >
    <EditOutlined /> Modifier
  </button>

                {/* BOUTON SUPPRIMER - CORRIGÉ */}
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
        ))}
      </div>
    </div>
  );
};

export default Allannonces;