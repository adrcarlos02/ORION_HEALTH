// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user data if token exists
  useEffect(() => {
    const token = Cookies.get('jwtToken');
    if (token) {
      axios
        .get('/api/users/profile')
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error('Failed to fetch user:', error);
          Cookies.remove('jwtToken');
        });
    }
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};