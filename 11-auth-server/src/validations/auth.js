const { body } = require('express-validator');

// Expresiones regulares para validación
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;


exports.registerValidation = [
    // Validación del campo 'email'
    body('email')
        .isString()
        .matches(emailRegex)
        .withMessage('El correo electrónico debe ser válido'),

    // Validación del campo 'password'
    body('password')
        .isString()
        .matches(passwordRegex)
        .withMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un dígito y un carácter especial'),
];

exports.loginValidation = [
    body('email')
        .isString()
        .matches(emailRegex)
        .withMessage('El correo electrónico debe ser válido'),

    // Validación del campo 'password'
    body('password')
        .isString()
        .matches(passwordRegex)
        .withMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un dígito y un carácter especial'),
]
