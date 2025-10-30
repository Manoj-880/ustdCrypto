/**
 * Payment Controller - USDT Investment Platform
 * 
 * This controller handles all payment-related operations including:
 * - Payment verification and processing
 * - Automated daily profit distribution
 * - Referral bonus calculations and distribution
 * - Transaction logging and audit trails
 * 
 * Key Features:
 * - TRON blockchain integration for USDT transactions
 * - Automated profit calculation based on lock-in plans
 * - Referral system with bonus distribution
 * - Email notifications for transactions
 * - Comprehensive error handling and logging
 * 
 * @author USDT Platform Team
 * @version 1.0.0
 * @since 2024
 */

const axios = require("axios");
const { TronWeb } = require("tronweb");
const BigNumber = require("bignumber.js");
const transactionRepo = require("../repos/transactionRepo");
const userRepo = require("../repos/userRepo");
const walletRepo = require("../repos/walletRepo");
const withdrawalRepo = require("../repos/withdrawRepo");
const {
  sendDepositSuccessEmail,
  sendReferralBonusEmail,
} = require("../services/emailService");
const lockinRepo = require("../repos/lockinRepo");

/**
 * USDT Contract ABI (Application Binary Interface)
 * 
 * This minimal ABI contains only the transfer function needed for USDT transactions.
 * The ABI defines how to interact with the USDT smart contract on the TRON blockchain.
 * 
 * Transfer Function:
 * - _to: Recipient wallet address
 * - _value: Amount to transfer (in smallest USDT unit)
 * - Returns: Boolean indicating success/failure
 */
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

/**
 * Process Payment Verification and Deposit
 * 
 * This function handles the verification of USDT deposits made by users.
 * It verifies the transaction on the TRON blockchain and credits the user's account.
 * 
 * Process Flow:
 * 1. Validate required parameters (txId, userId)
 * 2. Get active system wallet for transaction verification
 * 3. Verify transaction on TRON blockchain
 * 4. Check if transaction is already processed
 * 5. Credit user's account balance
 * 6. Create transaction record
 * 7. Send confirmation email
 * 
 * @param {Object} req - Express request object
 * @param {string} req.body.txId - TRON transaction ID to verify
 * @param {string} req.body.userId - User ID making the deposit
 * @param {Object} res - Express response object
 * @returns {Object} Success/failure response with transaction details
 */
const makePayment = async (req, res) => {
  try {
    const { txId, userId } = req.body;
    let MY_WALLET;
    const activerWallet = await walletRepo.getActiveWallet();
    if (activerWallet) {
      MY_WALLET = activerWallet.walletId;
    }

    if (!txId || !userId) {
      return res.status(200).send({
        success: false,
        message: "TxID and userId are required",
      });
    }

    if (!MY_WALLET) {
      return res.status(200).send({
        success: false,
        message: "No active wallet found in system",
      });
    }

    const tronWeb = new TronWeb({
      fullHost: process.env.TRON_FULL_NODE,
      privateKey: process.env.TRON_PRIVATE_KEY,
    });

    // New verification flow:
    // 1) Fetch active wallet's TRC20 USDT transactions for today via TronGrid
    // 2) Check whether provided txId is present among those transactions to our wallet
    // 3) Extract amount from that record and proceed

    const usdtContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

    const startOfDayUtc = new Date();
    startOfDayUtc.setUTCHours(0, 0, 0, 0);
    const endOfDayUtc = new Date();
    endOfDayUtc.setUTCHours(23, 59, 59, 999);

    // TronGrid API for TRC20 transfers to/from the wallet for USDT
    // We will page through a reasonable window if needed; first attempt with limit=200
    const tronGridUrl = `https://api.trongrid.io/v1/accounts/${MY_WALLET}/transactions/trc20?limit=200&contract_address=${usdtContractAddress}`;

    let walletTxs = [];
    try {
      const resp = await fetch(tronGridUrl, {
        headers: { 'TRON-PRO-API-KEY': process.env.TRON_PRO_API_KEY || '21503d89-f582-4167-82eb-a16da6104342' }
      });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data?.data)) {
          walletTxs = data.data;
        }
      } else {
        console.warn("TronGrid response not ok", await resp.text());
      }
    } catch (e) {
      console.error("Failed to fetch TronGrid transactions:", e);
    }

    // Filter to today's UTC date range
    const todaysTxs = walletTxs.filter(tx => {
      const ts = typeof tx.block_timestamp === 'number' ? tx.block_timestamp : 0;
      return ts >= startOfDayUtc.getTime() && ts <= endOfDayUtc.getTime();
    });

    // Try to find the provided txId in today's TRC20 USDT transfers
    const matched = todaysTxs.find(tx => tx?.transaction_id === txId);

    if (!matched) {
      return res.status(200).send({
        success: false,
        message: "Transaction not found for our wallet today",
      });
    }

    // Validate it is USDT and inbound to our wallet
    const isToOurWallet = (matched?.to || '').toLowerCase() === (MY_WALLET || '').toLowerCase();
    if (!isToOurWallet) {
      return res.status(200).send({
        success: false,
        message: "Transaction is not sent to our wallet",
      });
    }

    const trc20Value = matched?.value || "0"; // integer in 6 decimals
    const amount = new BigNumber(trc20Value).dividedBy(1000000).toNumber();
    if (!(amount > 0)) {
      return res.status(200).send({
        success: false,
        message: "Invalid transfer amount",
      });
    }

    const existingTransaction = await transactionRepo.getTransactionByTxId(txId);
    if (Array.isArray(existingTransaction) ? existingTransaction.length > 0 : !!existingTransaction) {
      return res.status(200).send({
        success: false,
        message: "Transaction already processed",
      });
    }

    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    }

    const currentBalance = parseFloat(user.balance) || 0;
    const newBalance = currentBalance + amount;

    await userRepo.updateUser(userId, {
      balance: newBalance.toFixed(2).toString(),
    });

    const newTransaction = await transactionRepo.createTransaction({
      transactionId: txId,
      quantity: amount.toFixed(2).toString(),
      date: new Date(),
      userId: userId,
      activeWalleteId: MY_WALLET,
      userWalletId: user.walletId || null,
      type: "DEPOSIT",
    });

    try {
      const emailResult = await sendDepositSuccessEmail(
        user.email,
        user.firstName,
        amount.toFixed(2),
        newBalance.toFixed(2)
      );
      if (emailResult.success) {
      } else {
        console.warn(
          "Failed to send deposit success email:",
          emailResult.error
        );
      }
    } catch (emailError) {
      console.error("Email service error:", emailError);
    }

    res.status(200).send({
      success: true,
      message: "Payment processed successfully",
      data: {
        transaction: newTransaction,
        newBalance: newBalance.toFixed(2),
        amount: amount.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error in makePayment:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Automated Daily Profit Distribution System
 * 
 * This is the core function that automatically distributes daily profits to all users
 * with active lock-ins. It runs via cron job every day at 8 AM IST.
 * 
 * Process Flow:
 * 1. Fetch all users from database
 * 2. For each user, get their active lock-ins
 * 3. Calculate daily profit based on lock-in amount and interest rate
 * 4. Update user's balance and profit totals
 * 5. Create transaction records for audit trail
 * 6. Process referral bonuses for referrers
 * 7. Send email notifications for referral bonuses
 * 
 * Profit Calculation:
 * - Daily Profit = Lock-in Amount × Daily Interest Rate
 * - Interest Rate is stored as percentage (e.g., 5.5 for 5.5%)
 * - Only ACTIVE lock-ins are considered for profit calculation
 * 
 * Referral System:
 * - When a user receives profit, their referrer gets a bonus
 * - Referral bonus is calculated from the lock-in plan's referral bonus rate
 * - Bonus is added to referrer's balance and profit totals
 * 
 * Error Handling:
 * - Individual user failures don't stop the entire process
 * - Database errors are logged but don't crash the system
 * - Email failures don't affect profit distribution
 * 
 * @returns {Promise<void>} Completes profit distribution for all eligible users
 */
const addProfit = async () => {
  try {
    const MY_WALLET = process.env.DEFAULT_WALLET_ID || "SYSTEM_WALLET";
    
    let users = await userRepo.getAllUsers();

    if (!users || users.length === 0) {
      return;
    }

    let totalProfitsAdded = 0;
    let usersProcessed = 0;
    let usersWithProfits = 0;

    for (let user of users) {
      usersProcessed++;
      const userLockins = await lockinRepo.getLockinsByUserId(user._id);
      
      if (!userLockins || userLockins.length === 0) {
        continue;
      }

      const parseIstDate = (dateString) => {
        if (!dateString) return null;
        if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(dateString)) {
          return new Date(dateString);
        }
        if (/^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?)?$/.test(dateString)) {
          const base = dateString.replace(" ", "T");
          if (base.length <= 10) {
            return new Date(`${base}T23:59:59+05:30`);
          }
          return new Date(`${base}+05:30`);
        }
        return new Date(`${dateString} GMT+0530`);
      };

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
            // Mark lock-in as completed
            await lockinRepo.updateLockin(lockin._id, { status: "COMPLETED" });
            
            // Send maturity email notification
            try {
              const { sendEmail } = require("../services/emailService");
              const maturityDate = endIst.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              
              await sendEmail(
                user.email,
                "lockinMaturity",
                "payments@secureusdt.com",
                user.firstName || user.email,
                user.email,
                lockin.name || `Lock-In #${lockin._id}`,
                parseFloat(lockin.amount).toFixed(2),
                lockin.planDuration || 'N/A',
                maturityDate
              );
              console.log(`✅ Maturity email sent for lock-in: ${lockin.name || lockin._id}`);
            } catch (emailError) {
              console.error(`Failed to send maturity email for lock-in ${lockin._id}:`, emailError);
              // Don't fail profit distribution if email fails
            }
          }
        } catch (e) {
          console.error("Error updating lockin status:", lockin._id, e);
        }
      }

      let userLockinTotal = userLockins
        .map((lockin) => parseFloat(lockin.amount) || 0)
        .reduce((sum, amount) => sum + amount, 0);

      // Get all active lockins
      const activeLockins = userLockins.filter((lockin) => lockin.status === "ACTIVE");
      
      let totalUserProfit = 0;
      const transactionTimestamp = new Date();

      // Process each lockin separately and create individual transactions
      for (const lockin of activeLockins) {
        const dailyRate = (lockin.interestRate || 0) / 100;
        const lockinAmount = parseFloat(lockin.amount) || 0;
        const lockinProfit = lockinAmount * dailyRate;

        if (lockinProfit > 0) {
          // Create transaction for this specific lockin
          await transactionRepo.createTransaction({
            quantity: lockinProfit.toFixed(2).toString(),
            date: transactionTimestamp,
            userId: user._id,
            activeWalleteId: MY_WALLET,
            userWalletId: user.walletId || null,
            type: "DAILY_PROFIT",
            lockinId: lockin._id,
            description: `Daily profit from ${lockin.planName || 'Lock-in Plan'} (${lockinProfit.toFixed(2)} USDT)`,
            status: "completed",
          });

          totalUserProfit += lockinProfit;
          totalProfitsAdded += lockinProfit;
        }
      }

      // Update user balance once with all accumulated profits
      if (totalUserProfit > 0) {
        usersWithProfits++;
        const balance = parseFloat(user.balance) || 0;
        const currentProfit = parseFloat(user.profit) || 0;
        const newBalance = balance + totalUserProfit;
        const newProfit = currentProfit + totalUserProfit;

        await userRepo.updateUser(user._id, {
          balance: newBalance.toFixed(2).toString(),
          profit: newProfit.toFixed(2).toString(),
        });
      }

      if (totalUserProfit > 0 && user.referredBy) {
        try {
          const referrer = await userRepo.getUserById(user.referredBy);
          if (referrer) {
            let totalReferralBonus = 0;
            const activeLockins = userLockins.filter(lockin => lockin.status === "ACTIVE");
            
            for (const lockin of activeLockins) {
              const referralBonusRate = (lockin.referralBonus || 0) / 100;
              const lockinAmount = parseFloat(lockin.amount) || 0;
              const dailyProfit = lockinAmount * ((lockin.interestRate || 0) / 100);
              const referralBonus = dailyProfit * referralBonusRate;
              totalReferralBonus += referralBonus;
            }

            if (totalReferralBonus > 0) {
              const referrerBalance = parseFloat(referrer.balance) || 0;
              const referrerProfit = parseFloat(referrer.profit) || 0;
              const newReferrerBalance = referrerBalance + totalReferralBonus;
              const newReferrerProfit = referrerProfit + totalReferralBonus;

              await userRepo.updateUser(referrer._id, {
                balance: newReferrerBalance.toFixed(2).toString(),
                profit: newReferrerProfit.toFixed(2).toString(),
              });

              await transactionRepo.createTransaction({
                quantity: totalReferralBonus.toFixed(2).toString(),
                date: new Date(),
                userId: referrer._id,
                activeWalleteId: MY_WALLET,
                userWalletId: referrer.walletId || null,
                type: "REFERRAL_BONUS",
              });

              try {
                await sendReferralBonusEmail(
                  referrer.email,
                  referrer.firstName,
                  user.firstName,
                  totalReferralBonus.toFixed(2),
                  newReferrerBalance.toFixed(2)
                );
              } catch (emailError) {
                console.error("Failed to send referral bonus email:", emailError);
              }
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
    console.error("❌ [CRON] Error in addProfit:", error);
  }
};

module.exports = {
  makePayment,
  addProfit,
};