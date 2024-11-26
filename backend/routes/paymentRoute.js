import express from 'express';
import {
  initiateRazorpayPayment,
  verifyRazorpayPayment,
  initiateStripePayment,
  verifyStripePayment,
} from '../controllers/paymentController.js';
import authUser from '../middleware/authUser.js';

const paymentRouter = express.Router();

paymentRouter.post('/razorpay/initiate', authUser, initiateRazorpayPayment);
paymentRouter.post('/razorpay/verify', authUser, verifyRazorpayPayment);
paymentRouter.post('/stripe/initiate', authUser, initiateStripePayment);
paymentRouter.post('/stripe/verify', authUser, verifyStripePayment);

export default paymentRouter;