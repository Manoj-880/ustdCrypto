const transactionsModel = require('../models/transactionsModel');

const getAllTransactions = async () => {
    const transactions = await transactionsModel
        .find()
        .populate({
            path: 'userId',
            select: 'firstName lastName email walletId balance',
            options: { strictPopulate: false }
        })
        .sort({ date: -1 }); // latest first
    return transactions;
};

const getAllTransactionsByUserId = async (userId) => {
  const transactions = await transactionsModel
    .find({ userId })
    .populate({
        path: 'userId',
        select: 'firstName lastName email walletId balance',
        options: { strictPopulate: false }
    })
    .populate({
        path: 'lockinId',
        select: 'name planDuration planName',
        options: { strictPopulate: false }
    })
    .sort({ date: -1 }); // latest first

  return transactions;
};


const createTransaction = async (transactionData) => {
    const transaction = new transactionsModel(transactionData);
    
    // Set transactionId if not provided
    if (!transaction.transactionId) {
        transaction.transactionId = transaction._id ? transaction._id.toString() : null;
    }
    
    await transaction.save();
    
    // Update transactionId after save if it wasn't set
    if (!transaction.transactionId) {
        transaction.transactionId = transaction._id.toString();
        await transaction.save();
    }
    
    return transaction;
};

const deleteTransaction = async (transactionId) => {
    return await transactionsModel.findByIdAndDelete(transactionId);
};

const getTransactionById = async (transactionId) => {
    const transaction = await transactionsModel.findById(transactionId);
    return transaction;
};

const getTransactionByTxId = async (txid) => {
  const transaction = await transactionsModel.find({transactionId: txid});
  return transaction;
}

module.exports = {
    getAllTransactions,
    getAllTransactionsByUserId,
    createTransaction,
    getTransactionById,
    getTransactionByTxId,
    deleteTransaction
}