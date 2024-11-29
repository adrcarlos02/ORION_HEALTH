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
  const [bookedSlots, setBookedSlots] = useState(["10:00 AM", "11:30 AM"]); // Example booked slots
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotTime, setSlotTime] = useState("");
  

  const navigate = useNavigate();

  const fetchDocInfo = () => {
    console.log('DRS', doctors, docId);
    const doctor = doctors.find((doc) => doc._id.toString() == docId);
    console.log('DR', doctor.fees);
    if (doctor) {
      setDocInfo(doctor);
    } else {
      toast.error("Doctor not found.");
    }
  };

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

        const isPastSlot = selectedDate.toDateString() === now.toDateString() && slotTime.getTime() < currentTime + 60 * 60 * 1000; // Exclude past and 1 hour before slots
        const isBooked = bookedSlots.includes(formattedTime);

        newSlots.push({
          datetime: slotTime,
          time: formattedTime,
          isDisabled: isPastSlot || isBooked,
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

  const bookAppointment = async () => {
    
    if (!slotTime) {
      toast.warning("Please select a time slot.");
      return;
    }

    const payload = {
        doctorId: parseInt(docId),
        slotDate: selectedDate,
        slotTime: slotTime,
        amount: docInfo.fees,
    };
    
    const result = await axios.post('/api/appointments/book', payload);
    console.log(result);
    /*
    CONDITION to check if result is successful
    if(success) {
      toast.success()
    } else {
      toast.error()
    }
    */
    toast.success('Appoint')
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
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img
            src={docInfo.image}
            alt={`${docInfo.name}'s profile`}
            className="rounded-lg shadow-md w-full h-auto object-cover"
          />
          <h2 className="text-3xl font-semibold text-gray-800 mt-6">{docInfo.name}</h2>
          <p className="text-lg text-gray-600">{docInfo.degree} - {docInfo.speciality}</p>
          <p className="text-lg font-medium text-gray-700 mt-4">
            Appointment fee: {docInfo.fees} {currency}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Book Your Appointment</h3>

          <input
            type="date"
            id="appointment-date"
            className="mt-2 p-4 border rounded-lg w-full text-lg"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
            min={new Date().toISOString().split("T")[0]}
          />

          <div className="mt-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              Available Slots for {daysOfWeek[selectedDate.getDay()]}:
            </h4>
            {docSlots.length > 0 ? (
              <div className="flex gap-4 flex-wrap">
                {docSlots.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => !slot.isDisabled && setSlotTime(slot.time)}
                    className={`py-2 px-6 rounded-full cursor-pointer ${
                      slot.time === slotTime
                        ? "bg-blue-500 text-white"
                        : slot.isDisabled
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
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