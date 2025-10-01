const express = require('express');
const router = express.Router();
const walletRequestsController = require('../controllers/withdrawalRequestController');

router.get('/', walletRequestsController.getAllWithdrawalRequests);
router.get('/:id', walletRequestsController.getWithdrawalRequestById);
router.post('/', walletRequestsController.createWithdrawalRequest);
router.delete('/:id', walletRequestsController.deleteWithdrawalRequest);

module.exports = router;