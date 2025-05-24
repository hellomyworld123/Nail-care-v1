const API_URL = process.env.REACT_APP_API_URL;

export async function postReservation(payload) {
  if (!API_URL) {
    console.warn("⚠️ REACT_APP_API_URL n'est pas défini. Le formulaire fonctionnera en mode démo.");
    // Simuler une réponse réussie en mode démo
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: "Mode démo : réservation simulée" });
      }, 1000);
    });
  }

  const res = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API ${res.status}: ${txt}`);
  }
  return res.json();
} 