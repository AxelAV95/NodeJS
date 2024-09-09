const {body} = require("express-validator")

// Expresión regular para validar la cédula de 9 dígitos
const cedulaRegex = /^\d{9}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

exports.registerValidation = [
    body("nombre", "Nombre no tiene la longitud que se espera").isLength({min: 3}),
    body("apellidos", "Apellidos no tiene la longitud que se espera").isLength({min: 3}),
    body("cedula", "Ingrese una cédula válida").matches(cedulaRegex),
    body("password", "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character").matches(passwordRegex)
]

exports.loginValidation = [
    body("cedula", "Ingrese una cédula válida").matches(cedulaRegex),
    body("password", "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character").matches(passwordRegex)
]