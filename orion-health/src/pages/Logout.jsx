// src/pages/Logout.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserContext } from '../context/UserContext';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Optionally, notify the backend about logout
        await axios.post('/api/user/logout'); // Ensure this route exists on the backend
      } catch (error) {
        console.error('Logout error:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Logout failed. Please try again.');
      } finally {
        Cookies.remove('jwtToken'); // Remove the JWT token from cookies
        setUser(null); // Clear the user context
        toast.success('Logged out successfully.');
        navigate('/login'); // Redirect to the login page
      }
    };

    performLogout();
  }, [navigate, setUser]);

  return <p>Logging out...</p>;
};

export default Logout;