import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BellOutlined, DeleteOutlined } from '@ant-design/icons';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showList, setShowList] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  // Charger MES notifications
  const chargerMesNotifications = async () => {
    if (!userId) return;
    
    try {
      const [notifsRes, countRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/mes-notifications?userId=${userId}`),
        axios.get(`http://localhost:5000/api/mes-notifications/non-lues?userId=${userId}`)
      ]);
      
      setNotifications(notifsRes.data);
      setUnreadCount(countRes.data.count);

      // Alert pour les nouvelles notifications
      if (countRes.data.count > 0) {
        console.log(`🔔 Vous avez ${countRes.data.count} nouvelle(s) notification(s)`);
      }
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
    }
  };

  // Charger au démarrage
  useEffect(() => {
    if (userId) {
      chargerMesNotifications();
      // Recharger toutes les 30 secondes
      const interval = setInterval(chargerMesNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Marquer comme lu
  const marquerCommeLue = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/mes-notifications/${notificationId}/lu`, {
        userId: userId
      });
      setNotifications(notifications.map(notif => 
        notif.idNotification === notificationId ? { ...notif, lu: 1 } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erreur marquer comme lu:', err);
    }
  };

  // Supprimer une notification
  const supprimerNotification = async (notificationId) => {
    if (window.confirm('Supprimer cette notification ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/mes-notifications/${notificationId}`, {
          data: { userId: userId }
        });
        setNotifications(notifications.filter(notif => notif.idNotification !== notificationId));
        
        // Mettre à jour le compteur
        const notifASupprimer = notifications.find(n => n.idNotification === notificationId);
        if (notifASupprimer && notifASupprimer.lu === 0) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } catch (err) {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  // Voir les détails
  const voirDetails = (notification) => {
    setSelectedNotification(notification);
    if (notification.lu === 0) {
      marquerCommeLue(notification.idNotification);
    }
  };

  return (
    <div className="notification-simple">
      {/* Bouton Cloche */}
      <button className="bell-btn" onClick={() => setShowList(!showList)}>
        <BellOutlined />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {/* Liste des notifications */}
      {showList && (
        <div className="notifications-list">
          <div className="list-header">
            <h3>Mes Notifications</h3>
            <button onClick={() => setShowList(false)}>×</button>
          </div>

          <div className="notifications-content">
            {notifications.length === 0 ? (
              <p className="no-notifs">Aucune notification</p>
            ) : (
              notifications.map(notification => (
                <div key={notification.idNotification} className={`notification-item ${notification.lu === 0 ? 'unread' : ''}`}>
                  <div className="notif-content" onClick={() => voirDetails(notification)}>
                    <div className="notif-icon">
                      {notification.typeNotification === 'message' && '💬'}
                      {notification.typeNotification === 'nouvelle_demande' && '📋'}
                      {!['message', 'nouvelle_demande'].includes(notification.typeNotification) && '🔔'}
                    </div>
                    <div className="notif-text">
                      <strong>{notification.titre}</strong>
                      <p>{notification.message}</p>
                      <small>
                        {new Date(notification.dateCreation).toLocaleDateString('fr-FR')}
                      </small>
                    </div>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => supprimerNotification(notification.idNotification)}
                    title="Supprimer"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {selectedNotification && (
        <div className="modal-overlay" onClick={() => setSelectedNotification(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de la notification</h3>
              <button onClick={() => setSelectedNotification(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-item">
                <strong>Titre:</strong>
                <span>{selectedNotification.titre}</span>
              </div>
              <div className="detail-item">
                <strong>Message:</strong>
                <p>{selectedNotification.message}</p>
              </div>
              <div className="detail-item">
                <strong>Date:</strong>
                <span>{new Date(selectedNotification.dateCreation).toLocaleString('fr-FR')}</span>
              </div>
              <div className="detail-item">
                <strong>Type:</strong>
                <span>{selectedNotification.typeNotification}</span>
              </div>
              <div className="detail-item">
                <strong>Statut:</strong>
                <span className={selectedNotification.lu === 0 ? 'statut-non-lu' : 'statut-lu'}>
                  {selectedNotification.lu === 0 ? 'Non lu' : 'Lu'}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedNotification(null)}>Fermer</button>
              <button 
                className="btn-supprimer"
                onClick={() => {
                  supprimerNotification(selectedNotification.idNotification);
                  setSelectedNotification(null);
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;