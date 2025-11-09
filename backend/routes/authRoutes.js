const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    console.log('📧 Send OTP Request received:', req.body);
    
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ 
                error: 'Email and role are required' 
            });
        }

        // Validate role
        if (!['teacher', 'student'].includes(role)) {
            return res.status(400).json({ 
                error: 'Invalid role. Must be teacher or student' 
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log('Generated OTP:', otp, 'for', email);

        // Check if user exists
        const userCheck = await pool.query(
            'SELECT id FROM lms.users WHERE email = $1 AND role = $2',
            [email, role]
        );

        let userId;

        if (userCheck.rows.length > 0) {
            // Update existing user
            userId = userCheck.rows[0].id;
            await pool.query(
                'UPDATE lms.users SET otp_code = $1, otp_expires_at = $2, updated_at = NOW() WHERE id = $3',
                [otp, otpExpires, userId]
            );
            console.log('✅ Updated existing user:', userId);
        } else {
            // Create new user
            const newUser = await pool.query(
                'INSERT INTO lms.users (email, role, otp_code, otp_expires_at) VALUES ($1, $2, $3, $4) RETURNING id',
                [email, role, otp, otpExpires]
            );
            userId = newUser.rows[0].id;
            console.log('✅ Created new user:', userId);
        }

        // Send OTP via email
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your OTP Code - EduTrack Pro',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0d9488;">EduTrack Pro - OTP Verification</h2>
                    <p>Your One-Time Password (OTP) is:</p>
                    <h1 style="color: #0d9488; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px;">EduTrack Pro - Learning Management System</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent to:', email);

        res.json({ 
            success: true, 
            message: 'OTP sent successfully',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only in dev
        });

    } catch (error) {
        console.error('❌ Send OTP Error:', error);
        res.status(500).json({ 
            error: 'Failed to send OTP. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    console.log('🔐 Verify OTP Request received:', req.body);
    
    try {
        const { email, otp, role } = req.body;

        if (!email || !otp || !role) {
            return res.status(400).json({ 
                error: 'Email, OTP, and role are required' 
            });
        }

        // Verify OTP
        const result = await pool.query(
            `SELECT id, email, role, otp_code, otp_expires_at 
             FROM lms.users 
             WHERE email = $1 AND role = $2`,
            [email, role]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        const user = result.rows[0];

        // Check if OTP matches
        if (user.otp_code !== otp) {
            return res.status(400).json({ 
                error: 'Invalid OTP' 
            });
        }

        // Check if OTP expired
        if (new Date() > new Date(user.otp_expires_at)) {
            return res.status(400).json({ 
                error: 'OTP has expired. Please request a new one.' 
            });
        }

        // Get profile data
        let profile;
        if (role === 'teacher') {
            const teacherData = await pool.query(
                'SELECT * FROM lms.teachers WHERE user_id = $1',
                [user.id]
            );
            profile = teacherData.rows[0] || null;
        } else {
            const studentData = await pool.query(
                'SELECT * FROM lms.students WHERE user_id = $1',
                [user.id]
            );
            profile = studentData.rows[0] || null;
        }

        // Update last login and clear OTP
        await pool.query(
            'UPDATE lms.users SET last_login = NOW(), otp_code = NULL, otp_expires_at = NULL WHERE id = $1',
            [user.id]
        );

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        console.log('✅ OTP verified for:', email);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profile
            }
        });

    } catch (error) {
        console.error('❌ Verify OTP Error:', error);
        res.status(500).json({ 
            error: 'Failed to verify OTP. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;