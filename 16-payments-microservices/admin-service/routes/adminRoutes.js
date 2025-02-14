const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUsers, getAllSubscriptions, getAllPayments, getAllDiscounts, updateUserRole } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', authMiddleware, getAllUsers);
router.get('/subscriptions', authMiddleware, getAllSubscriptions);
router.get('/payments', authMiddleware, getAllPayments);
router.get('/discounts', authMiddleware, getAllDiscounts);
router.put('/users/:id/role', authMiddleware, updateUserRole);

module.exports = router;