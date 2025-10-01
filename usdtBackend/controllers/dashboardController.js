const usersRepo = require("../repos/userRepo");
const transactionRepo = require("../repos/transactionRepo");
const withdrawalRepo = require("../repos/withdrawRepo");
const adminWalletRepo = require("../repos/walletRepo");
const { TronWeb } = require("tronweb");

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  headers: { "TRON-PRO-API-KEY": "21503d89-f582-4167-82eb-a16da6104342" },
  //   fullHost: "https://api.tronstack.io",
});

// Test TronWeb connection
tronWeb.isConnected().then((connected) => {
  console.log("TronWeb connected:", connected);
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
      console.log("Attempting to load USDT contract at:", contractAddress);
      usdtContract = await tronWeb.contract().at(contractAddress);
      console.log("Contract loaded successfully");

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
          console.log(`Wallet ${wallet.walletId} balance: ${balance} USDT`);
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
      console.log("Proceeding without balance calculation due to contract error");
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
