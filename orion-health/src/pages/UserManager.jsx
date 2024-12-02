import React, { useState, useEffect } from "react";
import adminAxiosInstance from "../utils/adminAxiosInstance";
import Sidebar from "../components/Sidebar";
import UserForm from "../usermanager/UserForm";
import UserList from "../usermanager/UserList";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await adminAxiosInstance.get("/users");
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Refetch users after creating a new user
  const handleUserChange = async () => {
    await fetchUsers(); // Refetch the updated user list
  };

  return (
    <div className="grid grid-cols-[auto,1fr] min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center space-y-6 p-6">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-black">
            User Manager
          </h1>
        </header>

        {/* User Creation Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-lg sm:text-xl font-semibold text-black mb-4 text-center">
            Create New User
          </h2>
          <UserForm onSubmit={handleUserChange} />
        </div>

        {/* User List */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-solid rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-4 text-center">
              Users List
            </h2>
            <UserList
              users={users}
              onDelete={(id) =>
                setUsers((prevUsers) =>
                  prevUsers.filter((user) => user.id !== id)
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;