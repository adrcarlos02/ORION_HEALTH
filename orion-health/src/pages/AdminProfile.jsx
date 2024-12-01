import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // Import assets
import adminAxiosInstance from "../utils/adminAxiosInstance"; // Use adminAxiosInstance for admin actions

const AdminProfile = () => {
  const { admin, loginAdmin } = useContext(AdminContext); // Use loginAdmin from AdminContext
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update submission
  const updateAdminProfile = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Name is required.");
        return;
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Valid email is required.");
        return;
      }

      setLoading(true);

      console.log("Updating admin profile with data:", formData); // Debug: Log form data
      const { data } = await adminAxiosInstance.put("/profile", formData); // Use adminAxiosInstance for the request

      console.log("Response Data:", data); // Debug: Log response data

      if (data.success) {
        toast.success(data.message || "Profile updated successfully.");
        loginAdmin(data.admin); // Update admin context with the new admin data
        setIsEdit(false);
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update Profile Error:", error.response || error); // Debug: Log error
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return <p className="text-center text-black">Loading...</p>;

  return (
    <div className="max-w-lg flex flex-col gap-4 p-6 mx-auto mt-10 rounded-xl shadow-lg bg-white">
      <div className="text-center">
        <img
          src={admin.profilePic || assets.defaultUserphoto} // Use defaultUserphoto if no profilePic is provided
          alt="Admin Profile"
          className="w-32 h-32 mx-auto rounded-full object-cover border"
        />
        <h1 className="text-2xl font-semibold mt-4 text-black">
          {isEdit ? "Edit Profile" : "Admin Profile"}
        </h1>
      </div>

      <form className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-black">Name</label>
          {isEdit ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Admin Name"
            />
          ) : (
            <p className="text-black">{admin.name || "No name available"}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-black">Email</label>
          {isEdit ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Admin Email"
            />
          ) : (
            <p className="text-black">{admin.email || "No email available"}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          {isEdit ? (
            <>
              <button
                type="button"
                onClick={() => setIsEdit(false)}
                className="px-4 py-2 text-black bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={updateAdminProfile}
                disabled={loading}
                className={`px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEdit(true)}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;