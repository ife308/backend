const db = require('../db');
const bcrypt = require('bcrypt');
const { EditUserValidator } = require('../models/User');

exports.edit = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const imageUrl = req.file ? req.file.path : null;

        const { name, email, password } = req.body;
        const userId = req.session.user.id;

        const { isValid, errors } = EditUserValidator({ name, email, password, imageUrl });
        if (!isValid) {
            return res.status(400).json({ success: false, errors });
        }

        if (!name && !email && !password && !imageUrl) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        if (name) {
            await new Promise((resolve, reject) => {
                const query = 'UPDATE users SET name = ? WHERE id = ?';
                db.query(query, [name, userId], (err) => {
                    if (err) {
                        console.error('Error updating name:', err);
                        return reject(new Error('Error updating name'));
                    }
                    req.session.user.name = name;
                    resolve();
                });
            });
        }

        if (email) {
            await new Promise((resolve, reject) => {
                const checkEmailQuery = 'SELECT email FROM users WHERE email = ?';
                db.query(checkEmailQuery, [email], (err, results) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return reject(new Error('Internal server error'));
                    }

                    if (results.length > 0) {
                        return reject(new Error('Email already in use'));
                    }

                    const query = 'UPDATE users SET email = ? WHERE id = ?';
                    db.query(query, [email, userId], (err) => {
                        if (err) {
                            console.error('Error updating email:', err);
                            return reject(new Error('Error updating email'));
                        }
                        req.session.user.email = email;
                        resolve();
                    });
                });
            });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await new Promise((resolve, reject) => {
                const query = 'UPDATE users SET password = ? WHERE id = ?';
                db.query(query, [hashedPassword, userId], (err) => {
                    if (err) {
                        console.error('Error updating password:', err);
                        return reject(new Error('Error updating password'));
                    }
                    resolve();
                });
            });
        }

        if (imageUrl) {
            await new Promise((resolve, reject) => {
                const query = 'UPDATE users SET image = ? WHERE id = ?';
                db.query(query, [imageUrl, userId], (err) => {
                    if (err) {
                        console.error('Error updating profile image:', err);
                        return reject(new Error('Error updating profile image'));
                    }
                    req.session.user.image = imageUrl;
                    resolve();
                });
            });
        }

        // Save session updates before responding
        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ message: 'Error saving session' });
            }
            res.json({ message: 'User updated successfully' });
        });
    } catch (err) {
        console.error('Error updating user:', err.message);
        if (err.message === 'Email already in use') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}


exports.deletePhoto = (req, res) => {
    const userId = req.session.user.id;

    const query = 'UPDATE users SET image = NULL WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error deleting profile image:', err);
            return res.status(500).json({ message: 'Error deleting profile image' });
        } else {
            req.session.user.image = '';
            res.status(200).json({ message: 'Profile image deleted Successfully' });
        }
    })
}