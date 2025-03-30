const pool = require('../config/db');

// Get user's ratings
exports.getUserRatings = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT store_id, rating
            FROM ratings
            WHERE user_id = $1
        `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong while fetching ratings" });
    }
};

// List all stores (with optional search & average rating)
exports.listStores = async (req, res) => {
    try {
        const { name, address } = req.query;
        let query = `
            SELECT s.id, s.name, s.email, s.address, 
                   COALESCE(AVG(r.rating), 0) AS average_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        let values = [];

        if (name) {
            query += " AND s.name ILIKE $" + (values.length + 1);
            values.push(`%${name}%`);
        }
        if (address) {
            query += " AND s.address ILIKE $" + (values.length + 1);
            values.push(`%${address}%`);
        }

        query += " GROUP BY s.id";

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong while fetching stores" });
    }
};

// Submit or update rating for a store
exports.rateStore = async (req, res) => {
    const { store_id, rating } = req.body;

    if (!store_id || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Invalid rating. It must be between 1 and 5." });
    }

    try {
        // Check if the user already rated this store
        const existingRating = await pool.query(
            'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
            [req.user.id, store_id]
        );

        if (existingRating.rows.length > 0) {
            // Update the existing rating
            await pool.query(
                'UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3',
                [rating, req.user.id, store_id]
            );
            return res.json({ message: 'Rating updated successfully' });
        }

        // Insert a new rating
        await pool.query(
            'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)',
            [req.user.id, store_id, rating]
        );
        res.json({ message: 'Rating submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong while submitting rating" });
    }
};

// Modify user’s rating
exports.updateRating = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    try {
        const result = await pool.query(
            'UPDATE ratings SET rating = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [rating, id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Rating not found or unauthorized." });
        }

        res.json({ message: 'Rating updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong while updating rating" });
    }
};

// Delete user’s rating
exports.deleteRating = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM ratings WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Rating not found or unauthorized." });
        }

        res.json({ message: 'Rating deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong while deleting rating" });
    }
};
