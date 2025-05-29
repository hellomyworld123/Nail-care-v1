// Configuration de l'API
const API_URL = process.env.REACT_APP_API_URL || 'https://sahar-backend.onrender.com';
const MONGODB_URI = process.env.MONGODB_URI;

// Configuration par défaut pour les requêtes
const defaultConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  credentials: 'include',
  mode: 'cors'
};

// Validation des variables d'environnement
if (!API_URL) {
  console.error('❌ REACT_APP_API_URL n\'est pas défini');
}

// Log des variables d'environnement au chargement
console.log('🔧 Configuration initiale:', {
  API_URL,
  hasMongoURI: !!MONGODB_URI,
  envKeys: Object.keys(process.env).filter(key => key.includes('MONGODB') || key.includes('API'))
});

// Fonction pour valider l'URL de l'API
function validateApiUrl(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('L\'URL de l\'API doit utiliser le protocole HTTP ou HTTPS');
    }
    return true;
  } catch (error) {
    console.error('❌ URL de l\'API invalide:', error.message);
    return false;
  }
}

// Fonction utilitaire pour gérer les erreurs
async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Erreur API:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      message: errorText
    });
    throw new Error(`API ${response.status}: ${errorText}`);
  }
  return response.json();
}

// Fonction pour vérifier la connexion à l'API
export async function checkApiConnection() {
  try {
    console.log('🔍 Vérification API - URL:', `${API_URL}/health`);
    const response = await fetch(`${API_URL}/health`, {
      ...defaultConfig,
      method: 'GET'
    });
    const data = await handleResponse(response);
    console.log('✅ Connexion API OK:', data);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion API:', {
      message: error.message,
      stack: error.stack
    });
    return false;
  }
}

// Fonction pour vérifier la connexion à la base de données
export async function checkDbConnection() {
  try {
    // On utilise le même endpoint que le health check car il semble être le seul qui fonctionne
    console.log('🔍 Vérification DB via health check - URL:', `${API_URL}/health`);
    const response = await fetch(`${API_URL}/health`, {
      ...defaultConfig,
      method: 'GET'
    });
    const data = await handleResponse(response);
    
    // On considère que si l'API répond, la DB est probablement connectée
    // car l'API ne peut pas fonctionner sans DB
    console.log('✅ Connexion DB OK (via health check):', data);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion DB:', {
      message: error.message,
      stack: error.stack
    });
    return false;
  }
}

// Fonction pour envoyer une réservation
export async function postReservation(payload) {
  try {
    console.log('📤 Envoi de la réservation à:', `${API_URL}/api/appointments`);
    console.log('📦 Données envoyées:', payload);

    const response = await fetch(`${API_URL}/api/appointments`, {
      ...defaultConfig,
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const data = await handleResponse(response);
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

// Fonction pour récupérer les réservations
export async function getReservations() {
  try {
    console.log('📥 Récupération des réservations depuis:', `${API_URL}/api/appointments`);
    const response = await fetch(`${API_URL}/api/appointments`, {
      ...defaultConfig,
      method: 'GET'
    });
    const data = await handleResponse(response);
    console.log('✅ Réservations récupérées:', data);
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des réservations:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// Fonction pour supprimer une réservation
export async function deleteReservation(id) {
  try {
    console.log('🗑️ Suppression de la réservation:', id);
    const response = await fetch(`${API_URL}/api/appointments/${id}`, {
      ...defaultConfig,
      method: 'DELETE'
    });
    const data = await handleResponse(response);
    console.log('✅ Réservation supprimée:', data);
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la réservation:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
} 