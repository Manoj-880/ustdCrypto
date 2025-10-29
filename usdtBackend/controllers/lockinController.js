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

module.exports = {
  getAllLockins,
  getLockinsByUserId,
  createLockin,
  deleteLockin,
  getNextLockinName,
};
