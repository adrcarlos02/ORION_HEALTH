import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component

const AdminDashboard = () => {
  const { admin } = useContext(AdminContext);

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
            <a
              href="/admin-manager"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Manage Admins
            </a>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition hover:bg-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              User Manager
            </h2>
            <p className="text-gray-600 mt-2">
              View, update, or delete user accounts.
            </p>
            <a
              href="/user-manager"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Manage Users
            </a>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition hover:bg-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              Appointment Manager
            </h2>
            <p className="text-gray-600 mt-2">
              Approve, update, or cancel appointments.
            </p>
            <a
              href="/appointment-manager"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Manage Appointments
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;