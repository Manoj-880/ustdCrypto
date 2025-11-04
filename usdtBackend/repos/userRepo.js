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

const updateUserSession = async (userId, sessionId) => {
    const user = await userModel.findByIdAndUpdate(
        userId,
        { 
            currentSessionId: sessionId,
            lastLoginTime: new Date()
        },
        { new: true }
    );
    return user;
};

const getUserBySessionId = async (sessionId) => {
    const user = await userModel.findOne({ currentSessionId: sessionId });
    return user;
};

const clearUserSession = async (userId) => {
    const user = await userModel.findByIdAndUpdate(
        userId,
        { currentSessionId: null },
        { new: true }
    );
    return user;
};

const deleteUser = async (id) => {
    const user = await userModel.findByIdAndDelete(id);
    return user;
}

const getUsersByReferralCode = async (referralCode) => {
    const users = await userModel.find({ referredBy: referralCode }).select('firstName lastName email joinDate').sort({ joinDate: -1 });
    return users;
};

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
    updateUserSession,
    getUserBySessionId,
    clearUserSession,
    getUsersByReferralCode,
};