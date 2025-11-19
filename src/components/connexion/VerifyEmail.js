// VerifyEmail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const { token } = useParams(); // récupère le token depuis l'URL
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | failed

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/verify-email/${token}`);
        if (res.status === 200) {
          setStatus("success");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error(err);
        setStatus("failed");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      {status === "loading" && <p>Vérification de votre email...</p>}
      {status === "success" && <p>Email vérifié ! Redirection vers connexion...</p>}
      {status === "failed" && <p>Lien invalide ou expiré.</p>}
    </div>
  );
}

export default VerifyEmail;
