const express = require('express');
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', AuthController.registerValidation, AuthController.register);
router.post('/login/step1', AuthController.loginStep1Validation, AuthController.loginStep1);
router.post('/login/step2', verifyToken, AuthController.loginStep2Validation, AuthController.loginStep2);

module.exports = router;