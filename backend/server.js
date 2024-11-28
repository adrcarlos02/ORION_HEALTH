// server.js
import express from "express";
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from "./config/db.js"; // Corrected import
import { connectCloudinary } from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import appointmentRouter from './routes/appointmentRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Import cookie-parser

// App configuration
const app = express();
const port = process.env.PORT || 7001;

dotenv.config();

// Connect to database and cloud services
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser

// Configure CORS to allow credentials and specify origin
app.use(
  cors({
    origin: 'http://localhost:7002', 
    credentials: true, // Allow cookies to be sent
  })
);

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/payments', paymentRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Start the server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server started on PORT:${port}`));
}

export default app;