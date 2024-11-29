import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null); // To handle multiple cancellations

  // Format date (e.g., "20_01_2000" => "20 Jan 2000")
  const formatDate = (slotDate) => {
    const [day, month, year] = slotDate.split("_");
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
  // const fetchAppointments = async () => {
  //   try {
  //     const { data } = await axios.get("/api/appointments/user"); // Fetch appointments
  //     if (data.success) {
  //       setAppointments(data.appointments.reverse());
  //     } else {
  //       toast.error(data.message || "Failed to fetch appointments.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching appointments:", error);
  //     toast.error(
  //       error.response?.data?.message || "Failed to fetch appointments."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Cancel an appointment
  const fetchAppointments = async () => {
    try {
      console.log("Fetching appointments...");
      const { data } = await axios.get(`/api/appointments/profile/${user.id}`); // Pass user ID in the URL
      console.log("API Response:", data);
  
      if (data.success) {
        setAppointments(data.appointments.reverse());
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
  
  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);
  
  
  
  const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmCancel) return;

    setCancelling(appointmentId);
    try {
      const { data } = await axios.post("/api/cancel-appointment", {
        appointmentId,
      });
      if (data.success) {
        toast.success("Appointment cancelled successfully.");
        setAppointments((prev) =>
          prev.filter((appt) => appt._id !== appointmentId)
        );
      } else {
        toast.error(data.message || "Failed to cancel appointment.");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment."
      );
    } finally {
      setCancelling(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments booked.</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="flex flex-col sm:flex-row justify-between items-center border p-4 mb-4 rounded"
          >
            {/* Doctor's Information */}
            <div className="flex items-center">
              {/* <img
                src={appointment.docData.image}
                alt={appointment.docData.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              /> */}
              <div>
                <h3 className="text-lg font-semibold">
                  {appointment.doctor.name}
                </h3>
                <p className="text-gray-600">
                  {appointment.doctor.speciality}
                </p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="mt-4 sm:mt-0">
              <p className="text-gray-800">
                <strong>Date:</strong> {formatDate(appointment.slotDate)}
              </p>
              <p className="text-gray-800">
                <strong>Time:</strong> {appointment.slotTime}
              </p>
              <p className="text-gray-800">
                <strong>Status:</strong>{" "}
                {appointment.cancelled ? "Cancelled" : "Scheduled"}
              </p>
            </div>

            {/* Cancel Button */}
            {!appointment.cancelled && (
              <button
                onClick={() => handleCancel(appointment._id)}
                className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                disabled={cancelling === appointment._id}
              >
                {cancelling === appointment._id ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyAppointments;
