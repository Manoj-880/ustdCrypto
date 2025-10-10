const profitRepo = require("../repos/profitRepo");
const userRepo = require("../repos/userRepo");
const lockinRepo = require("../repos/lockinRepo");

const getAllProfits = async (req, res) => {
  try {
    const profits = await profitRepo.getAllProfits();
    res.status(200).send({
      success: true,
      message: "Profits fetched successfully",
      data: profits,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProfitsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).send({
        success: false,
        message: "Valid user ID is required",
      });
    }

    const profits = await profitRepo.getProfitsByUserId(userId);
    const lastClaimed = await profitRepo.getLastClaimedProfit(userId);
    const pendingProfit = await profitRepo.getPendingProfit(userId);

    // Calculate next claim time (24 hours after last claim)
    let nextClaimTime = null;
    if (lastClaimed) {
      nextClaimTime = new Date(lastClaimed.claimedAt.getTime() + 24 * 60 * 60 * 1000);
    }

    // Calculate current available profit from user's profit field
    const user = await userRepo.getUserById(userId);
    const currentProfit = user ? parseFloat(user.profit) : 0;

    // Calculate total claimed profits
    const totalClaimed = profits
      .filter(profit => profit.status === "CLAIMED")
      .reduce((sum, profit) => sum + parseFloat(profit.amount), 0);

    res.status(200).send({
      success: true,
      message: "User profits fetched successfully",
      data: {
        profits,
        lastClaimed,
        pendingProfit,
        nextClaimTime,
        currentProfit,
        totalClaimed,
        canClaim: nextClaimTime ? new Date() >= nextClaimTime : true,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const claimProfit = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User ID is required",
      });
    }

    // Check if user can claim (24 hours since last claim)
    const lastClaimed = await profitRepo.getLastClaimedProfit(userId);
    if (lastClaimed) {
      const nextClaimTime = new Date(lastClaimed.claimedAt.getTime() + 24 * 60 * 60 * 1000);
      if (new Date() < nextClaimTime) {
        return res.status(400).send({
          success: false,
          message: "You can only claim profit once every 24 hours",
          nextClaimTime,
        });
      }
    }

    // Get user's current profit
    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const currentProfit = parseFloat(user.profit);
    if (currentProfit <= 0) {
      return res.status(400).send({
        success: false,
        message: "No profit available to claim",
      });
    }

    // Create profit record
    const profitData = {
      userId,
      amount: currentProfit.toString(),
      status: "CLAIMED",
      claimedAt: new Date(),
      transactionId: `PROFIT-CLAIM-${Date.now()}-${userId}`,
    };

    const claimedProfit = await profitRepo.createProfit(profitData);

    // Reset user's profit to 0
    await userRepo.updateUser(userId, { profit: "0" });

    res.status(200).send({
      success: true,
      message: "Profit claimed successfully",
      data: claimedProfit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const generateDailyProfit = async (req, res) => {
  try {
    const users = await userRepo.getAllUsers();
    const generatedProfits = [];

    for (let user of users) {
      const userLockins = await lockinRepo.getLockinsByUserId(user._id);
      
      // Calculate profit from active lockins
      const userLockinProfit = userLockins
        .filter((lockin) => lockin.status === "ACTIVE")
        .map((lockin) => {
          const dailyRate = parseFloat(lockin.intrestRate) / 100 / 365; // Convert annual rate to daily
          return (parseFloat(lockin.amount) || 0) * dailyRate;
        })
        .reduce((sum, profit) => sum + profit, 0);

      if (userLockinProfit > 0) {
        // Add to user's profit
        const currentProfit = parseFloat(user.profit) || 0;
        const newProfit = currentProfit + userLockinProfit;
        
        await userRepo.updateUser(user._id, {
          profit: newProfit.toFixed(2).toString(),
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
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllProfits,
  getProfitsByUserId,
  claimProfit,
  generateDailyProfit,
};
