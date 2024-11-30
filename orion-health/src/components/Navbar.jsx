import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-50 pb-4 border-b ${
        theme === "light"
          ? "bg-white border-gray-200 shadow-md"
          : "bg-gray-900 border-gray-700 shadow-lg"
      }`}
    >
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-3">
        {/* Logo */}
        <a
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <img
            src={assets.logo}
            className="h-9 transition-transform hover:scale-105"
            alt="Logo"
          />
        </a>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-multi-level"
          aria-expanded={showMenu}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Navbar Links */}
        <div
          className={`flex-col md:flex-row md:space-x-6 w-full md:flex md:w-auto ${
            showMenu ? "flex mt-4 md:mt-0" : "hidden"
          }`}
        >
          <ul className="flex flex-col md:flex-row items-center w-full md:space-x-6">
            {/* Navigation Links */}
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "About" },
              { path: "/contact", label: "Contact" },
            ].map(({ path, label }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded md:py-0 md:px-0 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    } hover:text-blue-500 dark:hover:text-blue-300`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}

            {/* Conditional User Links */}
            {user ? (
              <>
                <li>
                  <NavLink
                    to="/my-profile"
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded md:py-0 md:px-0 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      } hover:text-blue-500 dark:hover:text-blue-300`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/doctors"
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded md:py-0 md:px-0 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      } hover:text-blue-500 dark:hover:text-blue-300`
                    }
                  >
                    Doctors
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-appointments"
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded md:py-0 md:px-0 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      } hover:text-blue-500 dark:hover:text-blue-300`
                    }
                  >
                    My Appointments
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded md:py-0 md:px-0 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      } hover:text-blue-500 dark:hover:text-blue-300`
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded md:py-0 md:px-0 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      } hover:text-blue-500 dark:hover:text-blue-300`
                    }
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}

            {/* Theme Toggle Button */}
            <li>
              <button
                onClick={toggleTheme}
                className="relative w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                <div
                  className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0"
                  } dark:border-gray-600`}
                ></div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;