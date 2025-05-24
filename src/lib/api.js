const API_URL = process.env.REACT_APP_API_URL;
const MONGODB_URI = process.env.MONGODB_URI;

// Fonction pour vérifier la connexion à l'API
async function checkApiConnection() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ Connexion API OK:', data);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion API:', error);
    return false;
  }
}

// Fonction pour vérifier la connexion MongoDB
async function checkMongoConnection() {
  try {
    const response = await fetch(`${API_URL}/mongo-status`);
    const data = await response.json();
    console.log('✅ Connexion MongoDB OK:', data);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    return false;
  }
}

export async function postReservation(payload) {
  console.log('🔍 Configuration:', {
    API_URL,
    hasMongoURI: !!MONGODB_URI,
    payload
  });

  // Vérification des connexions
  await checkApiConnection();
  await checkMongoConnection();

  if (!API_URL) {
    console.warn("⚠️ REACT_APP_API_URL n'est pas défini. Le formulaire fonctionnera en mode démo.");
    // Simuler une réponse réussie en mode démo
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: "Mode démo : réservation simulée" });
      }, 1000);
    });
  }

  console.log('📤 Envoi de la réservation à:', `${API_URL}/api/reservations`); // Log de l'URL complète
  console.log('📦 Données envoyées:', payload); // Log des données envoyées

  try {
    const res = await fetch(`${API_URL}/api/reservations`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Mongo-URI": MONGODB_URI // Ajout de l'URI MongoDB dans les headers
      },
      body: JSON.stringify(payload),
    });
    
    console.log('📥 Réponse reçue:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries())
    });
    
    if (!res.ok) {
      const txt = await res.text();
      console.error('❌ Erreur API:', {
        status: res.status,
        message: txt
      });
      throw new Error(`API ${res.status}: ${txt}`);
    }
    
    const data = await res.json();
    console.log('✅ Réservation réussie:', data); // Log de la réponse réussie
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de l\'appel API:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
} 