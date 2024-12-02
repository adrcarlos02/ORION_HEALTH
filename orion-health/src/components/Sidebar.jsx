import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false); // Hover state for large screens
  const [isExpanded, setIsExpanded] = useState(false); // Toggle state for small screens
  const [isManagersOpen, setIsManagersOpen] = useState(false); // Accordion state for Managers

  const toggleManagers = () => {
    setIsManagersOpen((prev) => !prev); // Toggle Managers accordion
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev); // Toggle sidebar for small screens
  };

  return (
    <div className="relative">
      {/* Circular Button for Small Screens */}
      <button
        className="fixed bottom-4 left-4 z-50 w-12 h-12 sm:hidden bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg"
        onClick={toggleSidebar}
      >
        {isExpanded ? "X" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 h-screen bg-gray-800 text-white shadow-lg transform transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "w-64" : "w-20"
        } sm:translate-x-0 ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        } sm:flex sm:flex-col sm:static sm:w-auto`}
        aria-label="Sidebar"
        onMouseEnter={() => setIsHovered(true)} // Expand on hover for larger screens
        onMouseLeave={() => setIsHovered(false)} // Collapse on mouse leave for larger screens
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-600">
            {isHovered || isExpanded ? (
              <span className="text-lg font-semibold text-white">
                ORION HEALTH PANEL
              </span>
            ) : null}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              {/* Dashboard Link */}
              <li>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center p-3 text-white rounded-lg hover:bg-gray-700"
                >
                  <div className="grid place-items-center w-8 h-8 bg-gray-600 rounded-full">
                    D
                  </div>
                  {(isHovered || isExpanded) && (
                    <span className="ml-4">Dashboard</span>
                  )}
                </Link>
              </li>

              {/* Managers Dropdown */}
              <li>
                <button
                  type="button"
                  className="flex items-center w-full p-3 text-white rounded-lg hover:bg-gray-700"
                  onClick={toggleManagers}
                >
                  <div className="grid place-items-center w-8 h-8 bg-gray-600 rounded-full">
                    M
                  </div>
                  {(isHovered || isExpanded) && (
                    <span className="ml-4">Managers</span>
                  )}
                </button>

                {/* Accordion Content for Managers */}
                {isManagersOpen && (isHovered || isExpanded) && (
                  <ul className="pl-8 space-y-2">
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
                )}
              </li>

            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;