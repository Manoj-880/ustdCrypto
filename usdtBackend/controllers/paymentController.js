const axios = require("axios");
const { TronWeb } = require("tronweb");
const BigNumber = require("bignumber.js");
// import transactionsModel from "../models/transactionsModel.js"; // adjust path as needed
const transactionRepo = require("../repos/transactionRepo");
const userRepo = require("../repos/userRepo");
const withdrawalRepo = require("../repos/withdrawRepo");

const USDT_CONTRACT = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";
// USDT ABI minimal
const usdtAbi = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

const makePayment = async (req, res) => {
  try {
    const { txId, userId } = req.body;
    let MY_WALLET;
    const activerWallet = await userRepo.getActiveWallet();
    if (activerWallet) {
      MY_WALLET = activerWallet.address;
    }

    if (!txId || !userId) {
      return res.status(200).send({
        success: false,
        message: "TxID and userId are required",
      });
    }

    // 1. Get all transfers related to MY_WALLET
    const url = `https://apilist.tronscan.org/api/token_trc20/transfers?limit=100&start=0&sort=-timestamp&count=true&relatedAddress=${MY_WALLET}`;
    const response = await axios.get(url);

    const transfers = response.data?.token_transfers || [];

    // 2. Find the transfer matching given txId
    const transfer = transfers.find((t) => t.transaction_id === txId);

    if (!transfer) {
      return res.status(200).send({
        success: false,
        message: "Transaction not found in wallet transfers",
      });
    }

    // 3. Validate USDT and sent to our wallet
    const decimals = transfer.tokenInfo?.tokenDecimal || 6;
    const transferredAmount = parseFloat(transfer.quant) / 10 ** decimals;

    if (
      transfer.tokenInfo?.tokenAbbr !== "USDT" ||
      transfer.to_address !== MY_WALLET
    ) {
      return res.status(200).send({
        success: false,
        message: "Invalid transfer details",
      });
    }

    // 4. Prevent duplicate transaction
    let previousTransactions = await transactionRepo.getTransactionByTxId(txId);
    if (previousTransactions.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Transaction already exists",
      });
    }

    // 5. Save transaction in DB
    const transactionData = {
      quantity: transferredAmount,
      date: new Date(transfer.block_ts || Date.now()),
      userId,
      activeWalleteId: MY_WALLET,
      userWalletId: transfer.from_address,
      transactionId: txId,
    };

    let user = await userRepo.getUserById(userId);
    const updatedBalance = (parseFloat(user.balance) || 0) + transferredAmount;

    await userRepo.updateUser(user._id, {
      balance: updatedBalance.toFixed(2).toString(),
    });
    await transactionRepo.createTransaction(transactionData);

    return res.status(200).send({
      success: true,
      message: "Deposit verified and transaction saved",
      data: {
        txId,
        from: transfer.from_address,
        to: transfer.to_address,
        amount: transferredAmount,
        transactionData,
      },
    });
  } catch (error) {
    console.error("makePayment error:", error.message);
    return res.status(500).send({
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
      await userRepo.updateUser(user._id, {
        balance: newBalance.toFixed(2).toString(),
        profit: userProfit.toFixed(2).toString(),
      });

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

const withdraw = async (req, res) => {
  try {
    const { userid, amount } = req.body;
    const user = await userRepo.getUserById(userid);
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    } else {
      if (user.balance < amount) {
        return res.status(200).send({
          success: false,
          message: "Insufficient balance",
        });
      } else {
        let data = {
          userId: userid,
          amount: amount,
          walltAddress: user.walletKey,
          userBalance: user.balance,
        };
        await withdrawalRepo.createRequest(data);
        return res.status(200).send({
          success: true,
          message:
            "Withdraw request placed successfully and will be processed within 24 hours",
          data: data,
        });
      }
    }
  } catch (error) {
    console.error("Withdraw error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const withdrawSuccess = async (req, res) => {
  try {
    const { requestId, transactionId } = req.body;
    // 1. Get all transfers related to MY_WALLET
    const url = `https://apilist.tronscan.org/api/token_trc20/transfers?limit=100&start=0&sort=-timestamp&count=true&relatedAddress=${MY_WALLET}`;
    const response = await axios.get(url);

    const transfers = response.data?.token_transfers || [];

    // 2. Find the transfer matching given txId
    const transfer = transfers.find((t) => t.transaction_id === transactionId);

    if (!transfer) {
      return res.status(200).send({
        success: false,
        message: "Transaction not found in wallet transfers",
      });
    }
  } catch (error) {
    console.error("Withdraw error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  makePayment,
  addProfit,
  withdraw,
};
