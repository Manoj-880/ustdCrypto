const userRepo = require('../repos/userRepo');
const { sendWelcomeEmail } = require('../services/emailService');

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

        // Generate unique referral code for the new user
        const makeCode = () => {
            const base = (user.firstName || 'USER').slice(0, 3).toUpperCase();
            const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
            return `${base}${rand}`;
        };

        let referralCode = makeCode();
        // ensure uniqueness (retry a few times)
        for (let i = 0; i < 5; i++) {
            const existing = await userRepo.getUserByReferralCode(referralCode);
            if (!existing) break;
            referralCode = makeCode();
        }
        user.referralCode = referralCode;

        // Validate referredBy if provided
        if (user.referredBy) {
            const referrer = await userRepo.getUserByReferralCode(user.referredBy);
            if (!referrer) {
                return res.status(200).send({
                    success: false,
                    message: 'Invalid referral code'
                });
            }
        } else if (user.referredByCode) {
            // allow alternate field name from client
            const referrer = await userRepo.getUserByReferralCode(user.referredByCode);
            if (!referrer) {
                return res.status(200).send({
                    success: false,
                    message: 'Invalid referral code'
                });
            }
            user.referredBy = user.referredByCode;
            delete user.referredByCode;
        }

        let createUserStatus = await userRepo.addUser(user);
        if(createUserStatus) {
            // Send welcome email after successful registration
            try {
                await sendWelcomeEmail(user.email, user.firstName);
                console.log('Welcome email sent successfully to:', user.email);
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // Don't fail registration if email fails
            }
            
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