import express from "express";
import cors from 'cors';
import 'dotenv/config';
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import appointmentRouter from './routes/appointmentRoute.js';
import paymentRouter from './routes/paymentRoute.js';


// app config
const app = express();
const port = process.env.PORT || 7000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server started on PORT:${port}`));
}

export default app;
app.use("/api/admin", adminRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/payments', paymentRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});