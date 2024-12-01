import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import adminAxiosInstance from "../utils/adminAxiosInstance";
import { assets } from "../assets/assets"; // Import your assets for banners
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const bannerImages = [
    assets.BannerChildHealth,
    assets.BannerGeneralPhysician,
    assets.BannerMaternalHealth,
    assets.BannerNeurology,
    assets.BannerSkinHealth,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  // Rotating banner effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 10000); // Rotate every 10 seconds
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Handle Admin Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await adminAxiosInstance.post("/login", { email, password });
  
      const { success, message, token, admin } = loginResponse.data;
  
      if (success) {
        // Store the token
        localStorage.setItem("adminToken", token);
  
        // Fetch admin profile (ensure the endpoint includes `/api/admin/profile`)
        const profileResponse = await adminAxiosInstance.get("/profile");
  
        if (profileResponse.data.success) {
          loginAdmin(profileResponse.data.admin); // Update admin context
          toast.success(message || "Login successful. Redirecting...");
          setTimeout(() => navigate("/admin/dashboard"), 2000); // Redirect to dashboard
        } else {
          toast.error("Failed to load admin profile.");
        }
      } else {
        toast.error(message || "Login failed.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(error.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bannerImages[currentImageIndex]})`,
        backgroundColor: "var(--bg-color)", // Fallback color
      }}
    >
      <ToastContainer /> {/* Toastify for notifications */}
      <div
        className="w-full max-w-md px-8 py-10 bg-white bg-opacity-80 shadow-lg rounded-lg backdrop-blur-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent background
        }}
      >
        {/* Logo Section */}
        <div className="text-center mb-6">
          <img
            src={assets.logo}
            alt="Orion Health Logo"
            className="mx-auto w-48 cursor-pointer mb-4"
            onClick={() => navigate("/")}
          />
          <h2 className="text-2xl font-bold text-gray-800">Welcome, Admin</h2>
          <p className="text-sm text-gray-600">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              style={{ backgroundColor: "#fff", color: "#000" }} // Explicit black text color
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              style={{ backgroundColor: "#fff", color: "#000" }} // Explicit black text color
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Not an admin?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline"
            >
              Return to User Login
            </button>
          </p>
          <p className="text-sm text-gray-600">
            Go back to{" "}
            <button
              onClick={() => navigate("/")}
              className="text-blue-500 hover:underline"
            >
              Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;