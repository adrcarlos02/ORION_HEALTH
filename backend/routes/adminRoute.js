// /routes/adminRoute.js
import express from 'express';
import { loginAdmin, getAllAppointments } from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js';

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.get('/appointments', authAdmin, getAllAppointments);

export default adminRouter;