import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import { uploadToCloudinary } from "../utils/cloudinary.js"; // For image uploads

dotenv.config();

// Helper function for error handling
const handleServerError = (res, error, message = "Server error. Please try again later.") => {
  console.error(message, error);
  res.status(500).json({ success: false, message });
};

// Helper function to validate ID existence
const validateResourceById = async (Model, id, resourceName) => {
  const resource = await Model.findByPk(id);
  if (!resource) {
    throw new Error(`${resourceName} not found.`);
  }
  return resource;
};

// ADMIN CONTROLLERS

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Generate admin token
    const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET_ADMIN, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully.",
      token,
    });
  } catch (error) {
    handleServerError(res, error, "Admin login error");
  }
};

// Create admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: "Admin already exists." });
    }

    // Hash password and create admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ name, email, password: hashedPassword });

    res.status(201).json({ success: true, message: "Admin created successfully.", admin: newAdmin });
  } catch (error) {
    handleServerError(res, error, "Create admin error");
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ success: true, admins });
  } catch (error) {
    handleServerError(res, error, "Get all admins error");
  }
};

// Update admin
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Validate admin existence
    const admin = await validateResourceById(Admin, id, "Admin");

    // Update fields if provided
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();

    res.status(200).json({ success: true, message: "Admin updated successfully.", admin });
  } catch (error) {
    handleServerError(res, error, "Update admin error");
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate admin existence
    const admin = await validateResourceById(Admin, id, "Admin");

    await admin.destroy();
    res.status(200).json({ success: true, message: "Admin deleted successfully." });
  } catch (error) {
    handleServerError(res, error, "Delete admin error");
  }
};

// Delete user (admin-only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user existence
    const user = await validateResourceById(User, id, "User");

    await user.destroy();
    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    handleServerError(res, error, "Delete user error");
  }
};

// Get all users (admin-only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ success: true, users });
  } catch (error) {
    handleServerError(res, error, "Get all users error");
  }
};

// Get single user (admin-only)
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user existence
    const user = await validateResourceById(User, id, "User");

    res.status(200).json({ success: true, user });
  } catch (error) {
    handleServerError(res, error, "User not found");
  }
};

// Update user profile (admin-only)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, phone, address, dob, gender } = req.body;

    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "profile_images");
      imageUrl = result.secure_url;
    }

    const updateData = {
      name,
      phone,
      address,
      dob,
      gender,
      ...(imageUrl && { image: imageUrl }), // Conditionally add image field
    };

    const [updatedRows] = await User.update(updateData, { where: { id: userId } });

    if (updatedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const updatedUser = await User.findByPk(userId, { attributes: { exclude: ["password"] } });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    handleServerError(res, error, "Update profile error");
  }
};