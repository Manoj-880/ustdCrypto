const userRepo = require('../repos/userRepo');
const { sendWelcomeEmail, sendEmail } = require('../services/emailService');
const crypto = require('crypto');

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

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        console.log('Generated verification token:', verificationToken);
        console.log('Token expires at:', verificationExpires);
        
        // Add verification fields to user
        user.isEmailVerified = false;
        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = verificationExpires;

        let createUserStatus = await userRepo.addUser(user);
        console.log('User created successfully:', createUserStatus ? 'Yes' : 'No');
        if(createUserStatus) {
            console.log('Created user email:', createUserStatus.email);
            console.log('Created user verification token:', createUserStatus.emailVerificationToken);
            console.log('Created user verification expires:', createUserStatus.emailVerificationExpires);
            
            // Verify the token was actually saved by querying the database
            const verifyUser = await userRepo.getUserByVerificationToken(verificationToken);
            console.log('Verification - User found by token after creation:', verifyUser ? 'Yes' : 'No');
            if (verifyUser) {
                console.log('Verification - User email:', verifyUser.email);
                console.log('Verification - Token matches:', verifyUser.emailVerificationToken === verificationToken);
            }
            // Send verification email instead of welcome email
            try {
                const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://secureusdt.com' : 'http://localhost:5173');
                const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
                console.log('Environment:', process.env.NODE_ENV);
                console.log('Frontend URL:', frontendUrl);
                console.log('Generated verification link:', verificationLink);
                
                const emailResult = await sendEmail(
                    user.email,
                    'emailVerification',
                    'noreply@secureusdt.com',
                    user.firstName,
                    user.email,
                    verificationLink
                );

                if (emailResult.success) {
                    console.log('Verification email sent successfully to:', user.email);
                } else {
                    console.error('Failed to send verification email:', emailResult.message);
                }
            } catch (emailError) {
                console.error('Failed to send verification email:', emailError);
                // Don't fail registration if email fails
            }
            
            res.status(200).send({
                success: true,
                message: "User created successfully. Please check your email to verify your account.",
                data: {
                    ...createUserStatus.toObject(),
                    password: undefined, // Don't send password in response
                    emailVerificationToken: undefined // Don't send token in response
                },
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