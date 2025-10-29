const lockinRepo = require("../repos/lockinRepo");
const lockinPlanRepo = require("../repos/lockinPlanRepo");
const userRepo = require("../repos/userRepo");
const { sendDepositSuccessEmail } = require("../services/emailService");

const getAllLockins = async (req, res) => {
  try {
    const lockins = await lockinRepo.getAllLockins();
    res.status(200).send({
      success: true,
      message: "Lock-ins fetched successfully",
      data: lockins,
    });
  } catch (error) {
    console.error("Error in createLockin:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLockinsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!userId || userId === 'undefined') {
      return res.status(400).send({
        success: false,
        message: "Valid user ID is required",
      });
    }
    
    const lockins = await lockinRepo.getLockinsByUserId(userId);
    res.status(200).send({
      success: true,
      message: "User lock-ins fetched successfully",
      data: lockins,
    });
  } catch (error) {
    console.error("Error in createLockin:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const createLockin = async (req, res) => {
  try {
    const { userId, planId, amount } = req.body;
    if (!userId || !planId || !amount) {
      return res.status(400).send({
        success: false,
        message: "User ID, plan ID, and amount are required",
      });
    }

    // Get user details and validate balance
    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const userBalance = parseFloat(user.balance) || 0;
    const lockinAmount = parseFloat(amount);
    
    if (userBalance < lockinAmount) {
      return res.status(400).send({
        success: false,
        message: "Insufficient balance for lock-in",
        currentBalance: userBalance,
        requiredAmount: lockinAmount,
      });
    }

    // Get the lock-in plan from selected plan ID
    const plan = await lockinPlanRepo.getLockinPlanById(planId);
    if (!plan) {
      return res.status(404).send({
        success: false,
        message: "Lock-in plan not found",
      });
    }

    // Calculate start date as Date.now() and end date based on plan duration
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    // Generate lockin name
    const lockinName = await generateLockinName();

    // Create the lockin with all plan details stored
    const newLockin = await lockinRepo.createLockin({
      userId,
      planId, // Keep planId for reference
      planName: plan.planName,
      planDuration: plan.duration,
      interestRate: plan.interestRate,
      referralBonus: plan.referralBonus || 0,
      planDescription: plan.description || '',
      amount: amount.toString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      name: lockinName,
    });

    // Subtract amount from user balance
    const newBalance = userBalance - lockinAmount;
    const updatedUser = await userRepo.updateUser(userId, {
      balance: newBalance.toFixed(2).toString(),
    });

    // Send deposit success email
    try {
      const transactionId = newLockin._id.toString();
      const startDateFormatted = startDate.toLocaleDateString();
      const maturityDateFormatted = endDate.toLocaleDateString();
      
      await sendDepositSuccessEmail(
        user.email,
        user.firstName,
        amount,
        `${plan.duration} days`,
        startDateFormatted,
        maturityDateFormatted,
        transactionId
      );
    } catch (emailError) {
      console.error('Failed to send deposit success email:', emailError);
      // Don't fail lockin creation if email fails
    }

    res.status(201).send({
      success: true,
      message: "Lock-in created successfully",
      data: {
        lockin: newLockin,
        user: {
          _id: updatedUser._id,
          balance: updatedUser.balance,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          walletId: updatedUser.walletId,
          profit: updatedUser.profit,
        },
      },
    });
  } catch (error) {
    console.error("Error in createLockin:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// Function to generate lockin name: LOCKIN + YY + MM + [A-Z][01-99]
// Format: LOCKIN + first 2 digits of year + month + letter + sequence
// Example for Oct 29, 2025: LOCKIN2010A01
const generateLockinName = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  
  // Extract first 2 digits of year (YY) and MM (padded to 2 digits)
  const yy = String(year).slice(0, 2);
  const mm = String(month).padStart(2, '0');
  const datePrefix = `LOCKIN${yy}${mm}`;
  
  // Find all lockins created today (same date prefix)
  const todayLockins = await lockinRepo.getLockinsByDatePrefix(datePrefix);
  const count = todayLockins.length + 1; // +1 for the new one we're creating
  
  // Calculate letter and number
  // Letter A for 1-99, B for 100-199, C for 200-299, etc.
  const letterIndex = Math.floor((count - 1) / 99);
  const letter = String.fromCharCode(65 + letterIndex); // 65 is 'A'
  
  // Number is the sequence within the letter range (01-99)
  const number = ((count - 1) % 99) + 1;
  const numberStr = String(number).padStart(2, '0');
  
  return `${datePrefix}${letter}${numberStr}`;
};

const getNextLockinName = async (req, res) => {
  try {
    const lockinName = await generateLockinName();
    res.status(200).send({
      success: true,
      data: { name: lockinName },
    });
  } catch (error) {
    console.error("Error generating lockin name:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteLockin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLockin = await lockinRepo.deleteLockin(id);
    if (!deletedLockin) {
      return res.status(404).send({
        success: false,
        message: "Lock-in not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Lock-in deleted successfully",
    });
  } catch (error) {
    console.error("Error in createLockin:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get completed lock-ins for a user (not yet processed)
 */
const getCompletedLockins = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).send({
        success: false,
        message: "Valid user ID is required",
      });
    }
    
    // Get all completed lock-ins (status: COMPLETED and not yet processed)
    const allLockins = await lockinRepo.getLockinsByUserId(userId);
    const completedLockins = allLockins.filter(lockin => 
      lockin.status === "COMPLETED" && !lockin.isProcessed
    );
    
    res.status(200).send({
      success: true,
      message: "Completed lock-ins fetched successfully",
      data: completedLockins,
    });
  } catch (error) {
    console.error("Error in getCompletedLockins:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Add lock-in amount to wallet balance
 */
const addToWallet = async (req, res) => {
  try {
    const { lockinId, userId } = req.body;
    
    if (!lockinId || !userId) {
      return res.status(400).send({
        success: false,
        message: "Lock-in ID and user ID are required",
      });
    }
    
    // Get lock-in
    const lockin = await lockinRepo.getLockinsByUserId(userId).then(lockins => 
      lockins.find(l => l._id.toString() === lockinId.toString())
    );
    
    if (!lockin) {
      return res.status(404).send({
        success: false,
        message: "Lock-in not found",
      });
    }
    
    if (lockin.status !== "COMPLETED") {
      return res.status(400).send({
        success: false,
        message: "Lock-in must be completed before adding to wallet",
      });
    }
    
    // Check if already processed (we'll add a flag later, for now just check status)
    // For now, we'll update status to mark as processed
    
    // Get user
    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    
    // Add lock-in amount to wallet balance
    const lockinAmount = parseFloat(lockin.amount) || 0;
    const currentBalance = parseFloat(user.balance) || 0;
    const newBalance = currentBalance + lockinAmount;
    
    // Update user balance
    const updatedUser = await userRepo.updateUser(userId, {
      balance: newBalance.toFixed(2).toString(),
    });
    
    // Mark lock-in as processed
    await lockinRepo.updateLockin(lockin._id, {
      status: "PROCESSED",
      isProcessed: true,
    });
    
    res.status(200).send({
      success: true,
      message: "Lock-in amount added to wallet successfully",
      data: {
        user: {
          _id: updatedUser._id,
          balance: updatedUser.balance,
        },
        lockin: {
          _id: lockin._id,
          amount: lockin.amount,
        },
      },
    });
  } catch (error) {
    console.error("Error in addToWallet:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Relock - Create new lock-in from completed lock-in
 */
const relock = async (req, res) => {
  try {
    const { lockinId, userId, planId } = req.body;
    
    if (!lockinId || !userId || !planId) {
      return res.status(400).send({
        success: false,
        message: "Lock-in ID, user ID, and plan ID are required",
      });
    }
    
    // Get the completed lock-in
    const allLockins = await lockinRepo.getLockinsByUserId(userId);
    const completedLockin = allLockins.find(l => 
      l._id.toString() === lockinId.toString() && l.status === "COMPLETED"
    );
    
    if (!completedLockin) {
      return res.status(404).send({
        success: false,
        message: "Completed lock-in not found",
      });
    }
    
    // Get the new plan
    const plan = await lockinPlanRepo.getLockinPlanById(planId);
    if (!plan) {
      return res.status(404).send({
        success: false,
        message: "Lock-in plan not found",
      });
    }
    
    // Get user
    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    
    // Use the completed lock-in amount for the new lock-in
    const lockinAmount = parseFloat(completedLockin.amount) || 0;
    
    // Calculate start and end dates for new lock-in
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);
    
    // Generate lockin name
    const lockinName = await generateLockinName();
    
    // Create new lock-in
    const newLockin = await lockinRepo.createLockin({
      userId,
      planId,
      planName: plan.planName,
      planDuration: plan.duration,
      interestRate: plan.interestRate,
      referralBonus: plan.referralBonus || 0,
      planDescription: plan.description || '',
      amount: lockinAmount.toString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      name: lockinName,
    });
    
    // Mark the completed lock-in as processed
    await lockinRepo.updateLockin(completedLockin._id, {
      status: "PROCESSED",
      isProcessed: true,
    });
    
    // Send deposit success email for relock
    try {
      const transactionId = newLockin._id.toString();
      const startDateFormatted = startDate.toLocaleDateString();
      const maturityDateFormatted = endDate.toLocaleDateString();
      
      await sendDepositSuccessEmail(
        user.email,
        user.firstName,
        lockinAmount,
        `${plan.duration} days`,
        startDateFormatted,
        maturityDateFormatted,
        transactionId
      );
    } catch (emailError) {
      console.error('Failed to send relock deposit email:', emailError);
    }
    
    res.status(201).send({
      success: true,
      message: "Lock-in relocked successfully",
      data: {
        lockin: newLockin,
        user: {
          _id: user._id,
          balance: user.balance,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          walletId: user.walletId,
          profit: user.profit,
        },
      },
    });
  } catch (error) {
    console.error("Error in relock:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllLockins,
  getLockinsByUserId,
  createLockin,
  deleteLockin,
  getNextLockinName,
  getCompletedLockins,
  addToWallet,
  relock,
};
