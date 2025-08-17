const transactionsModel = require('../models/transactionsModel');

const getAllTransactions = async () => {
    const transactions = await transactionsModel.find();
    return transactions;
};

const getAllTransactionsByUserId = async (userId) => {
  const transactions = await transactionsModel
    .find({ userId })
    .sort({ date: -1 }); // latest first

  return transactions;
};


const createTransaction = async (transactionData) => {
    const transaction = new transactionsModel(transactionData);
    await transaction.save();
    return transaction;
};

const getTransactionById = async (transactionId) => {
    const transaction = await transactionsModel.findById(transactionId);
    return transaction;
};

module.exports = {
    getAllTransactions,
    getAllTransactionsByUserId,
    createTransaction,
    getTransactionById
}