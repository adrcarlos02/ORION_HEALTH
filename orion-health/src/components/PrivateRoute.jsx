// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PrivateRoute = ({ element }) => {
  const { user } = useContext(UserContext);
  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;