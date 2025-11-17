import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import './ChatBox.css';

const ChatBoxClient = ({ user, proprietaireId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // ✅ Utiliser useCallback pour stabiliser la référence
  const fetchMessages = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${user.userId}/${proprietaireId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Erreur récupération messages:", err);
    }
  }, [user, proprietaireId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // rafraîchit toutes les 3 sec
    return () => clearInterval(interval);
  }, [fetchMessages]); // ✅ ok maintenant

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/messages", {
        contenu: newMsg,
        expediteurId: user.userId,
        destinataireId: proprietaireId
      });

      setMessages(prev => [
        ...prev,
        {
          idMesg: Date.now(),
          contenu: newMsg,
          expediteurId: user.userId,
          destinataireId: proprietaireId,
          dateEnv: new Date().toISOString(),
          expediteur_nom: "Vous",
          expediteur_prenom: ""
        }
      ]);
      setNewMsg("");
    } catch (err) {
      console.error("Erreur envoi message:", err);
      alert("Erreur lors de l'envoi du message");
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((m) => (
          <div
            key={m.idMesg}
            className={m.expediteurId === user.userId ? "msg-sent" : "msg-received"}
          >
            <div className="msg-content">{m.contenu}</div>
            <div className="msg-date">{new Date(m.dateEnv).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div className="send-msg">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Écrire un message..."
        />
        <button onClick={handleSend}>Envoyer</button>
      </div>
    </div>
  );
};

export default ChatBoxClient;
