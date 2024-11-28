// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user data if token exists
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      axios
        .get('/users/profile')
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('jwtToken');
        });
    }
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};