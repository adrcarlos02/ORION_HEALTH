import React, { useState, useEffect } from "react";
import adminAxiosInstance from "../utils/adminAxiosInstance";
import Sidebar from "../components/Sidebar";
import AdminForm from "../adminmanager/AdminForm";
import AdminList from "../adminmanager/AdminList";

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve the current logged-in admin's ID
  const currentAdminId = localStorage.getItem("adminId");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await adminAxiosInstance.get("/admins");
        setAdmins(response.data.admins);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch admins. Please try again.");
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleAdminChange = (newAdmin) => {
    setAdmins((prevAdmins) => [...prevAdmins, newAdmin]);
  };

  return (
    <div className="grid grid-cols-[auto,1fr] min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center space-y-6 p-6">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-black">
            Admin Manager
          </h1>
        </header>

        {/* Admin Creation Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-lg sm:text-xl font-semibold text-black mb-4 text-center">
            Create New Admin
          </h2>
          <AdminForm onSubmit={handleAdminChange} />
        </div>

        {/* Admin List */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-solid rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-4 text-center">
              Admins List
            </h2>
            <AdminList
              admins={admins}
              currentAdminId={currentAdminId} // Pass the logged-in admin's ID
              onDelete={(id) =>
                setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManager;