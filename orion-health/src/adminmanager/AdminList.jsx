import React, { useState } from "react";
import { toast } from "react-toastify";
import adminAxiosInstance from "../utils/adminAxiosInstance";

const AdminList = ({ admins, currentAdminId, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5; // Number of admins displayed per page

  const handleDelete = async (adminId) => {
    if (adminId === currentAdminId) {
      toast.error("You cannot delete your own account.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (confirmDelete) {
      try {
        await adminAxiosInstance.delete(`/admins/${adminId}`);
        toast.success("Admin deleted successfully!");
        onDelete(adminId);
      } catch (err) {
        toast.error("Error deleting admin. Please try again.");
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(admins.length / adminsPerPage);
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (!admins || admins.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No admins found.</p>
      </div>
    );
  }

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
          {currentAdmins.map((admin, index) => (
            <tr key={admin.id || `admin-${index}`} className="border-b">
              <td className="py-2 px-4 text-sm text-gray-600">{admin.name}</td>
              <td className="py-2 px-4 text-sm text-gray-600">{admin.email}</td>
              <td className="py-2 px-4 text-sm">
                <button
                  onClick={() => handleDelete(admin.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Delete admin ${admin.name}`}
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
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminList;