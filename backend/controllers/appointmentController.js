import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';

export const bookAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, doctorId, slotDate, slotTime } = req.body;

    // Validate doctor availability
    const doctor = await Doctor.findByPk(doctorId, { transaction });
    if (!doctor || !doctor.available) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Doctor not available' });
    }

    // Check if slot is already booked
    const isSlotTaken = await Appointment.findOne({
      where: { doctorId, slotDate, slotTime },
      transaction,
    });
    if (isSlotTaken) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'This time slot is already booked.' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      userId,
      doctorId,
      slotDate,
      slotTime,
      amount: doctor.fees,
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ success: true, message: 'Appointment booked successfully.', appointment });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: 'Error booking appointment. Please try again.' });
  }
};

export const getAppointmentsByUser = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;

    const whereClause = { userId };
    if (startDate && endDate) {
      whereClause.slotDate = { [Op.between]: [startDate, endDate] };
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: { model: Doctor, attributes: ['name', 'speciality'] },
    });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching appointments.' });
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId, startDate, endDate } = req.body;

    const whereClause = { doctorId };
    if (startDate && endDate) {
      whereClause.slotDate = { [Op.between]: [startDate, endDate] };
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: { model: User, attributes: ['name', 'email'] },
    });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching appointments.' });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId, userId } = req.body;

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Ensure only authorized users can cancel
    if (appointment.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this appointment.' });
    }

    await appointment.destroy(); // Soft delete if `paranoid` is enabled
    res.status(200).json({ success: true, message: 'Appointment cancelled successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error cancelling appointment.' });
  }
};