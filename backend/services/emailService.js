const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail service
  auth: {
    user: process.env.SMTP_USER, // your app email
    pass: process.env.SMTP_PASS, // app password
  },
});

/**
 * Send OTP email
 * @param {string} to - recipient email
 * @param {number|string} otp - OTP code
 */
async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: `"SmartRoad AI" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Password Reset OTP',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${to}`);
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send OTP email');
  }
}

module.exports = { sendOTPEmail };
