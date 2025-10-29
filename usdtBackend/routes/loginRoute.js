const express = require("express");
const router = express.Router();
const login = require("../controllers/loginController");

router.post("/", login.login);
router.post("/admin", login.AdminLogin);
router.post("/check-session", login.checkSessionStatus);

module.exports = router;
