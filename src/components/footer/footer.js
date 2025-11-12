import React from "react";
import './footer.css'
const footer = () => {
  return (
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Dari.Tunisie</h3>
              <p>Votre plateforme de confiance pour trouver le logement parfait</p>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: contact@dariTN.com</p>
              <p>Tél: +216 12 345 678</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Location Tunisie. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
  )
};
      export default footer;