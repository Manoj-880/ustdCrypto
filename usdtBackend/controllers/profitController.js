/**
 * Profit Controller - USDT Investment Platform
 * 
 * This controller manages all profit-related operations including:
 * - Retrieving profit data for users and administrators
 * - Manual profit generation (for testing/admin purposes)
 * - Profit transaction history and analytics
 * 
 * Key Features:
 * - User-specific profit tracking and history
 * - Administrative profit management
 * - Transaction-based profit calculation
 * - Real-time profit balance updates
 * 
 * @author USDT Platform Team
 * @version 1.0.0
 * @since 2024
 */

const profitRepo = require("../repos/profitRepo");
const userRepo = require("../repos/userRepo");
const lockinRepo = require("../repos/lockinRepo");

/**
 * Get All Profits (Administrative Function)
 * 
 * Retrieves profit data for all users in the system.
 * This is typically used by administrators for system-wide profit analysis.
 * 
 * Process Flow:
 * 1. Fetch all profit records from database
 * 2. Return comprehensive profit data
 * 3. Handle database errors gracefully
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} All profit records with success status
 */
const getAllProfits = async (req, res) => {
  try {
    const profits = await profitRepo.getAllProfits();
    res.status(200).send({
      success: true,
      message: "Profits fetched successfully",
      data: profits,
    });
  } catch (error) {
    console.error("Error in getAllProfits:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get Profits by User ID
 * 
 * Retrieves comprehensive profit information for a specific user.
 * This includes current profit balance, total earnings, transaction history,
 * and the last profit addition date.
 * 
 * Data Returned:
 * - currentProfit: User's current profit balance from user model
 * - totalProfitsEarned: Sum of all DAILY_PROFIT transactions
 * - profitTransactions: Array of all profit-related transactions
 * - lastProfitAdded: Date of the most recent profit addition
 * 
 * Process Flow:
 * 1. Validate user ID parameter
 * 2. Fetch user data to get current profit balance
 * 3. Retrieve all transactions for the user
 * 4. Filter for DAILY_PROFIT transactions
 * 5. Calculate total profits earned from transactions
 * 6. Return comprehensive profit data
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.userId - User ID to fetch profits for
 * @param {Object} res - Express response object
 * @returns {Object} User's profit data including balance, history, and analytics
 */
const getProfitsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).send({
        success: false,
        message: "Valid user ID is required",
      });
    }

    const user = await userRepo.getUserById(userId);
    const currentProfit = user ? parseFloat(user.profit) : 0;

    const transactionRepo = require("../repos/transactionRepo");
    const profitTransactions = await transactionRepo.getAllTransactionsByUserId(userId);
    
    const dailyProfitTransactions = profitTransactions.filter(
      transaction => transaction.type === "DAILY_PROFIT"
    );

    const totalProfitsEarned = dailyProfitTransactions.reduce(
      (sum, transaction) => sum + parseFloat(transaction.quantity), 0
    );

    res.status(200).send({
      success: true,
      message: "User profits fetched successfully",
      data: {
        currentProfit,
        totalProfitsEarned,
        profitTransactions: dailyProfitTransactions,
        lastProfitAdded: dailyProfitTransactions.length > 0 ? 
          dailyProfitTransactions[0].date : null,
      },
    });
  } catch (error) {
    console.error("Error in getAllProfits:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Generate Daily Profits (Manual Trigger)
 * 
 * This function manually triggers the daily profit generation process.
 * It's typically used for testing purposes or as an administrative tool
 * to manually distribute profits outside of the automated cron schedule.
 * 
 * Process Flow:
 * 1. Fetch all users from database
 * 2. For each user, get their active lock-ins
 * 3. Calculate daily profit based on lock-in amount and interest rate
 * 4. Update user's balance and profit totals
 * 5. Create transaction records for audit trail
 * 6. Return summary of generated profits
 * 
 * Profit Calculation:
 * - Daily Profit = Lock-in Amount × Daily Interest Rate
 * - Only ACTIVE lock-ins are considered
 * - Interest rate is converted from percentage to decimal
 * 
 * Database Updates:
 * - User balance: Increased by calculated profit amount
 * - User profit: Increased by calculated profit amount
 * - Transaction record: Created for audit trail
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Summary of generated profits with user details
 */
const generateDailyProfit = async (req, res) => {
  try {
    const users = await userRepo.getAllUsers();
    const generatedProfits = [];

    for (let user of users) {
      const userLockins = await lockinRepo.getLockinsByUserId(user._id);
      
      const userLockinProfit = userLockins
        .filter((lockin) => lockin.status === "ACTIVE")
        .map((lockin) => {
          const dailyRate = parseFloat(lockin.interestRate) / 100;
          return (parseFloat(lockin.amount) || 0) * dailyRate;
        })
        .reduce((sum, profit) => sum + profit, 0);

      if (userLockinProfit > 0) {
        const currentBalance = parseFloat(user.balance) || 0;
        const currentProfit = parseFloat(user.profit) || 0;
        const newBalance = currentBalance + userLockinProfit;
        const newProfit = currentProfit + userLockinProfit;
        
        await userRepo.updateUser(user._id, {
          balance: newBalance.toFixed(2).toString(),
          profit: newProfit.toFixed(2).toString(),
        });

        const transactionRepo = require("../repos/transactionRepo");
        await transactionRepo.createTransaction({
          quantity: userLockinProfit.toFixed(2).toString(),
          date: new Date(),
          userId: user._id,
          activeWalleteId: "DAILY_PROFIT",
          userWalletId: user.walletId || null,
          type: "DAILY_PROFIT",
        });

        generatedProfits.push({
          userId: user._id,
          amount: userLockinProfit,
        });
      }
    }

    res.status(200).send({
      success: true,
      message: "Daily profits generated successfully",
      data: generatedProfits,
    });
  } catch (error) {
    console.error("Error in getAllProfits:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllProfits,
  getProfitsByUserId,
  generateDailyProfit,
};