const express = require('express');
const router = express.Router();

// Mock payment processing for tips
router.post('/tip', async (req, res) => {
  try {
    const { driverId, amount, method, phoneNumber } = req.body;

    console.log('💰 Payment request received:', {
      driverId,
      amount,
      method,
      phoneNumber: phoneNumber ? phoneNumber.replace(/\d(?=\d{4})/g, '*') : 'N/A',
    });

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock payment success (in production, integrate with Paystack/Momo API)
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    console.log(`✅ Payment successful! Reference: ${paymentReference}`);

    res.json({
      success: true,
      message: 'Payment processed successfully!',
      reference: paymentReference,
      amount,
      method,
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed',
    });
  }
});

// Mock Paystack webhook endpoint
router.post('/webhook/paystack', (req, res) => {
  console.log('📨 Paystack webhook received:', req.body);
  res.json({ success: true });
});

// Mock Mobile Money callback
router.post('/callback/momo', (req, res) => {
  console.log('📱 Mobile Money callback received:', req.body);
  res.json({ success: true });
});

module.exports = router;
