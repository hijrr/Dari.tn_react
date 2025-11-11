import React, { useState } from 'react';
import './AgenceCard.css';

const AgenceCard = ({ agence }) => {
  // Vérification et valeurs par défaut pour l'agence
  const agenceData = agence || {
    userId: 0,
    nom: "Agence",
    prénom: "Non",
    email: "email@exemple.com",
    telephone: "00000000",
    dateInscri: new Date().toISOString(),
    role: "agence",
    profileImage: null
  };

  const [showContactForm, setShowContactForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageStatus, setMessageStatus] = useState('');
  const [contactInfo, setContactInfo] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: ''
  });

  // Fonction pour contacter par email direct
  const handleEmailContact = () => {
    const subject = "Demande d'information - Site Immobilier";
    const body = `Bonjour ${agenceData.prénom},\n\nJe souhaiterais obtenir plus d'informations sur vos services immobiliers.\n\nCordialement`;
    window.location.href = `mailto:${agenceData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Fonction pour envoyer le message via le formulaire
  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessageStatus('');

    try {
      const response = await fetch(`http://localhost:5000/api/agences/${agenceData.userId}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: contactInfo.nom,
          email: contactInfo.email,
          telephone: contactInfo.telephone,
          message: contactInfo.message
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessageStatus('success');
        setContactInfo({ nom: '', email: '', telephone: '', message: '' });
        setTimeout(() => {
          setShowContactForm(false);
          setMessageStatus('');
        }, 2000);
      } else {
        setMessageStatus('error');
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      setMessageStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'UTC'
      };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (error) {
      return "Date inconnue";
    }
  };

  // Générer les initiales pour l'avatar
  const getInitials = () => {
    if (!agenceData.prénom || !agenceData.nom) return "AG";
    return `${agenceData.prénom.charAt(0)}${agenceData.nom.charAt(0)}`.toUpperCase();
  };

  // Vérifier si l'image de profil existe
  const hasProfileImage = agenceData.profileImage && agenceData.profileImage !== 'null' && agenceData.profileImage !== '';

  // Si l'agence est undefined, afficher un message d'erreur
  if (!agence) {
    return (
      <div className="agence-card error">
        <div className="error-message">
          <h3>❌ Agence non disponible</h3>
          <p>Les informations de l'agence n'ont pas pu être chargées.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agence-card">
      {/* En-tête de la carte */}
      <div className="agence-header">
        <div className="agence-avatar">
          {hasProfileImage ? (
            <img 
              src={`http://localhost:5000${agenceData.profileImage}`}
              alt={`${agenceData.prénom} ${agenceData.nom}`}
              className="profile-image"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextSibling;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`avatar-fallback ${hasProfileImage ? 'hidden' : ''}`}>
            {getInitials()}
          </div>
          <div className="online-indicator"></div>
        </div>

        <div className="agence-info">
          <h2 className="agence-name">
            {agenceData.prénom} {agenceData.nom}
            <span className="verified-badge">✓</span>
          </h2>
          <p className="agence-role">Agence Immobilière</p>
          <div className="agence-meta">
            <span className="member-since">
              📅 Membre depuis {formatDate(agenceData.dateInscri)}
            </span>
            <span className="rating">
              ⭐ 4.8/5
            </span>
          </div>
        </div>
      </div>

      {/* Informations de contact */}
      <div className="contact-section">
        <div className="contact-item">
          <div className="contact-icon">📧</div>
          <div className="contact-details">
            <span className="contact-label">Email professionnel</span>
            <a href={`mailto:${agenceData.email}`} className="contact-value">
              {agenceData.email}
            </a>
          </div>
        </div>

        <div className="contact-item">
          <div className="contact-icon">📞</div>
          <div className="contact-details">
            <span className="contact-label">Téléphone</span>
            <a href={`tel:${agenceData.telephone}`} className="contact-value">
              {agenceData.telephone}
            </a>
          </div>
        </div>

        <div className="contact-item">
          <div className="contact-icon">🕒</div>
          <div className="contact-details">
            <span className="contact-label">Disponibilité</span>
            <span className="contact-value">Lun - Ven: 9h - 18h</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="action-buttons">
        <button 
          className="btn btn-primary"
          onClick={handleEmailContact}
          disabled={loading}
        >
          <span className="btn-icon">📧</span>
          Contacter par Email
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={() => setShowContactForm(!showContactForm)}
          disabled={loading}
        >
          <span className="btn-icon">💬</span>
          {showContactForm ? 'Annuler' : 'Envoyer Message'}
        </button>

        <button className="btn btn-outline">
          <span className="btn-icon">⭐</span>
          Voir Profil
        </button>
      </div>

      {/* Formulaire de contact */}
      {showContactForm && (
        <div className="contact-form-container">
          <div className="form-header">
            <h3>📬 Envoyer un message à {agenceData.prénom}</h3>
            <p>Votre message sera envoyé directement à l'agence</p>
          </div>

          {messageStatus === 'success' && (
            <div className="alert alert-success">
              ✅ Votre message a été envoyé avec succès !
            </div>
          )}

          {messageStatus === 'error' && (
            <div className="alert alert-error">
              ❌ Une erreur est survenue. Veuillez réessayer.
            </div>
          )}

          <form onSubmit={handleSubmitMessage} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nom">Votre nom *</label>
                <input
                  type="text"
                  id="nom"
                  value={contactInfo.nom}
                  onChange={(e) => setContactInfo({...contactInfo, nom: e.target.value})}
                  placeholder="Votre nom complet"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Votre email *</label>
                <input
                  type="email"
                  id="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  placeholder="votre@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                value={contactInfo.telephone}
                onChange={(e) => setContactInfo({...contactInfo, telephone: e.target.value})}
                placeholder="Votre numéro (optionnel)"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Votre message *</label>
              <textarea
                id="message"
                value={contactInfo.message}
                onChange={(e) => setContactInfo({...contactInfo, message: e.target.value})}
                placeholder={`Bonjour ${agenceData.prénom}, je suis intéressé(e) par vos services immobiliers...`}
                rows="5"
                required
                disabled={loading}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={`btn btn-submit ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <span className="btn-icon">📤</span>
                  Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Footer avec statistiques */}
      <div className="agence-footer">
        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Biens</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5ans</span>
            <span className="stat-label">Expérience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenceCard;