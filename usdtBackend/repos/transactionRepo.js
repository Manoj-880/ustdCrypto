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
    .sort({ date: -1 }); // latest first

  return transactions;
};


const createTransaction = async (transactionData) => {
    const transaction = new transactionsModel(transactionData);
    await transaction.save();
    
    // Set transactionId to MongoDB _id
    transaction.transactionId = transaction._id.toString();
    await transaction.save();
    
    return transaction;
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
    getTransactionByTxId
}