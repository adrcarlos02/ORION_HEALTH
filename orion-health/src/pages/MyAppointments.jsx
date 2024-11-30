import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    specialty: "",
    date: "",
    status: "",
  });
  const appointmentsPerPage = 5;

  // Format date (e.g., "2024-12-01" => "01 Dec 2024")
  const formatDate = (slotDate) => {
    const [year, month, day] = slotDate.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  // Fetch user appointments
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`/api/appointments/profile/${user.id}`);
      if (data.success) {
        setAppointments(data.appointments.reverse());
        setFilteredAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message || "Failed to fetch appointments.");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel an appointment
  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    setCancelling(appointmentId);
    try {
      const { data } = await axios.post("/api/appointments/cancel", { appointmentId });
      if (data.success) {
        toast.success("Appointment canceled successfully.");
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === appointmentId ? { ...appt, cancelled: true } : appt
          )
        );
        setFilteredAppointments((prev) =>
          prev.map((appt) =>
            appt.id === appointmentId ? { ...appt, cancelled: true } : appt
          )
        );
      } else {
        toast.error(data.message || "Failed to cancel appointment.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while canceling the appointment."
      );
    } finally {
      setCancelling(null);
    }
  };

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    // Apply filters
    const filtered = appointments.filter((appt) => {
      const specialtyMatch =
        !updatedFilters.specialty || appt.doctor.speciality === updatedFilters.specialty;

      const dateMatch = !updatedFilters.date || appt.slotDate === updatedFilters.date;

      const statusMatch =
        !updatedFilters.status ||
        (updatedFilters.status === "Cancelled" && appt.cancelled) ||
        (updatedFilters.status === "Scheduled" && !appt.cancelled);

      return specialtyMatch && dateMatch && statusMatch;
    });

    setFilteredAppointments(filtered);
    setCurrentPage(1);
  };

  // Reset Filters
  const resetFilters = () => {
    setFilters({ specialty: "", date: "", status: "" });
    setFilteredAppointments(appointments);
    setCurrentPage(1);
  };

  // Pagination Logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
      >
        <p className="text-lg">Loading appointments...</p>
      </div>
    );
  }

  // Get unique specialties dynamically
  const specialties = [
    ...new Set(appointments.map((appt) => appt.doctor.speciality)),
  ];

  return (
    <div
      className="container mx-auto p-6"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <h2 className="text-3xl font-bold text-center mb-6">My Appointments</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="specialty" className="block text-sm font-medium">
            Specialty
          </label>
          <select
            id="specialty"
            name="specialty"
            value={filters.specialty}
            onChange={handleFilterChange}
            className="mt-1 block w-full p-2 rounded-md"
            style={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            <option value="">All</option>
            {specialties.map((specialty, idx) => (
              <option key={idx} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="mt-1 block w-full p-2 rounded-md"
            style={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
              borderColor: "var(--primary-color)",
            }}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="mt-1 block w-full p-2 rounded-md"
            style={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            <option value="">All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={resetFilters}
        className="mb-6 px-4 py-2 rounded-md"
        style={{
          backgroundColor: "var(--primary-color)",
          color: "white",
        }}
      >
        Reset Filters
      </button>

      {/* Appointments */}
      {currentAppointments.length === 0 ? (
        <p className="text-center">No appointments found for the selected filters.</p>
      ) : (
        currentAppointments.map((appointment, index) => (
          <div
            key={appointment.id || `${appointment.slotDate}-${appointment.slotTime}-${index}`}
            className="flex flex-col sm:flex-row justify-between items-center border p-4 mb-4 rounded-lg shadow-md"
            style={{
              backgroundColor: "var(--bg-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            <div>
              <h3 className="text-lg font-semibold">{appointment.doctor.name}</h3>
              <p>{appointment.doctor.speciality}</p>
              <p>
                <strong>Date:</strong> {formatDate(appointment.slotDate)}
              </p>
              <p>
                <strong>Time:</strong> {appointment.slotTime}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {appointment.cancelled ? (
                  <span className="text-red-500">Cancelled</span>
                ) : (
                  <span className="text-green-500">Scheduled</span>
                )}
              </p>
            </div>

            {!appointment.cancelled && (
              <button
                onClick={() => handleCancel(appointment.id)}
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                }}
                disabled={cancelling === appointment.id}
              >
                {cancelling === appointment.id ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </div>
        ))
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        {Array.from({
          length: Math.ceil(filteredAppointments.length / appointmentsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className="px-4 py-2 mx-1 rounded-lg"
            style={{
              backgroundColor: currentPage === index + 1 ? "var(--primary-color)" : "var(--bg-color)",
              color: currentPage === index + 1 ? "white" : "var(--text-color)",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;