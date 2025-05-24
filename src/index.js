import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Ajout d'un gestionnaire d'erreurs
const renderApp = () => {
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Erreur de rendu:', error);
    root.render(
      <div style={{ color: 'red', padding: '20px' }}>
        Une erreur est survenue lors du chargement de l'application.
        <pre>{error.message}</pre>
      </div>
    );
  }
};

renderApp();

reportWebVitals();
