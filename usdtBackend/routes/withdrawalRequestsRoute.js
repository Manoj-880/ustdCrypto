const express = require('express');
const router = express.Router();
const walletRequestsController = require('../controllers/withdrawalRequestController');

router.get('/', walletRequestsController.getAllWithdrawalRequests);
router.get('/user/:userId', walletRequestsController.getWithdrawalRequestsByUserId);
router.get('/:id', walletRequestsController.getWithdrawalRequestById);
router.post('/', walletRequestsController.createWithdrawalRequest);
router.delete('/:id', walletRequestsController.deleteWithdrawalRequest);
router.put('/:id/reject', walletRequestsController.rejectWithdrawalRequest);
router.put('/:id/approve', walletRequestsController.approveWithdrawalRequest);
router.put('/:id/verify', walletRequestsController.verifyTransaction);

module.exports = router;