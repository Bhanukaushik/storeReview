const pool = require('../config/db');

// Get ratings for the store owned by the logged-in user
exports.getRatingsForStore = async (req, res) => {
  try {
      // Fetch the store owned by the logged-in store owner
      const store = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [req.user.id]);

      if (store.rows.length === 0) {
          return res.status(403).json({ error: "You do not own any stores" });
      }

      const storeId = store.rows[0].id;

      // Fetch ratings for that store
      const ratings = await pool.query(
          'SELECT users.name, ratings.rating FROM ratings JOIN users ON ratings.user_id = users.id WHERE ratings.store_id = $1',
          [storeId]
      );

      res.json(ratings.rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};


// Get the average rating of the store owned by the logged-in user
exports.getAverageRating = async (req, res) => {
    try {
        // Fetch store ID based on the logged-in store owner
        const store = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [req.user.id]);

        if (store.rows.length === 0) {
            return res.status(403).json({ error: "You do not own any stores" });
        }

        const storeId = store.rows[0].id;

        // Calculate the average rating for the store
        const rating = await pool.query(
            'SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings WHERE store_id = $1',
            [storeId]
        );

        res.json({ average_rating: parseFloat(rating.rows[0].average_rating).toFixed(2) });

    } catch (err) {
        console.error("Error fetching average rating:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getOwnerStores = async (req, res) => {
  try {
      // Fetch stores where the logged-in user is the owner
      const stores = await pool.query('SELECT * FROM stores WHERE owner_id = $1', [req.user.id]);

      if (stores.rows.length === 0) {
          return res.status(404).json({ error: "You do not own any stores." });
      }

      res.json(stores.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
  }
};

