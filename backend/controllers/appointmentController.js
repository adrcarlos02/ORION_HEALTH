import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import sequelize from '../config/db.js';

// Book Appointment
export const bookAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    console.log("REQBODY", req.body);
    const { doctorId, slotDate, slotTime } = req.body;
    const userId = req.userId; // Retrieved from auth middleware

    if (!doctorId || !slotDate || !slotTime) {
      await transaction.rollback();
      console.log('####', doctorId, slotDate, slotTime);
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const doctor = await Doctor.findByPk(doctorId, {
      attributes: ['id', 'name', 'speciality', 'fees', 'slots_booked', 'available'],
    });

    if (!doctor || !doctor.available) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Doctor not available.' });
    }

    const slotsBooked = doctor.slots_booked || {};
    if (slotsBooked[slotDate]?.includes(slotTime)) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Slot already booked.' });
    }

    if (!slotsBooked[slotDate]) {
      slotsBooked[slotDate] = [];
    }
    slotsBooked[slotDate].push(slotTime);

    await Doctor.update(
      { slots_booked: slotsBooked },
      { where: { id: doctorId } }
    );

    const appointment = await Appointment.create(
      {
        userId,
        doctorId,
        slotDate,
        slotTime,
        amount: doctor.fees,
      }
    );

    await transaction.commit();
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      appointment,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error booking appointment:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Cancel Appointment
export const cancelAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;

    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (appointment.userId !== userId) {
      await transaction.rollback();
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    appointment.cancelled = true;
    await appointment.save({ transaction });

    const doctor = await Doctor.findByPk(appointment.doctorId);
    const slotsBooked = doctor.slots_booked || {};
    slotsBooked[appointment.slotDate] = slotsBooked[appointment.slotDate]?.filter(
      (slot) => slot !== appointment.slotTime
    );

    if (!slotsBooked[appointment.slotDate]?.length) {
      delete slotsBooked[appointment.slotDate];
    }

    await Doctor.update({ slots_booked: slotsBooked }, { where: { id: doctor.id }, transaction });

    await transaction.commit();
    res.status(200).json({ success: true, message: 'Appointment cancelled successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ success: false, message: 'Error cancelling appointment.' });
  }
};

// /**
//  * List Appointments for Authenticated User.
//  */
// export const listAppointments = async (req, res) => {
//   try {
//     console.log('Entering listAppointments');
//     const userId = req.userId; // Retrieved from auth middleware
//     console.log('User ID:', userId);

//     if (!userId) {
//       console.error("Error: User ID is missing.");
//       return res.status(400).json({ success: false, message: 'User ID is missing.' });
//     }

//     // Fetch appointments with associated Doctor data
//     const appointments = await Appointment.findAll({
//       where: { userId },
//       include: [
//         {
//           model: Doctor,
//           as: 'doctor', // Ensure this matches the association alias
//           attributes: ['id', 'name', 'speciality', 'image', 'address'],
//         },
//       ],
//       order: [['slotDate', 'DESC'], ['slotTime', 'DESC']],
//     });

//     console.log('Fetched appointments:', appointments);
//     res.status(200).json({ success: true, appointments });
//   } catch (error) {
//     console.error('Error fetching user appointments:', error.message, error.stack);
//     res.status(500).json({ success: false, message: 'Error fetching appointments.' });
//   }
// };

// Get All Appointments for a Specific User
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