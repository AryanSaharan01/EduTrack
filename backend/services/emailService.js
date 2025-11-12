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
      subject: "🔐 Your OTP Verification Code - CodeMaster LMS",
      text: `Your one-time password is ${otp}. It expires in 10 minutes.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <div style="background-color: rgba(255, 255, 255, 0.15); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                <span style="font-size: 36px; color: white;">🔐</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                CodeMaster LMS
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px; font-weight: 400;">
                Learning Management System
              </p>
            </div>

            <!-- Main Content -->
            <div style="padding: 50px 40px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h2 style="color: #1a202c; margin: 0 0 15px; font-size: 24px; font-weight: 600;">
                  Verify Your Identity
                </h2>
                <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.6;">
                  We've sent you a secure verification code to complete your login process.
                </p>
              </div>

              <!-- OTP Code Container -->
              <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px dashed #cbd5e0; border-radius: 16px; padding: 30px; text-align: center; margin: 40px 0;">
                <p style="color: #4a5568; margin: 0 0 15px; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                  Your Verification Code
                </p>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 36px; font-weight: 800; letter-spacing: 8px; padding: 20px; border-radius: 12px; font-family: 'Courier New', monospace; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);">
                  ${otp}
                </div>
              </div>

              <!-- Timer and Instructions -->
              <div style="background-color: #fff5f5; border-left: 4px solid #f56565; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                  <span style="color: #e53e3e; font-size: 18px; margin-right: 10px;">⏰</span>
                  <strong style="color: #c53030; font-size: 16px;">Time Sensitive</strong>
                </div>
                <p style="color: #744210; margin: 0; font-size: 14px; line-height: 1.5;">
                  This verification code will expire in <strong>10 minutes</strong> for security reasons. Please use it immediately to complete your authentication.
                </p>
              </div>

              <!-- Instructions -->
              <div style="background-color: #f0fff4; border: 1px solid #9ae6b4; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h3 style="color: #22543d; margin: 0 0 15px; font-size: 18px; font-weight: 600;">
                  📝 How to use this code:
                </h3>
                <ol style="color: #2d3748; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li style="margin-bottom: 8px;">Return to the CodeMaster LMS login page</li>
                  <li style="margin-bottom: 8px;">Enter the 6-digit code exactly as shown above</li>
                  <li style="margin-bottom: 8px;">Click "Verify" to complete your login</li>
                </ol>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                  Continue to CodeMaster LMS →
                </a>
              </div>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #fffaf0; border-top: 1px solid #fed7aa; padding: 25px 40px;">
              <div style="display: flex; align-items: flex-start;">
                <span style="color: #dd6b20; font-size: 20px; margin-right: 12px; margin-top: 2px;">🛡️</span>
                <div>
                  <h4 style="color: #9c4221; margin: 0 0 8px; font-size: 16px; font-weight: 600;">
                    Security Notice
                  </h4>
                  <p style="color: #744210; margin: 0; font-size: 14px; line-height: 1.6;">
                    If you didn't request this verification code, please ignore this email. Your account remains secure. Never share this code with anyone.
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #2d3748; padding: 30px 40px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <span style="color: #a0aec0; font-size: 24px; margin-right: 15px;">📚</span>
                <span style="color: #a0aec0; font-size: 24px; margin-right: 15px;">💻</span>
                <span style="color: #a0aec0; font-size: 24px; margin-right: 15px;">🎓</span>
                <span style="color: #a0aec0; font-size: 24px;">✨</span>
              </div>
              <p style="color: #a0aec0; margin: 0 0 10px; font-size: 14px;">
                © 2024 CodeMaster LMS. All rights reserved.
              </p>
              <p style="color: #718096; margin: 0; font-size: 12px; line-height: 1.5;">
                This is an automated message. Please do not reply to this email.<br>
                If you need assistance, contact our support team.
              </p>
            </div>
          </div>

          <!-- Mobile Responsive Styles -->
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; }
              .header-padding { padding: 30px 20px !important; }
              .content-padding { padding: 30px 20px !important; }
              .otp-code { font-size: 28px !important; letter-spacing: 4px !important; }
            }
          </style>
        </body>
        </html>
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