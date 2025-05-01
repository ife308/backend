const bcrypt = require('bcrypt');
const db = require('../db');
const { AddadminValidator, ValidateLogin } = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

exports.adminLogin = (req, res) => {
    const { email, password } = req.body;

    const { isValid, errors } = ValidateLogin({ email, password });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const query = 'SELECT * FROM users WHERE email = ? AND role IN ("admin", "superuser")';
    db.query(query, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const admin = results[0];
        bcrypt.compare(password, admin.password, (compareErr, isMatch) => {
            if (compareErr || !isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            req.session.admin = { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
            res.json({ message: 'Admin login successful!' });
        });
    });
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

exports.addAdmin = async (req, res) => {
    try {
        const pass = crypto.randomBytes(5).toString('hex');
        const { name, email } = req.body;

        const { isValid, errors } = AddadminValidator({ name, email });
        if (!isValid) {
            return res.status(400).json({ message: 'Validation errors', errors });
        }

        const [results] = await db.promise().query('SELECT email FROM users WHERE email = ?', [email]);
        if (results.length > 0) {
            return res.status(409).json({ message: 'Email is already in use' });
        }

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Welcome to AI for EducatorS',
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome Email</title>
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
                        <h2>Welcome to <b>AI for Educators!</b></h2>
                    </div>
                    <div class="content">
                        <p>Hi <strong>${name}</strong>,</p>
                        <p>We are thrilled to have you join our platform. Your role is pivotal in shaping the way educators, students, and institutions harness the power of artificial intelligence to foster engaging learning environments.</p>
                        <p>To get started, log in to your admin dashboard. Your temporary password is: <strong>${pass}</strong></p>
                        <p>Once again, welcome aboard! Together, we'll transform the future of education.</p>
                    </div>
                    <div class="footer">
                        <p>
                            Best regards, <br>
                            AI for Educators Team
                        </p>
                    </div>
                </div>
            </body>
            </html>`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.error('Error sending email:', mailErr);
            return res.status(500).json({ message: 'Failed to send the email. Please use a valid email address.' });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);

        const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "admin")';
        await db.promise().query(insertQuery, [name, email, hashedPassword]);

        console.log('Admin created successfully!');
        return res.status(201).json({ message: 'Admin created successfully!' });

    } catch (error) {
        console.error('Error in addAdmin function:', error);
        return res.status(500).json({ message: 'An internal server error occurred.' });
    }
};



exports.admin = (req, res) => {
    if (req.session && req.session.admin) {
        res.json({
            success: true,
            user: {
                name: req.session.admin.name,
                email: req.session.admin.email,
                image: req.session.admin.image,
                role: req.session.admin.role

            },
        });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};



exports.adminLogout = (req, res) => {
    if (req.session.admin) {
        delete req.session.admin;

        return res.status(200).json({ message: 'Logged Out Successfully' });
    } else {
        return res.status(400).json({ message: 'No user session found' });
    }

};