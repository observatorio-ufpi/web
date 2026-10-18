import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { iniciarEstatisticaUso } from './utils/estatisticaUso';

// Só faz algo se VITE_PLAUSIBLE_DOMAIN estiver configurado no build (desligado por padrão)
iniciarEstatisticaUso();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
