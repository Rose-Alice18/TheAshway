const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const DeliveryRequest = require('../models/DeliveryRequest');

// Create a test email transporter
// In production, use real email credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

// Submit delivery request
router.post('/request', async (req, res) => {
  try {
    const { name, contact, itemDescription, pickupPoint, dropoffPoint, deliveryType, notes } = req.body;

    // Save to database
    const deliveryRequest = new DeliveryRequest({
      name,
      contact,
      itemDescription,
      pickupPoint,
      dropoffPoint,
      deliveryType,
      notes,
    });

    await deliveryRequest.save();

    // Log the request
    console.log('📦 New delivery request saved:', deliveryRequest);

    // Prepare email content
    const deliveryTypeNames = {
      instant: 'Instant Delivery (2-4 hours)',
      'next-day': 'Next-Day Delivery',
      'weekly-station': 'Weekly Station Pickup',
    };

    const emailContent = `
      <h2>🚚 New Delivery Request - The Ashway</h2>

      <h3>Customer Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Contact:</strong> ${contact}</li>
      </ul>

      <h3>Delivery Details:</h3>
      <ul>
        <li><strong>Item:</strong> ${itemDescription}</li>
        <li><strong>Pickup Point:</strong> ${pickupPoint}</li>
        <li><strong>Drop-off Point:</strong> ${dropoffPoint}</li>
        <li><strong>Delivery Type:</strong> ${deliveryTypeNames[deliveryType]}</li>
        ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
      </ul>

      <p><em>Request received at: ${new Date().toLocaleString()}</em></p>
    `;

    // Try to send email (will fail if credentials not configured)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@theashway.com',
        to: process.env.DEVELOPER_EMAIL || 'developer@theashway.com',
        subject: `New Delivery Request from ${name}`,
        html: emailContent,
      });
      console.log('✅ Email notification sent!');
    } catch (emailError) {
      console.log('⚠️  Email sending failed (configure EMAIL_USER and EMAIL_PASS in .env)');
      console.log('Request data saved to console instead.');
    }

    res.json({
      success: true,
      message: 'Delivery request received! We will contact you shortly.',
      requestId: `DEL-${Date.now()}`,
    });
  } catch (error) {
    console.error('Delivery request error:', error);
    res.status(500).json({ error: 'Failed to process delivery request' });
  }
});

// ============ ADMIN ROUTES ============

// Get all delivery requests (admin only)
router.get('/admin/all', async (req, res) => {
  try {
    const deliveries = await DeliveryRequest.find().sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch deliveries', message: error.message });
  }
});

// Authorize a delivery request (admin only)
router.put('/admin/:id/authorize', async (req, res) => {
  try {
    const { authorizedBy } = req.body;
    const delivery = await DeliveryRequest.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (delivery.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending deliveries can be authorized' });
    }

    delivery.status = 'authorized';
    delivery.authorizedBy = authorizedBy;
    delivery.authorizedAt = new Date();

    await delivery.save();

    console.log(`✅ Delivery ${delivery._id} authorized by ${authorizedBy}`);

    res.json({
      success: true,
      message: 'Delivery authorized successfully',
      delivery,
    });
  } catch (error) {
    console.error('Authorize delivery error:', error);
    res.status(500).json({ error: 'Failed to authorize delivery', message: error.message });
  }
});

// Assign rider to delivery (admin only)
router.put('/admin/:id/assign', async (req, res) => {
  try {
    const { riderName } = req.body;
    const delivery = await DeliveryRequest.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (delivery.status !== 'authorized') {
      return res.status(400).json({ error: 'Only authorized deliveries can be assigned to riders' });
    }

    if (!riderName) {
      return res.status(400).json({ error: 'Rider name is required' });
    }

    delivery.status = 'assigned';
    delivery.assignedRider = riderName;
    delivery.assignedAt = new Date();

    await delivery.save();

    console.log(`🏍️ Delivery ${delivery._id} assigned to ${riderName}`);

    res.json({
      success: true,
      message: `Delivery assigned to ${riderName}`,
      delivery,
    });
  } catch (error) {
    console.error('Assign rider error:', error);
    res.status(500).json({ error: 'Failed to assign rider', message: error.message });
  }
});

// Update delivery status (admin/rider)
router.put('/admin/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await DeliveryRequest.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const validStatuses = ['pending', 'authorized', 'assigned', 'in-progress', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    delivery.status = status;
    await delivery.save();

    console.log(`📦 Delivery ${delivery._id} status updated to ${status}`);

    res.json({
      success: true,
      message: `Delivery status updated to ${status}`,
      delivery,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status', message: error.message });
  }
});

module.exports = router;
