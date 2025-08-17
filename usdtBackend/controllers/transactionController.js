const transactionRepo = require('../repos/transactionRepo');

const getAllTransactions = async (req, res) => {
    try {
        let transactions = await transactionRepo.getAllTransactions();
        if(transactions){
            res.status(200).send({
                success: true,
                message: 'Transactions fetched successfully',
                data: transactions
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
        if(transactions){
            res.status(200).send({
                success: true,
                message: 'Transactions fetched successfully',
                data: transactions
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