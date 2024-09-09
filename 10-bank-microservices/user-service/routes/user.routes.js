const { Router } = require("express");

const router = Router();

const {
  register,
  login
} = require("../controllers/user.controller.js");
const { registerValidation, loginValidation } = require("../validations/auth");
const { handleValidationErrors } = require("../validations/errors");

router.post("/register",registerValidation,handleValidationErrors, register);
router.post("/login", loginValidation, handleValidationErrors,login);
// router.get("/account", protectAuth, account);

module.exports = router;

