const nodemailer = require("nodemailer");
require("dotenv").config();

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: process.env.SMTP_SECURE === "false" ? false : true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

/**
 * Verify email configuration
 * @returns {Promise<boolean>}
 */
async function verifyConnection() {
  try {
    await transporter.verify();
    console.log("Email service is ready");
    return true;
  } catch (error) {
    console.error("Email service error:", error);
    return false;
  }
}

/**
 * Send OTP email
 * @param {string} to - Recipient email
 * @param {string} otp - One-time password
 * @returns {Promise<void>}
 */
async function sendOTPEmail(to, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"CodeMaster LMS" <${process.env.SMTP_USER}>`,
      to,
      subject: "Your OTP Code",
      text: `Your one-time password is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>CodeMaster LMS - OTP Verification</h2>
          <p>Your one-time password is:</p>
          <h1 style="color: #4F46E5; font-size: 32px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <hr>
          <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });
    
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
}

module.exports = { 
  sendOTPEmail,
  verifyConnection
};