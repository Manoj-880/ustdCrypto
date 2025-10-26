const axios = require("axios");
const { TronWeb } = require("tronweb");
const BigNumber = require("bignumber.js");
// import transactionsModel from "../models/transactionsModel.js"; // adjust path as needed
const transactionRepo = require("../repos/transactionRepo");
const userRepo = require("../repos/userRepo");
const walletRepo = require("../repos/walletRepo");
const withdrawalRepo = require("../repos/withdrawRepo");
const {
  sendDepositSuccessEmail,
  sendReferralBonusEmail,
} = require("../services/emailService");
const lockinRepo = require("../repos/lockinRepo");

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
    const activerWallet = await walletRepo.getActiveWallet();
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
      type: "deposit",
      status: "completed",
      description: `Deposit from ${transfer.from_address}`,
      fee: 0
    };

    let user = await userRepo.getUserById(userId);
    const updatedBalance = (parseFloat(user.balance) || 0) + transferredAmount;

    await userRepo.updateUser(user._id, {
      balance: updatedBalance.toFixed(2).toString(),
    });
    await transactionRepo.createTransaction(transactionData);

    // Send email notification for successful deposit
    try {
      const emailResult = await sendDepositSuccessEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        transferredAmount,
        "Deposit", // planName - for regular deposits
        transactionData.date, // startDate
        transactionData.date, // maturityDate (same as start for regular deposits)
        txId
      );

      if (emailResult.success) {
        console.log("Deposit success email sent to:", user.email);
      } else {
        console.warn(
          "Failed to send deposit success email:",
          emailResult.message
        );
      }
    } catch (emailError) {
      console.error("Error sending deposit success email:", emailError);
      // Don't fail the transaction if email fails
    }

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
      const userLockins = await lockinRepo.getLockinsByUserId(user._id);

      // Helper to parse dates as IST if no timezone is present
      const parseIstDate = (dateString) => {
        if (!dateString) return null;
        // If string already has timezone/Z, rely on native parsing
        if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(dateString)) {
          return new Date(dateString);
        }
        // ISO-like without TZ
        if (/^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?)?$/.test(dateString)) {
          const base = dateString.replace(" ", "T");
          if (base.length <= 10) {
            // Date only: treat end of day IST
            return new Date(`${base}T23:59:59+05:30`);
          }
          return new Date(`${base}+05:30`);
        }
        // Fallback: append IST offset
        return new Date(`${dateString} GMT+0530`);
      };

      // Check and mark expired lockins as COMPLETED if endDate has passed (IST-aware)
      const nowUtc = new Date();
      for (const lockin of userLockins) {
        try {
          const endIst = parseIstDate(lockin.endDate);
          if (
            lockin.status === "ACTIVE" &&
            endIst instanceof Date &&
            !isNaN(endIst.getTime()) &&
            nowUtc > endIst
          ) {
            await lockinRepo.updateLockin(lockin._id, { status: "COMPLETED" });
          }
        } catch (e) {
          console.error("Error updating lockin status:", lockin._id, e);
        }
      }

      let userLockinTotal = userLockins
        .map((lockin) => parseFloat(lockin.amount) || 0)
        .reduce((sum, amount) => sum + amount, 0);

      let userLockinProfit = userLockins
        .filter((lockin) => lockin.status === "ACTIVE") // consider only ACTIVE lockins
        .map((lockin) => {
          const dailyRate = (lockin.interestRate || 0) / 100; // Convert percentage to decimal
          return (parseFloat(lockin.amount) || 0) * dailyRate;
        })
        .reduce((sum, profit) => sum + profit, 0);

      const balance = parseFloat(user.balance);
      let userProfit = parseFloat(user.profit);
      if (balance <= 0) continue;

      const newBalance = balance + userLockinProfit;
      userProfit = userProfit + userLockinProfit;

      // Update user balance in DB
      await userRepo.updateUser(user._id, {
        balance: newBalance.toFixed(2).toString(),
        profit: userProfit.toFixed(2).toString(),
      });

      // Save profit transaction log
      await transactionRepo.createTransaction({
        quantity: userLockinProfit.toFixed(2).toString(),
        date: new Date(),
        userId: user._id,
        activeWalleteId: MY_WALLET,
        userWalletId: user.walletId || null,
        transactionId: `PROFIT-${Date.now()}`,
        type: "DAILY_PROFIT",
      });

      // Referral bonus: if this user was referred, credit referral bonus based on lockin plan
      if (user.referredBy && userLockinProfit > 0) {
        try {
          const referrer = await userRepo.getUserByReferralCode(
            user.referredBy
          );
          if (referrer) {
            // Calculate referral bonus based on each active lockin's referral bonus rate
            let totalReferralBonus = 0;
            const activeLockins = userLockins.filter(
              (lockin) => lockin.status === "ACTIVE"
            );

            for (const lockin of activeLockins) {
              const lockinAmount = parseFloat(lockin.amount) || 0;
              const lockinReferralRate = (lockin.referralBonus || 0) / 100; // Convert percentage to decimal
              const lockinReferralBonus = lockinAmount * lockinReferralRate;
              totalReferralBonus += lockinReferralBonus;
            }

            const referrerBalance = parseFloat(referrer.balance) || 0;
            const newReferrerBalance = referrerBalance + totalReferralBonus;

            await userRepo.updateUser(referrer._id, {
              balance: newReferrerBalance.toFixed(2).toString(),
            });

            // Log referral bonus transaction for the referrer
            await transactionRepo.createTransaction({
              quantity: totalReferralBonus.toFixed(2).toString(),
              date: new Date(),
              userId: referrer._id,
              activeWalleteId: MY_WALLET,
              userWalletId: referrer.walletId || null,
              transactionId: `REFERRAL-BONUS-${Date.now()}-${referrer._id}`,
              type: "REFERRAL_BONUS",
            });

            // Send referral bonus email to referrer
            try {
              await sendReferralBonusEmail(
                referrer.email,
                referrer.firstName,
                user.firstName, // referred user's name
                totalReferralBonus.toFixed(2),
                newReferrerBalance.toFixed(2)
              );
              console.log("Referral bonus email sent to:", referrer.email);
            } catch (emailError) {
              console.error("Failed to send referral bonus email:", emailError);
              // Don't fail bonus processing if email fails
            }
          }
        } catch (referralErr) {
          console.error(
            "Referral bonus error for user:",
            user._id,
            referralErr
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in addProfit:", error);
  }
};

// const withdraw = async (req, res) => {
//   try {
//     const { userid, amount } = req.body;
//     const user = await userRepo.getUserById(userid);
//     if (!user) {
//       return res.status(200).send({
//         success: false,
//         message: "User not found",
//       });
//     } else {
//       if (user.balance < amount) {
//         return res.status(200).send({
//           success: false,
//           message: "Insufficient balance",
//         });
//       } else {
//         let data = {
//           userId: userid,
//           amount: amount,
//           walltAddress: user.walletId,
//           userBalance: user.balance,
//         };
//         await withdrawalRepo.createRequest(data);
//         return res.status(200).send({
//           success: true,
//           message:
//             "Withdraw request placed successfully and will be processed within 24 hours",
//           data: data,
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Withdraw error:", error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const withdrawSuccess = async (req, res) => {
//   try {
//     const { requestId, transactionId } = req.body;
//     // 1. Get all transfers related to MY_WALLET
//     const url = `https://apilist.tronscan.org/api/token_trc20/transfers?limit=100&start=0&sort=-timestamp&count=true&relatedAddress=${MY_WALLET}`;
//     const response = await axios.get(url);

//     const transfers = response.data?.token_transfers || [];

//     // 2. Find the transfer matching given txId
//     const transfer = transfers.find((t) => t.transaction_id === transactionId);

//     if (!transfer) {
//       return res.status(200).send({
//         success: false,
//         message: "Transaction not found in wallet transfers",
//       });
//     }
//   } catch (error) {
//     console.error("Withdraw error:", error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

module.exports = {
  makePayment,
  addProfit,
  // withdraw,
  // withdrawSuccess,
};
