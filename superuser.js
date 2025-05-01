const bcrypt = require('bcrypt');
const db = require('./db');
const readline = require('readline');
const { validateSignup } = require('./models/User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const createAdmin = async (name, email, password) => {
    const { isValid, errors } = validateSignup({ name, email, password });
    if (!isValid) {
        console.error('Validation errors:', errors);
        rl.close();
        process.exit(1);
    }

    const checkEmailQuery = 'SELECT email FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking email existence:', err);
            rl.close();
            process.exit(1);
        }

        if (results.length > 0) {
            console.error('Email is already in use.');
            rl.close();
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "superuser")';
        db.query(query, [name, email, hashedPassword], (err) => {
            if (err) {
                console.error('Error creating admin:', err);
            } else {
                console.log('Admin created successfully!');
            }
            rl.close();
            process.exit(0);
        });
    });
};

rl.question('Enter name for admin: ', (name) => {
    rl.question('Enter email for admin: ', (email) => {
        rl.question('Enter password for admin: ', (password) => {
            createAdmin(name, email, password);
        });
    });
});
