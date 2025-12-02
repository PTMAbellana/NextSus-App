import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Configure axios base URL
const API_URL = process.env.REACT_APP_API_URL || 'https://nextsus-app.onrender.com';
axios.defaults.baseURL = API_URL;

console.log('API URL configured:', API_URL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
