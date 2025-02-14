const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/me', authMiddleware, getUser);
router.put('/me', authMiddleware, updateUser);
router.delete('/me', authMiddleware, deleteUser);

module.exports = router;