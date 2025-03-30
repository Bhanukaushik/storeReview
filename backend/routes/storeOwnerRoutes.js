const express = require('express');
const { getRatingsForStore, getAverageRating, getOwnerStores} = require('../controllers/storeOwnerController');
const { authMiddleware, storeOwnerMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ratings', authMiddleware, storeOwnerMiddleware, getRatingsForStore);
router.get('/average-rating', authMiddleware, storeOwnerMiddleware, getAverageRating);
router.get('/my-store', authMiddleware, storeOwnerMiddleware, getOwnerStores);

module.exports = router;
