const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.register = async (req, res) => {
    const { name, email, password, address, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query to find the user by email
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // Check if user exists
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if password is valid
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token with user id and role
        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send back user data and token
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email,
                role: user.rows[0].role
            }
        });
    } catch (err) {
        console.error(err.message); // Log error for debugging
        res.status(500).json({ error: err.message });
    }
};


exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Fetch the existing password
        const userQuery = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = userQuery.rows[0];

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Old password is incorrect." });
        }

        // Validate new password
        if (!/(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}/.test(newPassword)) {
            return res.status(400).json({
                error: "New password must be 8-16 characters, contain one uppercase letter, and one special character."
            });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error." });
    }
};