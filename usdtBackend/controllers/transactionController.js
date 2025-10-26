const transactionRepo = require('../repos/transactionRepo');

const getAllTransactions = async (req, res) => {
    try {
        let transactions = await transactionRepo.getAllTransactions();
        console.log('Raw transactions data:', JSON.stringify(transactions, null, 2));
        
        if(transactions && transactions.length > 0){
            // Map the data to match frontend expectations
            const mappedTransactions = transactions.map(transaction => {
                // Handle cases where userId might be null or user data might be missing
                let userName = 'Unknown User';
                let userEmail = 'Unknown Email';
                let userBalance = '0';
                let walletId = null;
                
                if (transaction.userId) {
                    if (typeof transaction.userId === 'object' && transaction.userId.firstName) {
                        // User data is populated
                        userName = `${transaction.userId.firstName || ''} ${transaction.userId.lastName || ''}`.trim() || 'Unknown User';
                        userEmail = transaction.userId.email || 'Unknown Email';
                        userBalance = transaction.userId.balance || '0';
                        walletId = transaction.userId.walletId || null;
                    } else {
                        // User ID exists but data is not populated (user might be deleted)
                        userName = `User ${transaction.userId}`;
                        userEmail = 'User Deleted';
                    }
                }
                
                // Determine transaction type based on activeWalleteId or existing type
                let transactionType = transaction.type;
                if (!transactionType) {
                    if (transaction.activeWalleteId === 'WITHDRAWAL_REQUEST') {
                        transactionType = 'withdraw';
                    } else {
                        transactionType = 'deposit';
                    }
                } else {
                    // Map backend transaction types to frontend expected types
                    switch (transaction.type) {
                        case 'ADMIN_ADD':
                            transactionType = 'deposit';
                            break;
                        case 'TRANSFER_OUT':
                            transactionType = 'transfer';
                            break;
                        case 'TRANSFER_IN':
                            transactionType = 'deposit';
                            break;
                        case 'WITHDRAWAL_REQUEST':
                        case 'withdraw':
                            transactionType = 'withdraw';
                            break;
                        case 'claimed_profit':
                            transactionType = 'claimed_profit';
                            break;
                        default:
                            transactionType = 'deposit';
                    }
                }
                
                return {
                    id: transaction.transactionId || transaction._id,
                    userName: userName,
                    userEmail: userEmail,
                    type: transactionType,
                    usdtQuantity: transaction.quantity || 0,
                    date: transaction.date,
                    status: transaction.status || 'completed',
                    description: transaction.description || `${transactionType} transaction`,
                    fee: transaction.fee || 0,
                    balance: userBalance,
                    transactionHash: transaction.transactionId || transaction._id,
                    fromAddress: transaction.userWalletId || 'Unknown',
                    toAddress: transaction.activeWalleteId || 'Unknown',
                    userId: transaction.userId?._id || transaction.userId,
                    walletId: walletId
                };
            });
            
            res.status(200).send({
                success: true,
                message: 'Transactions fetched successfully',
                data: mappedTransactions
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'No transactions found'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    };
};

const getAllTransactionsByUserId = async (req, res) => {
    try {
        let id = req.params.id;
        let transactions = await transactionRepo.getAllTransactionsByUserId(id);
        if(transactions && transactions.length > 0){
            // Map the data to match frontend expectations
            const mappedTransactions = transactions.map(transaction => {
                // Handle cases where userId might be null or user data might be missing
                let userName = 'Unknown User';
                let userEmail = 'Unknown Email';
                let userBalance = '0';
                let walletId = null;
                
                if (transaction.userId) {
                    if (typeof transaction.userId === 'object' && transaction.userId.firstName) {
                        // User data is populated
                        userName = `${transaction.userId.firstName || ''} ${transaction.userId.lastName || ''}`.trim() || 'Unknown User';
                        userEmail = transaction.userId.email || 'Unknown Email';
                        userBalance = transaction.userId.balance || '0';
                        walletId = transaction.userId.walletId || null;
                    } else {
                        // User ID exists but data is not populated (user might be deleted)
                        userName = `User ${transaction.userId}`;
                        userEmail = 'User Deleted';
                    }
                }
                
                // Determine transaction type based on activeWalleteId or existing type
                let transactionType = transaction.type;
                if (!transactionType) {
                    if (transaction.activeWalleteId === 'WITHDRAWAL_REQUEST') {
                        transactionType = 'withdraw';
                    } else {
                        transactionType = 'deposit';
                    }
                } else {
                    // Map backend transaction types to frontend expected types
                    switch (transaction.type) {
                        case 'ADMIN_ADD':
                            transactionType = 'deposit';
                            break;
                        case 'TRANSFER_OUT':
                            transactionType = 'transfer';
                            break;
                        case 'TRANSFER_IN':
                            transactionType = 'deposit';
                            break;
                        case 'WITHDRAWAL_REQUEST':
                        case 'withdraw':
                            transactionType = 'withdraw';
                            break;
                        case 'claimed_profit':
                            transactionType = 'claimed_profit';
                            break;
                        default:
                            transactionType = 'deposit';
                    }
                }
                
                return {
                    id: transaction.transactionId || transaction._id,
                    userName: userName,
                    userEmail: userEmail,
                    type: transactionType,
                    usdtQuantity: transaction.quantity || 0,
                    date: transaction.date,
                    status: transaction.status || 'completed',
                    description: transaction.description || `${transactionType} transaction`,
                    fee: transaction.fee || 0,
                    balance: userBalance,
                    transactionHash: transaction.transactionId || transaction._id,
                    fromAddress: transaction.userWalletId || 'Unknown',
                    toAddress: transaction.activeWalleteId || 'Unknown',
                    userId: transaction.userId?._id || transaction.userId,
                    walletId: walletId
                };
            });
            
            res.status(200).send({
                success: true,
                message: 'Transactions fetched successfully',
                data: mappedTransactions
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'No transactions found'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    };
};

module.exports = {
    getAllTransactions,
    getAllTransactionsByUserId
};