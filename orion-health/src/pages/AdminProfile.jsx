import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';

const AdminProfile = () => {
  const { admin } = useContext(AdminContext);

  if (!admin) return <p>Loading...</p>;

  return (
    <div>
      <h1>Admin Profile</h1>
      <p>Name: {admin.name}</p>
      <p>Email: {admin.email}</p>
    </div>
  );
};

export default AdminProfile;