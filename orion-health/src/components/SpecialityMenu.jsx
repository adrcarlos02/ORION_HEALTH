import React, { forwardRef } from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = forwardRef((props, ref) => {
  // Map specialty names to layman terms
  const specialityTerms = {
    "General Physician": "General Physician",
    "Gynecologist": "Maternal Health",
    "Dermatologist": "Skin Health",
    "Pediatrician": "Child Health",
    "Neurologist": "Neurology",
  };

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-6 py-12"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center">
        Find by Speciality
      </h1>

      {/* Subtitle */}
      <p className="w-4/5 sm:w-2/3 lg:w-1/3 text-center text-sm lg:text-base">
        Simply browse through our extensive list of quality health providers,
        schedule your appointment now.
      </p>

      {/* Speciality Icons */}
      <div className="flex flex-wrap justify-center gap-4 pt-6 w-full sm:w-3/4 lg:w-full">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            className="flex flex-col items-center text-xs sm:text-sm cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            style={{
              color: "var(--text-color)",
            }}
          >
            {/* Circle with White Background */}
            <div
              className="p-3 rounded-full border-2 sm:border-4 transition-all duration-300 transform hover:scale-110"
              style={{
                borderColor: "var(--primary-color)", // Circle border matches the theme's primary color
                backgroundColor: "white", // Keep circle white
              }}
            >
              <img
                className="w-12 sm:w-16 lg:w-24 h-auto rounded-full"
                src={item.image}
                alt={item.speciality}
              />
            </div>
            {/* Speciality Name */}
            <p className="text-center mt-2">
              {specialityTerms[item.speciality] || item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
});

export default SpecialityMenu;