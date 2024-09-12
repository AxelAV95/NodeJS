const {body} = require("express-validator")

exports.createEnvelopeValidations = [
    body("sobrenombre", "Nombre no tiene la longitud que se espera").isLength({ min: 3 }),
    body("sobremonto", "Monto no es válido").isFloat({ min: 0 }).isLength({ max: 10 }),
    body("sobreCuentaId", "Ingrese una cuenta válida").notEmpty(),
    
]
