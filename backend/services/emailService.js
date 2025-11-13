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
      from: `"EduTrack Pro LMS - Security Team" <${process.env.SMTP_USER}>`,
      to,
      subject: "Your Verification Code for EduTrack Pro LMS",
      text: `Your verification code is ${otp}. This code will expire in 2 minutes. If you didn't request this code, please ignore this email.`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Verification Code - EduTrack Pro LMS</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6;">
          
          <!-- Wrapper Table -->
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa; padding: 40px 0;">
            <tr>
              <td align="center" style="padding: 0;">
                
                <!-- Main Container -->
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  
                  <!-- Logo & Header -->
                  <tr>
                    <td style="padding: 48px 40px 32px; text-align: center; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="text-align: center;">
                            <div style="width: 64px; height: 64px; background-color: rgba(255,255,255,0.2); border-radius: 16px; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
                              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9"/>
                                <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
                                <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
                              </svg>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
                              EduTrack Pro LMS
                            </h1>
                            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">
                              Secure Account Verification
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 48px 40px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        
                        <!-- Greeting -->
                        <tr>
                          <td style="padding-bottom: 24px;">
                            <h2 style="margin: 0 0 12px; color: #1a1a1a; font-size: 22px; font-weight: 600; line-height: 1.3;">
                              Hello,
                            </h2>
                            <p style="margin: 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                              We received a request to access your EduTrack Pro LMS account. To ensure the security of your account, please use the verification code below.
                            </p>
                          </td>
                        </tr>

                        <!-- OTP Box -->
                        <tr>
                          <td style="padding: 32px 0;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); border: 2px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
                              <tr>
                                <td style="padding: 32px; text-align: center;">
                                  <p style="margin: 0 0 16px; color: #6B7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px;">
                                    YOUR VERIFICATION CODE
                                  </p>
                                  <div style="display: inline-block; background-color: #ffffff; padding: 20px 40px; border-radius: 8px; border: 1px solid #E5E7EB; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                    <span style="color: #4F46E5; font-size: 42px; font-weight: 700; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace; display: inline-block;">
                                      ${otp}
                                    </span>
                                  </div>
                                  <p style="margin: 16px 0 0; color: #6B7280; font-size: 14px; line-height: 1.5;">
                                    Code expires in <strong style="color: #DC2626;">2 minutes</strong>
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Instructions -->
                        <tr>
                          <td style="padding: 24px 0;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #EFF6FF; border-left: 4px solid #3B82F6; border-radius: 6px;">
                              <tr>
                                <td style="padding: 20px 24px;">
                                  <p style="margin: 0 0 12px; color: #1E40AF; font-size: 15px; font-weight: 600;">
                                    📋 Quick Steps:
                                  </p>
                                  <ol style="margin: 0; padding-left: 20px; color: #1F2937; font-size: 14px; line-height: 1.8;">
                                    <li style="margin-bottom: 6px;">Return to the login page on EduTrack Pro LMS</li>
                                    <li style="margin-bottom: 6px;">Enter the 6-digit code shown above</li>
                                    <li style="margin-bottom: 6px;">Click "Verify" to complete authentication</li>
                                  </ol>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Security Warning -->
                        <tr>
                          <td style="padding: 24px 0 0;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 6px;">
                              <tr>
                                <td style="padding: 20px 24px;">
                                  <p style="margin: 0 0 8px; color: #92400E; font-size: 15px; font-weight: 600;">
                                    🔒 Security Reminder
                                  </p>
                                  <p style="margin: 0; color: #78350F; font-size: 14px; line-height: 1.6;">
                                    <strong>Important:</strong> Our support team will never ask you for this code. If you didn't request this verification, please disregard this email and ensure your account password is secure.
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Additional Info -->
                        <tr>
                          <td style="padding: 32px 0 0; border-top: 1px solid #E5E7EB; margin-top: 32px;">
                            <p style="margin: 0 0 8px; color: #6B7280; font-size: 14px; line-height: 1.6;">
                              If you're having trouble accessing your account, please contact our support team at:
                            </p>
                            <p style="margin: 0; color: #4F46E5; font-size: 14px; font-weight: 600;">
                              support@edutrackprolms.com
                            </p>
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 40px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="text-align: center; padding-bottom: 16px;">
                            <p style="margin: 0; color: #9CA3AF; font-size: 13px; line-height: 1.6;">
                              <strong style="color: #6B7280;">EduTrack Pro LMS</strong><br>
                              Building Tomorrow's Developers Today
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center; padding-top: 16px; border-top: 1px solid #E5E7EB;">
                            <p style="margin: 0 0 8px; color: #9CA3AF; font-size: 12px;">
                              © 2024 EduTrack Pro LMS. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #9CA3AF; font-size: 12px; line-height: 1.5;">
                              This is an automated security message. Please do not reply to this email.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
                
                <!-- Email Client Notice -->
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; margin-top: 16px;">
                  <tr>
                    <td style="text-align: center; padding: 0 20px;">
                      <p style="margin: 0; color: #9CA3AF; font-size: 11px; line-height: 1.5;">
                        If you're having trouble viewing this email, please check your spam folder or contact support.
                      </p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>

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