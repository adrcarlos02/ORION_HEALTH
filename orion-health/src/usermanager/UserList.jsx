import React from "react";
import { toast } from "react-toastify";
import adminAxiosInstance from "../utils/adminAxiosInstance";

const UserList = ({ users, onDelete }) => {
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        await adminAxiosInstance.delete(`/users/${userId}`);
        toast.success("User deleted successfully!");
        onDelete(userId);
      } catch (error) {
        toast.error("Error deleting user. Please try again.");
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
              Name
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
              Email
            </th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="py-2 px-4 text-sm text-gray-600">{user.name}</td>
              <td className="py-2 px-4 text-sm text-gray-600">{user.email}</td>
              <td className="py-2 px-4 text-sm">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;