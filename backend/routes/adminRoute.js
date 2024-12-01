import express from "express";
import {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile, // Import the updateAdminProfile controller
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
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';

import authAdmin from "../middleware/authAdmin.js"; // Ensure middleware is correctly imported

const adminRouter = express.Router();

// Admin authentication
adminRouter.post("/login", loginAdmin);

// Admin profile routes
adminRouter.get("/profile", authAdmin, getAdminProfile); // Fetch profile
adminRouter.put("/profile", authAdmin, updateAdminProfile); // Update profile

// Admin CRUD
adminRouter.post("/admins", authAdmin, createAdmin);
adminRouter.get("/admins", authAdmin, getAllAdmins);
adminRouter.put("/admins/:id", authAdmin, updateAdmin);
adminRouter.delete("/admins/:id", authAdmin, deleteAdmin);

// User management
adminRouter.get("/users", authAdmin, getAllUsers);
adminRouter.get("/users/:id", authAdmin, getSingleUser);
adminRouter.put("/users/:id", authAdmin, updateUser);
adminRouter.delete("/users/:id", authAdmin, deleteUser);

// Appointment management
adminRouter.get("/appointments", authAdmin, getAllAppointments);
adminRouter.put("/appointments/:id", authAdmin, updateAppointment);
adminRouter.delete("/appointments/:id", authAdmin, deleteAppointment);

export default adminRouter;