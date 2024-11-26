import Razorpay from 'razorpay';
import Stripe from 'stripe';
import Appointment from '../models/Appointment.js';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const initiateRazorpayPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment || appointment.cancelled) {
      return res.status(404).json({ success: false, message: 'Appointment not valid for payment' });
    }

    const options = {
      amount: appointment.amount * 100, // Convert to smallest currency unit
      currency: process.env.CURRENCY,
      receipt: `${appointmentId}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify payment signature
    const crypto = require('crypto');
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const appointmentId = razorpay_order_id; // Use receipt as the appointment ID
    await Appointment.update({ payment: true }, { where: { id: appointmentId } });

    res.status(200).json({ success: true, message: 'Payment successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const initiateStripePayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment || appointment.cancelled) {
      return res.status(404).json({ success: false, message: 'Appointment not valid for payment' });
    }

    const currency = process.env.CURRENCY.toLowerCase();
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: 'Appointment Fees' },
            unit_amount: appointment.amount * 100, // Convert to smallest currency unit
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?appointmentId=${appointmentId}`,
      cancel_url: `${req.headers.origin}/cancel?appointmentId=${appointmentId}`,
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyStripePayment = async (req, res) => {
  try {
    const { appointmentId, success } = req.body;

    if (success === 'true') {
      await Appointment.update({ payment: true }, { where: { id: appointmentId } });
      return res.status(200).json({ success: true, message: 'Payment successful' });
    }

    res.status(400).json({ success: false, message: 'Payment failed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};