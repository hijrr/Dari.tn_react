import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './GestionDemandes.css';

function GestionDemandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [showRefusModal, setShowRefusModal] = useState(false);
  const [demandeARefuser, setDemandeARefuser] = useState(null);
  const [raisonRefus, setRaisonRefus] = useState('');
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  // Récupérer toutes les demandes
  useEffect(() => {
    if (!userId) return;

    const fetchDemandes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/get/demandes/${userId}`);
        
        console.log('Données reçues:', res.data); // Debug
        
        // Assurer que chaque demande a un statut (avec le bon nom de la base)
        const demandesAvecStatut = res.data.map(demande => ({
          ...demande,
          demande_statut: demande.demande_statut || 'en attente'
        }));
        
        console.log('Demandes avec statut:', demandesAvecStatut); // Debug
        setDemandes(demandesAvecStatut);
      } catch (err) {
        console.error('Erreur chargement demandes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, [userId]);

  // Scroll vers le bas du chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Charger les messages avec un client spécifique
  const chargerMessagesAvecClient = async (clientId) => {
    if (!clientId) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${userId}/${clientId}`);

      
      const messagesFormates = response.data.map(msg => ({
        id: msg.idMesg,
        contenu: msg.contenu,
        expediteur: msg.expediteurId === userId ? 'proprietaire' : 'client',
        date: new Date(msg.dateEnv).toLocaleString('fr-FR'),
        expediteurId: msg.expediteurId,
        destinataireId: msg.destinataireId,
        expediteur_nom: msg.expediteur_nom,
        expediteur_prenom: msg.expediteur_prenom
      }));

      setChatMessages(messagesFormates);
    } catch (err) {
      console.error('Erreur chargement messages:', err);
    }
  };

  // Polling pour les nouveaux messages (toutes les 2 secondes)
  useEffect(() => {
    let intervalId;
    
    if (selectedDemande) {
      chargerMessagesAvecClient(selectedDemande.clientId);
      intervalId = setInterval(() => {
        chargerMessagesAvecClient(selectedDemande.clientId);
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDemande]);

  // Accepter une demande
  const accepterDemande = async (demandeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir accepter cette demande ?')) {
      return;
    }

    try {
      await axios.put(`http://localhost:5000/demandes/${demandeId}/accepter`);
      
      // Mettre à jour l'état local avec le bon statut
      setDemandes(demandes.map(d => 
        d.idDem === demandeId ? { ...d, demande_statut: 'accepte' } : d
      ));
      
      alert('✅ Demande acceptée avec succès! Un message a été envoyé au client.');
    } catch (err) {
      console.error('Erreur acceptation:', err);
      alert('❌ Erreur lors de l\'acceptation');
    }
  };

  // Ouvrir modal de refus
  const ouvrirModalRefus = (demande) => {
    setDemandeARefuser(demande);
    setShowRefusModal(true);
    setRaisonRefus('');
  };

  // Fermer modal de refus
  const fermerModalRefus = () => {
    setShowRefusModal(false);
    setDemandeARefuser(null);
    setRaisonRefus('');
  };

  // Refuser une demande
  const refuserDemande = async () => {
    if (!demandeARefuser) return;

    try {
      await axios.put(`http://localhost:5000/demandes/${demandeARefuser.idDem}/refuser`, {
        raison: raisonRefus
      });
      
      // Mettre à jour l'état local avec le bon statut
      setDemandes(demandes.map(d => 
        d.idDem === demandeARefuser.idDem ? { ...d, demande_statut: 'refuse' } : d
      ));
      
      fermerModalRefus();
      alert('❌ Demande refusée! Un message a été envoyé au client.');
    } catch (err) {
      console.error('Erreur refus:', err);
      alert('❌ Erreur lors du refus');
    }
  };

  // Ouvrir le chat
  const ouvrirChat = async (demande) => {
    const statut = demande.demande_statut || 'en attente';
    if (statut !== 'accepte' && statut !== 'en attente') {
      alert('Vous ne pouvez contacter le client que pour les demandes acceptées ou en attente.');
      return;
    }

    setSelectedDemande(demande);
    await chargerMessagesAvecClient(demande.clientId);
  };

  // Envoyer un message
  const envoyerMessage = async () => {
    if (!message.trim() || !selectedDemande) return;

    try {
      // Envoyer le message via l'API (avec notification automatique)
      await axios.post('http://localhost:5000/api/messages', {
        contenu: message,
        expediteurId: userId,
        destinataireId: selectedDemande.clientId
      });

      // Ajouter le message localement immédiatement
      const nouveauMessage = {
        id: Date.now(),
        contenu: message,
        expediteur: 'proprietaire',
        date: new Date().toLocaleString('fr-FR'),
        expediteurId: userId,
        destinataireId: selectedDemande.clientId,
        expediteur_nom: user.nom,
        expediteur_prenom: user.prénom
      };

      setChatMessages(prev => [...prev, nouveauMessage]);
      setMessage('');
      
      // Recharger les messages pour s'assurer d'avoir les derniers
      setTimeout(() => {
        chargerMessagesAvecClient(selectedDemande.clientId);
      }, 500);
    } catch (err) {
      console.error('Erreur envoi message:', err);
      alert('Erreur lors de l\'envoi du message');
    }
  };

  // Filtrer les demandes - CORRIGÉ avec les bons noms de statut
  const demandesFiltrees = demandes.filter(demande => {
    if (filtreStatut === 'tous') return true;
    const statut = demande.demande_statut || 'en attente';
    if (filtreStatut === 'en_attente') return statut === 'en attente';
    return statut === filtreStatut;
  });

  // Calculer les statistiques - CORRIGÉ avec les bons noms de statut
  const stats = {
    total: demandes.length,
    enAttente: demandes.filter(d => (d.demande_statut || 'en attente') === 'en attente').length,
    acceptees: demandes.filter(d => (d.demande_statut || '') === 'accepte').length,
    refusees: demandes.filter(d => (d.demande_statut || '') === 'refuse').length
  };

  console.log('Statistiques:', stats); // Debug

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des demandes...</p>
      </div>
    );
  }

  return (
    <div className="gestion-demandes">
      {/* En-tête avec statistiques */}
      <div className="dashboard-header">
        <h1>📋 Gestion des Demandes</h1>
        <div className="stats-grid">
          <div className="stat-card total">
            <h3>Total</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card en-attente">
            <h3>En attente</h3>
            <p className="stat-number">{stats.enAttente}</p>
          </div>
          <div className="stat-card acceptees">
            <h3>Acceptées</h3>
            <p className="stat-number">{stats.acceptees}</p>
          </div>
          <div className="stat-card refusees">
            <h3>Refusées</h3>
            <p className="stat-number">{stats.refusees}</p>
          </div>
        </div>
      </div>

      {/* Filtres - CORRIGÉ avec les bons noms */}
      <div className="filtres-section">
        <div className="filtres">
          <button 
            className={`filtre-btn ${filtreStatut === 'tous' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('tous')}
          >
            Toutes ({stats.total})
          </button>
          <button 
            className={`filtre-btn ${filtreStatut === 'en_attente' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('en_attente')}
          >
            En attente ({stats.enAttente})
          </button>
          <button 
            className={`filtre-btn ${filtreStatut === 'accepte' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('accepte')}
          >
            Acceptées ({stats.acceptees})
          </button>
          <button 
            className={`filtre-btn ${filtreStatut === 'refuse' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('refuse')}
          >
            Refusées ({stats.refusees})
          </button>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="demandes-container">
        {demandesFiltrees.length === 0 ? (
          <div className="no-demands">
            <div className="empty-state">
              <h3>📭 Aucune demande</h3>
              <p>Aucune demande ne correspond aux filtres sélectionnés</p>
            </div>
          </div>
        ) : (
          <div className="demandes-grid">
            {demandesFiltrees.map(demande => {
              const statut = demande.demande_statut || 'en attente';
              console.log('Demande:', demande.idDem, 'Statut:', statut); // Debug
              
              return (
                <div key={demande.idDem} className={`demande-card ${statut.replace(' ', '_')}`}>
                  <div className="demande-header">
                    <h3>{demande.annonce_titre}</h3>
                    <span className={`statut-badge ${statut.replace(' ', '_')}`}>
                      {statut === 'en attente' ? 'En attente' : 
                       statut === 'accepte' ? 'Acceptée' : 'Refusée'}
                    </span>
                  </div>
                  
                  <div className="demande-info">
                    <div className="info-item">
                      <span className="info-label">👤 Client:</span>
                      <span>{demande.client_nom} {demande.client_prenom}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📧 Email:</span>
                      <span>{demande.client_email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📞 Téléphone:</span>
                      <span>{demande.client_telephone}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📍 Localisation:</span>
                      <span>{demande.localisation}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">🏠 Type:</span>
                      <span>{demande.type}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📅 Date demande:</span>
                      <span>{new Date(demande.dateDem).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">⏱️ Durée:</span>
                      <span>{demande.duree}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">💰 Prix:</span>
                      <span className="prix">{demande.annonce_prix} DT</span>
                    </div>
                  </div>

                  {/* SECTION DES ACTIONS - CORRIGÉE avec les bons noms de statut */}
                  <div className="demande-actions">
                    {/* En attente : Accepter + Refuser */}
                    {(statut === 'en attente') && (
                      <>
                        <button 
                          className="btn-accepter"
                          onClick={() => accepterDemande(demande.idDem)}
                        >
                          ✅ Accepter
                        </button>
                        <button 
                          className="btn-refuser"
                          onClick={() => ouvrirModalRefus(demande)}
                        >
                          ❌ Refuser
                        </button>
                      </>
                    )}
                    
                    {/* Acceptée : Contacter seulement */}
                    {(statut === 'accepte') && (
                      <button 
                        className="btn-chat"
                        onClick={() => ouvrirChat(demande)}
                      >
                        💬 Contacter
                      </button>
                    )}
                    
                    {/* Refusée : Aucun bouton */}
                    {(statut === 'refuse') && (
                      <div className="demande-refusee">
                        <p className="text-refusee">❌ Demande refusée</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de refus */}
      {showRefusModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>❌ Refuser la demande</h3>
              <button className="btn-fermer" onClick={fermerModalRefus}>✕</button>
            </div>
            <div className="modal-body">
              <p>Vous êtes sur le point de refuser la demande pour :</p>
              <p className="annonce-titre"><strong>{demandeARefuser?.annonce_titre}</strong></p>
              
              <div className="form-group">
                <label htmlFor="raison">Raison du refus (optionnel) :</label>
                <textarea
                  id="raison"
                  value={raisonRefus}
                  onChange={(e) => setRaisonRefus(e.target.value)}
                  placeholder="Expliquez brièvement la raison de votre refus..."
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={fermerModalRefus}>
                Annuler
              </button>
              <button className="btn-refuser" onClick={refuserDemande}>
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {selectedDemande && (
        <div className="chat-modal">
          <div className="chat-container">
            <div className="chat-header">
              <h3>💬 Chat avec {selectedDemande.client_nom}</h3>
              <div className="chat-status">
                <span className="statut-badge small">
                  {selectedDemande.demande_statut === 'en attente' ? 'En attente' : 
                   selectedDemande.demande_statut === 'accepte' ? 'Acceptée' : 'Refusée'}
                </span>
              </div>
              <button 
                className="btn-fermer"
                onClick={() => setSelectedDemande(null)}
              >
                ✕
              </button>
            </div>

            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <div className="no-messages">
                  <p>Aucun message échangé pour le moment</p>
                  <p>Envoyez le premier message !</p>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`message ${msg.expediteur}`}>
                    <div className="message-header">
                      <span className="message-sender">
                        {msg.expediteur === 'proprietaire' ? 'Vous' : selectedDemande.client_nom}
                      </span>
                      <span className="message-time">{msg.date}</span>
                    </div>
                    <div className="message-content">
                      {msg.contenu}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tapez votre message..."
                onKeyPress={(e) => e.key === 'Enter' && envoyerMessage()}
              />
              <button onClick={envoyerMessage} disabled={!message.trim()}>
                📤 Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionDemandes;