const API_URL = process.env.REACT_APP_API_URL || 'https://sahar-backend.onrender.com';
const MONGODB_URI = process.env.MONGODB_URI;

// Fonction pour vérifier la connexion à l'API
export async function checkApiConnection() {
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
export async function checkMongoConnection() {
  try {
    console.log('🔍 Vérification MongoDB - URL:', `${API_URL}/api/mongo-status`);
    const response = await fetch(`${API_URL}/api/mongo-status`, {
      headers: {
        "X-Mongo-URI": MONGODB_URI
      }
    });
    
    console.log('📥 Réponse MongoDB:', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur MongoDB - Status:', response.status, 'Message:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('✅ Connexion MongoDB OK:', data);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', {
      message: error.message,
      stack: error.stack,
      url: `${API_URL}/api/mongo-status`
    });
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
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: "Mode démo : réservation simulée" });
      }, 1000);
    });
  }

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI n'est pas défini");
    throw new Error("Configuration MongoDB manquante");
  }

  console.log('📤 Envoi de la réservation à:', `${API_URL}/api/reservations`);
  console.log('📦 Données envoyées:', payload);

  try {
    const res = await fetch(`${API_URL}/api/reservations`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Mongo-URI": MONGODB_URI
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
    console.log('✅ Réservation réussie:', data);
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de l\'appel API:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
} 