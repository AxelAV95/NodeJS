const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.get('/', usuarioController.getAllUsuarios);
router.post('/', usuarioController.createUsuario);

module.exports = router;