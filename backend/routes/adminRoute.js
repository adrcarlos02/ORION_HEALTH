import express from "express";
import {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getAllUsers,
  deleteUser,
  getSingleUser,
  updateUser,
} from "../controllers/adminController.js";

import {
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';

import { registerUser } from "../controllers/userController.js";
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router();

// Admin authentication
adminRouter.post("/login", loginAdmin);

// Admin profile routes
adminRouter.get("/profile", authAdmin, getAdminProfile);
adminRouter.put("/profile", authAdmin, updateAdminProfile);

// Admin CRUD
adminRouter.post("/admins", authAdmin, createAdmin);
adminRouter.get("/admins", authAdmin, getAllAdmins);
adminRouter.put("/admins/:id", authAdmin, updateAdmin);
adminRouter.delete("/admins/:id", authAdmin, deleteAdmin);

// User management
adminRouter.post("/users", authAdmin, registerUser);
adminRouter.get("/users", authAdmin, getAllUsers); 
adminRouter.get("/users/:id", authAdmin, getSingleUser);
adminRouter.put("/users/:id", authAdmin, updateUser);
adminRouter.delete("/users/:id", authAdmin, deleteUser);

// Appointment management
adminRouter.get("/appointments", authAdmin, getAllAppointments); 
adminRouter.get("/appointments/:id", authAdmin, getAppointmentById);
adminRouter.put("/appointments/:id", authAdmin, updateAppointment);
adminRouter.delete("/appointments/:id", authAdmin, deleteAppointment);

// 404 fallback
adminRouter.all("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

export default adminRouter;