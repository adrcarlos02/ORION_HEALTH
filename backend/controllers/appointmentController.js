import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import sequelize from '../config/db.js';

// // Book Appointment
export const bookAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { doctorId, slotDate, slotTime } = req.body;
    const userId = req.userId; // Retrieved from auth middleware

    if (!doctorId || !slotDate || !slotTime) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if the doctor exists and is available
    const doctor = await Doctor.findByPk(doctorId, {
      attributes: ['id', 'name', 'speciality', 'fees', 'available'],
    });

    if (!doctor || !doctor.available) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Doctor not available." });
    }

    // Check if the slot is already booked
    const existingAppointment = await Appointment.findOne({
      where: { doctorId, slotDate, slotTime },
      transaction, // Ensure this query is part of the transaction
    });

    if (existingAppointment) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Slot already booked." });
    }

    // Create the appointment
    const newAppointment = await Appointment.create(
      {
        userId,
        doctorId,
        slotDate,
        slotTime,
        amount: doctor.fees,
      },
      { transaction } // Ensure creation is part of the transaction
    );

    await transaction.commit();
    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      appointment: newAppointment,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Slot is already booked." });
    }
    await transaction.rollback();
    console.error("Error booking appointment:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// List Appointments for Authenticated User.
export const getAppointmentsByUser = async (req, res) => {
  try {
    // Extract userId from the route parameters
    const { userId } = req.params;

    // Validate that the userId matches the authenticated user's ID
    if (parseInt(userId) !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only access your own appointments.',
      });
    }

    // Fetch appointments for the user, including associated doctor data
    const appointments = await Appointment.findAll({
      where: { userId },
      include: [
        {
          model: Doctor,
          as: 'doctor', // Ensure this alias matches the Sequelize association
          attributes: ['id', 'name', 'speciality'], // Add/remove attributes as needed
        },
      ],
      order: [['slotDate', 'DESC'], ['slotTime', 'DESC']], // Sort appointments by date and time
    });

    // Handle case where no appointments are found
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No appointments found for the user.',
      });
    }

    // Respond with retrieved appointments
    return res.status(200).json({
      success: true,
      message: 'Appointments retrieved successfully.',
      appointments,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching user appointments:', error.message, error.stack);

    // Respond with an internal server error
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching appointments. Please try again later.',
    });
  }
};


// Cancel Appointment
export const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.body; // Get appointmentId from the request body
  const isAdmin = req.decoded.role === "admin"; // Check if the user is an admin

  const transaction = await sequelize.transaction();
  try {
    // Find the appointment
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // If not an admin, check if the appointment belongs to the logged-in user
    if (!isAdmin && appointment.userId !== req.userId) {
      await transaction.rollback();
      return res.status(403).json({ success: false, message: 'Unauthorized action. You can only cancel your own appointments.' });
    }

    // Mark the appointment as canceled
    appointment.cancelled = true;
    await appointment.save({ transaction });

    // Optional: Update Doctor's slots_booked (if applicable)
    const doctor = await Doctor.findByPk(appointment.doctorId);
    if (doctor) {
      const slotsBooked = doctor.slots_booked || {};
      const slotDate = appointment.slotDate;

      // Remove the canceled slot from slots_booked
      if (slotsBooked[slotDate]) {
        slotsBooked[slotDate] = slotsBooked[slotDate].filter((slot) => slot !== appointment.slotTime);
        if (slotsBooked[slotDate].length === 0) {
          delete slotsBooked[slotDate];
        }
      }

      await Doctor.update(
        { slots_booked: slotsBooked },
        { where: { id: doctor.id }, transaction }
      );
    }

    await transaction.commit();
    return res.status(200).json({ success: true, message: 'Appointment canceled successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error canceling appointment:', error.message);
    return res.status(500).json({ success: false, message: 'Error canceling appointment.' });
  }
};
// export const cancelAppointment = async (req, res) => {
//   const { appointmentId } = req.body; // Get appointmentId from the request body
//   const isAdmin = req.isAdmin; // Make sure that `isAdmin` is part of the authenticated user data

//   const transaction = await sequelize.transaction();
//   try {
//     // Find the appointment
//     const appointment = await Appointment.findByPk(appointmentId);

//     if (!appointment) {
//       await transaction.rollback();
//       return res.status(404).json({ success: false, message: 'Appointment not found.' });
//     }

//     // Check if the authenticated user is an admin
//     if (!isAdmin) {
//       await transaction.rollback();
//       return res.status(403).json({ success: false, message: 'Unauthorized action.' });
//     }

//     // Mark the appointment as canceled
//     appointment.cancelled = true;
//     await appointment.save({ transaction });

//     // Optional: Update Doctor's slots_booked (if applicable)
//     const doctor = await Doctor.findByPk(appointment.doctorId);
//     if (doctor) {
//       const slotsBooked = doctor.slots_booked || {};
//       const slotDate = appointment.slotDate;

//       // Remove the canceled slot from slots_booked
//       if (slotsBooked[slotDate]) {
//         slotsBooked[slotDate] = slotsBooked[slotDate].filter((slot) => slot !== appointment.slotTime);
//         if (slotsBooked[slotDate].length === 0) {
//           delete slotsBooked[slotDate];
//         }
//       }

//       await Doctor.update(
//         { slots_booked: slotsBooked },
//         { where: { id: doctor.id }, transaction }
//       );
//     }

//     await transaction.commit();
//     return res.status(200).json({ success: true, message: 'Appointment canceled successfully.' });
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Error canceling appointment:', error.message);
//     return res.status(500).json({ success: false, message: 'Error canceling appointment.' });
//   }
// };


export const getAllAppointments = async (req, res) => {
  try {
    const { doctorId, userId, date, view } = req.query;

    // Build query conditions dynamically
    const conditions = {};
    if (doctorId) conditions.doctorId = doctorId;
    if (userId) conditions.userId = userId;
    if (date) conditions.slotDate = date;

    // Calculate date range for `view`
    const currentDate = new Date();
    if (view === 'day') {
      conditions.slotDate = sequelize.where(
        sequelize.fn('DATE', sequelize.col('slotDate')),
        '=',
        currentDate.toISOString().split('T')[0] // Today's date
      );
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
      conditions.slotDate = {
        [sequelize.Op.between]: [
          startOfWeek.toISOString().split('T')[0],
          endOfWeek.toISOString().split('T')[0],
        ],
      };
    } else if (view === 'month') {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of month
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // End of month
      conditions.slotDate = {
        [sequelize.Op.between]: [
          startOfMonth.toISOString().split('T')[0],
          endOfMonth.toISOString().split('T')[0],
        ],
      };
    }

    // Fetch appointments with associated User and Doctor data
    const appointments = await Appointment.findAll({
      where: conditions,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone', 'image'], // Include specific user details
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'speciality', 'fees'], // Include specific doctor details
        },
      ],
      order: [['slotDate', 'ASC'], ['slotTime', 'ASC']], // Order by date and time
    });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No appointments found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointments retrieved successfully.',
      appointments,
    });
  } catch (error) {
    console.error('Error fetching all appointments:', error.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching appointments.',
    });
  }
};


// Get Appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the appointment by ID, including associated User and Doctor data
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone', 'image'], // Include specific user details
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'speciality', 'fees'], // Include specific doctor details
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment retrieved successfully.',
      appointment,
    });
  } catch (error) {
    console.error('Error fetching appointment by ID:', error.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the appointment.',
    });
  }
};


//   console.log('cancelAppointment controller executed with data:', req.body);
//   const transaction = await sequelize.transaction();
//   try {
//     const { appointmentId } = req.body;
//     const userId = req.userId; // Retrieved from auth middleware

//     // Find the appointment
//     const appointment = await Appointment.findByPk(appointmentId);

//     if (!appointment) {
//       await transaction.rollback();
//       return res.status(404).json({ success: false, message: 'Appointment not found.' });
//     }

//     // Ensure the authenticated user owns the appointment
//     if (appointment.userId !== userId) {
//       await transaction.rollback();
//       return res.status(403).json({ success: false, message: 'Unauthorized action.' });
//     }

//     // Mark the appointment as cancelled
//     appointment.cancelled = true;
//     await appointment.save({ transaction });

//     await transaction.commit();
//     return res.status(200).json({ success: true, message: 'Appointment cancelled successfully.' });
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Error cancelling appointment:', error.message);
//     return res.status(500).json({ success: false, message: 'Error cancelling appointment.' });
//   }
// };




// List Appointments for Doctor
export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const doctorId = req.doctorId;

    const appointments = await Appointment.findAll({
      where: { doctorId },
      include: {
        model: User,
        attributes: ['name', 'email', 'image'],
      },
      order: [['slotDate', 'ASC'], ['slotTime', 'ASC']],
    });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching appointments for doctor:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments.' });
  }
};




//Delete appointment
// export const deleteAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if the appointment exists
//     const appointment = await Appointment.findByPk(id);
//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Appointment not found.',
//       });
//     }

//     // Delete the appointment
//     await appointment.destroy();
//     res.status(200).json({
//       success: true,
//       message: 'Appointment deleted successfully.',
//     });
//   } catch (error) {
//     console.error('Error deleting appointment:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while deleting the appointment.',
//     });
//   }
// };
// Delete appointment
export const deleteAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    // Check if the appointment exists
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Optional: Update Doctor's slots_booked
    const doctor = await Doctor.findByPk(appointment.doctorId);
    if (doctor) {
      const slotsBooked = doctor.slots_booked || {};
      const slotDate = appointment.slotDate;

      if (slotsBooked[slotDate]) {
        slotsBooked[slotDate] = slotsBooked[slotDate].filter((slot) => slot !== appointment.slotTime);
        if (slotsBooked[slotDate].length === 0) {
          delete slotsBooked[slotDate];
        }
      }

      await Doctor.update(
        { slots_booked: slotsBooked },
        { where: { id: doctor.id }, transaction }
      );
    }

    // Delete the appointment
    await appointment.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully.',
      appointmentId: id, // Return the ID of the deleted appointment
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting appointment:', error.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the appointment.',
    });
  }
};


//update appointment
export const updateAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params; // Appointment ID to update
    const { doctorId, slotDate, slotTime, amount, isCompleted } = req.body;

    // Fetch the existing appointment
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Check if the doctor exists
    if (doctorId) {
      const doctor = await Doctor.findByPk(doctorId);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found.',
        });
      }

      // Check if the new slot is available
      if (slotDate && slotTime) {
        const existingAppointment = await Appointment.findOne({
          where: { doctorId, slotDate, slotTime },
        });

        if (existingAppointment && existingAppointment.id !== parseInt(id)) {
          return res.status(400).json({
            success: false,
            message: 'The specified slot is already booked for the selected doctor.',
          });
        }
      }
    }

    // Update appointment fields
    appointment.doctorId = doctorId || appointment.doctorId;
    appointment.slotDate = slotDate || appointment.slotDate;
    appointment.slotTime = slotTime || appointment.slotTime;
    appointment.amount = amount || appointment.amount;
    appointment.isCompleted =
      typeof isCompleted === 'boolean' ? isCompleted : appointment.isCompleted;

    // Save the updated appointment
    await appointment.save({ transaction });
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully.',
      appointment,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating appointment:', error.message);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the appointment.',
    });
  }
};