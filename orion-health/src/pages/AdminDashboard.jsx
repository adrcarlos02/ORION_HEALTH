// pages/AdminDashboard.jsx
import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

const AdminDashboard = () => {
  const { admin } = useContext(AdminContext);

  return (
    <div className="admin-dashboard">
      <h1>Welcome, {admin?.name || "Admin"}</h1>
      <p>Manage users and appointments efficiently.</p>
    </div>
  );
};

export default AdminDashboard;