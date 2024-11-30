// src/pages/NotFound.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const NotFound = () => {
  const { theme } = useContext(ThemeContext); // Access the current theme

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        theme === "light" ? "bg-gray-100 text-gray-800" : "bg-gray-900 text-gray-200"
      }`}
    >
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg mb-6">Oops! The page you are looking for does not exist.</p>
      <Link
        to="/"
        className={`px-6 py-2 rounded-lg transition-all ${
          theme === "light"
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-blue-700 text-white hover:bg-blue-800"
        }`}
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;