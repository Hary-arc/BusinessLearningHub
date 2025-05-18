
import '@testing-library/jest-dom';

// Mock window.Razorpay
window.Razorpay = jest.fn().mockImplementation(() => ({
  open: jest.fn()
}));
