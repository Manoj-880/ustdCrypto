const userRepo = require('../repos/userRepo');

const getAllUsers = async (req, res) => {
    try {
        const users = await userRepo.getAllUsers();
        if(users) {
            res.status(200).send({
                success: true,
                message: "Users fetched successfully",
                data: users,
            });
        } else {
            res.status(200).send({
                success: false,
                message: "No users found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ 
            success: false, 
            message: "Internal server error",
        });
    };
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userRepo.getUserById(id);
        if(user) {
            res.status(200).send({
                success: true,
                message: "User fetched successfully",
                data: user,
            });
        } else {
            res.status(200).send({
                success: false,
                message: "No user found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ 
            success: false, 
            message: "Internal server error",
        });
    };
};

const createUser = async (req, res) => {
    try {
        let user = req.body;
        let createUserStatus = await userRepo.addUser(user);
        if(createUserStatus) {
            res.status(200).send({
                success: true,
                message: "User created successfully",
                data: createUserStatus,
            });
        } else {
            res.status(200).send({
                success: false,
                message: "User not created",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ 
            success: false, 
            message: "Internal server error",
        });
    };
};

const updateUser = async (req, res) => {
    try {
        let id = req.params.id;
        let user = req.body;
        let updateUserStatus = await userRepo.updateUser(id, user);
        if(updateUserStatus) {
            res.status(200).send({
                success: true,
                message: "User updated successfully",
            });
        } else {
            res.status(200).send({
                success: false,
                message: "User not updated",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    };
};

const deleteUser = async (req, res) => {
    try {
        let id = req.params.id;
        let deleteUserStatus = await userRepo.deleteUser(id);
        if(deleteUserStatus) {
            res.status(200).send({
                success: true,
                message: "User deleted successfully",
            });
        } else {
            res.status(200).send({
                success: false,
                message: "User not deleted",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    };
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};