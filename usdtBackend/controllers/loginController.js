const userRepo = require("../repos/userRepo");
const adminRepo = require("../repos/adminRepo");

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userRepo.getUserByMail(email);
    if (user && user.password === password) {
      res.status(200).send({
        success: true,
        message: "Login Successful",
        data: user,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const AdminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    let admin = await adminRepo.getAdminByEmail(email);
    if (admin && admin.password === password) {
      res.status(200).send({
        success: true,
        message: "Login Successful",
        data: admin,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  login,
  AdminLogin,
};
