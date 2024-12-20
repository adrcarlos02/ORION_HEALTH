import React, { useState, useEffect } from "react";
import axios from "../utils/adminAxiosInstance";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

const AdminAppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    doctor: "",
    date: "",
    time: "",
    specialty: "",
    id: "",
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const itemsPerPage = 4;

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/appointments");
      if (data.success) {
        setAppointments(data.appointments);
        setFilteredAppointments(data.appointments);
      } else {
        toast.error(data.message || "Failed to fetch appointments.");
      }
    } catch (error) {
      toast.error("Failed to fetch appointments. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get("/doctors");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error("Failed to fetch doctors.");
      }
    } catch (error) {
      toast.error("Failed to fetch doctors. Please try again.");
    }
  };

  // Refresh appointments
  const refreshAppointments = async () => {
    setRefreshing(true);
    await fetchAppointments();
  };

  // Cancel an appointment (POST request)
  const cancelAppointment = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (confirmCancel) {
      try {
        // Get the token from localStorage (assuming you store the token there after login)
        const token = localStorage.getItem("adminToken");
  
        if (!token) {
          toast.error("You are not authenticated. Please log in.");
          return;
        }
  
        // POST request to cancel appointment with Authorization header
        await axios.post(
          `/appointments/cancel`, 
          { appointmentId: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Appointment cancelled successfully!");
        fetchAppointments(); // Refresh the list after canceling
      } catch (error) {
        toast.error("Failed to cancel appointment. Please try again.");
      }
    }
  };

  // Delete an appointment (DELETE request)
  const deleteAppointment = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (confirmDelete) {
      try {
        await axios.delete(`/appointments/${id}`);
        toast.success("Appointment deleted successfully!");
        fetchAppointments();
      } catch (error) {
        toast.error("Failed to delete appointment. Please try again.");
      }
    }
  };

  // Handle filtering
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = appointments;

    if (filters.doctor) {
      filtered = filtered.filter((appt) => appt.doctor.name === filters.doctor);
    }
    if (filters.date) {
      filtered = filtered.filter((appt) => appt.slotDate === filters.date);
    }
    if (filters.time) {
      filtered = filtered.filter((appt) => appt.slotTime === filters.time);
    }
    if (filters.specialty) {
      filtered = filtered.filter((appt) => appt.doctor.speciality === filters.specialty);
    }
    if (filters.id) {
      filtered = filtered.filter((appt) => appt.id.toString() === filters.id);
    }

    setFilteredAppointments(filtered);
    setPage(1);
  };

  // Update available time slots based on selected date
  const getAvailableSlots = (date) => {
    const day = new Date(date).getDay();
    const now = new Date();
    const currentTime = now.getTime();
    let newSlots = [];

    if (day === 0) {
      toast.warning("The clinic is closed on Sundays.");
      return [];
    }

    const startHour = 8;
    const endHour = day === 6 ? 12 : 16;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, minute);
        const formattedTime = slotTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const isPastSlot =
          date === now.toDateString() && slotTime.getTime() < currentTime;

        newSlots.push({
          time: formattedTime,
          isDisabled: isPastSlot,
        });
      }
    }
    return newSlots;
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (filters.date) {
      const availableTimesForDate = getAvailableSlots(filters.date);
      setAvailableTimes(availableTimesForDate);
    }
  }, [filters.date]);

  // Extract unique doctor names, specialties, and time slots for filters
  const uniqueDoctors = Array.from(new Set(appointments.map((appt) => appt.doctor.name)));
  const uniqueSpecialties = Array.from(
    new Set(appointments.map((appt) => appt.doctor.speciality))
  );
  const uniqueTimeSlots = Array.from(new Set(appointments.map((appt) => appt.slotTime)));

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const currentPageAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  return (
    <div className="grid grid-cols-[auto,1fr] min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Appointment Manager</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <select
            name="doctor"
            onChange={handleFilterChange}
            value={filters.doctor}
            className="p-2 rounded border border-gray-300 bg-white text-gray-800 hover:border-blue-500 focus:outline-none"
          >
            <option value="">Filter by Doctor</option>
            {uniqueDoctors.map((doctor) => (
              <option key={doctor} value={doctor}>
                {doctor}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            onChange={handleFilterChange}
            value={filters.date}
            className="p-2 rounded border border-gray-300 text-gray-800 hover:border-blue-500 focus:outline-none"
          />

          {filters.date && (
            <select
              name="time"
              onChange={handleFilterChange}
              value={filters.time}
              className="p-2 rounded border border-gray-300 bg-white text-gray-800 hover:border-blue-500 focus:outline-none"
            >
              <option value="">Filter by Time</option>
              {availableTimes.map((slot) => (
                <option key={slot.time} value={slot.time} disabled={slot.isDisabled}>
                  {slot.time}
                </option>
              ))}
            </select>
          )}

          <select
            name="specialty"
            onChange={handleFilterChange}
            value={filters.specialty}
            className="p-2 rounded border border-gray-300 bg-white text-gray-800 hover:border-blue-500 focus:outline-none"
          >
            <option value="">Filter by Specialty</option>
            {uniqueSpecialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="id"
            placeholder="Search by ID"
            onChange={handleFilterChange}
            value={filters.id}
            className="p-2 rounded border border-gray-300 text-gray-800 hover:border-blue-500 focus:outline-none"
          />

          <button
            onClick={applyFilters}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Apply Filters
          </button>
        </div>

        <button
          onClick={refreshAppointments}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4 flex items-center hover:bg-green-600 focus:outline-none"
        >
          {refreshing && (
            <span className="animate-spin border-2 border-white border-t-transparent border-solid rounded-full w-4 h-4 mr-2"></span>
          )}
          Refresh Appointments
        </button>

        {/* Appointment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentPageAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 bg-white rounded-lg shadow border-l-4 flex flex-col justify-between hover:shadow-lg transition-all"
              style={{
                borderColor: appointment.cancelled ? "red" : "green",
              }}
            >
              <div>
                <h2 className="text-lg font-semibold text-black">{appointment.doctor.speciality}</h2>
                <p className="text-black">Appointment ID: #{appointment.id}</p>
                <p className="text-black">Date: {appointment.slotDate}</p>
                <p className="text-black">Time: {appointment.slotTime}</p>
                <h3 className="mt-2 font-semibold text-black">Patient</h3>
                <p className="text-black">Name: {appointment.User.name}</p>
                <p className="text-black">Email: {appointment.User.email}</p>
                <p className="text-black">Phone: {appointment.User.phone}</p>
                <h3 className="mt-2 font-semibold text-black">Doctor</h3>
                <p className="text-black">Name: {appointment.doctor.name}</p>
                <p className="text-black">Specialty: {appointment.doctor.speciality}</p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => cancelAppointment(appointment.id)}
                  disabled={appointment.cancelled}
                  className={`px-3 py-1 rounded ${
                    appointment.cancelled
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {appointment.cancelled ? "Cancelled" : "Cancel Appointment"}
                </button>

                <button
                  onClick={() => deleteAppointment(appointment.id)}
                  className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Delete Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`px-3 py-1 rounded ${
                page === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointmentManager;