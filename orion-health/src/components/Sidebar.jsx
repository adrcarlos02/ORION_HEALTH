import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false); // Track hover status
  const [isManagersOpen, setIsManagersOpen] = useState(false); // Accordion state for Managers

  const toggleManagers = () => {
    setIsManagersOpen((prev) => !prev); // Toggle Managers accordion
  };

  return (
    <aside
      id="sidebar"
      className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out ${
        isHovered ? "w-72" : "w-20"
      } bg-gray-800 text-white shadow-lg overflow-hidden`}
      aria-label="Sidebar"
      onMouseEnter={() => {
        setIsHovered(true); // Expand sidebar
        setIsManagersOpen(true); // Expand accordion when sidebar expands
      }} // Expand on hover
      onMouseLeave={() => {
        setIsHovered(false); // Collapse sidebar
        setIsManagersOpen(false); // Collapse accordion when sidebar collapses
      }} // Collapse when not hovered
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div
          className={`flex items-center justify-between px-4 py-4 border-b border-gray-600 ${
            isHovered ? "justify-between" : "justify-center"
          }`}
        >
          {/* Title */}
          <div className="flex items-center">
            {/* Title hidden when collapsed */}
            {isHovered && (
              <span className="ml-3 text-lg font-semibold text-white">
                ORION HEALTH PANEL
              </span>
            )}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setIsHovered(!isHovered)}
            className="text-gray-500 hover:text-gray-700"
            aria-label={isHovered ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <svg
              className={`w-6 h-6 transition-transform ${
                isHovered ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {/* Dashboard Link */}
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700"
              >
                <svg
                  className="w-6 h-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                {isHovered && (
                  <span className="ml-4 text-white">Dashboard</span>
                )}
              </Link>
            </li>

            {/* Managers Dropdown */}
            <li>
              <button
                type="button"
                className="flex items-center w-full p-3 text-white rounded-lg hover:bg-gray-700"
                onClick={toggleManagers} // Toggle the Managers accordion
              >
                <svg
                  className="w-6 h-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="http://www.w3.org/2000/svg"
                >
                  <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                </svg>
                {isHovered && (
                  <span className="flex-1 ml-4 text-white">Managers</span>
                )}
                {/* Accordion Indicator */}
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    isManagersOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {/* Accordion Content for Managers */}
              <ul
                className={`py-2 pl-6 space-y-2 ${
                  isManagersOpen ? "block" : "hidden"
                }`}
              >
                <li>
                  <Link
                    to="/admin-manager"
                    className="block p-2 text-white rounded-lg hover:bg-gray-700"
                  >
                    Admin Manager
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user-manager"
                    className="block p-2 text-white rounded-lg hover:bg-gray-700"
                  >
                    User Manager
                  </Link>
                </li>
                <li>
                  <Link
                    to="/appointment-manager"
                    className="block p-2 text-white rounded-lg hover:bg-gray-700"
                  >
                    Appointment Manager
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;