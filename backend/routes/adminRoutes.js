const express = require("express");
const {
  addUser,
  addStore,
  getStats,
  listUsers,
  listStores,
  getUserDetails,
} = require("../controllers/adminController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add-user", authMiddleware, adminMiddleware, addUser);
router.post("/add-store", authMiddleware, adminMiddleware, addStore);
router.get("/stats", authMiddleware, adminMiddleware, getStats);
router.get("/users", authMiddleware, adminMiddleware, listUsers);
router.get("/stores", authMiddleware, adminMiddleware, listStores);
router.get("/user/:id", authMiddleware, adminMiddleware, getUserDetails);

module.exports = router;
