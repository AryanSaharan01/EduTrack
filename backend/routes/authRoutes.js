const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { sendOTPEmail } = require('../services/emailService');

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    try {
        const { email, role } = req.body;

        console.log('📧 Send OTP Request received:', { email, role });

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
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

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

        // Send OTP via email using the email service
        await sendOTPEmail(email, otp);
        console.log('✅ OTP email sent to:', email);

        // Instead of 204 with no body, send 200 with JSON:
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only in dev
        });

    } catch (error) {
        console.error('❌ Error in /send-otp:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
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