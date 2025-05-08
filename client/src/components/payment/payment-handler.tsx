
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PaymentHandlerProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentHandler({ amount, onSuccess, onError }: PaymentHandlerProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create order on server
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment order');
      }
      
      const { orderId, keyId } = await response.json();
      if (!orderId || !keyId) {
        throw new Error('Invalid payment configuration received');
      }

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: "INR",
        name: "Business Learn",
        description: "Course Payment",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });
            
            const { valid } = await verifyResponse.json();
            if (valid) {
              onSuccess(response.razorpay_payment_id);
            } else {
              onError('Payment verification failed');
            }
          } catch (error) {
            onError('Payment verification failed');
          }
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com"
        },
        theme: {
          color: "#2563eb"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      onError('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </Button>
  );
}
