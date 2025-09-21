const express = require("express");
const router = express.Router();
const login = require("../controllers/loginController");

router.post("/", login.login);
router.post("/admin", login.AdminLogin);

module.exports = router;
