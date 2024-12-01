import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance"; // Generic Axios instance
import "react-toastify/dist/ReactToastify.css";

const UserForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, password } = formData;

    // Basic validation
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Valid email is required.");
      return;
    }
    if (!user && password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const endpoint = user ? `/api/admin/users/${user.id}` : "/api/admin/users";
      const method = user ? axios.put : axios.post;
      const payload = user ? { name, email } : { name, email, password };

      const response = await method(endpoint, payload);

      toast.success(`User ${user ? "updated" : "created"} successfully!`);
      console.log(`${user ? "Update" : "Create"} response:`, response.data);

      // Reset form and trigger the parent refresh
      setFormData({ name: "", email: "", password: "" });
      onSubmit();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Error response:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter user's full name"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter user's email"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />
      </div>

      {/* Password Field (only for creating new users) */}
      {!user && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
          <p className="text-xs text-gray-500 mt-1">At least 6 characters.</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        className={`w-full px-4 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? (user ? "Updating..." : "Creating...") : user ? "Update User" : "Create User"}
      </button>
    </form>
  );
};

export default UserForm;