import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BellOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './notifClient.css';

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

      // SweetAlert info pour nouvelles notifications
      if (countRes.data.count > 0) {
        Swal.fire({
          title: '🔔 Nouvelle notification',
          text: `Vous avez ${countRes.data.count} nouvelle(s) notification(s)`,
          icon: 'info',
          timer: 2500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
      Swal.fire('Erreur', 'Impossible de charger les notifications', 'error');
    }
  };

  // Charger au démarrage
  useEffect(() => {
    if (userId) {
      chargerMesNotifications();
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
      Swal.fire('Erreur', 'Impossible de marquer comme lu', 'error');
    }
  };

  // Supprimer une notification avec SweetAlert
  const supprimerNotification = async (notificationId) => {
    const result = await Swal.fire({
      title: 'Supprimer cette notification ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/mes-notifications/${notificationId}`, {
          data: { userId: userId }
        });

        setNotifications(notifications.filter(notif => notif.idNotification !== notificationId));

        const notifASupprimer = notifications.find(n => n.idNotification === notificationId);
        if (notifASupprimer && notifASupprimer.lu === 0) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }

        Swal.fire('Supprimé !', 'La notification a été supprimée.', 'success');

      } catch (err) {
        console.error('Erreur suppression:', err);
        Swal.fire('Erreur', 'Erreur lors de la suppression', 'error');
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
    <div className="notif-notification-bell-container">
      {/* Bouton Cloche */}
      <button
        className={`bell-button ${unreadCount > 0 ? 'has-notifications' : ''}`}
        onClick={() => setShowList(!showList)}
      >
        <BellOutlined />
        {unreadCount > 0 && <span className="notif-notification-badge">{unreadCount}</span>}
      </button>

      {/* Liste des notifications */}
      {showList && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h3>Mes Notifications</h3>
            <button onClick={() => setShowList(false)}>×</button>
          </div>

          <div className="notifications-container">
            {notifications.length === 0 ? (
              <p className="no-notifications">Aucune notification</p>
            ) : (
              notifications.map(notification => (
                <div key={notification.idNotification} className={`notification-item ${notification.lu === 0 ? 'unread' : 'read'}`}>
                  <div className="notification-content" onClick={() => voirDetails(notification)}>
                    <div className="notif-notification-icon">
                      {notification.typeNotification === 'message' && '💬'}
                      {notification.typeNotification === 'nouvelle_demande' && '📋'}
                      {!['message', 'nouvelle_demande'].includes(notification.typeNotification) && '🔔'}
                    </div>
                    <div className="notification-text">
                      <strong>{notification.titre}</strong>
                      <p>{notification.message}</p>
                      <small>{new Date(notification.dateCreation).toLocaleDateString('fr-FR')}</small>
                    </div>
                  </div>
                  <button
                    className="delete-notification-btn"
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
        <div className="notification-modal-overlay" onClick={() => setSelectedNotification(null)}>
          <div className="notification-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="notification-modal-header">
              <h3>Détails de la notification</h3>
              <button onClick={() => setSelectedNotification(null)}>×</button>
            </div>
            <div className="notification-modal-body">
              <div className="modal-detail-item">
                <strong>Titre:</strong>
                <span>{selectedNotification.titre}</span>
              </div>
              <div className="modal-detail-item">
                <strong>Message:</strong>
                <p>{selectedNotification.message}</p>
              </div>
              <div className="modal-detail-item">
                <strong>Date:</strong>
                <span>{new Date(selectedNotification.dateCreation).toLocaleString('fr-FR')}</span>
              </div>
              <div className="modal-detail-item">
                <strong>Type:</strong>
                <span>{selectedNotification.typeNotification}</span>
              </div>
              <div className="modal-detail-item">
                <strong>Statut:</strong>
                <span className={selectedNotification.lu === 0 ? 'notification-status-unread' : 'notification-status-read'}>
                  {selectedNotification.lu === 0 ? 'Non lu' : 'Lu'}
                </span>
              </div>
            </div>
            <div className="notification-modal-footer">
              <button onClick={() => setSelectedNotification(null)}>Fermer</button>
              <button
                className="notification-delete-btn"
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
