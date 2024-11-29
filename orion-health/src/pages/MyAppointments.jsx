// src/pages/MyAppointments.jsx
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext.jsx';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null); // To handle multiple cancellations

  // Function to format the date (e.g., "20_01_2000" => "20 Jan 2000")
  const slotDateFormat = (slotDate) => {
    const [day, month, year] = slotDate.split('_');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  // Fetch user appointments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get('/api/users/appointments');
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message || 'Failed to fetch appointments.');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirmCancel) return;

    setCancelling(appointmentId);
    try {
      const { data } = await axios.post('/api/users/cancel-appointment', { appointmentId });
      if (data.success) {
        toast.success(data.message || 'Appointment cancelled successfully.');
        // Remove the cancelled appointment from the list
        setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
      } else {
        toast.error(data.message || 'Failed to cancel appointment.');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancelling(null);
    }
  };

  useEffect(() => {
    if (user) {
      getUserAppointments();
    }
  }, [user]);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments booked.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment.id} className='flex flex-col sm:flex-row justify-between items-center border p-4 mb-4 rounded'>
            {/* Doctor's Information */}
            <div className='flex items-center'>
              <img
                src={appointment.doctor.image}
                alt={appointment.doctor.name}
                className='w-16 h-16 rounded-full object-cover mr-4'
              />
              <div>
                <h3 className='text-lg font-semibold'>{appointment.doctor.name}</h3>
                <p className='text-gray-600'>{appointment.doctor.speciality}</p>
                <p className='text-gray-600'>
                  {appointment.doctor.address.line1}, {appointment.doctor.address.line2}
                </p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className='mt-4 sm:mt-0'>
              <p className='text-gray-800'>
                <strong>Date:</strong> {slotDateFormat(appointment.slotDate)}
              </p>
              <p className='text-gray-800'>
                <strong>Time:</strong> {appointment.slotTime}
              </p>
              <p className='text-gray-800'>
                <strong>Status:</strong> {appointment.cancelled ? 'Cancelled' : 'Scheduled'}
              </p>
            </div>

            {/* Cancel Button */}
            {!appointment.cancelled && (
              <button
                onClick={() => cancelAppointment(appointment.id)}
                className='mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'
                disabled={cancelling === appointment.id}
              >
                {cancelling === appointment.id ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyAppointments;