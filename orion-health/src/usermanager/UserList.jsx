import React, { useState } from "react";
import { toast } from "react-toastify";
import adminAxiosInstance from "../utils/adminAxiosInstance";

const UserList = ({ users, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Adjust the number of users per page as needed

  const totalPages = Math.ceil(users.length / usersPerPage);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

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
          {currentUsers.map((user) => (
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Previous
        </button>
        <div>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;