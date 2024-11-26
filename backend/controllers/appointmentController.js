import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

export const bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, slotDate, slotTime } = req.body;

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor || !doctor.available) {
      return res.status(404).json({ success: false, message: 'Doctor not available' });
    }

    const isSlotTaken = await Appointment.findOne({
      where: { doctorId, slotDate, slotTime },
    });
    if (isSlotTaken) {
      return res.status(400).json({ success: false, message: 'Slot not available' });
    }

    const appointment = await Appointment.create({
      userId,
      doctorId,
      slotDate,
      slotTime,
      amount: doctor.fees,
    });

    res.status(201).json({ success: true, message: 'Appointment booked', appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentsByUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const appointments = await Appointment.findAll({
      where: { userId },
      include: { model: Doctor, attributes: ['name', 'speciality'] },
    });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const appointments = await Appointment.findAll({
      where: { doctorId },
      include: { model: User, attributes: ['name', 'email'] },
    });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await appointment.update({ cancelled: true });
    res.status(200).json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};