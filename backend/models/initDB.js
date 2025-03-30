const pool = require('../config/db');

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(60) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                address VARCHAR(400),
                role VARCHAR(20) CHECK (role IN ('admin', 'user', 'store_owner')) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS stores (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                address VARCHAR(400) NOT NULL,
                owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS ratings (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                store_id INT REFERENCES stores(id) ON DELETE CASCADE,
                rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL
            );
        `);
        console.log("Tables created successfully!");
    } catch (err) {
        console.error("Error creating tables:", err.message);
    }
};

createTables();
