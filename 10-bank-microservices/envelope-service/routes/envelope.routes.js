const { Router } = require("express");
const router = Router();

// Importar las funciones del controlador
const {
  createEnvelope,
  testeo,
  loadToEnvelope,
  updateEnvelopeAmount,
  getAllEnvelopes,
  loadToAccount,
  deleteEnvelop
//   withdrawMoneyFromEnvelope,
//   deleteEnvelope
} = require("../controllers/envelope.controller.js");
const { createEnvelopeValidations } = require("../validations/envelope.validations.js");
const { handleValidationErrors } = require("../validations/errors");

// Crear un nuevo sobre
router.post("/",createEnvelopeValidations,handleValidationErrors, createEnvelope);
router.post("/load", loadToEnvelope);
router.put("/", updateEnvelopeAmount)
router.get("/:sobreCuentaId", getAllEnvelopes)
router.put("/transfer", loadToAccount)
router.post("/testeo", testeo)
router.delete("/remove", deleteEnvelop)

// // Cargar dinero a un sobre desde una cuenta asociada
// router.post("/load", loadMoneyToEnvelope);

// // Descargar dinero de un sobre a una cuenta asociada
// router.post("/withdraw", withdrawMoneyFromEnvelope);

// // Eliminar un sobre y devolver el dinero a la cuenta asociada
// router.delete("/:sobreid", deleteEnvelope);

module.exports = router;