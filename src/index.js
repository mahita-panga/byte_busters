import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { FlightProvider } from './FlightContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FlightProvider>
    <App />
    </FlightProvider>
  </React.StrictMode>
);

