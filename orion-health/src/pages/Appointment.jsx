import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currency } = useContext(AppContext);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotTime, setSlotTime] = useState("");

  const navigate = useNavigate();

  const fetchDocInfo = () => {
    const doctor = doctors.find((doc) => doc._id === docId);
    if (doctor) {
      setDocInfo(doctor);
    } else {
      toast.error("Doctor not found.");
    }
  };

  const getAvailableSlots = () => {
    const newSlots = [];
    const day = selectedDate.getDay();

    // Check for Sunday (clinic closed)
    if (day === 0) {
      setDocSlots([]);
      toast.warning("The clinic is closed on Sundays.");
      return;
    }

    // Define clinic hours based on the day
    const startHour = 8;
    const endHour = day === 6 ? 12 : 16; // Saturday: 8 AM - 12 PM, Weekdays: 8 AM - 4 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hour, minute);

        const formattedTime = slotTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        newSlots.push({
          datetime: slotTime,
          time: formattedTime,
        });
      }
    }

    setDocSlots(newSlots);
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo, selectedDate]);

  const handleDateChange = (e) => {
    const selected = new Date(e.target.value);
    setSelectedDate(selected);
  };

  const bookAppointment = () => {
    if (!slotTime) {
      toast.warning("Please select a time slot.");
      return;
    }

    toast.success(
      `Appointment booked with ${docInfo.name} on ${selectedDate.toDateString()} at ${slotTime}!`
    );
  };

  if (!docInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-gray-500">Loading doctor information...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Info Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="w-full">
            <img
              src={docInfo.image}
              alt={`${docInfo.name}'s profile`}
              className="rounded-lg shadow-md w-full h-auto object-cover"
            />
          </div>
          <div className="mt-6 space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800">{docInfo.name}</h2>
            <p className="text-lg text-gray-600">
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <p className="text-sm text-gray-500 mt-4">{docInfo.about}</p>
            <p className="text-lg font-medium text-gray-700">
              Appointment fee: {docInfo.fees} {currency}
            </p>
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Book Your Appointment</h3>

          {/* Date Picker */}
          <div>
            <label htmlFor="appointment-date" className="block text-lg font-medium text-gray-600">
              Choose a Date:
            </label>
            <input
              type="date"
              id="appointment-date"
              className="mt-2 p-4 border rounded-lg w-full text-lg"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Available Slots */}
          <div className="mt-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              Available Slots for {daysOfWeek[selectedDate.getDay()]}:
            </h4>
            {docSlots.length > 0 ? (
              <div className="flex gap-4 flex-wrap">
                {docSlots.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => setSlotTime(slot.time)}
                    className={`py-2 px-6 rounded-full cursor-pointer ${
                      slot.time === slotTime
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No slots available for this date.</p>
            )}
          </div>

          {/* Booking Button */}
          <div className="mt-6">
            <button
              onClick={bookAppointment}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Book Appointment
            </button>
          </div>

          {/* Button to Navigate to Doctors Page */}
          <div className="mt-4">
            <button
              onClick={() => navigate("/doctors")}
              className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              View All Doctors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;