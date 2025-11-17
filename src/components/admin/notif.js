import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("🔄 Chargement des notifications pour userId:", userId);
        const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
        console.log("📨 Notifications reçues:", res.data);
        setNotifications(res.data);
      } catch (err) {
        console.error("❌ Erreur notifications :", err);
      }
    };
    fetchNotifications();
  }, [userId]);

  const handleNotificationClick = async (notification) => {
    console.log("🖱️ Notification cliquée:", notification);
    
    if (!notification.annonceId) {
      console.warn("⚠️ Aucun annonceId trouvé");
      Swal.fire({
        icon: "warning",
        title: "Information manquante",
        text: "Impossible de rediriger vers l'annonce",
        timer: 2000,
      });
      return;
    }

    try {
      console.log("📍 Redirection vers annonce ID:", notification.annonceId);
      
      // Marquer comme lu si ce n'est pas déjà fait
      if (!notification.lu) {
        await axios.put(`http://localhost:5000/api/notifications/${notification.id}/read`);
        console.log("✅ Notification marquée comme lue");
      }

      // Fermer l'alerte SweetAlert
      Swal.close();

      // REDIRECTION
      navigate(`/annonces/${Number(notification.annonceId)}`);
      
      console.log("🎯 Redirection effectuée");

    } catch (error) {
      console.error("❌ Erreur lors de la redirection:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur de redirection",
        text: "Impossible d'accéder à l'annonce",
        timer: 2000,
      });
    }
  };

  const showNotificationAlert = () => {
    if (notifications.length === 0) {
      Swal.fire({
        title: "🔔 Notifications",
        text: "Aucune notification pour le moment",
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    // Séparer les notifications lues et non lues
    const unreadNotifications = notifications.filter(notif => !notif.lu);
    const readNotifications = notifications.filter(notif => notif.lu);

    // Créer un mapping des notifications par index pour faciliter la recherche
    const notificationsMap = {};
    notifications.forEach((notif, index) => {
      notificationsMap[index] = notif;
    });

    Swal.fire({
      title: `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 24px;">🔔</span>
          <span>Notifications</span>
          ${unreadNotifications.length > 0 ? 
            `<span style="background: #EF4444; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
              ${unreadNotifications.length}
            </span>` : ''
          }
        </div>
      `,
      html: `
        <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 10px 0;">
          ${unreadNotifications.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h4 style="color: #EF4444; margin: 0 0 10px 0; font-size: 14px;">
                📬 Non lues (${unreadNotifications.length})
              </h4>
              ${unreadNotifications.map((notif, index) => `
                <div 
                  class="notification-item unread" 
                  data-index="${notifications.indexOf(notif)}"
                  style="
                    background: #FEF2F2; 
                    border-left: 4px solid #EF4444; 
                    padding: 12px; 
                    margin-bottom: 8px; 
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                  "
                >
                  <div style="font-weight: bold; color: #1F2937; margin-bottom: 4px; font-size: 14px;">
                    ${notif.titre}
                  </div>
                  <div style="color: #6B7280; font-size: 13px; margin-bottom: 6px;">
                    ${notif.message}
                  </div>
                  <div style="color: #9CA3AF; font-size: 11px; display: flex; align-items: center; gap: 4px;">
                    <span>🕒</span>
                    ${new Date(notif.dateCreation).toLocaleString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${readNotifications.length > 0 ? `
            <div>
              <h4 style="color: #6B7280; margin: 0 0 10px 0; font-size: 14px;">
                📭 Lues (${readNotifications.length})
              </h4>
              ${readNotifications.map((notif, index) => `
                <div 
                  class="notification-item read" 
                  data-index="${notifications.indexOf(notif)}"
                  style="
                    background: #F9FAFB; 
                    border-left: 4px solid #9CA3AF; 
                    padding: 12px; 
                    margin-bottom: 8px; 
                    border-radius: 6px;
                    cursor: pointer;
                    opacity: 0.8;
                    transition: all 0.3s ease;
                  "
                >
                  <div style="font-weight: normal; color: #1F2937; margin-bottom: 4px; font-size: 14px;">
                    ${notif.titre}
                  </div>
                  <div style="color: #6B7280; font-size: 13px; margin-bottom: 6px;">
                    ${notif.message}
                  </div>
                  <div style="color: #9CA3AF; font-size: 11px; display: flex; align-items: center; gap: 4px;">
                    <span>🕒</span>
                    ${new Date(notif.dateCreation).toLocaleString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: 500,
      customClass: {
        popup: 'notification-popup'
      },
      didOpen: () => {
        console.log("🔓 Alerte ouverte");
        console.log("📋 Liste des notifications:", notifications);
        
        // Gérer les clics sur les notifications
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
          item.addEventListener('click', () => {
            const notificationIndex = item.getAttribute('data-index');
            console.log("📋 Index notification cliquée:", notificationIndex);
            
            // Trouver la notification correspondante par index
            if (notificationIndex !== null && notifications[notificationIndex]) {
              const notification = notifications[notificationIndex];
              console.log("✅ Notification trouvée:", notification);
              handleNotificationClick(notification);
            } else {
              console.error("❌ Notification non trouvée avec index:", notificationIndex);
              console.log("📊 Notifications disponibles:", notifications);
            }
          });

          // Effets hover
          item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          });

          item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
          });
        });
      }
    });
  };

  const unreadCount = notifications.filter(notif => !notif.lu).length;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={showNotificationAlert}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '10px',
          borderRadius: '50%',
          position: 'relative',
          fontSize: '1.3rem',
          color: unreadCount > 0 ? '#3B82F6' : '#6B7280',
          transition: 'all 0.3s ease'
        }}
        title={`${unreadCount} notification(s) non lue(s)`}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: '#EF4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: '2px solid white'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default Notifications;