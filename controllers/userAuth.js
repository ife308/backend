const bcrypt = require('bcrypt');
const db = require('../db');
const { validateSignup, ValidateLogin } = require('../models/User');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    const { isValid, errors } = validateSignup({ name, email, password });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    const checkEmailQuery = 'SELECT email FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length > 0) {
            // Email already exists
            return res.status(409).json({ message: 'Email already in use' });
        }

        try {
            //encrypt the password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // query to insert the user details to the users table in the database
            const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

            // process the  databse query and pass in the value name, email, hashedPassword into the query then return a successful message if the process is successful and throw error if there is an error
            db.query(query, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Database insert error:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                };
                console.log('User registered:', result.insertId);

                // Store user details in the session
                req.session.user = {
                    id: result.insertId,
                    name: name,
                    email: email
                };

                res.status(200).json({ message: 'Signup successful!' });
            });
        } catch (error) {
            console.error('Password hashing error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

};

exports.login = async (req, res) => {

    // get the email and password entered by user in the login form
    const { email, password } = req.body;

    const { isValid, errors } = ValidateLogin({ email, password });
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    // query to get user data from users table in the database where the email is equal to the email enter by the user
    const sql = 'SELECT * FROM users WHERE email = ?';

    // process the  databse query and pass in the value email into the query to check for the user email in the database and the match variable is used to compare password and and the password entered by the user
    db.query(sql, [email], async (err, results) => {
        if (err) {
            // Handle database query errors
            return res.status(500).json({ message: 'Database error' });
        }
        const user = results[0];
        if (user) {

            // Compare provided password with hashed password
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // Store user details in the session
                req.session.regenerate((err) => {
                    if (err) {
                        console.error('Session regeneration failed:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    req.session.user = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    };


                    console.log('Session saved:', req.session.user);
                    res.status(200).json({ message: 'Login successful!' });
                });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });

}

exports.user = (req, res) => {
    if (req.session && req.session.user) {
        res.json({
            success: true,
            user: {
                name: req.session.user.name,
                email: req.session.user.email,
                image: req.session.user.image,
            },
        });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};



exports.logout = (req, res) => {
    console.log('Session:', req.session);
    console.log('Session user:', req.session.user);
    if (req.session.user) {
        delete req.session.user;
        return res.status(200).json({ message: 'Logged Out Successfully' });
    } else {
        return res.status(400).json({ message: 'No user session found' });
    }

};

