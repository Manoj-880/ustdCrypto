const walletRepo = require("../repos/walletRepo");
const { TronWeb } = require("tronweb");

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  headers: { "TRON-PRO-API-KEY": "911e0d91-689f-454b-896d-4881f12e7128" },
});

const getAllWallets = async (req, res) => {
  try {
    const wallets = await walletRepo.getAllWallets();
    
    if (wallets) {
      // Calculate balance for each wallet
      const walletsWithBalance = await Promise.all(
        wallets.map(async (wallet) => {
          let balance = 0;
          
          try {
            if (wallet.walletId) {
              // Validate wallet address format
              let walletAddress = wallet.walletId;
              
              if (tronWeb.isAddress(walletAddress)) {
                // Get USDT balance using TronGrid API
                try {
                  const response = await fetch(`https://api.trongrid.io/v1/accounts/${walletAddress}/transactions/trc20?limit=200&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`, {
                    headers: {
                      'TRON-PRO-API-KEY': '21503d89-f582-4167-82eb-a16da6104342'
                    }
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    
                    if (data.data && data.data.length > 0) {
                      // Calculate balance from transaction history
                      let totalBalance = 0;
                      for (const tx of data.data) {
                        if (tx.to === walletAddress) {
                          totalBalance += parseFloat(tx.value) / 1000000; // USDT has 6 decimals
                        } else if (tx.from === walletAddress) {
                          totalBalance -= parseFloat(tx.value) / 1000000;
                        }
                      }
                      balance = Math.max(0, totalBalance); // Ensure non-negative balance
                    }
                  }
                } catch (apiError) {
                  console.error(`Error fetching USDT balance for wallet ${wallet.walletId}:`, apiError.message);
                  balance = 0;
                }
              } else {
                console.warn(`Invalid wallet address format: ${wallet.walletId}`);
                balance = 0;
              }
            }
          } catch (err) {
            console.error(`Error fetching balance for wallet ${wallet.walletId}:`, err.message || err);
            balance = 0;
          }
          
          return {
            ...wallet.toObject(),
            balance: balance
          };
        })
      );

      
      res.status(200).send({
        success: true,
        message: "Wallets fetched successfully",
        data: walletsWithBalance,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "No wallets found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getWalletById = async (req, res) => {
  try {
    const wallet = await walletRepo.getWalletById(req.params.id);
    if (wallet) {
      res.status(200).send({
        success: true,
        message: "Wallet fetched successfully",
        data: wallet,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Wallet not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getActiveWallet = async (req, res) => {
  try {
    const wallet = await walletRepo.getActiveWallet();
    if (wallet) {
      res.status(200).send({
        success: true,
        message: "Active wallet fetched successfully",
        data: wallet,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "No active wallet found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const createWallet = async (req, res) => {
  try {
    // First, set all existing wallets to inactive
    await walletRepo.setAllWalletsInactive();
    
    // Create the new wallet (it will be active by default due to model default)
    const newWallet = await walletRepo.createWallet(req.body);
    
    if (newWallet) {
      res.status(200).send({
        success: true,
        message: "Wallet created successfully",
        data: newWallet,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Wallet not created",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateWallet = async (req, res) => {
  try {
    // First, set all wallets to inactive
    await walletRepo.setAllWalletsInactive();
    
    // Then, set the specific wallet to active
    const updatedWallet = await walletRepo.setWalletActive(req.params.id);
    
    if (updatedWallet) {
      res.status(200).send({
        success: true,
        message: "Wallet updated successfully",
        data: updatedWallet,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Wallet not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteWallet = async (req, res) => {
  try {
    const deletedWallet = await walletRepo.deleteWallet(req.params.id);
    if (deletedWallet) {
      res.status(200).send({
        success: true,
        message: "Wallet deleted successfully",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Wallet not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllWallets,
  getWalletById,
  createWallet,
  updateWallet,
  deleteWallet,
  getActiveWallet,
};
