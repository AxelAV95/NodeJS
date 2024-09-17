const { Router } = require("express");
const router = Router();

const authMiddleware = require("../middleware/auth.middleware")

const {
  register,
  login,
  logout,
  test
} = require("../controllers/auth.controller.js");
const { registerValidation, loginValidation } = require("../validations/auth");
const { handleValidationErrors } = require("../validations/errors");

router.post("/register", registerValidation,handleValidationErrors, register);
router.post("/login", loginValidation, handleValidationErrors,login);
router.post("/logout",logout);
router.get("/protected", authMiddleware,test);

module.exports = router;

