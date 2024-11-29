// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user data if token exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get('jwtToken');
      if (token) {
        try {
          const response = await axios.get('/api/user/profile');
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            toast.error(response.data.message || 'Failed to fetch user data.');
            Cookies.remove('jwtToken');
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          toast.error('Failed to fetch user data. Please log in again.');
          Cookies.remove('jwtToken');
        }
      }
    };

    fetchUserProfile();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};