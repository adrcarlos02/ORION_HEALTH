// server.js
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js"; // Ensure this matches your actual file name
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import appointmentRouter from './routes/appointmentRoute.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer'; // Import multer for error handling

dotenv.config();

// App configuration
const app = express();
const port = process.env.PORT || 7001;

// Connect to database and cloud services
connectDB();
connectCloudinary();

// Middlewares
app.use(cors({
  origin: 'http://localhost:7002', // Update this to your frontend's origin
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files (for uploaded images)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use('/api/appointments', appointmentRouter);

// Root route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    // General errors
    console.error('General error:', err);
    res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  } else {
    next();
  }
});

// Start the server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server started on PORT:${port}`));
}

export default app;