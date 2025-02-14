const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createSubscription, getSubscription, updateSubscription, deleteSubscription, getUserSubscriptions, activateSubscription, renewSubscription } = require('../controllers/subscriptionController');

const router = express.Router();

router.post('/', authMiddleware, createSubscription);
router.get('/:id', authMiddleware, getSubscription);
router.put('/:id', authMiddleware, updateSubscription);
router.delete('/:id', authMiddleware, deleteSubscription);
router.get('/user/me', authMiddleware, getUserSubscriptions);
router.post('/activate', activateSubscription);
router.post('/renew',  renewSubscription);
// router.post('/activate', authMiddleware, activateSubscription);
// router.post('/renew', authMiddleware, renewSubscription);

module.exports = router;