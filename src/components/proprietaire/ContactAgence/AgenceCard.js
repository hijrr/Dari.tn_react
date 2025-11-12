import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  SearchOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  UserOutlined,
  StarOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  SendOutlined
} from '@ant-design/icons';
import './AgenceCard.css';

const AgenceCard = () => {
  const [agences, setAgences] = useState([]);
  const [filteredAgences, setFilteredAgences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgence, setSelectedAgence] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  // Charger les agences
  const chargerAgences = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/agences');
      setAgences(response.data.data);
      setFilteredAgences(response.data.data);
    } catch (err) {
      console.error('Erreur chargement agences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerAgences();
  }, []);

  // Filtrer les agences
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAgences(agences);
    } else {
      const filtered = agences.filter(agence =>
        agence.prénom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agence.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agence.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAgences(filtered);
    }
  }, [searchTerm, agences]);

  // Recherche d'agences
  const rechercherAgences = async (search) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/agences/search?search=${search}`);
      setFilteredAgences(response.data.data);
    } catch (err) {
      console.error('Erreur recherche agences:', err);
    }
  };

  // Ouvrir modal de contact
  const ouvrirContactModal = (agence) => {
    setSelectedAgence(agence);
    setContactForm({
      nom: '',
      email: '',
      telephone: '',
      message: ''
    });
    setShowContactModal(true);
  };

  // Fermer modal de contact
  const fermerContactModal = () => {
    setShowContactModal(false);
    setSelectedAgence(null);
    setSending(false);
  };

  // Envoyer message
  const envoyerMessage = async (e) => {
    e.preventDefault();
    
    if (!contactForm.nom || !contactForm.email || !contactForm.message) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSending(true);
      await axios.post(`http://localhost:5000/api/agences/${selectedAgence.userId}/contact`, contactForm);
      
      alert('Votre message a été envoyé avec succès !');
      fermerContactModal();
    } catch (err) {
      console.error('Erreur envoi message:', err);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  // Formater la date d'inscription
  const formaterDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="agences-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des agences...</p>
      </div>
    );
  }

  return (
    <div className="agences-container">
      {/* En-tête */}
      <div className="agences-header">
        <div className="header-content">
          <h1>📞 Agences Immobilières</h1>
          <p>Contactez les meilleures agences pour vos projets immobiliers</p>
        </div>
        
        {/* Barre de recherche */}
        <div className="search-section">
          <div className="search-container">
            <SearchOutlined className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une agence par nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                rechercherAgences(e.target.value);
              }}
              className="search-input"
            />
          </div>
          <div className="agences-count">
            {filteredAgences.length} agence(s) trouvée(s)
          </div>
        </div>
      </div>

      {/* Liste des agences */}
      <div className="agences-grid">
        {filteredAgences.length === 0 ? (
          <div className="no-agences">
            <div className="empty-state">
              <UserOutlined className="empty-icon" />
              <h3>Aucune agence trouvée</h3>
              <p>Aucune agence ne correspond à votre recherche</p>
            </div>
          </div>
        ) : (
          filteredAgences.map(agence => (
            <div key={agence.userId} className="agence-card">
              {/* En-tête de la carte */}
              <div className="agence-header">
                <div className="agence-avatar">
                  {agence.profileImage ? (
                    <img src={agence.profileImage} alt={`${agence.prénom} ${agence.nom}`} />
                  ) : (
                    <div className="avatar-placeholder">
                      <UserOutlined />
                    </div>
                  )}
                </div>
                <div className="agence-info">
                  <h3 className="agence-name">{agence.prénom} {agence.nom}</h3>
                  <p className="agence-role">Agence Immobilière</p>
                
                </div>
              </div>

              {/* Informations de contact */}
              <div className="agence-contact-info">
                <div className="contact-item">
                  <MailOutlined className="contact-icon" />
                  <span className="contact-text">{agence.email}</span>
                </div>
                <div className="contact-item">
                  <PhoneOutlined className="contact-icon" />
                  <span className="contact-text">{agence.telephone || 'Non renseigné'}</span>
                </div>
                <div className="contact-item">
                  <CalendarOutlined className="contact-icon" />
                  <span className="contact-text">
                    Membre depuis {formaterDate(agence.dateInscri)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="agence-actions">
                <button 
                  className="btn-contact"
                  onClick={() => ouvrirContactModal(agence)}
                >
                  <MailOutlined />
                  Contacter
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de contact */}
      {showContactModal && selectedAgence && (
        <div className="modal-overlay" onClick={fermerContactModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <h2>Contacter {selectedAgence.prénom} {selectedAgence.nom}</h2>
                <p>Envoyez un message à cette agence immobilière</p>
              </div>
              <button className="close-btn" onClick={fermerContactModal}>
                ×
              </button>
            </div>

            <form onSubmit={envoyerMessage} className="contact-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nom">Nom complet *</label>
                  <input
                    type="text"
                    id="nom"
                    value={contactForm.nom}
                    onChange={(e) => setContactForm({...contactForm, nom: e.target.value})}
                    placeholder="Votre nom complet"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    value={contactForm.telephone}
                    onChange={(e) => setContactForm({...contactForm, telephone: e.target.value})}
                    placeholder="Votre numéro de téléphone"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    placeholder="Décrivez votre projet immobilier, vos besoins, votre budget..."
                    rows="6"
                    required
                  />
                </div>
              </div>

              <div className="form-footer">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={fermerContactModal}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn-send"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <div className="sending-spinner"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <SendOutlined />
                      Envoyer le message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgenceCard;