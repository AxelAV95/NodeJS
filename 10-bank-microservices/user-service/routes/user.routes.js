const { Router } = require("express");

const router = Router();
const protectAuth = require("../middleware/protectAuth")


const {
  register,
  login,
  account
} = require("../controllers/user.controller.js");
const { registerValidation, loginValidation } = require("../validations/auth");
const { handleValidationErrors } = require("../validations/errors");

router.post("/register",registerValidation,handleValidationErrors, register);
router.post("/login", loginValidation, handleValidationErrors,login);
router.get("/account/:userId", protectAuth, account);

module.exports = router;

