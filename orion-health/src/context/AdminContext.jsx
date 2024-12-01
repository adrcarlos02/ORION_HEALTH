// context/AdminContext.jsx
import React, { createContext, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null); // Admin info from login

  const loginAdmin = (adminData) => setAdmin(adminData); // Set admin info on login
  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null); // Clear admin data on logout
  };

  return (
    <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};