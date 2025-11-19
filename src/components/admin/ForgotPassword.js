import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // étape 1 ou 2
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const sendCode = async () => {
    if (!email) return Swal.fire("Erreur", "Email requis", "error");
    try {
      await axios.post("http://localhost:5000/api/user/send-reset-code", { email });
      Swal.fire("Succès", "Code envoyé à votre email", "success");
      setStep(2);
    } catch (err) {
      Swal.fire("Erreur", err.response?.data?.message || "Erreur envoi code", "error");
    }
  };

  const verifyCodeAndReset = async () => {
    if (!code || !newPassword || !confirmPassword) {
      return Swal.fire("Erreur", "Tous les champs sont requis", "error");
    }
    if (newPassword !== confirmPassword) {
      return Swal.fire("Erreur", "Les mots de passe ne correspondent pas", "error");
    }
    try {
      await axios.post("http://localhost:5000/api/user/reset-password", {
        email,
        code,
        newPassword,
      });
      Swal.fire("Succès", "Mot de passe mis à jour", "success");
      navigate("/login");
    } catch (err) {
      Swal.fire("Erreur", err.response?.data?.message || "Code invalide", "error");
    }
  };

  return (
    <div className="forgot-password-page">
      {step === 1 && (
        <div>
          <h2>Réinitialiser le mot de passe</h2>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendCode}>Envoyer le code</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Entrer le code reçu par email</h2>
          <input
            type="text"
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmer nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={verifyCodeAndReset}>Valider</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
