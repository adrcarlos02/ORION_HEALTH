import express from 'express';
import {
  loginDoctor,
  addDoctor,
  getDoctorProfile,
  updateDoctorProfile,
} from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';
import authAdmin from '../middleware/authAdmin.js';

const doctorRouter = express.Router();

doctorRouter.post('/login', loginDoctor);
doctorRouter.post('/add', authAdmin, addDoctor); // Only admin can add doctors
doctorRouter.get('/profile', authDoctor, getDoctorProfile);
doctorRouter.put('/profile', authDoctor, updateDoctorProfile);

export default doctorRouter;