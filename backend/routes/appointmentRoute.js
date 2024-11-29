import express from 'express';
import {
  bookAppointment,
  cancelAppointment,
  //listAppointments,
  getAppointmentsByUser ,
  getAppointmentsByDoctor,
} from '../controllers/appointmentController.js';
import {
  getDoctorSlots, // Add this to your doctorController.js
} from '../controllers/doctorController.js'; // Ensure this is implemented
import authUser from '../middleware/authUser.js';
import authDoctor from '../middleware/authDoctor.js';

const appointmentRouter = express.Router();

// User Routes
appointmentRouter.post('/book', authUser, bookAppointment);
appointmentRouter.post('/cancel', authUser, cancelAppointment);
//appointmentRouter.get('/user', authUser, listAppointments);
appointmentRouter.get('/profile/:userId', authUser, getAppointmentsByUser);

// Doctor Routes
appointmentRouter.get('/doctor', authDoctor, getAppointmentsByDoctor);

// New Route: Fetch booked slots for a specific doctor
appointmentRouter.get('/doctors/:doctorId/slots', getDoctorSlots);

export default appointmentRouter;