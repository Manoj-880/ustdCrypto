const lockinRepo = require("../repos/lockinRepo");

const getAllLockins = async (req, res) => {
  try {
    const lockins = await lockinRepo.getAllLockins();
    res.status(200).send({
      success: true,
      message: "Lock-ins fetched successfully",
      data: lockins,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLockinsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const lockins = await lockinRepo.getLockinsByUserId(userId);
    res.status(200).send({
      success: true,
      message: "User lock-ins fetched successfully",
      data: lockins,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const createLockin = async (req, res) => {
  try {
    const { userId, planId, amount, startDate, endDate } = req.body;
    if (!userId || !planId || !amount || !startDate || !endDate) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    const newLockin = await lockinRepo.createLockin({
      userId,
      duration: planId,
      amount,
      startDate,
      endDate,
    });
    res.status(201).send({
      success: true,
      message: "Lock-in created successfully",
      data: newLockin,
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
};
