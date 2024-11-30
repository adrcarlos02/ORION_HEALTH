import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currency } = useContext(AppContext);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotTime, setSlotTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch booked slots for the doctor and selected date
  const fetchBookedSlots = async () => {
    setIsLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const { data } = await axios.get(`/api/appointments/doctors/${docId}/slots?date=${formattedDate}`);
      if (data.success) {
        setBookedSlots(data.bookedSlots); // Update booked slots for the doctor and date
      } else {
        toast.error(data.message || "Failed to fetch booked slots.");
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch booked slots.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch doctor information
  const fetchDocInfo = () => {
    const doctor = doctors.find((doc) => doc._id.toString() === docId);
    if (doctor) {
      setDocInfo(doctor);
    } else {
      toast.error("Doctor not found. Redirecting...");
      navigate("/doctors"); // Redirect to doctors list
    }
  };

  // Generate available slots for the selected date
  const getAvailableSlots = () => {
    const newSlots = [];
    const day = selectedDate.getDay();

    if (day === 0) {
      setDocSlots([]);
      toast.warning("The clinic is closed on Sundays.");
      return;
    }

    const startHour = 8;
    const endHour = day === 6 ? 12 : 16;

    const now = new Date();
    const currentTime = now.getTime();

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hour, minute);

        const formattedTime = slotTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const isPastSlot =
          selectedDate.toDateString() === now.toDateString() &&
          slotTime.getTime() < currentTime; // Exclude past slots
        const isBooked = bookedSlots.includes(formattedTime); // Check if slot is booked

        newSlots.push({
          datetime: slotTime,
          time: formattedTime,
          isDisabled: isPastSlot || isBooked,
        });
      }
    }

    setDocSlots(newSlots);
  };

  // Handle date change
  const handleDateChange = (e) => {
    const selected = new Date(e.target.value);
    setSelectedDate(selected);
  };

  // Book an appointment
  const bookAppointment = async () => {
    if (!slotTime) {
      toast.warning("Please select a time slot.");
      return;
    }

    if (bookedSlots.includes(slotTime)) {
      toast.error("The selected time slot is no longer available. Please choose a different time.");
      return;
    }

    if (!window.confirm(`Are you sure you want to book this slot: ${slotTime}?`)) {
      return;
    }

    const payload = {
      doctorId: parseInt(docId),
      slotDate: selectedDate.toISOString().split("T")[0],
      slotTime,
      amount: docInfo.fees,
    };

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/appointments/book", payload);
      if (data.success) {
        toast.success("Your booking has been successful!");
        navigate("/my-appointments"); // Redirect immediately
      } else {
        toast.error(data.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to book appointment.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch doctor info on mount
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  // Fetch booked slots and update available slots when docInfo or selectedDate changes
  useEffect(() => {
    if (docInfo) {
      fetchBookedSlots();
    }
  }, [docInfo, selectedDate]);

  // Update available slots after fetching booked slots
  useEffect(() => {
    if (bookedSlots) {
      getAvailableSlots();
    }
  }, [bookedSlots]);

  if (!docInfo || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center" style={{ color: "black" }}>Loading...</p> {/* Static black color */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: "white", color: "black" }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Info */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img
            src={docInfo.image}
            alt={`${docInfo.name}'s profile`}
            className="rounded-lg shadow-md w-full h-auto object-cover"
          />
          <h2 className="text-3xl font-semibold mt-6">{docInfo.name}</h2>
          <p className="text-lg">
            {docInfo.degree} - {docInfo.speciality}
          </p>
          <p className="text-lg font-medium mt-4">
            Appointment fee: {docInfo.fees} {currency}
          </p>
          {/* Display additional information */}
          {docInfo.about && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">About the Doctor</h3>
              <p className="text-sm text-gray-600">{docInfo.about}</p>
            </div>
          )}
        </div>

        {/* Appointment Booking */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Book Your Appointment</h3>

          <input
            type="date"
            id="appointment-date"
            className="mt-2 p-4 border rounded-lg w-full text-lg"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
            min={new Date().toISOString().split("T")[0]}
          />

          <div className="mt-6">
            <h4 className="text-xl font-semibold mb-2">
              Available Slots for {daysOfWeek[selectedDate.getDay()]}:
            </h4>
            {docSlots.length > 0 ? (
              <div className="flex gap-4 flex-wrap">
                {docSlots.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => !slot.isDisabled && setSlotTime(slot.time)}
                    className={`py-2 px-6 rounded-full cursor-pointer transition-all ${
                      slot.time === slotTime
                        ? "bg-blue-500 text-white"
                        : slot.isDisabled
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed line-through"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                    title={slot.isDisabled ? "This slot is unavailable." : "Click to select this slot"}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-black">No slots available for this date.</p> 
            )}
          </div>

          <button
            onClick={bookAppointment}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-6"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointment;