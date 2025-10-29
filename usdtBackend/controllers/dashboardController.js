const usersRepo = require("../repos/userRepo");
const transactionRepo = require("../repos/transactionRepo");
const withdrawalRepo = require("../repos/withdrawRepo");
const adminWalletRepo = require("../repos/walletRepo");
const profitRepo = require("../repos/profitRepo");
const { TronWeb } = require("tronweb");

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  headers: { "TRON-PRO-API-KEY": "21503d89-f582-4167-82eb-a16da6104342" },
  //   fullHost: "https://api.tronstack.io",
});

// Test TronWeb connection
tronWeb.isConnected().then((connected) => {
  // TronWeb connection status
}).catch((err) => {
  console.error("TronWeb connection error:", err);
});

const adminDashboard = async (req, res) => {
  try {
    const users = await usersRepo.getAllUsers();
    const transactions = await transactionRepo.getAllTransactions();
    const withdrawalRequests = await withdrawalRepo.getAllRequests();
    const adminWallets = await adminWalletRepo.getAllWallets();

    // USDT contract on TRON (correct contract address)
    let usdtContract;
    let totalBalance = 0;
    
    try {
      const contractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // Official TRON USDT contract
      usdtContract = await tronWeb.contract().at(contractAddress);

      // Validate contract is loaded
      if (!usdtContract) {
        throw new Error("Contract not loaded properly");
      }

      // Loop through each wallet to get balances
      for (const wallet of adminWallets) {
        try {
          if (!wallet.walletId) {
            console.warn(`Skipping wallet with no walletId:`, wallet);
            continue;
          }
          
          const rawBalance = await usdtContract.balanceOf(wallet.walletId).call();
          const decimals = 6; // USDT has 6 decimals on TRON
          const balance = Number(rawBalance.toString()) / 10 ** decimals;
          totalBalance += balance;
        } catch (err) {
          console.error(
            `Error fetching balance for wallet ${wallet.walletId}:`,
            err.message || err
          );
          // Continue with other wallets even if one fails
        }
      }
    } catch (err) {
      console.error("Failed to load contract or fetch balances:", err);
      // Continue without balance calculation - set totalBalance to 0
      totalBalance = 0;
    }

    // latest 5 users
    const recentUsers = users.slice(-5).reverse();

    // latest 5 transactions
    const recentTransactions = transactions.slice(-5).reverse();

    let data = {
      usersCount: users.length,
      adminBalance: totalBalance,
      totalRequests: withdrawalRequests.length,
      totalTransactions: transactions.length,
      recentUsers: recentUsers,
      recentTransactions: recentTransactions,
    };

    res.status(200).send({
      success: true,
      message: "Dashboard data fetched successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { adminDashboard };

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

const userDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({ success: false, message: "User ID is required" });
    }

    const user = await usersRepo.getUserById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Monthly profit: sum of DAILY_PROFIT transactions in current month
    const userTransactions = await transactionRepo.getAllTransactionsByUserId(userId);
    const now = new Date();
    const som = startOfMonth(now);
    const eom = endOfMonth(now);
    const monthlyProfit = userTransactions
      .filter(t => t.type === "DAILY_PROFIT" && t.date && t.date >= som && t.date <= eom)
      .reduce((sum, t) => sum + parseFloat(t.quantity || 0), 0);

    // Total profit from user model
    const totalProfit = parseFloat(user.profit || 0);

    // Active days = days passed from join date to today's date
    const registeredDate = new Date(user.joinDate);
    const daysSinceRegistered = Math.max(1, Math.ceil((now - registeredDate) / (24 * 60 * 60 * 1000)));
    const activeDays = daysSinceRegistered;

    // Success rate = activeDays / days since registered (inclusive) * 100
    // Note: Since activeDays now equals daysSinceRegistered, successRate will always be 100%
    // Keeping this for backward compatibility, but it can be removed if not needed
    const successRate = (activeDays / daysSinceRegistered) * 100;

    // Total transactions by user (already fetched above)
    const totalTransactions = userTransactions?.length || 0;

    // Avg daily profit = totalProfit / daysSinceRegistered
    const avgDailyProfit = totalProfit / daysSinceRegistered;

    // Total lock-in balance
    // Lockins are fetched on client currently; can be added here later if needed

    return res.status(200).send({
      success: true,
      message: "User dashboard metrics fetched",
      data: {
        monthlyProfit: Number(monthlyProfit.toFixed(2)),
        totalProfit: Number(totalProfit.toFixed(2)),
        activeDays,
        successRate: Number(successRate.toFixed(1)),
        totalTransactions,
        avgDailyProfit: Number(avgDailyProfit.toFixed(2)),
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

module.exports.userDashboard = userDashboard;
