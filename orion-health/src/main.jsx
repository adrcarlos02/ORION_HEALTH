// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Your global styles
import { BrowserRouter } from 'react-router-dom'; // For routing
import AppContextProvider from './context/AppContext.jsx'; // Your AppContext provider
import { UserProvider } from './context/UserContext.jsx'; // Your UserContext provider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for react-toastify

// Create a root element and render the application
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AppContextProvider>
          <App />
          <ToastContainer /> {/* To display toast notifications globally */}
        </AppContextProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);