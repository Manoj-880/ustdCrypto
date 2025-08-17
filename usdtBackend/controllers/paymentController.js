const axios = require("axios");
// import transactionsModel from "../models/transactionsModel.js"; // adjust path as needed
const transactionRepo = require("../repos/transactionRepo");
const userRepo = require("../repos/userRepo");

const MY_WALLET = "TQ5xtoptrJfaHS8Sx7G7pBXoq4kyhCRQuK"; // Your TronLink Pro wallet

const makePayment = async (req, res) => {
    try {
        const { txId, amount, userId, userWalletId } = req.body; // user submits TxID, amount, userId

        if (!txId || !amount || !userId || !userWalletId) {
        return res.status(200).send({
            success: false,
            message: "TxID, amount, userId and userWalletId are required",
        });
        }

        // 1. Fetch transaction details from Tronscan API
        const url = `https://apilist.tronscanapi.com/api/transaction-info?hash=${txId}`;
        const response = await axios.get(url);
        const txData = response.data;

        // 2. Basic validations
        if (!txData || txData.contractType !== 31) {
        // 31 = TRC-20 contract call
        return res.status(200).send({
            success: false,
            message: "Invalid or non TRC-20 transaction",
        });
        }

        // 3. Get TRC-20 transfer details
        const transfer = txData.tokenTransferInfo;
        if (!transfer) {
        return res.status(200).send({
            success: false,
            message: "No token transfer found in transaction",
        });
        }

        // 4. Validate it is USDT and sent to your wallet
        const transferredAmount = parseFloat(transfer.amount_str) / 1e6; // convert to USDT

        if (
        transfer.symbol !== "USDT" ||
        transfer.to_address !== MY_WALLET ||
        transferredAmount < parseFloat(amount)
        ) {
        return res.status(200).send({
            success: false,
            message: "Invalid transfer details",
        });
        }

        // ✅ 5. Save transaction in DB
        const transactionData = {
        quantity: transferredAmount,
        date: new Date(),
        userId,
        activeWalleteId: MY_WALLET,
        userWalletId,
        transactionId: txId,
        };

        // const transaction = new transactionsModel(transactionData);
        // await transaction.save();
        await transactionRepo.createTransaction(transactionData);

        // 6. Send success response
        return res.status(200).send({
        success: true,
        message: "Deposit verified and transaction saved",
        txId,
        from: transfer.from_address,
        to: transfer.to_address,
        amount: transferredAmount,
        transaction,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
        success: false,
        message: "Internal server error",
        });
    }
};

const addProfit = async () => {
    try {
        let users = await userRepo.getAllUsers();

        if (!users || users.length === 0) {
        console.log({
            success: false,
            message: "No users found",
        });
        return;
        }

        // Loop through each user and update balance
        for (let user of users) {
        const balance = parseFloat(user.balance) || 0;
        let userProfit = parseFloat(user.profit);
        if (balance <= 0) continue;

        const profit = (balance * 0.25) / 100; // ✅ 0.25% profit
        const newBalance = balance + profit;
        userProfit = userProfit + profit;

        // Update user balance in DB
        await userRepo.updateUser(user._id, { balance: newBalance.toFixed(2).toString(), profit: userProfit.toFixed(2).toString() });

        // Save profit transaction log
        await transactionRepo.createTransaction({
            quantity: profit,
            date: new Date(),
            userId: user._id,
            activeWalleteId: MY_WALLET,
            userWalletId: user.walletKey || null,
            transactionId: `PROFIT-${Date.now()}-${user._id}`,
            type: "DAILY_PROFIT",
        });
        }
    } catch (error) {
        console.error("Error in addProfit:", error);
    }
};



module.exports = {
    makePayment,
    addProfit
}