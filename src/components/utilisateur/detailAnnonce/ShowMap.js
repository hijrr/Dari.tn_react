// ShowMap.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// icône rouge (URL publique)
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// petit hook pour centrer la carte quand position change
function Recenter({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (position && Array.isArray(position)) {
      map.setView(position, zoom || 12, { animate: true });
    }
  }, [position, zoom, map]);
  return null;
}

export default function ShowMap({ localisation }) {
  const [position, setPosition] = useState(null); // [lat, lon]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const geocode = async (q) => {
      try {
        // Nominatim - limiter à 1 résultat
        const url = `https://nominatim.openstreetmap.org/search`;
        console.log("Geocoding ->", q);
        const res = await axios.get(url, {
          params: { q, format: "json", limit: 1, addressdetails: 0 },
          headers: { "Accept-Language": "fr" },
        });

        if (!mounted) return null;
        if (res.data && res.data.length > 0) {
          const { lat, lon } = res.data[0];
          return [parseFloat(lat), parseFloat(lon)];
        }
        return null;
      } catch (err) {
        console.error("Erreur geocoding:", err);
        return null;
      }
    };

    (async () => {
      setLoading(true);
      setError("");
      if (!localisation || localisation.trim() === "") {
        setError("Localisation vide");
        setLoading(false);
        return;
      }

      // 1) Essayer avec ", Tunisie" (améliore la précision)
      const try1 = await geocode(localisation + ", Tunisie");
      if (try1) {
        setPosition(try1);
        setLoading(false);
        return;
      }

      // 2) Essayer la string brute
      const try2 = await geocode(localisation);
      if (try2) {
        setPosition(try2);
        setLoading(false);
        return;
      }

      // 3) Aucun résultat -> fallback (centre la Tunisie)
      setError("Impossible de trouver l'emplacement exact. Affichage par défaut.");
      // coords centrées approximatives Tunisie
      setPosition([34.0, 9.0]);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [localisation]);

  // affichage
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <strong>Chargement de la carte…</strong>
      </div>
    );
  }

  if (error && !position) {
    return (
      <div style={{ padding: 20 }}>
        <strong>Erreur : </strong> {error}
      </div>
    );
  }

  // position peut être null si erreur, on a fallback ci-dessus
  const center = position || [34.0, 9.0];

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Recenter position={center} zoom={12} />
        <Marker position={center} icon={redIcon}>
          <Popup>{localisation || "Emplacement"}</Popup>
        </Marker>
      </MapContainer>
      {error && (
        <div style={{ marginTop: 8, color: "#b85252", fontSize: 13 }}>
          {error}
        </div>
      )}
    </div>
  );
}
