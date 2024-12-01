import React from "react";
import { toast } from "react-toastify";
import adminAxiosInstance from "../utils/adminAxiosInstance";

const AdminList = ({ admins, currentAdminId, onDelete }) => {
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
          {admins.map((admin, index) => {
            // Guard against undefined or missing properties
            if (!admin || !admin.name) {
              console.warn(`Skipping invalid admin entry at index ${index}:`, admin);
              return null;
            }
            return (
              <tr key={admin.id} className="border-b">
                <td className="py-2 px-4 text-sm text-gray-600">{admin.name}</td>
                <td className="py-2 px-4 text-sm text-gray-600">{admin.email}</td>
                <td className="py-2 px-4 text-sm">
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;