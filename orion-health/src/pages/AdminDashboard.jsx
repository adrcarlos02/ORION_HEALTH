import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation

const AdminDashboard = () => {
  const { admin } = useContext(AdminContext);
  const navigate = useNavigate(); // Hook for navigating programmatically

  const handleNavigateToAdminManager = () => {
    navigate("/admin-manager"); // Navigate to the Admin Manager page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome, {admin?.name || "Admin"}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage users, admins, and appointments efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition hover:bg-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              Admin Manager
            </h2>
            <p className="text-gray-600 mt-2">
              Add, update, or remove admin accounts.
            </p>
            <button
              onClick={handleNavigateToAdminManager} // Using navigate function to go to Admin Manager
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Manage Admins
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition hover:bg-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              User Manager
            </h2>
            <p className="text-gray-600 mt-2">
              View, update, or delete user accounts.
            </p>
            <button
              onClick={() => navigate("/user-manager")} // Use navigate for User Manager
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Manage Users
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition hover:bg-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              Appointment Manager
            </h2>
            <p className="text-gray-600 mt-2">
              Approve, update, or cancel appointments.
            </p>
            <button
              onClick={() => navigate("/appointment-manager")} // Use navigate for Appointment Manager
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Manage Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;