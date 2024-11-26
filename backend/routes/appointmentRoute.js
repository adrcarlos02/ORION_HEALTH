import express from 'express';
import {
  bookAppointment,
  getAppointmentsByUser,
  getAppointmentsByDoctor,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import authUser from '../middleware/authUser.js';
import authDoctor from '../middleware/authDoctor.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/book', authUser, bookAppointment);
appointmentRouter.get('/user', authUser, getAppointmentsByUser);
appointmentRouter.get('/doctor', authDoctor, getAppointmentsByDoctor);
appointmentRouter.post('/cancel', authUser, cancelAppointment);

export default appointmentRouter;