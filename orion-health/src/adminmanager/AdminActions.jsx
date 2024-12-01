import React from 'react';
import axios from 'axios';

const AdminActions = ({ adminId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admins/${adminId}`);
      onDelete(); // Callback to refresh data
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div>
      <button>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default AdminActions;