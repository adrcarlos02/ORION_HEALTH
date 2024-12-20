import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// Helper function to send error responses
const handleError = (res, error, message = 'An error occurred') => {
  console.error(error);
  res.status(500).json({ success: false, message });
};

// Doctor Login
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find doctor by email
    const doctor = await Doctor.findOne({ where: { email } });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: doctor.id, role: 'doctor' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Respond with token
    res.status(200).json({ success: true, token, message: 'Login successful.' });
  } catch (error) {
    handleError(res, error, 'Failed to login doctor.');
  }
};

// Add a New Doctor
export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    // Check if doctor with email already exists
    const existingDoctor = await Doctor.findOne({ where: { email } });
    if (existingDoctor) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new doctor
    const newDoctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: typeof address === 'string' ? JSON.parse(address) : address,
    });

    // Respond with doctor details
    res.status(201).json({
      success: true,
      message: 'Doctor added successfully.',
      doctor: { id: newDoctor.id, name: newDoctor.name, email: newDoctor.email },
    });
  } catch (error) {
    handleError(res, error, 'Failed to add doctor.');
  }
};

// Get Doctor Profile
export const getDoctorProfile = async (req, res) => {
  try {
    const { docId } = req.params;

    // Fetch doctor profile by ID
    const doctor = await Doctor.findByPk(docId, {
      attributes: { exclude: ['password'] },
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Respond with doctor profile
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    handleError(res, error, 'Failed to fetch doctor profile.');
  }
};

// Update Doctor Profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const { docId } = req.params;
    const { fees, address, available } = req.body;

    // Ensure at least one field is provided for update
    if (!fees && !address && available === undefined) {
      return res.status(400).json({ success: false, message: 'No fields to update provided.' });
    }

    // Prepare fields to update
    const updatedFields = {};
    if (fees) updatedFields.fees = fees;
    if (address) updatedFields.address = typeof address === 'string' ? JSON.parse(address) : address;
    if (available !== undefined) updatedFields.available = available;

    // Update doctor profile
    const [updated] = await Doctor.update(updatedFields, { where: { id: docId } });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Doctor not found or no changes made.' });
    }

    // Respond with success message
    res.status(200).json({ success: true, message: 'Doctor profile updated successfully.' });
  } catch (error) {
    handleError(res, error, 'Failed to update doctor profile.');
  }
};


// Get Doctor Slots

export const getDoctorSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query; // Expecting a query parameter for date (e.g., YYYY-MM-DD)

  try {
    // Validate the input parameters
    if (!doctorId || isNaN(doctorId)) {
      return res.status(400).json({ success: false, message: 'Invalid doctorId. It must be a numeric value.' });
    }

    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    // Check if the doctor exists
    const doctor = await Doctor.findByPk(doctorId, {
      attributes: ['id', 'name', 'speciality'],
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Fetch appointments for the given doctor and date, excluding canceled appointments
    const appointments = await Appointment.findAll({
      where: {
        doctorId,
        slotDate: date,
        cancelled: false, // Only include non-canceled appointments
      },
      attributes: ['slotTime'], // Fetch only the slotTime field
    });

    // Map the booked slots
    const bookedSlots = appointments.map((appointment) => appointment.slotTime);

    // Respond with booked slots
    res.status(200).json({
      success: true,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        speciality: doctor.speciality,
      },
      bookedSlots,
    });
  } catch (error) {
    console.error('Error fetching doctor slots:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch doctor slots. Please try again later.' });
  }
};


// export const getDoctorSlots = async (req, res) => {
//   const { doctorId } = req.params;
//   const { date } = req.query; // Expecting a query parameter for date (e.g., YYYY-MM-DD)

//   try {
//     // Validate the input parameters
//     if (!doctorId || isNaN(doctorId)) {
//       return res.status(400).json({ success: false, message: 'Invalid doctorId.' });
//     }

//     if (!date || isNaN(Date.parse(date))) {
//       return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
//     }

//     // Check if the doctor exists
//     const doctor = await Doctor.findByPk(doctorId, {
//       attributes: ['id', 'name', 'speciality'],
//     });

//     if (!doctor) {
//       return res.status(404).json({ success: false, message: 'Doctor not found.' });
//     }

//     // Fetch appointments for the given doctor and date
//     const appointments = await Appointment.findAll({
//       where: { doctorId, slotDate: date, cancelled },
//       attributes: ['slotTime'], // Fetch only slotTime
//     });

//     // Map the booked slots
//     const bookedSlots = appointments.map((appointment) => appointment.slotTime);

//     res.status(200).json({ success: true, bookedSlots });
//   } catch (error) {
//     console.error('Error fetching doctor slots:', {
//       message: error.message,
//       stack: error.stack,
//     });
//     res.status(500).json({ success: false, message: 'Failed to fetch doctor slots.' });
//   }
// };

//   const { doctorId } = req.params;
//   const { date } = req.query; // Expecting a query parameter for date (e.g., YYYY-MM-DD)

//   try {
//     // Validate that the doctor exists
//     const doctor = await Doctor.findByPk(doctorId, {
//       attributes: ['id', 'name', 'speciality'],
//     });
    
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: 'Doctor not found.' });
//     }

//     // Fetch booked slots for the given doctor and date from the Appointment table
//     const appointments = await Appointment.findAll({
//         where: { doctorId, slotDate: date },
//         attributes: ['slotTime'], // Only fetch the booked slot times
//       });

//     // Extract booked slots for the specified date
//     const slotsBooked = doctor.slots_booked[date] || [];
//     res.status(200).json({ success: true, bookedSlots: slotsBooked });
//   } catch (error) {
//     handleError(res, error, 'Failed to fetch doctor slots.');
//   }
// };