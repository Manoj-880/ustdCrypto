const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post("/make-payment", paymentController.makePayment);

module.exports = router;