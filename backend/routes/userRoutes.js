const express = require('express');
const {
    listStores,
    rateStore,
    updateRating,
    deleteRating,
    getUserRatings
} = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/ratings', authMiddleware, getUserRatings);
router.get('/stores', authMiddleware, listStores);
router.post('/rate', authMiddleware, rateStore);
router.put('/rate/:id', authMiddleware, updateRating);
router.delete('/rate/:id', authMiddleware, deleteRating);

module.exports = router;
