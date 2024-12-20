// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { assets } from "../assets/assets";
import axios from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
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
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Banner rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/user/login", { email, password });

      const { success, message, user } = response.data;
      if (success) {
        const profileResponse = await axios.get("/api/user/profile");
        if (profileResponse.data.success) {
          setUser(profileResponse.data.user);
          toast.success(message || "Logged in successfully.");
          navigate("/my-profile");
        } else {
          toast.error(profileResponse.data.message || "Profile loading failed.");
        }
      } else {
        toast.error(message || "Login failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bannerImages[currentImageIndex]})`,
        backgroundColor: "var(--bg-color)", // Dynamic background color
      }}
    >
      <ToastContainer /> {/* Toastify for notifications */}
      <div
        className="w-full max-w-md px-8 py-10 bg-white bg-opacity-80 shadow-lg rounded-lg backdrop-blur-md"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        {/* Logo Section */}
        <div className="text-center mb-6">
          <img
            src={assets.logo}
            alt="Orion Health Logo"
            className="mx-auto w-48 cursor-pointer mb-4"
            onClick={() => navigate("/")}
          />
          <h2 className="text-2xl font-bold text-gray-800">Welcome, User</h2>
          <p className="text-sm text-gray-600">Sign in to access your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
            className="w-full py-2 text-white font-semibold bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-500 font-medium hover:underline"
            >
              Sign Up
            </button>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            For admin login,{" "}
            <button
              onClick={() => navigate("/admin/login")}
              className="text-blue-500 font-medium hover:underline"
            >
              click here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;