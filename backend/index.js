const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const storeOwnerRoutes = require('./routes/storeOwnerRoutes');

require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'https://store-review-hzkj.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow requests with no origin (like mobile apps)

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow preflight methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow headers
    credentials: true,
}));

// Log request origin to debug CORS issues
app.use((req, res, next) => {
    console.log('Request Origin:', req.get('Origin'));  // Logs the request origin
    next();
});

app.use(express.json());

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/store-owner', storeOwnerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ error: 'Internal Server Error' }); // Send a JSON response for errors
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
