const nodemailer = require('nodemailer');
const { ContactValidator } = require('../models/User');
require('dotenv').config();

exports.contact = (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    const { isValid, errors } = ContactValidator({ name, email, phone, subject, message });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.GMAIL_USER,
        replyTo: email,
        subject: subject,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Message</title>
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
                    background: #333399;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }
                .header h2 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .content p {
                    margin: 10px 0;
                    font-size: 16px;
                }
                .content strong {
                    color: #333399;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    background: #f9f9f9;
                    font-size: 14px;
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h2>New Contact Message</h2>
                </div>
                <div class="content">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                </div>
                <div class="footer">
                    <p>
                        This message was sent from the contact form on your website.
                    </p>
                </div>
            </div>
        </body>
        </html>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            res.status(500).json({message: 'An error occurred while sending the email.'});
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({message: 'Your message has been sent successfully!'});
        }
    });
}