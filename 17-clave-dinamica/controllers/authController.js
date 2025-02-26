const { body, validationResult } = require('express-validator');
const UserModel = require('../models/userModel');
const DynamicKeyModel = require('../models/dynamicKeyModel');
const bcrypt = require('bcrypt');
const { generateRandomPositions, generateToken } = require('../utils/helpers');

const AuthController = {
  // Validaciones para registro
  registerValidation: [
    body('username')
      .isLength({ min: 4, max: 50 }).withMessage('El nombre de usuario debe tener entre 4 y 50 caracteres')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    body('password')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],

  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    try {
      const { username, password } = req.body;
      const userId = await UserModel.createUser(username, password);
      await DynamicKeyModel.generateDynamicKeys(userId);
      res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      } else {
        res.status(500).json({ error: 'Error interno al registrar el usuario' });
      }
    }
  },

  // Validaciones para login paso 1
  loginStep1Validation: [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],

  async loginStep1(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    try {
      const { username, password } = req.body;
      const user = await UserModel.findUserByUsername(username);
      if (!(await bcrypt.compare(password, user.contraseña))) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
      const positions = generateRandomPositions();
      const token = generateToken(user.id_usuario, positions, '5m'); // Token con posiciones, 5 minutos
      console.log(positions); // Para depuración
      res.json({
        message: 'Credenciales válidas, por favor verifica las claves dinámicas',
        positions: positions.map(([f, c]) => `${c}${f}`),
        token,
      });
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.status(500).json({ error: 'Error interno al procesar el login' });
      }
    }
  },

  // Validaciones para login paso 2
  loginStep2Validation: [
    body('values')
      .isArray({ min: 3, max: 3 }).withMessage('Debe proporcionar exactamente 3 valores')
      .custom(values => values.every(v => Number.isInteger(v) && v >= 1 && v <= 99))
      .withMessage('Los valores deben ser enteros entre 1 y 99'),
  ],

  async loginStep2(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    try {
      const { values } = req.body;
      const { userId, positions } = req; // Posiciones vienen del token vía middleware
      console.log(positions); // Para depuración
      console.log(values);   // Para depuración
      const expectedValues = await DynamicKeyModel.getDynamicKeyValues(userId, positions);
      if (!values.every((v, i) => v === expectedValues[i])) {
        return res.status(401).json({ error: 'Claves dinámicas incorrectas' });
      }
      const accessToken = generateToken(userId, null, '1h'); // Token de acceso por 1 hora, sin posiciones
      res.json({ message: 'Autenticación exitosa', accessToken });
    } catch (error) {
      if (error.message === 'Error al recuperar claves dinámicas') {
        res.status(500).json({ error: 'Error al verificar las claves dinámicas' });
      } else {
        res.status(500).json({ error: 'Error interno en la verificación' });
      }
    }
  },
};

module.exports = AuthController;