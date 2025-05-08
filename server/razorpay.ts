
import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials must be set in environment variables');
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function createOrder(amount: number) {
  return razorpay.orders.create({
    amount: amount * 100, // Convert to smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  });
}

export async function verifyPayment(orderId: string, paymentId: string, signature: string) {
  const text = orderId + "|" + paymentId;
  const crypto = require('crypto');
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex');
  return generated_signature === signature;
}
