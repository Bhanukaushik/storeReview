const pool = require('../config/db');
const bcrypt = require('bcryptjs');

//  Add a new user (Admin, Store Owner, or Normal User)
exports.addUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;
    
    if (!['admin', 'user', 'store_owner'].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Allowed roles: admin, user, store_owner" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashedPassword, address, role]
        );
        res.status(201).json({ message: 'User added successfully', user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new store


exports.addStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;

        // Validate input
        if (!name || !email || !address || !owner_id) {
            return res.status(400).json({ error: "All fields are required: name, email, address, owner_id" });
        }

        // Check if the owner_id exists and is a store owner
        const ownerCheck = await pool.query('SELECT * FROM users WHERE id = $1 AND role = $2', [owner_id, 'store_owner']);

        if (ownerCheck.rows.length === 0) {
            return res.status(400).json({ error: "Invalid owner_id. The user must be a store owner." });
        }

        // Insert into stores table
        const newStore = await pool.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, address, owner_id]
        );

        res.status(201).json({ message: "Store added successfully", store: newStore.rows[0] });

    } catch (error) {
        console.error("Error adding store:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get statistics (Total Users, Stores, Ratings)
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
        const totalStores = await pool.query('SELECT COUNT(*) FROM stores');
        const totalRatings = await pool.query('SELECT COUNT(*) FROM ratings');

        res.json({
            totalUsers: totalUsers.rows[0].count,
            totalStores: totalStores.rows[0].count,
            totalRatings: totalRatings.rows[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List users (with optional filtering by role)
exports.listUsers = async (req, res) => {
    const { role } = req.query;
    let query = 'SELECT id, name, email, address, role FROM users';
    let values = [];

    if (role) {
        query += ' WHERE role = $1';
        values.push(role);
    }

    try {
        const users = await pool.query(query, values);
        res.json(users.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  List stores (with optional filtering by name or address)
exports.listStores = async (req, res) => {
    const { name, address } = req.query;
    let query = 'SELECT * FROM stores WHERE 1=1';
    let values = [];

    if (name) {
        values.push(`%${name}%`);
        query += ` AND name ILIKE $${values.length}`;
    }
    if (address) {
        values.push(`%${address}%`);
        query += ` AND address ILIKE $${values.length}`;
    }

    try {
        const stores = await pool.query(query, values);
        res.json(stores.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  View user details (including rating if Store Owner)
exports.getUserDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        let userData = user.rows[0];

        if (userData.role === 'store_owner') {
            const ratings = await pool.query(
                'SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = $1',
                [id]
            );
            userData.average_rating = ratings.rows[0].average_rating || "No ratings yet";
        }

        res.json(userData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
