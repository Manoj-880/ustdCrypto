const adminRepo = require("../repos/adminRepo");

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

module.exports = {
  createAdmin,
  updateAdmin,
};
