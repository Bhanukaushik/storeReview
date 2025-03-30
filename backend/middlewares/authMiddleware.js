const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Access Denied. No token provided or incorrect format." });
    }

    const token = authHeader.split(' ')[1]; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

exports.adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access Denied. Admins only." });
    }
    next();
};

exports.storeOwnerMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'store_owner') {
        return res.status(403).json({ error: "Access Denied. Store Owners only." });
    }
    next();
};
