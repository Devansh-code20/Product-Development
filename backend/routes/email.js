const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/auth');

// Create transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// POST /api/email/send — Admin: send reply email to customer
router.post('/send', authMiddleware, async (req, res) => {
  const { to, toName, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ message: 'Recipient email, subject, and message are required.' });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return res.status(400).json({ message: 'Invalid recipient email address.' });
  }

  try {
    const transporter = createTransporter();

    // Verify connection before sending
    await transporter.verify();

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #00897B; padding: 20px 30px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 22px;">AI-Solutions</h2>
          <p style="color: #E0F2F1; margin: 4px 0 0 0; font-size: 13px;">Intelligent Software Solutions</p>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="color: #333; font-size: 15px; margin-top: 0;">Dear ${toName || 'there'},</p>
          <div style="color: #444; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #888; font-size: 13px; margin: 0;">
            Best regards,<br/>
            <strong style="color: #00897B;">The AI-Solutions Team</strong><br/>
            <a href="mailto:${process.env.EMAIL_USER}" style="color: #00897B;">${process.env.EMAIL_USER}</a>
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 12px 30px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #aaa; font-size: 11px; margin: 0;">
            This email was sent by AI-Solutions Admin Panel · Sunderland, UK
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || `AI-Solutions <${process.env.EMAIL_USER}>`,
      to: `${toName || ''} <${to}>`,
      subject: subject,
      text: message, // plain text fallback
      html: htmlBody,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${to} — Message ID: ${info.messageId}`);
    res.json({ 
      message: 'Email sent successfully!',
      messageId: info.messageId,
      to: to
    });

  } catch (error) {
    console.error('❌ Email send error:', error.message);
    
    // Friendly error messages
    if (error.code === 'EAUTH') {
      return res.status(500).json({ message: 'Email authentication failed. Check your Gmail App Password in .env file.' });
    }
    if (error.code === 'ECONNECTION') {
      return res.status(500).json({ message: 'Could not connect to email server. Check internet connection.' });
    }
    
    res.status(500).json({ message: `Failed to send email: ${error.message}` });
  }
});

module.exports = router;