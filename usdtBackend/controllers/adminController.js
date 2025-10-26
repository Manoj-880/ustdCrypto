const adminRepo = require("../repos/adminRepo");
const userRepo = require("../repos/userRepo");
const transactionRepo = require("../repos/transactionRepo");
const { sendEmail } = require("../services/emailService");

const createAdmin = async (req, res) => {
  try {
    let adminData = req.body;
    await adminRepo.createAdmin(adminData);
    res.status(200).send({
      success: true,
      message: "Admin added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    await adminRepo.updateAdminById(id, data);
    res.status(200).send({
      success: true,
      message: "Admin updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const addBalance = async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;

    // Validate input
    if (!userId || !amount) {
      return res.status(400).send({
        success: false,
        message: "User ID and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).send({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (amount > 10000) {
      return res.status(400).send({
        success: false,
        message: "Amount cannot exceed 10,000 USDT",
      });
    }

    // Get user data
    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Calculate new balance
    const currentBalance = parseFloat(user.balance) || 0;
    const newBalance = (currentBalance + parseFloat(amount)).toFixed(2);

    // Update user balance
    await userRepo.updateUser(userId, {
      balance: newBalance.toString(),
    });

    // Create transaction record
    const transactionData = {
      quantity: parseFloat(amount).toFixed(2),
      date: new Date(),
      userId: userId,
      activeWalleteId: "ADMIN_ADD",
      userWalletId: user.walletId || null,
      transactionId: `ADMIN-ADD-${Date.now()}`,
      type: "ADMIN_ADD",
      status: "completed",
      description: reason || "Admin added balance",
      fee: 0
    };

    await transactionRepo.createTransaction(transactionData);

    // Send email notification
    try {
      const emailResult = await sendEmail(
        user.email,
        "adminBalanceAdded",
        "payments@secureusdt.com",
        user.firstName,
        parseFloat(amount).toFixed(2),
        newBalance,
        transactionData.transactionId,
        reason || "Admin added balance"
      );

      if (emailResult.success) {
        console.log("Admin balance added email sent to:", user.email);
      } else {
        console.warn("Failed to send admin balance added email:", emailResult.message);
      }
    } catch (emailError) {
      console.error("Error sending admin balance added email:", emailError);
      // Don't fail the transaction if email fails
    }

    res.status(200).send({
      success: true,
      message: "Balance added successfully",
      data: {
        userId,
        amount: parseFloat(amount).toFixed(2),
        previousBalance: currentBalance.toFixed(2),
        newBalance,
        transactionId: transactionData.transactionId,
      },
    });
  } catch (error) {
    console.error("addBalance error:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAdmin,
  updateAdmin,
  addBalance,
};
