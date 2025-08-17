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
    updateUser,
    deleteUser,
};