const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post("/make-payment", paymentController.makePayment);
router.post("/withdraw", paymentController.withdraw);

module.exports = router;