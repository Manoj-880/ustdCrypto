const userModel = require('../models/userModel');

const getAllUsers = async () => {
    const users = await userModel.find();
    return users;
};

const addUser = async(user) => {
    const newUser = new userModel(user);
    await newUser.save();
    return newUser;
};

const getUserById = async (id) => {
    const user = await userModel.findById(id);
    return user;
};

const getUserByMail = async (email) => {
    const user = await userModel.findOne({ email });
    return user;
};

const getUserByReferralCode = async (referralCode) => {
    const user = await userModel.findOne({ referralCode });
    return user;
};

const getUserByEmail = async (email) => {
    const user = await userModel.findOne({ email });
    return user;
};

const getUserByVerificationToken = async (token) => {
    const user = await userModel.findOne({ emailVerificationToken: token });
    return user;
};

const updateUser = async (id, data) => {
    const user = await userModel.findByIdAndUpdate(id, data);
    return user;
};

const deleteUser = async (id) => {
    const user = await userModel.findByIdAndDelete(id);
    return user;
}

module.exports = {
    getAllUsers,
    addUser,
    getUserById,
    getUserByMail,
    getUserByEmail,
    getUserByReferralCode,
    getUserByVerificationToken,
    updateUser,
    deleteUser,
};