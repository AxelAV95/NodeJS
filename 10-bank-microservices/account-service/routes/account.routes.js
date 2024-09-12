const { Router } = require("express");

const router = Router();
const protectAuth = require("../middleware/protectAuth")

const {
  account,
  getAccountAmount,
  updateAccountAmount
} = require("../controllers/account.controller.js");


router.get("/:userId", protectAuth, account);
router.get("/summary/:cuentaid", getAccountAmount)
router.put("/:cuentaid", updateAccountAmount)
module.exports = router;
