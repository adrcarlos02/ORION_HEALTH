import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { assets } from "../assets/assets"; // Import assets for banner images and logo
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const bannerImages = [
    assets.BannerChildHealth,
    assets.BannerGeneralPhysician,
    assets.BannerMaternalHealth,
    assets.BannerNeurology,
    assets.BannerSkinHealth,
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Rotating banner effect
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 10000); // Rotate every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async () => {
    if (!formData.name.trim()) return toast.error("Name is required.");
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return toast.error("Valid email is required.");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters.");

    try {
      setLoading(true);

      const response = await axios.post("/api/user/register", {
        ...formData,
      });

      const { user } = response.data;
      toast.success("Account created successfully! Redirecting...");
      setUser(user);
      navigate("/my-profile");

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bannerImages[currentImageIndex]})`,
        backgroundColor: "#f3f4f6", // Fallback color
      }}
    >
      <ToastContainer />
      <div className="w-full max-w-lg p-6 bg-white bg-opacity-95 rounded-xl shadow-xl">
        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src={assets.logo}
            alt="Orion Health Logo"
            className="mx-auto w-36 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-6">Create Your Account</h2>

        <form className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
            <p className="text-xs text-gray-500 mt-1">At least 6 characters.</p>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={onSubmitHandler}
            className={`w-full px-4 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Already have an account */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline font-semibold"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;