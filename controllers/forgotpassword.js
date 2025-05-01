const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { ForgotPasswordValidator, ResetPasswordValidator } = require('../models/User');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const RESET_TOKEN_EXPIRY = '1h';

const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
});

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    const { isValid, errors } = ForgotPasswordValidator({ email });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const userQuery = 'SELECT id, name, email FROM users WHERE email = ?';
    db.query(userQuery, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const user = results[0];
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: RESET_TOKEN_EXPIRY });

        const resetLink = `http://localhost:3000/reset-password?token=${token}`;

        transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: 'Reset Your Password - AI for Educators',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        margin: 0;
                        padding: 0;
                        line-height: 1.6;
                        color: #333;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    .header {
                        background: #000033;
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h2 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content p {
                        margin: 10px 0;
                        font-size: 16px;
                    }
                    .content strong {
                        color: #000033;
                    }
                    .button-container {
                        text-align: center;
                        margin: 20px 0;
                    }
                    .button {
                        background: #000033;
                        color: white;
                        text-decoration: none;
                        padding: 10px 20px;
                        font-size: 16px;
                        border-radius: 5px;
                        display: inline-block;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        background: #f9f9f9;
                        font-size: 14px;
                        color: #555;
                    }
                    a {
                        color: #000033;
                        text-decoration: none;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h2>Reset Your Password</h2>
                    </div>
                    <div class="content">
                        <p>Hi <strong>${user.name}</strong>,</p>
                        <p>We received a request to reset your password for your AI for Educators account. Click the button below to reset your password:</p>
                        <div class="button-container">
                            <a href="${resetLink}" class="button">Reset Password</a>
                        </div>
                        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                        <p>Note: The link is valid for 1 hour only.</p>
                    </div>
                    <div class="footer">
                        <p>
                            Best regards, <br>
                            AI for Educators Team
                        </p>
                    </div>
                </div>
            </body>
            </html>`,
        }, (mailErr) => {
            if (mailErr) {
                console.error('Error sending email:', mailErr);
                return res.status(500).json({ message: 'Failed to send reset link' });
            }

            res.status(200).json({ message: 'Password reset link sent successfully!' });
        });
    });
};

exports.resetPassword = (req, res) => {
    const { token, newPassword } = req.body;

    const { isValid, errors } = ResetPasswordValidator({ token, newPassword });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;

        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to hash password' });
            }

            const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
            db.query(updateQuery, [hashedPassword, userId], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Failed to update password' });
                }

                res.status(200).json({ message: 'Password reset successfully!' });
            });
        });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};