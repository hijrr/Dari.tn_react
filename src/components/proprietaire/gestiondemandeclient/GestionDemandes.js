import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GestionDemandes.css';

function GestionDemandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState('tous');

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  // Récupérer toutes les demandes
  useEffect(() => {
    if (!userId) return;

    const fetchDemandes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/get/demandes/${userId}`);
        setDemandes(res.data);
      } catch (err) {
        console.error('Erreur chargement demandes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, [userId]);

  // Accepter une demande
  const accepterDemande = async (demandeId) => {
    try {
      await axios.put(`http://localhost:5000/demandes/${demandeId}/accepter`);
      setDemandes(demandes.map(d => 
        d.idDem === demandeId ? { ...d, statu: 'acceptée' } : d
      ));
      alert('✅ Demande acceptée avec succès!');
    } catch (err) {
      console.error('Erreur acceptation:', err);
      alert('❌ Erreur lors de l\'acceptation');
    }
  };

  // Refuser une demande
  const refuserDemande = async (demandeId) => {
    try {
      await axios.put(`http://localhost:5000/demandes/${demandeId}/refuser`);
      setDemandes(demandes.map(d => 
        d.idDem === demandeId ? { ...d, statu: 'refusée' } : d
      ));
      alert('❌ Demande refusée!');
    } catch (err) {
      console.error('Erreur refus:', err);
      alert('❌ Erreur lors du refus');
    }
  };

  // Ouvrir le chat
  const ouvrirChat = (demande) => {
    setSelectedDemande(demande);
    setChatMessages([]);
  };

  // Envoyer un message
  const envoyerMessage = async () => {
    if (!message.trim() || !selectedDemande) return;

    const nouveauMessage = {
      id: Date.now(),
      contenu: message,
      expediteur: 'proprietaire',
      date: new Date().toLocaleString()
    };

    setChatMessages([...chatMessages, nouveauMessage]);
    setMessage('');
  };

  // Filtrer les demandes
  const demandesFiltrees = demandes.filter(demande => {
    if (filtreStatut === 'tous') return true;
    if (filtreStatut === 'en_attente') return !demande.statu || demande.statu === 'en_attente';
    return demande.statu === filtreStatut;
  });

  // Calculer les statistiques
  const stats = {
    total: demandes.length,
    enAttente: demandes.filter(d => !d.statu || d.statu === 'en_attente').length,
    acceptees: demandes.filter(d => d.statu === 'acceptée').length,
    refusees: demandes.filter(d => d.statu === 'refusée').length
  };

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

      {/* Filtres */}
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
            className={`filtre-btn ${filtreStatut === 'acceptée' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('acceptée')}
          >
            Acceptées ({stats.acceptees})
          </button>
          <button 
            className={`filtre-btn ${filtreStatut === 'refusée' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('refusée')}
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
            {demandesFiltrees.map(demande => (
              <div key={demande.idDem} className={`demande-card ${demande.statu || 'en_attente'}`}>
                <div className="demande-header">
                  <h3>{demande.annonce_titre}</h3>
                  <span className={`statut-badge ${demande.statu || 'en_attente'}`}>
                    {demande.statu || 'en_attente'}
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
                    <span>{new Date(demande.dateDem).toLocaleDateString()}</span>
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

                <div className="demande-actions">
                  {(demande.statu === 'en_attente' || !demande.statu) && (
                    <>
                      <button 
                        className="btn-accepter"
                        onClick={() => accepterDemande(demande.idDem)}
                      >
                        ✅ Accepter
                      </button>
                      <button 
                        className="btn-refuser"
                        onClick={() => refuserDemande(demande.idDem)}
                      >
                        ❌ Refuser
                      </button>
                    </>
                  )}
                  
                  <button 
                    className="btn-chat"
                    onClick={() => ouvrirChat(demande)}
                  >
                    💬 Contacter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {selectedDemande && (
        <div className="chat-modal">
          <div className="chat-container">
            <div className="chat-header">
              <h3>💬 Chat avec {selectedDemande.client_nom}</h3>
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
                  <p>Soyez le premier à envoyer un message !</p>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`message ${msg.expediteur}`}>
                    <div className="message-content">
                      {msg.contenu}
                    </div>
                    <div className="message-time">
                      {msg.date}
                    </div>
                  </div>
                ))
              )}
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
                📤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionDemandes;